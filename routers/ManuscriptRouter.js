const express = require("express")
const authController = require("../controllers/authController.js")
const manuscriptController = require("../controllers/manuscriptController.js")

const ManuscriptRouter = express.Router()

ManuscriptRouter.route("/ie").get(authController.protect, manuscriptController.autoExtractBot)
ManuscriptRouter.route("/generate").post(authController.protect, manuscriptController.initGenerate)

//FOR TESTING. COMMENT OFF AFTER TESTING
// ManuscriptRouter.route("/test-generate").post(manuscriptController.initGenerate)


module.exports = ManuscriptRouter