const express = require("express")
const storageController = require("../controllers/storageController.js")

const StorageRouter = express.Router()

StorageRouter.route("/refresh_tokens").get(storageController.tokenRefresher)

module.exports = StorageRouter