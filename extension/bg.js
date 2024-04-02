
chrome.runtime.onInstalled.addListener(async function (details) {

    if (details.reason === "install") {
        var newURL = "https://puzzlebook-creator-earlybird.netlify.app/";
        chrome.tabs.create({ url: newURL });


    }

})



async function cookieChecker(cb) {
    let res = await chrome.cookies.getAll({ url: "https://puzzlebook-creator-online.onrender.com/" })

    for (let i in res) {
        if (res[i]["name"] === "Auth_Cookie") {
            expired = false
            break
        }
        else {
            expired = true
        }
    }

    if (expired) {

        cb({
            status: false,
            message: "website not logged in"
        })

    }

    else {
        cb({
            status: true,
            message: "website logged in"
        })
    }


}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.message === "from-popup-checkauth") {

        cookieChecker(sendResponse)

    }

    else {

        try {
            sendResponse({
                message: "fail"
            })
        } catch (error) {
            console.log(error);

        }


    }


    return true


})


