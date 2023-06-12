import { readFileSync } from "fs";
import { resolve } from "path";
import { DEVELOPMENT } from "./env";
import logger from "./logger";
import { categoryRepo } from "../controller/category.controller";
import { Repository } from "typeorm";
import { reactionRepo } from "../controller/reactions.controller";

const loadJSON = (file: string): string[] => {
	try {
		file = file.endsWith(".json") ? file : `${file}.json`

		const raw = readFileSync(resolve(
			DEVELOPMENT
				? `src/data/${file}`
				: `dist/data/${file}`
		))

		return JSON.parse(raw.toString())
	} catch {
		throw new Error()
	}
}

const loadUniqueJSON = (file: string): string[] => Array.from(new Set(loadJSON(file)))

const arrayToDatabase = (repository: Repository<any>, array: string[]) => {
	array.forEach(i => {
		const item = repository.create()
		item.name = i
		repository.save(item).catch(err => logger.silly(err.message))
	})
}

export default function () {
	try {
		arrayToDatabase(categoryRepo, loadUniqueJSON("categories.json"))
		arrayToDatabase(reactionRepo, loadUniqueJSON("reactions.json"))
	} catch (err: any) {
		logger.error(err.message)
	}
}