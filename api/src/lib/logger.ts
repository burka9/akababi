import { createLogger, format, transports } from 'winston'
import { LOG } from './env'

const { combine, printf, timestamp, colorize } = format

const logger = createLogger({
	level: LOG.LEVEL,
	transports: [],
	format: combine(
		colorize(),
		timestamp(),
		printf(log => `${new Date(log.timestamp).toLocaleString()} [${log.level}] - ${log.message}`)
	)
})

if (LOG.LOG_FILE) {
	logger.add(new transports.File({
		filename: LOG.LOG_FILE,
		maxFiles: LOG.LOG_MAX_FILES,
		maxsize: LOG.LOG_MAX_SIZE,
	}))
}

if (LOG.LOG_TO_CONSOLE) {
	logger.add(new transports.Console())
}

export default logger