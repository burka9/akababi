import { Request, Response } from "express";
import { goodRequest } from "../../lib/response";
import { Privacy } from "../../entity";
import { countryRepo, stateRepo } from "../../lib/load_data";

class MiscController {
	async getNationalities(req: Request, res: Response) {
		goodRequest(res, {
			nationalities: (await countryRepo.find({
				select: ["nationality"]
			})).map(item => item.nationality.trim())
		})
	}

	async getCountries(req: Request, res: Response) {
		goodRequest(res, {
			countries: (await countryRepo.find({
				select: ["name"]
			})).map(item => item.name.trim())
		})
	}

	async getStates(req: Request, res: Response) {
		goodRequest(res, {
			states: (await stateRepo.find({
				select: ["name"]
			})).map(item => item.name.trim())
		})
	}

	async getCities(req: Request, res: Response) {
		goodRequest(res, {
			cities: (await stateRepo.find({
				select: ["name"]
			})).map(item => item.name.trim())
		})
	}

	async getPrivacy(req: Request, res: Response) {
		goodRequest(res, {
			privacy: Object.values(Privacy)
		})
	}
}

export default new MiscController()