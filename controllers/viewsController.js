const fs = require("fs")
const PackageModel = require("../models/PackagesModel.js")
const SubscriptionModel = require("../models/SubscriptionModel.js")
const SocialUsersModel = require("../models/SocialUsersModel.js")
const constants = require("../utils/constants.js")
exports.getTestPage = (request, response, next) => {
    try {

        response.status(200).render("errorpage")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "getTestPage failed" } })
    }

}

exports.getOffloadingPage = (request, response, next) => {
    try {

        response.status(200).render("offloading")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get offloading page" } })

    }

}
exports.getHomePage = (request, response, next) => {
    try {
        fs.readFile("./utils/puzzleObj.json", (err, data) => {

            const puzzleList = JSON.parse(data)

            response.status(200).render("home", {
                puzzleList: puzzleList
            })
        })

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get home page" } })

    }

}

exports.getLoginPage = (request, response, next) => {
    // if a user is logged in, it redirects to the catalog

    try {
        console.log("is logged in: ", request.user);
        if (request.user) {
            return response.redirect("/catalog")
        }

        response.status(200).render("login")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get login page" } })
    }

}

exports.getSignupPage = (request, response, next) => {
    try {
        // if a user is logged in, it redirects to the catalog
        //because you can't signup for another account while still logged in

        if (request.user) {
            return response.redirect("/catalog")
        }
        response.status(200).render("signup")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get signup page" } })
    }

}

exports.getPricingPage = (request, response, next) => {
    try {
        response.status(200).render("pricing")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get pricing page" } })
    }

}

exports.getCatalogPage = (request, response, next) => {
    try {

        fs.readFile("./utils/puzzleObj.json", (err, data) => {

            const puzzleList = JSON.parse(data)

            response.status(200).render("catalog", {
                puzzleList: puzzleList
            })
        })

    } catch (error) {
        console.log(error);
        response.status(500).render("errorpage", { data: { status: 400, message: "couldn't get catalog page" } })
    }

}

exports.getCatResultPage = async (request, response, next) => {

    try {
        /*
        1. find out if is paid user and if subscription hasnt red
        2. if paid user, re render the side bar to show single full manuscript download btn
        */

        let paidUser = false
        const currentSub = await SubscriptionModel.findOne({ user: request.user.id })

        if (currentSub && currentSub.endDate > Date.now()) {
            paidUser = true
        }
        //get the link of the pdf page
        let prevfiles = fs.readdirSync(`${constants.previewManuscriptFolderPath}${request.user.id}`);

        let prev_path = `/assets/${constants.prev_manuscript_folder_const}/${request.user.id}/${prevfiles[0]}`

        let fullfiles = fs.readdirSync(`${constants.fullManuscriptFolderPath}${request.user.id}`);

        let full_path = `/${constants.full_manuscript_folder_const}/${request.user.id}/${fullfiles[0]}`

        response.status(200).render("cat_result", {
            data: {
                prev_path: prev_path,
                full_path: full_path,
                type: paidUser
            }
        })

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get result page" } })

    }
}

exports.getCatDetailPage = (request, response, next) => {
    try {

        const sentIds = request.params.puzzleIdList.split(",")
        //TODO: add logic to remove duplicate entries from sentIds

        let ParsedPuzzleList = []

        fs.readFile("./utils/puzzleObj.json", (err, data) => {

            const puzzleList = JSON.parse(data)

            const values = Object.values(puzzleList)

            for (let i = 0; i < sentIds.length; i++) {

                for (let j = 0; j < values.length; j++) {

                    if (values[j].id === sentIds[i]) {

                        ParsedPuzzleList.push(values[j])

                    }
                }
            }

            return response.status(200).render("cat_detail", {
                puzzleList: ParsedPuzzleList
            })


        })




    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get detail page" } })
    }

}


exports.getPurchasesPage = async (request, response, next) => {
    try {



        const currUser = await SocialUsersModel.findById(request.user.id)

        const manuscriptsArr = currUser.purchasedManuscripts

        response.status(200).render("cat_purchases", {
            manuscriptArr: manuscriptsArr
        })

    } catch (error) {
        console.log(error);

        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get purchases page" } })

    }
}

exports.getConversionPage = async (request, response, next) => {
    try {


        response.status(200).render("yay", {
        }

        )

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get conversion page page" } })
    }

}
exports.getActiveSubscriptionsPage = async (request, response, next) => {
    try {


        const subscriptionDocs = await SubscriptionModel.find({ user: request.user.id })
        console.log(subscriptionDocs);

        response.status(200).render("cat_subscriptions", {
            subsArr: subscriptionDocs
        }


        )

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get subscriptions page" } })
    }

}

exports.getSavedImagesPage = (request, response, next) => {
    try {
        response.status(200).render("saved-images")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get saved images page" } })
    }

}

exports.getOrderPage = async (request, response, next) => {
    try {


        // const currUser = await SocialUsersModel.findById(request.user.id)

        //get the last element in the generatedManuscripts array and get its boxid
        //query db for the ebook product model and set said info in the order page
        console.log("order type payload", request.params);

        let orderType = request.params.orderType

        const CurrentPackage = await PackageModel.findOne({ name: orderType })

        let paypalUrl = null

        if (process.env.NODE_ENV === "production") {
            paypalUrl = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_LIVE_CLIENT_ID}&currency=USD`

        }
        else if (process.env.NODE_ENV === "development") {
            paypalUrl = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_SANDBOX_CLIENT_ID}&currency=USD`
        }

        response.status(200).render("orderpage", {
            data: {
                id: CurrentPackage.id,
                name: CurrentPackage.name,
                price: CurrentPackage.price,
                desc: CurrentPackage.description,
                url: paypalUrl
            }
        })

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get order page" } })
    }

}

exports.getForgotPasswordPage = (request, response, next) => {
    try {
        response.status(200).render("forgot-password")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get forgot password page" } })
    }

}

exports.getResetPasswordPage = (request, response, next) => {
    try {
        response.status(200).render("reset-password")

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get reset password page" } })
    }

}


exports.getSitemap = (request, response, next) => {
    try {
        response.sendFile("sitemap.xml", { root: '.' })

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get sitemap page" } })
    }

}

exports.getRobotsTXT = (request, response, next) => {
    try {
        response.sendFile("robots.txt", { root: '.' })

    } catch (error) {
        response.status(400).render("errorpage", { data: { status: 400, message: "couldn't get sitemap page" } })
    }

}