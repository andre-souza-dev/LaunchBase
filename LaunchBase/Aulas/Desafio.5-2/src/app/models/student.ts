import db from "../../config/db";
import { Student } from "../controllers/students";

type Find = {
	id: number;
	ip: string;
};

export default {
	all(ip: string, callback: Function) {
		const query =
			"SELECT * FROM students WHERE ip=$1 OR ip='readonly ORDER BY name ASC";
		db.students.query(query, [ip], (error, response) => {
			if (error) throw new Error(`Database error on ALL: ${error}`);

			const data = response.rows;
			callback(data);
		});
	},
	create(student: Student, callback: Function) {
		const {
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			ip,
		} = student;
		const query = `INSERT INTO students (
            avatar_url,
            name,
            birth_date,
            email,
            school_term,
            weekly_load,
			ip )
            VALUES ( $1, $2, $3, $4, $5, $6, $7 )
            RETURNING id`;
		const data = [
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			ip,
		];
		db.students.query(query, data, (error, response) => {
			if (error) throw new Error(`Database error on CREATE: ${error}`);

			const id = Number(response.rows[0].id);
			callback(id);
		});
	},
	find({ id, ip }: Find, callback: Function) {
		const query = `SELECT * FROM students
            WHERE id=$1 AND ip=$2 OR ip='readonly'`;

		db.students.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on FIND: ${error}`);
			const data = response.rows[0];
			callback(data);
		});
	},
	update(student: Student, callback: Function) {
		const query = `UPDATE students
        SET avatar_url=$1,
			name=$2,
			birth_date=$3,
			email=$4,
			school_term=$5,
            weekly_load=$6 
		WHERE id=$7
		AND ip=$8`;
		const {
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			id,
			ip,
		} = student;

		const data = [
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			id,
			ip,
		];
		db.students.query(query, data, (error, response) => {
			if (error) throw `Database error on UPDATE: ${error}`;
			callback(response.rows);
		});
	},
	delete({ id, ip }: Find, callback: Function) {
		const query = `DELETE FROM students
            WHERE id=$1 AND ip=$2`;

		db.students.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on DELETE: ${error}`);
			const data = response.rows;
			callback(data);
		});
	},
};
