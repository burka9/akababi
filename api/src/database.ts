import { DataSource } from "typeorm";
import { DATABASE, DEVELOPMENT } from "./lib/env";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import mysql2 from "mysql2"

const { TYPE, DROP_SCHEMA, HOST, LOG, MAX_POOL, MIN_POOL, NAME, PASSWORD, PORT, SYNC, USER } = DATABASE

export const Database = new DataSource({
	type: TYPE,
	host: HOST,
	port: PORT,
	poolSize: MAX_POOL,
	database: NAME,
	username: USER,
	password: PASSWORD,
	synchronize: SYNC,
	dropSchema: DROP_SCHEMA,
	logging: LOG,
	extra: {
		connectionLimit: MAX_POOL
	},
	entities: [
		DEVELOPMENT
			? "src/entity/**/*.entity.ts"
			: "dist/entity/**/*.entity.js"
	],
	legacySpatialSupport: false,
	charset: 'utf8mb4', // Set the character set
  collation: 'utf8mb4_unicode_ci', // Set the collation
} as MysqlConnectionOptions)

export const conn = mysql2.createConnection({
	host: HOST,
	user: USER,
	password: PASSWORD,
	database: NAME,
})