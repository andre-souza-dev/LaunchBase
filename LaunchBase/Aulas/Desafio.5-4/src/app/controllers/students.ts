import { Request, Response } from "express";

import {
	getIP,
	sanitizeSubjects,
	getStudentGrade,
	getISODate,
} from "../../lib/utils";

import Student from "../models/student";
import { Teacher } from "./teachers";

export interface Student {
	id: number;
	avatar_url: string;
	name: string;
	birth_date: Date;
	email: string;
	school_term: string;
	weekly_load: string;
	created_at: Date;
	ip: string;
	teacher_id: number;
}

export type Pagination = {
	page: number;
	limit: number;
	totalPages: number;
};

export default {
	index(req: Request, res: Response) {
		const { ip } = getIP(req);
		const filter = req.query.filter?.toString();
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;
		const totalPages = 0;
		const pagination = { page, limit, totalPages };

		if (filter) {
			Student.findBy(
				ip,
				filter,
				pagination,
				(results: Student[], totalPages: number) =>
					renderStudents(results, { ...pagination, totalPages }, filter)
			);
		} else {
			Student.all(ip, pagination, (results: Student[], totalPages: number) => {
				renderStudents(results, { ...pagination, totalPages });
			});
		}

		function renderStudents(
			students: Student[],
			pagination: Pagination,
			filter?: string
		) {
			const cards = students.map((student: Student) => {
				return {
					...student,
					school_term: getStudentGrade(student.school_term),
				};
			});
			res.render("students/index.njk", {
				cards,
				filter,
				pagination,
			});
		}
	},
	show(req: Request, res: Response) {
		const id = Number(req.params.id);

		const { ip } = getIP(req);

		Student.find({ id, ip }, (foundStudent: Student) => {
			if (!foundStudent)
				return res.render("info.njk", { message: "Aluno não encontrado." });
			const card = {
				...foundStudent,
				school_term: getStudentGrade(foundStudent.school_term),
				editable: foundStudent.ip === ip,
			};
			return res.render("students/show.njk", {
				card,
			});
		});
	},
	create(req: Request, res: Response) {
		const { ip } = getIP(req);
		Student.teacherSelectOptions(ip, (teachers: Teacher[]) => {
			return res.render("students/create.njk", { teachers });
		});
	},
	post(req: Request, res: Response) {
		const keys = Object.keys(req.body);

		for (let key of keys) {
			const item = (req.body as any)[key];
			if (item === "") {
				return res.render("info.njk", {
					message: "Todos os campos são obrigatórios.",
				});
			}
		}

		const { ip } = getIP(req);
		const data = { ...req.body, ip };

		Student.create(data, (id: number) => {
			res.redirect(`/students/${id}`);
		});
	},
	edit(req: Request, res: Response) {
		const id = Number(req.params.id);
		const { ip } = getIP(req);

		Student.find({ id, ip }, (foundStudent: Student) => {
			if (!foundStudent)
				return res.render("info.njk", { message: "Professor não encontrado." });
			const card = {
				...foundStudent,
				birth_date: getISODate(foundStudent.birth_date),
				editable: foundStudent.ip === ip,
			};
			Student.teacherSelectOptions(ip, (teachers: Teacher[]) => {
				return res.render("students/edit.njk", {
					card,
					teachers,
				});
			});
		});
	},
	put(req: Request, res: Response) {
		const keys = Object.keys(req.body);
		for (let key of keys) {
			const item = (req.body as any)[key];
			if (item === "") {
				return res.render("info.njk", {
					message: "Todos os campos são obrigatórios.",
				});
			}
		}

		const id = Number(req.params.id);
		const { ip } = getIP(req);
		const weekly_load = sanitizeSubjects(req.body.weekly_load);

		const data = { ...req.body, weekly_load, id, ip };
		Student.update(data, () => {
			return res.redirect(`/students/${id}`);
		});
	},
	delete(req: Request, res: Response) {
		const id = Number(req.params.id);
		const { ip } = getIP(req);
		Student.delete({ id, ip }, () => {
			return res.redirect("/students");
		});
	},
};
