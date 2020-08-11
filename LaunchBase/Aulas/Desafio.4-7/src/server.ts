import express from "express";
import nunjucks from "nunjucks";
import teachers from "./controllers/teachers";
import students from "./controllers/students";
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
	res.render("teachers/create.njk");
});
server.post("/teachers", teachers.post);
server.put("/teachers", teachers.edit);
server.delete("/teachers/:id", teachers.delete);
server.get("/teachers/:id", teachers.show);
server.get("/teachers/:id/edit", teachers.edit);

server.get("/students", students.index);
server.get("/students/create", function (req, res) {
	res.render("students/create.njk");
});
server.post("/students", students.post);
server.put("/students", students.edit);
server.delete("/students/:id", students.delete);
server.get("/students/:id", students.show);
server.get("/students/:id/edit", students.edit);

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
