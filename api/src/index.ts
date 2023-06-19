import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { DEVELOPMENT, SERVER } from './lib/env'
import logger from './lib/logger'
import { RouteConfig } from './lib/route.config'
import { errorHandler } from './middleware'
import { Database } from './database'
import { User } from './entity/user/user.entity'
import { UserController } from './controller/user'

const routes: Array<RouteConfig> = []


// express configuration
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(cors())
app.use(morgan('combined', {
	stream: {
		write: (message: string) => {
			logger.info(message.trim());
		},
	}
}))


// routes configuration



// async error handler
app.use(errorHandler)




// server configuration
const server = createServer(app)


const SERVER_CALLBACK = () => {
	logger.info(`server started `)
	logger.debug(`listening on ${SERVER.HOST}:${SERVER.PORT}`)

	routes.forEach(route => logger.info(`Route configured: ${route.name}`))
}

const SERVER_ERROR = (err: any) => {
	if (err.code === 'EADDRINUSE') {
		logger.info('Address in use, retrying...')
		setTimeout(() => {
			server.close()
			SERVER.PORT++
			server.listen(SERVER.PORT, SERVER.HOST)
		}, 1000)
	}
}



// database configuration
Database.initialize()
	.then(async () => {
		logger.info('database connected')

		server
			.listen(SERVER.PORT, SERVER.HOST, SERVER_CALLBACK)
			.on('error', SERVER_ERROR)

		if (DEVELOPMENT) {
			try {
				let sub = Math.random().toString()
				
				await UserController.CreateNewUser({
					email: "user_1@email.com",
					phone: "123456",
					sub,
					location: {
						longitude: 10.2,
						latitude: 10.2,
					},
				} as User)

				let theuser = await UserController.FindUserBySub(sub)
				console.log(theuser)
				sub = Math.random().toString()

				await UserController.CreateNewUser({
					email: "user_2@email.com",
					phone: "123123",
					sub,
					location: {
						longitude: 1.2,
						latitude: 1.2,
					},
				} as User)

				theuser = await UserController.FindUserBySub(sub)
				console.log(theuser)
			} catch {
			}
		}
	})
	.catch(err => {
		logger.error(err.toString())
		logger.error('database connection failed')
	})
