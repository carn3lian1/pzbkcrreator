const express = require("express")
const purchasesController = require("../controllers/purchasesController.js")

const PurchasesRouter = express.Router()

PurchasesRouter.route("/").post(purchasesController.createOrder)
PurchasesRouter.route("/:orderID/capture/").post(purchasesController.capturePayment)


module.exports = PurchasesRouter