import { Request, Response } from "express";

import {
	getAge,
	getGraduation,
	getLessonType,
	getISODate,
	getIP,
	sanitizeSubjects,
} from "../../lib/utils";

import Teacher from "../models/teacher";

export interface Teacher {
	id: number;
	avatar_url: string;
	name: string;
	birth_date: Date;
	education_level: string;
	lesson_type: string;
	subjects_taught: string;
	created_at: Date;
	ip: string;
}

export default {
	index(req: Request, res: Response) {
		const { ip } = getIP(req);
		const filter = req.query.filter?.toString();

		if (filter) {
			Teacher.findBy(ip, filter, (results: Teacher[]) =>
				renderTeachers(results, filter)
			);
		} else {
			Teacher.all(ip, (results: Teacher[]) => renderTeachers(results));
		}

		function renderTeachers(teachers: Teacher[], filter?: string) {
			const cards = teachers.map((teacher: Teacher) => {
				const age = getAge(teacher.birth_date);
				const education_level = getGraduation(teacher.education_level);
				const lesson_type = getLessonType(teacher.lesson_type);
				const subjects_taught = teacher.subjects_taught.split(";");
				return {
					...teacher,
					age,
					education_level,
					lesson_type,
					subjects_taught,
				};
			});
			res.render("teachers/index.njk", {
				cards,
				filter,
			});
		}
	},
	show(req: Request, res: Response) {
		const id = Number(req.params.id);

		const { ip } = getIP(req);

		Teacher.find({ id, ip }, (foundTeacher: Teacher) => {
			if (!foundTeacher)
				return res.render("info.njk", { message: "Professor não encontrado." });
			const card = {
				...foundTeacher,
				age: getAge(foundTeacher.birth_date),
				education_level: getGraduation(foundTeacher.education_level),
				lesson_type: getLessonType(foundTeacher.lesson_type),
				subjects_taught: foundTeacher.subjects_taught.split(";"),
				editable: foundTeacher.ip === ip,
			};
			return res.render("teachers/show.njk", {
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
		const subjects_taught = sanitizeSubjects(req.body.subjects_taught);
		const data = { ...req.body, subjects_taught, ip };

		Teacher.create(data, (id: number) => {
			res.redirect(`/teachers/${id}`);
		});
	},
	edit(req: Request, res: Response) {
		const id = Number(req.params.id);
		const { ip } = getIP(req);

		Teacher.find({ id, ip }, (foundTeacher: Teacher) => {
			if (!foundTeacher)
				return res.render("info.njk", { message: "Professor não encontrado." });
			const card = {
				...foundTeacher,
				birth_date: getISODate(foundTeacher.birth_date),
				editable: foundTeacher.ip === ip,
			};
			return res.render("teachers/edit.njk", {
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
		const subjects_taught = sanitizeSubjects(req.body.subjects_taught);

		const data = { ...req.body, subjects_taught, id, ip };
		Teacher.update(data, () => {
			return res.redirect(`/teachers/${id}`);
		});
	},
	delete(req: Request, res: Response) {
		const id = Number(req.params.id);
		const { ip } = getIP(req);
		Teacher.delete({ id, ip }, () => {
			return res.redirect("/teachers");
		});
	},
};
