import { Request, Response } from "express";
import { Database } from "../../database";
import { Country } from "../../entity/group/country.entity";
import { goodRequest } from "../../lib/response";
import { matchedData, validationResult } from "express-validator";
import { BadFields, NoItem } from "../../lib/errors";

export const countryRepo = Database.getRepository(Country)

class CountryController {
	async readCountry(req: Request, res: Response) {
		const { country_id, country_name } = matchedData(req)

		goodRequest(res, {
			countries: await countryRepo.find({
				where: {
					...(country_id ? { id: country_id } : null),
					...(country_name ? { name: country_name } : null),
				},
				relations: ["cities"]
			})
		})
	}

	async createCountry(req: Request, res: Response) {
		const result = validationResult(req)
		const { country_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)
		
		const country = new Country(country_name)

		await countryRepo.save(country)

		goodRequest(res)
	}

	async updateCountry(req: Request, res: Response) {
		const result = validationResult(req)
		const { country_id, country_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const country = await countryRepo.findOneBy({ id: country_id })
		if (!country) throw new NoItem()

		country.name = country_name

		await countryRepo.save(country)

		goodRequest(res)
	}

	async removeCountry(req: Request, res: Response) {
		const result = validationResult(req)
		const { country_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const country = await countryRepo.findOneBy({ id: country_id })
		if (!country) throw new NoItem()

		await countryRepo.remove(country)

		goodRequest(res)
	}
}

export default new CountryController()