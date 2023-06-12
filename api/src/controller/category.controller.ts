import { Request, Response } from "express";
import logger from "../lib/logger";
import { goodRequest } from "../lib/response";
import { Database } from "../database";
import { CategoryTag } from "../entity/category.tag.entity";

export const categoryRepo = Database.getRepository(CategoryTag)

class CategoryController {
	async getCategories(req: Request, res: Response) {
		logger.debug(`get categories request ${req.url}`)

		goodRequest(res, [
			'categories',
			(await categoryRepo.find({
				order: {
					name: "ASC"
				}
			})).map(item => item.name)
		])
	}
}

export default new CategoryController()