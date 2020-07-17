import { Request, Response } from "express";
import fs from "fs";

import { getAge, getGraduation, getLessonType } from "./utils";

interface Teacher {
	id: number;
	avatarUrl: string;
	name: string;
	birthDate: Date;
	degree: string;
	lessonType: string;
	subjects: string[];
	createdAt: Date;
	ip: string;
}

export default {
	async index(req: Request, res: Response) {
		fs.readFile("./src/teachersData.json", (error, data) => {
			if (error) {
				res.render("teachers/index.njk", {
					teachers: "active",
					cards: [],
				});
				return;
			}
			const teachersData = JSON.parse(data.toString());
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";
			const cards = teachersData
				.filter((teacher: Teacher) => teacher.ip === ip || teacher.ip === "::1")
				.map((teacher: Teacher) => {
					const age = getAge(teacher.birthDate);
					const degree = getGraduation(teacher.degree);
					const lessonType = getLessonType(teacher.lessonType);
					return { ...teacher, age, degree, lessonType };
				});
			res.render("teachers/index.njk", {
				teachers: "active",
				cards,
			});
		});
	},
	async show(req: Request, res: Response) {
		const id = Number(req.params.id);
		const teachers = JSON.parse(
			(await fs.readFileSync("./src/teachersData.json")).toString()
		);
		const foundTeacher = teachers.find((teacher: Teacher) => teacher.id === id);
		if (!foundTeacher)
			return res.render("info.njk", { message: "Professor não encontrado." });
		const { remoteAddress: ip } = req.connection;
		const card = {
			...foundTeacher,
			age: getAge(foundTeacher.birthDate),
			degree: getGraduation(foundTeacher.degree),
			lessonType: getLessonType(foundTeacher.lessonType),
			editable: foundTeacher.ip === ip,
		};
		return res.render("teachers/show.njk", {
			card,
			teachers: "active",
		});
	},
	post(req: Request, res: Response) {
		const keys = Object.keys(req.body);

		for (let key of keys) {
			const item = (req.body as any)[key];
			if (item === "") {
				return res.render("info.njk", {
					message: "Todos os campos são obrigatórios.",
					teachers: "active",
				});
			}
		}

		fs.readFile("./src/teachersData.json", (error, data) => {
			const teachers = error ? [] : JSON.parse(data.toString());
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";

			const {
				avatarUrl,
				name,
				birthDate,
				degree,
				lessonType,
				subjects,
			} = req.body;
			const id = teachers.length + 1;
			teachers.push({
				id,
				avatarUrl,
				name,
				birthDate: new Date(birthDate),
				degree,
				lessonType,
				subjects: subjects
					.split(/;|,/g)
					.map((subject: string) => subject.trim()),
				createdAt: new Date(),
				ip,
			});
			fs.writeFileSync(
				"./src/teachersData.json",
				JSON.stringify(teachers, null, 4)
			);

			res.redirect("teachers");
		});
	},
	edit(req: Request, res: Response) {
		const keys = Object.keys(req.body);
		const id = Number(req.params.id);
		for (let key of keys) {
			const item = (req.body as any)[key];
			if (item === "") {
				return res.render("info.njk", {
					message: "Todos os campos são obrigatórios.",
					teachers: "active",
				});
			}
		}

		fs.readFile("./src/teachersData.json", (error, data) => {
			const teachers = error ? [] : JSON.parse(data.toString());
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";

			if (keys.length === 0) {
				const foundTeacher: Teacher = teachers.find(
					(teacher: Teacher) => teacher.id === id
				);
				if (!foundTeacher)
					return res.render("info.njk", {
						message: "Professor não encontrado.",
						teachers: "active",
					});
				if (foundTeacher.ip !== ip)
					return res.render("info.njk", {
						message:
							"Você não tem autorização para editar os dados deste professor.",
						teachers: "active",
					});
				const card = {
					...foundTeacher,
					subjects: foundTeacher.subjects.join("; "),
					birthDate: new Date(foundTeacher.birthDate)
						.toISOString()
						.slice(0, 10),
				};
				return res.render("teachers/edit.njk", {
					teachers: "active",
					card,
				});
			} else {
				const {
					id,
					avatarUrl,
					name,
					birthDate,
					degree,
					lessonType,
					subjects,
				} = req.body;
				fs.readFile("./src/teachersData.json", (error, data) => {
					if (error)
						return res.render("info.njk", {
							message: "Não há nenhum professor cadastrado.",
						});

					const teachers: Teacher[] = JSON.parse(data.toString());
					const foundTeacher = teachers.find(
						(teacher: Teacher) => teacher.id === Number(id)
					);
					if (!foundTeacher)
						return res.render("info.njk", {
							message: "Professor não encontrado.",
						});
					if (foundTeacher.ip !== ip)
						return res.render("info.njk", {
							message:
								"Você não tem permissão para alterar os dados deste professor",
						});
					const teacherIndex = teachers.findIndex(
						(teacher) => teacher.id === foundTeacher.id
					);
					teachers[teacherIndex] = {
						...foundTeacher,
						avatarUrl,
						name,
						birthDate,
						degree,
						lessonType,
						subjects: subjects
							.split(/;|,/g)
							.map((subject: string) => subject.trim()),
					};
					fs.writeFile(
						"./src/teachersData.json",
						JSON.stringify(teachers, null, 4),
						(error) => {
							if (error)
								return res.render("info.njk", {
									message: "Erro ao salvar dados do Professor.",
								});
							return res.redirect(`/teacher/${id}`);
						}
					);
				});
			}
		});
	},
};
