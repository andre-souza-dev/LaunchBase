import express from "express";
import nunjucks from "nunjucks";
import recipesData from "./data";

const server = express();

server.use(express.static("public"));
server.set("view engine", "html");

nunjucks.configure("src/views", {
	express: server,
	noCache: true,
	autoescape: false,
});

server.get("/", function (req, res) {
	const recipes = recipesData.map((recipe, index) => {
		if (index < 6) return { ...recipe, id: index };
	});
	res.render("index.njk", { recipes });
});
server.get("/recipes", function (req, res) {
	const recipes = recipesData.map((recipe, index) => {
		return { ...recipe, id: index };
	});
	res.render("recipes.njk", { recipes });
});
server.get("/recipes/:id", function (req, res) {
	const id = Number(req.params.id);
	const recipe = recipesData[id];
	if (recipe) {
		res.render("recipes-detail.njk", { recipe });
	} else {
		res.render("not-found.njk", { route: req.url });
	}
});
server.get("/about", function (req, res) {
	res.render("about.njk");
});

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
