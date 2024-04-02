const express = require("express")
const blogController = require("../controllers/BlogController.js")

const BlogRouter = express.Router()

BlogRouter.route("/").get(blogController.articleList)

//FOR TESTING. COMMENT OFF AFTER TESTING
// ManuscriptRouter.route("/test-generate").post(authController.protect, manuscriptController.initGenerate)


module.exports = BlogRouter