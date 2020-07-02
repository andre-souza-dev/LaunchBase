import express from "express";
import nunjucks from "nunjucks";
import coursesData from "./data";

const server = express();

server.use(express.static("public"));
server.set("view engine", "html");

nunjucks.configure("src/views", {
	express: server,
});

server.get("/", function (req, res) {
	res.render("about.njk", { about: "selected" });
});
server.get("/courses", function (req, res) {
	res.render("courses.njk", { courses: "selected", coursesData });
});
server.get("/course/:id", function (req, res) {
	const id = req.params.id;
	const course = coursesData.find((course) => course.id === id);
	if (course) {
		res.render("course.njk", { course });
	} else {
		res.render("not-found.njk", { route: req.url });
	}
});

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
