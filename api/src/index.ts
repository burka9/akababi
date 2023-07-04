import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { DATABASE, DEVELOPMENT, SERVER } from './lib/env'
import logger from './lib/logger'
import { RouteConfig } from './lib/route.config'
import { errorHandler } from './middleware/error_handler'
import { Database } from './database'
import MiscRoute from './routes/misc.route'
import UserRoute from './routes/user.route'
import { existsSync, mkdirSync, rmSync } from 'fs'
import DiscoverRoute from './routes/discover.route'
import { incomingRequestHandler } from './middleware/incoming_request_handler'
import PostRoute from './routes/post.route'

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


// incoming routes
app.use(incomingRequestHandler)


// routes configuration
routes.push(new MiscRoute(app))
routes.push(new UserRoute(app))
routes.push(new DiscoverRoute(app))
routes.push(new PostRoute(app))



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


const uploadInit = () => {
	DEVELOPMENT && DATABASE.DROP_SCHEMA && existsSync('uploads') && rmSync('uploads', { recursive: true })
	!existsSync('uploads') && mkdirSync('uploads')
}


// database configuration
Database.initialize()
	.then(async () => {
		logger.info('database connected')

		uploadInit()
		
		server
			.listen(SERVER.PORT, SERVER.HOST, SERVER_CALLBACK)
			.on('error', SERVER_ERROR)
	})
	.catch(err => {
		logger.error(err.toString())
		logger.error('database connection failed')
	})
