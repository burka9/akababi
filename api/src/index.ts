import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { DATABASE, DEVELOPMENT, SERVER } from './lib/env'
import logger from './lib/logger'
import { RouteConfig } from './lib/route.config'
import { Debug, IncludeLocation, errorHandler } from './middleware'
import { Database } from './database'
import UserRoutes from './routes/user.routes'
import PostRoutes from './routes/post/post.route'
import loadData from './lib/loadData'
import CategoryRoutes from './routes/category.route'
import { existsSync, mkdirSync, rmSync } from 'fs'
import ReactionRoutes from './routes/reaction.route'
import 'express-async-errors'
import DiscoverRoutes from './routes/discover.route'

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


// static assets
app.use("/assets", express.static("uploads"))

// middleware
app.use(IncludeLocation)
app.use(Debug)

// routes configuration
routes.push(new ReactionRoutes(app))
routes.push(new CategoryRoutes(app))
routes.push(new UserRoutes(app))
routes.push(new PostRoutes(app))
routes.push(new DiscoverRoutes(app))

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
	.then(() => {
		logger.info('database connected')

		server
			.listen(SERVER.PORT, SERVER.HOST, SERVER_CALLBACK)
			.on('error', SERVER_ERROR)

		loadData()

		if (DEVELOPMENT && DATABASE.DROP_SCHEMA) {
			rmSync('uploads', {
				recursive: true
			})
		}
		
		// create folder for uploads
		!existsSync('uploads') && mkdirSync('uploads')
	})
	.catch(err => {
		logger.error(err.toString())
		logger.error('database connection failed')
	})
