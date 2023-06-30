import multer from "multer"
import { v4 as uuid } from "uuid"

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, `uploads`)
	},
	filename: function (req, file, cb) {
    const name = uuid()
    const ext = file.originalname.split('.').pop()
    const theFilename = `${name}.${ext}`

    file.filename = theFilename

    cb(null, theFilename)
  }
})

export const upload = multer({ storage })