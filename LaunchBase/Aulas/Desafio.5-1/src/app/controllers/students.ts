import { Request, Response } from "express";
import fs from "fs";

import { getStudentBirth, getStudentGrade } from "../../lib/utils";

const studentsUrlLocation = "./src/data/students.json";

interface student {
	id: number;
	avatarUrl: string;
	name: string;
	birthDate: string;
	email: string;
	schoolYear: string;
	weeklyStudentLoad: number;
	ip: string;
}

export default {
	async index(req: Request, res: Response) {
		fs.readFile(studentsUrlLocation, (error, data) => {
			if (error) {
				res.render("students/index.njk", {
					cards: [],
				});
				return;
			}
			const studentsData = JSON.parse(data.toString());
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";
			const cards = studentsData
				.filter((student: student) => student.ip === ip || student.ip === "::1")
				.map((student: student) => {
					const birthDate = getStudentBirth(new Date(student.birthDate));
					const schoolYear = getStudentGrade(student.schoolYear);
					return { ...student, birthDate, schoolYear };
				});
			res.render("students/index.njk", {
				cards,
			});
		});
	},
	async show(req: Request, res: Response) {
		const id = Number(req.params.id);
		const students = JSON.parse(
			(await fs.readFileSync(studentsUrlLocation)).toString()
		);
		const foundstudent = students.find((student: student) => student.id === id);
		if (!foundstudent)
			return res.render("info.njk", { message: "Aluno não encontrado." });
		const headers = req.headers["x-forwarded-for"];
		const ip =
			typeof headers === "object"
				? headers.shift()
				: typeof headers === "string"
				? headers.split(",")[0]
				: "localhost";
		const card = {
			...foundstudent,
			birthDate: getStudentBirth(new Date(foundstudent.birthDate)),
			schoolYear: getStudentGrade(foundstudent.schoolYear),
			editable: foundstudent.ip === ip,
		};
		return res.render("students/show.njk", {
			card,
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

		fs.readFile(studentsUrlLocation, (error, data) => {
			const students = error ? [] : JSON.parse(data.toString());
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
				schoolYear,
				email,
				weeklyStudentLoad,
			} = req.body;
			const id = students.length + 1;
			students.push({
				id,
				avatarUrl,
				name,
				birthDate: new Date(birthDate),
				schoolYear,
				email,
				weeklyStudentLoad,
				ip,
			});
			fs.writeFileSync(studentsUrlLocation, JSON.stringify(students, null, 4));

			res.redirect("students");
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
				});
			}
		}

		fs.readFile(studentsUrlLocation, (error, data) => {
			const students = error ? [] : JSON.parse(data.toString());
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";

			if (keys.length === 0) {
				const foundstudent: student = students.find(
					(student: student) => student.id === id
				);
				if (!foundstudent)
					return res.render("info.njk", {
						message: "Aluno não encontrado.",
					});
				if (foundstudent.ip !== ip)
					return res.render("info.njk", {
						message:
							"Você não tem autorização para editar os dados deste aluno.",
					});
				const card = {
					...foundstudent,
					birthDate: new Date(foundstudent.birthDate)
						.toISOString()
						.slice(0, 10),
				};
				return res.render("students/edit.njk", {
					card,
				});
			} else {
				const {
					id,
					avatarUrl,
					name,
					birthDate,
					schoolYear,
					email,
					weeklyStudentLoad,
				} = req.body;
				fs.readFile(studentsUrlLocation, (error, data) => {
					if (error)
						return res.render("info.njk", {
							message: "Não há nenhum aluno cadastrado.",
						});

					const students: student[] = JSON.parse(data.toString());
					const foundstudent = students.find(
						(student: student) => student.id === Number(id)
					);
					if (!foundstudent)
						return res.render("info.njk", {
							message: "Aluno não encontrado.",
						});
					if (foundstudent.ip !== ip)
						return res.render("info.njk", {
							message:
								"Você não tem permissão para alterar os dados deste aluno",
						});
					const studentIndex = students.findIndex(
						(student) => student.id === foundstudent.id
					);
					students[studentIndex] = {
						...foundstudent,
						avatarUrl,
						name,
						birthDate,
						schoolYear,
						email,
						weeklyStudentLoad,
					};
					fs.writeFile(
						studentsUrlLocation,
						JSON.stringify(students, null, 4),
						(error) => {
							if (error)
								return res.render("info.njk", {
									message: "Erro ao salvar dados do Aluno.",
								});
							return res.redirect(`/students/${id}`);
						}
					);
				});
			}
		});
	},
	delete(req: Request, res: Response) {
		const { id } = req.params;
		fs.readFile(studentsUrlLocation, (error, data) => {
			if (error)
				res.render("info.njk", {
					message: "Erro de leitura no banco de dados.",
				});
			const students = JSON.parse(data.toString()) as student[];
			const headers = req.headers["x-forwarded-for"];
			const ip =
				typeof headers === "object"
					? headers.shift()
					: typeof headers === "string"
					? headers.split(",")[0]
					: "localhost";
			const foundstudents = students.filter(
				(student) => student.id !== Number(id) || student.ip !== ip
			);

			fs.writeFileSync(
				studentsUrlLocation,
				JSON.stringify(foundstudents, null, 4)
			);
		});

		return res.redirect("/students");
	},
};
