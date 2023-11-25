import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { DATABASE, DEVELOPMENT, PATH, SERVER } from './lib/env'
import logger from './lib/logger'
import { RouteConfig } from './lib/route.config'
import { errorHandler } from './middleware/error_handler'
import { Database, conn } from './database'
import MiscRoute from './routes/misc.route'
import UserRoute from './routes/user.route'
import { existsSync, mkdirSync, rmSync } from 'fs'
import DiscoverRoute from './routes/discover.route'
import { incomingRequestHandler } from './middleware/incoming_request_handler'
import PostRoute from './routes/post.route'
import SMSRoute from './routes/sms.route'
import { Server } from 'socket.io'
import socket from './socket'
import MessageRoute from './routes/message.route'
import NotificationRoute from './routes/notification.route'
import GroupRoute from './routes/group.route'
import loadData from './lib/load_data'


const routes: Array<RouteConfig> = []


// express configuration
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet({
	crossOriginResourcePolicy: false,
}))
app.use(cors())
app.use(morgan('combined', {
	stream: {
		write: (message: string) => {
			logger.info(message.trim());
		},
	}
}))



// static assets
app.use("/assets", express.static("uploads"))


// sms route
routes.push(new SMSRoute(app))


// incoming routes
app.use(incomingRequestHandler)



// routes configuration
routes.push(new MiscRoute(app))
routes.push(new UserRoute(app))
routes.push(new DiscoverRoute(app))
routes.push(new PostRoute(app))
routes.push(new MessageRoute(app))
routes.push(new NotificationRoute(app))
routes.push(new GroupRoute(app))



// async error handler
app.use(errorHandler)



// server configuration
const server = createServer(app)


// socket configuration
export const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173"
	}
})


const SERVER_CALLBACK = () => {
	logger.info(`server started `)
	logger.debug(`listening on ${SERVER.HOST}:${SERVER.PORT}`)

	socket(io)

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


const pathInit = (path: string) => {
	!existsSync(path) && mkdirSync(path)
}

const uploadInit = () => {
	DEVELOPMENT && DATABASE.DROP_SCHEMA && existsSync(PATH.UPLOAD) && rmSync(PATH.UPLOAD, { recursive: true })
	pathInit(PATH.UPLOAD)
}


// database configuration
Database.initialize()
	.then(async () => {
		logger.info('database connected')

		uploadInit()
		pathInit(PATH.CUSTOM)

		loadData()

		// connect to database using mysql
		conn.connect(err => {
			if (err) logger.error(`database connection failed with mysql2`)

			logger.debug(`database connected with mysql2`)
		})

		server
			.listen(SERVER.PORT, SERVER.HOST, SERVER_CALLBACK)
			.on('error', SERVER_ERROR)
	})
	.catch(err => {
		logger.error(err.toString())
		logger.error('database connection failed')
	})
