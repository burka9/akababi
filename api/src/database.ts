import { DataSource } from "typeorm";
import { DATABASE, DEVELOPMENT } from "./lib/env";

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
})
