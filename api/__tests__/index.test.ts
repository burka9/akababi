import { DataSource } from "typeorm"
import { UserController } from "../src/controller/user"
import { Database } from "../src/database"
import { User } from "../src/entity/user/user.entity"

let connection: DataSource

beforeAll(async () => {
	connection = await Database.initialize()
})

afterAll(async () => {
	await connection.destroy()
})

describe("CreateNewUser", () => {
	it("should create a new user with associated profile, audio, image and video categories", async () => {
		const mockSave = jest.fn()
		const mockUserRepo = {
			save: mockSave
		}

		const user = await UserController.CreateNewUser({
			email: "birukeph@gmail.com",
			phone: "9023798792",
			location: {
				longitude: 1,
				latitude: 1
			}
		} as User)

		expect(user).toBeDefined()
		expect(user.profile).toBeDefined()
		expect(user.profilePicture).toBeDefined()
		expect(user.audioCategories).toBeDefined()
		expect(user.videoCategories).toBeDefined()
		expect(user.pictureCategories).toBeDefined()
	})
})