import { Request, Response } from "express";
import { Interest } from "../../entity/user/interest.entity";
import { Database } from "../../database";
import { goodRequest } from "../../lib/response";
import { BadFields, NoItem } from "../../lib/errors";
import { matchedData, validationResult } from "express-validator";

export const interestRepo = Database.getRepository(Interest)

class InterestController {
	async readInterest(req: Request, res: Response) {
		const { interest_id, interest_name } = matchedData(req)

		goodRequest(res, {
			interests: await interestRepo.find({
				where: {
					...(interest_id ? { id: interest_id } : null),
					...(interest_name ? { name: interest_name } : null),
				}
			})
		})
	}

	async createInterest(req: Request, res: Response) {
		const result = validationResult(req)
		const { interest_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const interest = new Interest(interest_name)

		await interestRepo.save(interest)

		goodRequest(res)
	}

	async updateInterest(req: Request, res: Response) {
		const result = validationResult(req)
		const { interest_id, interest_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const interest = await interestRepo.findOneBy({ id: interest_id })
		if (!interest) throw new NoItem()

		interest.name = interest_name

		await interestRepo.save(interest)

		goodRequest(res)
	}

	async removeInterest(req: Request, res: Response) {
		const result = validationResult(req)
		const { interest_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const interest = await interestRepo.findOneBy({ id: interest_id })
		if (!interest) throw new NoItem()

		await interestRepo.remove(interest)

		goodRequest(res)
	}
}

export default new InterestController()