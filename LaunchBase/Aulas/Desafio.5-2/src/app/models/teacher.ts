import db from "../../config/db";
import { Teacher } from "../controllers/teachers";

type Find = {
	id: number;
	ip: string;
};

export default {
	all(ip: string, callback: Function) {
		const query =
			"SELECT * FROM teachers WHERE ip=$1 OR ip='readonly' ORDER BY name ASC";
		db.query(query, [ip], (error, response) => {
			if (error) throw new Error(`Database error on ALL: ${error}`);

			const data = response.rows;
			callback(data);
		});
	},
	create(teacher: Teacher, callback: Function) {
		const {
			avatar_url,
			name,
			birth_date,
			education_level,
			lesson_type,
			subjects_taught,
			ip,
		} = teacher;
		const query = `INSERT INTO teachers (
            avatar_url,
            name,
            birth_date,
            education_level,
            lesson_type,
            subjects_taught,
			ip )
            VALUES ( $1, $2, $3, $4, $5, $6, $7 )
            RETURNING id`;
		const data = [
			avatar_url,
			name,
			birth_date,
			education_level,
			lesson_type,
			subjects_taught,
			ip,
		];
		db.query(query, data, (error, response) => {
			if (error) throw new Error(`Database error on CREATE: ${error}`);

			const id = Number(response.rows[0].id);
			callback(id);
		});
	},
	find({ id, ip }: Find, callback: Function) {
		const query = `SELECT * FROM teachers
            WHERE id=$1 AND ip=$2 OR ip='readonly'`;

		db.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on FIND: ${error}`);
			const data = response.rows[0];
			callback(data);
		});
	},
	update(teacher: Teacher, callback: Function) {
		const query = `UPDATE teachers
        SET avatar_url=$1,
			name=$2,
			birth_date=$3,
			education_level=$4,
			lesson_type=$5,
            subjects_taught=$6 
		WHERE id=$7
		AND ip=$8`;
		const {
			avatar_url,
			name,
			birth_date,
			education_level,
			lesson_type,
			subjects_taught,
			id,
			ip,
		} = teacher;

		const data = [
			avatar_url,
			name,
			birth_date,
			education_level,
			lesson_type,
			subjects_taught,
			id,
			ip,
		];
		db.query(query, data, (error, response) => {
			if (error) throw `Database error on UPDATE: ${error}`;
			callback(response.rows);
		});
	},
	delete({ id, ip }: Find, callback: Function) {
		const query = `DELETE FROM teachers
            WHERE id=$1 AND ip=$2`;

		db.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on DELETE: ${error}`);
			const data = response.rows;
			callback(data);
		});
	},
};
