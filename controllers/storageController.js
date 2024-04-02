const fs = require("fs")
const https = require("https");
const path = require("node:path")
const axios = require("axios")
const prom_fs = require("node:fs/promises")
const dotenv = require("dotenv")
dotenv.config({ path: "../config.env" })
const BoxModel = require("../models/BoxModels.js")
let BoxSDK = require('box-node-sdk');
const constants = require("../utils/constants.js")



let client = null
// Initialize the SDK with your app credentials
const sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

exports.getUserInfoBox = async (accessToken) => {

    try {
        const boxTokenDoc = await BoxModel.findById(constants.BoxTokenDocId)

        client = sdk.getBasicClient(boxTokenDoc.boxAccessToken);

        console.log("current box client user id: ", client.CURRENT_USER_ID);

        return await client.users.get(client.CURRENT_USER_ID)

    } catch (error) {
        console.log(error);
        console.log("getUserInfoBox error");

    }

}

exports.listAllfilesInFolderBox = async (folderId) => {

    try {
        const fileIdArr = []
        const boxTokenDoc = await BoxModel.findById(constants.BoxTokenDocId)

        client = sdk.getBasicClient(boxTokenDoc.boxAccessToken);

        let res = await client.folders.getItems(
            folderId,
            {
                usemarker: 'false',
                fields: 'name',
                offset: 0,
                limit: 2000
            })

        const fileObjList = res.entries

        for (let i in fileObjList) {
            fileIdArr.push(fileObjList[i].id)
        }

        return fileIdArr
    } catch (error) {
        console.log(error);
        console.log("listAllfilesInFolderBox error");
    }

}

exports.uploadPreflightCheck = async (boxFolderId, fileObj) => {

    return await client.files.preflightUploadFile(boxFolderId, fileObj, null);

}

exports.uploadSingleFileBox = async (boxFolderId, LocalFileName, LocalFilePath) => {
    try {
        console.log("single file upload started");

        const boxTokenDoc = await BoxModel.findById(constants.BoxTokenDocId)

        client = sdk.getBasicClient(boxTokenDoc.boxAccessToken);

        const stream = fs.createReadStream(LocalFilePath);

        let rez = await client.files.uploadFile(boxFolderId, LocalFileName, stream)

        if (rez.entries?.length > 0) {

            console.log(`${LocalFileName} uploaded successfully: `,);

            let rez2 = await addSharedLinkToFile(rez.entries[0].id, boxTokenDoc.boxAccessToken)

            return {
                manuscriptName: rez.entries[0].name,
                manuscriptId: rez.entries[0].id,
                downloadURL: rez2.shared_link.download_url
            }

        }
        else {
            console.log("file not uploaded for some reason");
        }


    } catch (error) {
        console.log("uploadSingleFileBox error ");
        console.log(error);

        return null

    }
}


async function addSharedLinkToFile(boxFileId, accessToken) {
    client = sdk.getBasicClient(accessToken);
    const linkRes = await client.files.update(boxFileId, {
        shared_link: {
            access: "open",
            permissions: {
                can_view: true,
                can_download: true,
                can_edit: true
            }
        }
    })

    return linkRes
}

exports.chunkUploaderBox = async (boxFolderId, LocalFileName, LocalFilePath) => {

    let stream = fs.createReadStream(LocalFilePath);
    let rez = client.files.getChunkedUploader(boxFolderId, 20000, LocalFileName, stream)
}

exports.downloadSingleFileBox = async (boxFileId, destFolderPath, destFileName, i) => {
    //'public/assets/img/puzzle_imgs/dl/x.png' is example of createWriteStream argument
    try {
        const boxTokenDoc = await BoxModel.findById(constants.BoxTokenDocId)

        client = sdk.getBasicClient(boxTokenDoc.boxAccessToken);

        const stream = await client.files.getReadStream(boxFileId, null);

        let output = fs.createWriteStream(`${destFolderPath}${destFileName}_${Date.now()}.png`);

        stream.pipe(output);

        console.log(`${destFileName} num ${i} successfully downloaded`);
    } catch (error) {

        console.log("downloadSingleFileBox error");
    }

}

exports.getSingleFileSharedLink = async (fileId) => {

    const sharedLink = await client.files.get(fileId, { fields: 'shared_link' })

    return sharedLink

}


exports.deleteAllFilesInFolder = async (folderPathList) => {

    try {

        for (let i in folderPathList) {
            let folderPath = folderPathList[i]

            requiredPath = path.join(__dirname, `../${folderPath}`)

            for (const file of await prom_fs.readdir(requiredPath)) {

                await prom_fs.unlink(path.join(requiredPath, file));
            }
        }

    } catch (error) {
        console.log(error);
        console.log("deleteAllFilesInFolder failed");

    }

}


function authenticationURLGenerator() {
    let baseUrl = "https://account.box.com/api/oauth2/authorize";
    let clientId = process.env.BOX_CLIENT_ID;
    let authorizationUrl = `${baseUrl}?client_id=${clientId}&response_type=code`;

    console.log((authorizationUrl));

}


async function tokenGenerator() {
    //generates access and refresh tokens from an authorisation code

    const res = await axios({
        url: "https://api.box.com/oauth2/token",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",

        },
        data: {
            grant_type: "authorization_code",
            code: 'cGfa8RBUS0iLaUeLbCIiRRb3WVee918J',
            client_id: process.env.BOX_CLIENT_ID,
            client_secret: process.env.BOX_CLIENT_SECRET
        }

    })

    const accessToken = res.data.access_token;

    const refreshToken = res.data.refresh_token;

    //update the database not the json. its problematic

    const updatedBoxDoc = await updateBoxTokenDoc(constants.BoxTokenDocId, refreshToken, accessToken)

    console.log("updated box Doc", updatedBoxDoc);



}

async function updateBoxTokenDoc(id, refreshToken, accessToken) {
    return await BoxModel.findByIdAndUpdate(id, {
        boxRefreshToken: refreshToken,
        boxAccessToken: accessToken
    },
        { new: true })


}

//run this once an hour to keep the refresh and access tokens nice and fresh
exports.tokenRefresher = async function (request, response, next) {
    //generates other access and refresh tokens from an existing refresh token

    try {

        const currBoxTokenDox = await BoxModel.findById(constants.BoxTokenDocId)

        const currRefToken = currBoxTokenDox.boxRefreshToken

        const res = await axios({
            url: "https://api.box.com/oauth2/token",
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",

            },
            data: {
                grant_type: "refresh_token",
                refresh_token: currRefToken,
                client_id: process.env.BOX_CLIENT_ID,
                client_secret: process.env.BOX_CLIENT_SECRET
            }

        })

        const newAccessToken = res.data.access_token;

        const newRefreshToken = res.data.refresh_token;


        const updatedBoxDoc = await updateBoxTokenDoc(constants.BoxTokenDocId, newRefreshToken, newAccessToken)

        if (updatedBoxDoc) console.log("token refresh3r success");


        response.status(200).json({ status: 200, message: "sweet success" })
    } catch (error) {
        console.log(error.response);
        console.log("tokenRefresher error");
        response.status(400).render("errorpage", { data: { status: 400, message: "could not refresh" } })

    }

}

// authenticationCodeGenerator()// returns auth code
// tokenGenerator() // returns refresh token and access token and writes to file
// tokenRefresher() // uses above refresh token to get new refresh/access tokens pair
