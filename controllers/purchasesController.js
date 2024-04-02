const fs = require("fs")
const axios = require("axios");
const SocialUsersModel = require("../models/SocialUsersModel.js");
const SubscriptionModel = require("../models/SubscriptionModel.js");
const PackagesModel = require("../models/PackagesModel.js");
const storageController = require("../controllers/storageController.js")
const constants = require("../utils/constants.js")
const helpers = require("../utils/helperFunctions.js")

exports.createOrder = async (request, response, next) => {

    try {
        const sPackage = await PackagesModel.findById(request.body.packageId)

        const sPackagePrice = sPackage.price



        let cOrderRes = null;
        try {
            let baseUrl = null;

            if (process.env.NODE_ENV === "development") {
                baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL

            }
            else if (process.env.NODE_ENV === "production") {
                baseUrl = process.env.PAYPAL_LIVE_BASE_URL
            }



            const url = `${baseUrl}/v2/checkout/orders`
            const tokenObj = await generateAccessToken()
            cOrderRes = await axios({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenObj.access_token}`
                },

                data: JSON.stringify({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "USD",
                                value: sPackagePrice,
                            }
                        }
                    ],

                })

            })

            response.status(200).json({
                message: "create Order success",
                data: cOrderRes.data
            })

        } catch (error) {
            console.log(error);
            response.status(400).json({
                message: "could not complete the transaction. Please try again later 1",
                data: cOrderRes.data
            })
        }

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "could not complete the transaction. Please try again later 2" })
    }
}

exports.capturePayment = async (request, response, next) => {
    try {

        /**
         * it is either a payment for a free user or a payment for a paid account
         * if free user capture payment and show manuscript
         * if for paid account create a subscription doc for a first time purchase
         * update the subscription doc for an upgrade/downgrade then go to catalog page
         * 
         */

        const userId = request.user.id

        const sPackage = await PackagesModel.findById(request.body.packageId)
        if (sPackage.name === "basic") expiryDate = helpers.endDate(30)[1]
        if (sPackage.name === "premium") expiryDate = helpers.endDate(180)[1]
        if (sPackage.name === "platinum") expiryDate = helpers.endDate(365)[1]

        let baseUrl = null;

        if (process.env.NODE_ENV === "development") {
            baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL

        }
        else if (process.env.NODE_ENV === "production") {
            baseUrl = process.env.PAYPAL_LIVE_BASE_URL
        }

        const orderId = request.params.orderID;

        const tokenObj = await generateAccessToken()
        const url = `${baseUrl}/v2/checkout/orders/${orderId}/capture`;

        const cPaymentObj = await axios({
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenObj.access_token}`
            }
        })

        // update user mongoDB object with the name and id of just purchased manuscript
        //send url of download page back to client to allow for downloading of manuscript

        if (!cPaymentObj) return response.status(400).json({ message: "could not capture payment. Try again later" })

        const SubsModel = await SubscriptionModel.findOne({ user: userId })

        if (SubsModel) {
            //update the specific subscription model with the new details i.e price, creation date, expriry date
            console.log("premium user changing to a different package");

            const updatedSubscription = await SubscriptionModel.findOneAndUpdate({ user: request.user.id },
                {
                    package: sPackage.id,
                    user: request.user.id,
                    price: sPackage.price,
                    paypalCaptureId: cPaymentObj.data.id,
                    paymentCycle: "onetime",
                    endDate: expiryDate
                },
                {
                    new: true,
                    runValidators: true
                })

            if (updatedSubscription) {

                const msg = `You have successfully changed to the ${sPackage.name} package.`
                return response.status(200).json({
                    message: msg,
                    url: "/catalog"

                })
            }

            else {
                const msg = `could not change to the ${sPackage.name} package.`
                return response.status(200).json({
                    message: msg,
                    url: "/catalog"

                })
            }
        }

        //meaning that current user wants to buy a basic package
        else if (!SubsModel && sPackage.name === "basic") {
            console.log("free user buying a basic package");
            // add user to subscriptions collection

            const newPaidUser = await SubscriptionModel.create({
                package: sPackage.id,
                user: request.user.id,
                price: sPackage.price,
                paypalCaptureId: cPaymentObj.data.id,
                paymentCycle: "onetime",
                endDate: expiryDate
            })

            if (newPaidUser) {
                const msg = `You have successfully bought ${sPackage.name} package.`
                return response.status(200).json({
                    message: msg,
                    url: "/catalog"
                })

            }
            else {
                return response.status(200).json({
                    message: "something went wrong when buying basic package. Try again",
                })
            }

        }
        //meaning that current user wants to buy a premium package
        else if (!SubsModel && sPackage.name === "premium") {
            console.log("free user buying a premium package");
            // add user to subscriptions collection

            const newPaidUser = await SubscriptionModel.create({
                package: sPackage.id,
                user: request.user.id,
                price: sPackage.price,
                paypalCaptureId: cPaymentObj.data.id,
                paymentCycle: "onetime",
                endDate: expiryDate
            })

            if (newPaidUser) {
                const msg = `You have successfully bought ${sPackage.name} package.`
                return response.status(200).json({
                    message: msg,
                    url: "/catalog"
                })

            }
            else {
                return response.status(200).json({
                    message: "something went wrong when buying premium package. Try again",
                })
            }
        }

        //meaning that current user wants to buy a platinum package
        else if (!SubsModel && sPackage.name === "platinum") {
            console.log("free user buying a platinum package");

            const newPaidUser = await SubscriptionModel.create({
                package: sPackage.id,
                user: request.user.id,
                price: sPackage.price,
                paypalCaptureId: cPaymentObj.data.id,
                paymentCycle: "onetime",
                endDate: expiryDate
            })

            if (newPaidUser) {
                const msg = `You have successfully bought ${sPackage.name} package.`
                return response.status(200).json({
                    message: msg,
                    url: "/catalog"
                })

            }
            else {
                return response.status(200).json({
                    message: "something went wrong when buying platinum package. Try again",
                })
            }
        }
        //meaning that current user is free and is looking to buy a single manuscript
        else if (!SubsModel && sPackage.name === "single") {
            console.log("free user paying for single manuscript");

            //get the relative file path of full manuscript folder and set it as the download_url in the response
            //get the link of the pdf page
            let files = fs.readdirSync(`${constants.fullManuscriptFolderPath}${request.user.id}`);

            manuscript_path = `/${constants.full_manuscript_folder_const}/${request.user.id}/${files[0]}`

            return response.status(200).json({
                message: "you have successfully paid for the manuscript. Here it comes...",
                url: manuscript_path
            })

        }

        else {
            console.log("HERE!");
        }

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "capturePayment fail" })
    }
}


async function generateAccessToken() {
    try {

        let clientId = null;
        let clientSecret = null;
        let baseUrl = null;

        if (process.env.NODE_ENV === "development") {
            baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL
            clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID
            clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET
        }
        else if (process.env.NODE_ENV === "production") {
            baseUrl = process.env.PAYPAL_LIVE_BASE_URL
            clientId = process.env.PAYPAL_LIVE_CLIENT_ID
            clientSecret = process.env.PAYPAL_LIVE_CLIENT_SECRET
        }

        const response = await axios({
            url: `${baseUrl}/v1/oauth2/token`,
            method: "POST",
            data: "grant_type=client_credentials",
            auth: {
                username: clientId,
                password: clientSecret
            }
        })

        return response.data
    } catch (error) {
        console.log("generateAccessToken failed");
    }


}


async function logPurchaseToDb(request, fileName, fileId, dlURL) {

    try {
        let updatedUserRez = null

        if (request.user.provider === "manual") {

            updatedUserRez = await UsersModel.findByIdAndUpdate(request.user.id,
                {
                    $push: {
                        purchasedManuscripts: {
                            manuscriptName: fileName,
                            boxFileId: fileId,
                            downloadURL: dlURL

                        },

                    }
                },
                { new: true }
            )
        }
        else {
            updatedUserRez = await SocialUsersModel.findByIdAndUpdate(request.user.id,
                {
                    $push: {
                        purchasedManuscripts: {
                            manuscriptName: fileName,
                            boxFileId: fileId,
                            downloadURL: dlURL

                        },

                    }
                },
                { new: true }
            )

        }

        return updatedUserRez
    } catch (error) {
        console.log("logPurchaseToDb error");

    }

}


async function importantstuffThatIdRatherNotDelete() {
    let currUser = null

    if (request.user.provider === "manual") currUser = await UsersModel.findById(request.user.id)
    else currUser = await SocialUsersModel.findById(request.user.id)

    if (!currUser) return;

    const generatedManuscriptsArr = currUser.generatedManuscripts

    const fileName = generatedManuscriptsArr[generatedManuscriptsArr.length - 1].manuscriptName
    const fileId = generatedManuscriptsArr[generatedManuscriptsArr.length - 1].boxFileId
    const dlURL = generatedManuscriptsArr[generatedManuscriptsArr.length - 1].downloadURL

    // let updateRes = await logPurchaseToDb(request, fileName, fileId, dlURL)

    const sharedLinkObj = await storageController.getSingleFileSharedLink(fileId)

    const manuscript_download_url = sharedLinkObj.shared_link.download_url;

}