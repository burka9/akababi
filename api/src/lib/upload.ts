import multer from "multer"
import { v4 as uuid } from "uuid"

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
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

export const postUpload = multer({ storage: postStorage })

const commentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
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

export const commentUpload = multer({ storage: commentStorage })

const profileStorage = multer.diskStorage({
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

export const profileUpload = multer({ storage: profileStorage })
