import { Request, Response } from "express";

import {
	getIP,
	sanitizeSubjects,
	getStudentGrade,
	getISODate,
} from "../../lib/utils";

import Student from "../models/student";

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
}

export default {
	index(req: Request, res: Response) {
		const { ip } = getIP(req);
		Student.all(ip, (results: Student[]) => {
			const cards = results.map((student: Student) => {
				return {
					...student,
					school_term: getStudentGrade(student.school_term),
				};
			});
			res.render("students/index.njk", {
				cards,
			});
		});
	},
	show(req: Request, res: Response) {
		const id = Number(req.params.id);

		const { ip } = getIP(req);

		Student.find({ id, ip }, (foundStudent: Student) => {
			if (!foundStudent)
				return res.render("info.njk", { message: "Professor não encontrado." });
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
			return res.render("students/edit.njk", {
				card,
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
