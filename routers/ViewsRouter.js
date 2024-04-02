const express = require("express")

const authController = require("../controllers/authController.js")
const viewsController = require("../controllers/viewsController.js")

const ViewsRouter = express.Router()

ViewsRouter.route("/").get(authController.isLoggedIn, viewsController.getHomePage)
ViewsRouter.route("/sitemap.xml").get(viewsController.getSitemap)
ViewsRouter.route("/robots.txt").get(viewsController.getRobotsTXT)
ViewsRouter.route("/test").get(viewsController.getTestPage)
ViewsRouter.route("/offload").get(viewsController.getOffloadingPage)
ViewsRouter.route("/login").get(authController.isLoggedIn, viewsController.getLoginPage)
ViewsRouter.route("/signup").get(viewsController.getSignupPage)
ViewsRouter.route("/forgotpw").get(viewsController.getForgotPasswordPage)
ViewsRouter.route("/resetpw").get(viewsController.getResetPasswordPage)

ViewsRouter.route('/purchased-manuscripts').get(authController.protect, viewsController.getPurchasesPage)
ViewsRouter.route("/orderpage/:orderType").get(authController.protect, viewsController.getOrderPage)
ViewsRouter.route("/pricing").get(viewsController.getPricingPage)
ViewsRouter.route("/catalog").get(authController.protect, viewsController.getCatalogPage)
ViewsRouter.route("/catalog-detail/:puzzleIdList").get(authController.protect, viewsController.getCatDetailPage)
ViewsRouter.route("/catalog-result").get(authController.protect, viewsController.getCatResultPage)
ViewsRouter.route("/subs").get(authController.protect, viewsController.getActiveSubscriptionsPage)
ViewsRouter.route("/myimages").get(viewsController.getSavedImagesPage)
ViewsRouter.route("/yay").get(viewsController.getConversionPage)
module.exports = ViewsRouter;
