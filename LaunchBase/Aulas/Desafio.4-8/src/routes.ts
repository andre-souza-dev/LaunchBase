import express from "express";
import data from "./data/recipes.json";
import recipes from "./controllers/admin/recipes";

const routes = express.Router();

routes.get("/", function (req, res) {
	const recipes = data.recipes.map((recipe, index) => {
		if (index < 6) return { ...recipe, id: index };
	});
	res.render("index.njk", { recipes });
});
routes.get("/recipes", function (req, res) {
	const recipes = data.recipes.map((recipe, index) => {
		return { ...recipe, id: index };
	});
	res.render("recipes.njk", { recipes });
});
routes.get("/recipes/:id", function (req, res) {
	const id = Number(req.params.id);
	const recipe = data.recipes[id];
	if (recipe) {
		res.render("recipes-detail.njk", { recipe });
	} else {
		res.render("not-found.njk", { route: req.url });
	}
});
routes.get("/about", function (req, res) {
	res.render("about.njk");
});

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes/:id", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

export { routes };
