import { Request, Response } from "express";
import fs from "fs";

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
				res.render("teachers.njk", {
					teachers: "active",
					cards: [],
				});
				return;
			}
			const teachersData = JSON.parse(data.toString());
			const cards = teachersData
				.filter(
					(teacher: Teacher) =>
						teacher.ip === req.connection.remoteAddress || teacher.ip === "::1"
				)
				.map((teacher: Teacher) => {
					const age =
						new Date(
							Date.now() - Date.parse(teacher.birthDate.toString())
						).getFullYear() - 1970;
					return { ...teacher, age };
				});
			res.render("teachers.njk", {
				teachers: "active",
				cards,
			});
		});
	},
	post(req: Request, res: Response) {
		const keys = Object.keys(req.body);

		for (let key of keys) {
			const item = (req.body as any)[key];
			if (item === "") {
				res.render("info.njk", {
					message: "Todos os campos são obrigatórios.",
				});
				return;
			}
		}

		fs.readFile("./src/teachersData.json", (error, data) => {
			const teachers = error ? [] : JSON.parse(data.toString());
			const { remoteAddress: ip } = req.connection;
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
				subjects: subjects.split(";").map((subject: string) => subject.trim()),
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
};
