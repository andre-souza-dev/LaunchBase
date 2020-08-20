import express from "express";
import nunjucks from "nunjucks";
import methodOverride from "method-override";

import { routes } from "./routes";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.set("view engine", "html");

nunjucks.configure("src/app/views", {
	express: server,
	noCache: true,
	autoescape: false,
});

server.use(routes);

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
