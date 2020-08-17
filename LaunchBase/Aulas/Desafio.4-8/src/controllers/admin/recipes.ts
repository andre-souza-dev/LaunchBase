import { Request, Response } from "express";
import fs from "fs";

import data from "../../data/recipes.json";

export default {
	async index(req: Request, res: Response) {
		const recipes = data.recipes.map((recipe, index) => {
			return { ...recipe, id: index };
		});
		return res.render("admin/index.njk", { recipes });
	},
	async create(req: Request, res: Response) {
		return res.render("admin/new.njk");
	},
	async show(req: Request, res: Response) {
		const id = Number(req.params.id);
		const foundRecipe = data.recipes[id];
		if (foundRecipe) {
			const recipe = { ...foundRecipe, id };
			res.render("admin/recipes-detail.njk", { recipe });
		} else {
			res.render("not-found.njk", { route: req.url });
		}
	},
	async edit(req: Request, res: Response) {
		const id = Number(req.params.id);
		if (data.recipes.length > id) {
			const recipe = { ...data.recipes[id], id };
			return res.render("admin/edit.njk", { recipe });
		} else {
			return res.render("not-found.njk", {
				route: req.url,
				message: `RECEITA NÃO ENCONTRADA`,
			});
		}
	},

	async post(req: Request, res: Response) {
		const keys = Object.keys(req.body);

		for (const key of keys) {
			if (req.body[key].length === 0 && key !== "information")
				return res.render("info.njk", {
					message: `O Campo {${key}} é obrigatório`,
				});
		}
		const title = req.body.title.substr(0, 60);
		const author = req.body.author.substr(0, 20);
		data.recipes.push({ ...req.body, title, author });
		fs.writeFile(
			"./src/data/recipes.json",
			JSON.stringify(data, null, 4),
			(error) => {
				if (error) {
					return res.render("info.njk", { message: error.message });
				}
				return res.redirect("/admin/recipes");
			}
		);
	},
	async put(req: Request, res: Response) {
		const keys = Object.keys(req.body);
		const id = Number(req.params.id);

		for (const key of keys) {
			if (req.body[key].length === 0 && key !== "information")
				return res.render("info.njk", {
					message: `O Campo {${key}} é obrigatório`,
				});
		}
		const title = req.body.title.substr(0, 60);
		const author = req.body.author.substr(0, 20);
		data.recipes[id] = { ...req.body, title, author };
		fs.writeFile(
			"./src/data/recipes.json",
			JSON.stringify(data, null, 4),
			(error) => {
				if (error) {
					return res.render("info.njk", { message: error.message });
				}
				return res.redirect("/admin/recipes");
			}
		);
	},
	async delete(req: Request, res: Response) {},
};
