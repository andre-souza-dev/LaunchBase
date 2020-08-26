import db from "../../config/db";
import { Teacher, Pagination } from "../controllers/teachers";

type Find = {
	id: number;
	ip: string;
};

export default {
	all(ip: string, pagination: Pagination, callback: Function) {
		const { page, limit } = pagination;
		const offset = limit * (page - 1);
		const query = `SELECT * , (SELECT count(*) AS total_teachers FROM teachers WHERE ip=$1 OR ip='readonly')
		FROM teachers
		WHERE ip=$1 OR ip='readonly'
		ORDER BY created_at ASC
		LIMIT $2 OFFSET $3
		`;
		db.query(query, [ip, limit, offset], (error, response) => {
			if (error) throw new Error(`Database error on ALL: ${error}`);

			const data = response.rows;
			const totalPages = Math.ceil(
				(Number(response.rows[0]?.total_teachers) || 0) / limit
			);
			callback(data, totalPages);
		});
	},
	findBy(
		ip: string,
		filter: string,
		pagination: Pagination,
		callback: Function
	) {
		const { page, limit } = pagination;
		const offset = limit * (page - 1);
		const query = `SELECT *,
			(SELECT count(*) AS total_teachers
				FROM teachers
				WHERE (ip=$1 OR ip='readonly')
				AND (name ILIKE '%${filter}%'
					OR subjects_taught ILIKE '%${filter}%'))
			FROM teachers
			WHERE (ip=$1 OR ip='readonly')
			AND (name ILIKE '%${filter}%' OR subjects_taught ILIKE '%${filter}%')
			ORDER BY created_at ASC
			LIMIT $2 OFFSET $3
			`;
		db.query(query, [ip, limit, offset], (error, response) => {
			if (error) throw new Error(`Database error on findBy: ${error}`);

			const data = response.rows;
			const totalPages = Math.ceil(
				(Number(response.rows[0]?.total_teachers) || 0) / limit
			);
			callback(data, totalPages);
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
            WHERE id=$1 AND (ip=$2 OR ip='readonly')`;

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
