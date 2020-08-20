import { Pool } from "pg";
import url from "url";

const poolConfig = process.env.DATABASE_URL
	? transformPostgreURL(process.env.DATABASE_URL)
	: {
			user: "postgres",
			password: "postgres",
			host: "localhost",
			port: 5432,
			database: "",
			ssl: false,
	  };

const db = process.env.DATABASE_URL
	? {
			teachers: new Pool(poolConfig),
			students: new Pool(poolConfig),
	  }
	: {
			teachers: new Pool({
				...poolConfig,
				database: "my_teachers",
			}),
			students: new Pool({
				...poolConfig,
				database: "my_students",
			}),
	  };

export default db;

function transformPostgreURL(postgreURL: string) {
	const params = url.parse(postgreURL);
	const auth = params.auth ? params.auth.split(":") : [null];

	const config = {
		user: auth[0] || "postgres",
		password: auth[1] || "postgres",
		host: params.hostname || "localhost",
		port: Number(params.port) || 5432,
		database: params.pathname ? params.pathname.split("/")[1] : "",
		ssl: true,
	};

	return config;
}
