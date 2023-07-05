import dotenv from 'dotenv'
import { LoggerOptions } from 'typeorm/logger/LoggerOptions'
import { base64ToString } from './string'

dotenv.config()

const DB_BASE64_ENCODE = process.env.DB_BASE64_ENCODE === "true"

export const DEVELOPMENT = process.env.ENVIRONMENT?.toUpperCase() === 'DEVELOPMENT'
export const ENVIRONMENT = process.env.ENVIRONMENT
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || '10')

export const LOG = {
	LEVEL: process.env.LOG_LEVEL || 'info',
	LOG_FILE: process.env.LOG_FILE,
	LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE === "true",
	LOG_MAX_SIZE: Number(process.env.LOG_MAX_SIZE || '10000000'),
	LOG_MAX_FILES: Number(process.env.LOG_MAX_FILES || '10'),
}

export const SERVER = {
	HOST: process.env.SERVER_HOST || '0.0.0.0',
	PORT: Number(process.env.SERVER_PORT || '3000'),
}

function getDatabaseLogs(): LoggerOptions {
	let defaultLogs = ["info", "warn", "error", "log"]
	let logs

	try {
		logs = (process.env.DB_LOG as string).trim().split(',').map(log => log = log.trim())
	} catch { }

	return (logs || defaultLogs) as LoggerOptions
}


export type CustomDatabaseType = 'mysql' | 'mariadb' | 'postgres' | 'mongodb' | 'oracle'

function getDatabaseType(): CustomDatabaseType {
	return (['mysql', 'mariadb', 'postgres', 'mongodb', 'oracle']
		.find(type => type === process.env.DB_TYPE) || 'mysql') as CustomDatabaseType
}

function getDatabaseName(): string {
	return DB_BASE64_ENCODE ? base64ToString(process.env.DB_NAME || 'YmFja2VuZA==') : (process.env.DB_NAME || 'backend')
}
function getDatabaseUser(): string {
	return DB_BASE64_ENCODE ? base64ToString(process.env.DB_USER || 'cm9vdA==') : (process.env.DB_USER || 'root')
}
function getDatabasePassword(): string {
	return DB_BASE64_ENCODE ? base64ToString(process.env.DB_PASSWORD || '') : (process.env.DB_PASSWORD || '')
}

export const DATABASE = {
	TYPE: getDatabaseType(),
	HOST: process.env.DB_HOST || '127.0.0.1',
	PORT: Number(process.env.DB_PORT || '3306'),
	NAME: getDatabaseName(),
	USER: getDatabaseUser(),
	PASSWORD: getDatabasePassword(),
	MIN_POOL: Number(process.env.DB_MIN_POOL || 1),
	MAX_POOL: Number(process.env.DB_MAX_POOL || 4),
	LOG: getDatabaseLogs(),
	SYNC: process.env.DB_SYNCHRONIZE === 'true',
	DROP_SCHEMA: process.env.DB_DROP_SCHEMA === 'true' && DEVELOPMENT,
}

export const AUTH0 = {
	AUDIENCE: process.env.AUDIENCE,
	ISSUER: process.env.ISSUER,
	DOMAIN: process.env.DOMAIN,
}

export const GEOLOCATION = {
	API_KEY: process.env.GEO_LOCATION_API_KEY
}

export const OFFLINE = process.env.OFFLINE === "true"
export const OFFLINE_AUTH_URL = process.env.OFFLINE_AUTH_URL || "http://localhost:8181"
