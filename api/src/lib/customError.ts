export const CustomErrorName = 'CustomError'

export class CustomError extends Error {
	name: string
	code: number
	
	constructor(message: string, code?: number) {
		super(message)
		this.name = CustomErrorName
		this.code = Number(code) || 400
	}
}