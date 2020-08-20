import { Pool } from "pg";
import url from "url";

const poolConfig = process.env.DATABASE_URL
	? transformPostgreURL(process.env.DATABASE_URL)
	: {
			user: "postgres",
			password: "postgres",
			host: "localhost",
			port: 5432,
			database: "e_learning",
			ssl: false,
	  };

const db = new Pool(poolConfig);

export default db;

function transformPostgreURL(postgreURL: string) {
	const params = url.parse(postgreURL);
	const auth = params.auth ? params.auth.split(":") : [null];

	const config = {
		user: auth[0] || "postgres",
		password: auth[1] || "postgres",
		host: params.hostname || "localhost",
		port: Number(params.port) || 5432,
		database: params.pathname ? params.pathname.split("/")[1] : "e_learning",
		ssl: true,
	};

	return config;
}
