import { Request, Response } from "express";
import { Database } from "../../database";
import { goodRequest } from "../../lib/response";
import { BadFields, NoItem } from "../../lib/errors";
import { matchedData, validationResult } from "express-validator";
import { CategoryTag } from "../../entity/post/category_tag.entity";
import { interestRepo } from "./interest";
import { Interest } from "../../entity/user/interest.entity";

export const categoryRepo = Database.getRepository(CategoryTag)

class CategoryController {
	async readCategory(req: Request, res: Response) {
		const { category_id, category_name } = matchedData(req)

		goodRequest(res, {
			categories: await categoryRepo.find({
				where: {
					...(category_id ? { id: category_id } : null),
					...(category_name ? { name: category_name } : null),
				}
			})
		})
	}

	async createCategory(req: Request, res: Response) {
		const result = validationResult(req)
		const { category_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const category = new CategoryTag(category_name)

		await categoryRepo.save(category)

		// create corresponding interest
		try {
			await interestRepo.save(new Interest(category_name))
		} catch { }

		goodRequest(res)
	}

	async updateCategory(req: Request, res: Response) {
		const result = validationResult(req)
		const { category_id, category_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const category = await categoryRepo.findOneBy({ id: category_id })
		if (!category) throw new NoItem()

		category.name = category_name

		await categoryRepo.save(category)

		// update corresponding interest or create new
		try {
			let interest = await interestRepo.findOneBy({ name: category_name })
			if (interest) interest.name = category_name
			else interest = new Interest(category_name)
			await interestRepo.save(interest)
		} catch { }

		goodRequest(res)
	}

	async removeCategory(req: Request, res: Response) {
		const result = validationResult(req)
		const { category_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const category = await categoryRepo.findOneBy({ id: category_id })
		if (!category) throw new NoItem()

		await categoryRepo.remove(category)

		// delete corresponding interest
		try {
			await interestRepo.delete({ name: category.name })
		} catch { }

		goodRequest(res)
	}
}

export default new CategoryController()