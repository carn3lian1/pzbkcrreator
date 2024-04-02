//#puzzleContainer
//#btnNew

const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const newPuzzleSelector = "#btnNew"
const puzzleImgSelector = "#puzzleContainer"


exports.extractAndUploadShakashakaImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()
    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://www.puzzle-shakashaka.com/?size=4`)

    if (rez?.status() !== 200) return

    await helperFunctions.delay(3000)

    for (let i = 0; i < numOfImages; i++) {

        try {

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.shakashakaImgsFolderPath}shakashaka_${Date.now()}.png` })

            console.log(`shakashaka Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

            await page.click(newPuzzleSelector);
            await helperFunctions.delay(3000)



        } catch (error) {

            console.log("could not extract shakashaka image");

        }

    }

    await page.close()

    console.log("shakashaka image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.shakashakaImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("shakashaka shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.shakashakaImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.shakashakaImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            console.log("single shakashaka image uploaded to box: ", i);

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the shakashaka local folder");
                await storageController.deleteAllFilesInFolder([constants.shakashakaImgsFolderPath])

            }


        }


        console.log("shakashaka images upload finished");
    } catch (error) {

        console.log("something went wrong with the shakashaka.js -> box interaction");

    }


}