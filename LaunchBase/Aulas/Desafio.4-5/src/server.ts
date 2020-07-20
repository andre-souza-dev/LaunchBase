import express from "express";
import nunjucks from "nunjucks";
import teachers from "./teachers";
import methodOverride from "method-override";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.set("view engine", "html");

nunjucks.configure("src/views", {
	express: server,
	noCache: true,
	autoescape: false,
});

server.get("/", function (req, res) {
	res.redirect("/teachers");
});
server.get("/teachers", teachers.index);
server.get("/teachers/create", function (req, res) {
	res.render("teachers/create.njk", { teachers: "active" });
});
server.post("/teachers", teachers.post);
server.put("/teachers", teachers.edit);
server.delete("/teachers/:id", teachers.delete);
server.get("/teacher/:id", teachers.show);
server.get("/teacher/:id/edit", teachers.edit);

server.get("/students", function (req, res) {
	res.render("students/index.njk", { students: "active" });
});

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
