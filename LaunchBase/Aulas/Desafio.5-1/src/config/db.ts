import { Pool } from "pg";

export default = new Pool({
    user:'postgres',
    password:'postgres',
    host:'localhost',
    port:5432,
    database:'my_teachers'
})