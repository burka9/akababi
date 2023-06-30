export class error extends Error {
	code: number;
	data: object | undefined;
	
	constructor(message: string, code = 400, data?: object) {
		super(message)
		this.code = code
		this.data = data
	}
}

export class BadFields extends error {
	constructor(data?: object) {
		super("Bad Fields", 400, data)
	}
}

export class Unauthorized extends error {
	constructor() {
		super("Unauthorized", 401)
	}
}

export class BadRequest extends error {
	constructor() {
		super("Bad Request")
	}
}

export class NoLocation extends error {
	constructor() {
		super("No Location")
	}
}

export class NoItem extends error {
	constructor() {
		super("Mo Item Found")
	}
}