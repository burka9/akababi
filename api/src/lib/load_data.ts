import { Database } from "../database";
import { City } from "../entity/misc/city.entity";
import { Country } from "../entity/misc/country.entity";
import { DEVELOPMENT, SEED } from "./env";
import { resolve } from "path";
import logger from "./logger";
import { readFileSync } from "fs";
import { State } from "../entity/misc/state.entity";

export const countryRepo = Database.getRepository(Country)
export const stateRepo = Database.getRepository(State)
export const cityRepo = Database.getRepository(City)

export default async function loadData() {
	if (DEVELOPMENT) return
	
	// load countries
	try {
		const countries: any[] = JSON.parse(readFileSync(resolve(SEED.COUNTRY), "utf8"))

		for await (const country of countries) {
			try {
				await countryRepo.insert({
					name: country.name,
					iso2: country.iso2,
					iso3: country.iso3,
					nationality: country.nationality,
				})
			} catch {}
		}
		
	} catch (err: any) {
		logger.error(`error loading countries: ${err.message}`)
	}

	// load states
	try {
		const states: any[] = JSON.parse(readFileSync(resolve(SEED.STATE), "utf8"))

		for await (const state of states) {
			try {
				await stateRepo.insert({
					name: state.name,
					code: state.state_code,
					country: state.country_name,
				})
			} catch {}
		}
		
	} catch (err: any) {
		logger.error(`error loading states: ${err.message}`)
	}

	// load cities
	try {
		const cities: any[] = JSON.parse(readFileSync(resolve(SEED.CITY), "utf8"))

		for await (const city of cities) {
			try {
				await cityRepo.insert({
					name: city.name,
					country: city.country_name,
					state: city.state_name,
				})
			} catch {}
		}
		
	} catch (err: any) {
		logger.error(`error loading cities: ${err.message}`)
	}
}