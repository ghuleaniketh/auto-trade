import mysql from "mysql2/promise"; 
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
console.log(process.env.DB_HOST);
export default db;