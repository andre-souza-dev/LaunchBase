import { Router } from "express";
import teachers from "./app/controllers/teachers";
import students from "./app/controllers/students";

const routes = Router();

routes.get("/", function (req, res) {
	res.redirect("/teachers");
});
routes.get("/teachers", teachers.index);
routes.get("/teachers/create", function (req, res) {
	res.render("teachers/create.njk");
});
routes.post("/teachers", teachers.post);
routes.put("/teachers", teachers.edit);
routes.delete("/teachers/:id", teachers.delete);
routes.get("/teachers/:id", teachers.show);
routes.get("/teachers/:id/edit", teachers.edit);

routes.get("/students", students.index);
routes.get("/students/create", function (req, res) {
	res.render("students/create.njk");
});
routes.post("/students", students.post);
routes.put("/students", students.edit);
routes.delete("/students/:id", students.delete);
routes.get("/students/:id", students.show);
routes.get("/students/:id/edit", students.edit);

export { routes };
