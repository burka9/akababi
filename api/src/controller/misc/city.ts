import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { City } from "../../entity/group/city.entity";
import { BadFields, NoItem } from "../../lib/errors";
import { goodRequest } from "../../lib/response";
import { countryRepo } from "./country";
import { Database } from "../../database";

export const cityRepo = Database.getRepository(City)

class CityController {
	async readCity(req: Request, res: Response) {
		const { city_id, city_name } = matchedData(req)

		goodRequest(res, {
			cities: await cityRepo.find({
				where: {
					...(city_id ? { id: city_id } : null),
					...(city_name ? { name: city_name } : null),
				},
			})
		})
	}

	async createCity(req: Request, res: Response) {
		const result = validationResult(req)
		const { city_name, country_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const country = await countryRepo.findOneBy({ id: country_id })
		if (!country) throw new NoItem("Country")
		
		const city = new City(city_name)
		city.country = country

		await cityRepo.save(city)

		goodRequest(res)
	}

	async updateCity(req: Request, res: Response) {
		const result = validationResult(req)
		const { city_id, city_name } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const city = await cityRepo.findOneBy({ id: city_id })
		if (!city) throw new NoItem()

		city.name = city_name

		await cityRepo.save(city)

		goodRequest(res)
	}

	async removeCity(req: Request, res: Response) {
		const result = validationResult(req)
		const { city_id } = matchedData(req)

		if (!result.isEmpty()) throw new BadFields(result)

		const city = await cityRepo.findOneBy({ id: city_id })
		if (!city) throw new NoItem()

		await cityRepo.remove(city)

		goodRequest(res)
	}
}

export default new CityController()