const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const puzzleImgSelector = "#content > div > div.col-md-7.col-sm-8.col-xs-12 > div.panel.panel-default > div.panel-body"


exports.extractAndUploadArithmagonImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    for (let i = 0; i < numOfImages; i++) {

        try {

            const rez = await page.goto(`https://freeprintablepuzzles.co.uk/arithmagons/square/`)

            await helperFunctions.delay(5000)


            if (rez?.status() !== 200) return


            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.arithmagonImgsFolderPath}arithmagon_${Date.now()}.png` })

            console.log(`arithmagon Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(5000)

        } catch (error) {

            console.log("could not extract arithmagon image");

        }

    }


    await page.close()
    console.log("arithmagon image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.arithmagonImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("arithmagon shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.arithmagonImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.arithmagonImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the arithmagon local folder");
                await storageController.deleteAllFilesInFolder([constants.arithmagonImgsFolderPath])

            }

            console.log("single arithmagon image uploaded to box: ", i);

        }

        //Closes the browser instance
        // await browser.close();


        console.log("arithmagon images upload finished");
    } catch (error) {

        console.log("something went wrong with the arithmagon.js -> box interaction");

    }


}