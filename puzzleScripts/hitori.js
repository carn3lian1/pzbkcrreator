//#puzzleContainer
//#btnNew

const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const newPuzzleSelector = "#btnNew"
const puzzleImgSelector = "#puzzleContainer"


exports.extractAndUploadHitoriImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()
    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://www.puzzle-hitori.com/?size=11`)

    if (rez?.status() !== 200) return

    await helperFunctions.delay(3000)

    for (let i = 0; i < numOfImages; i++) {

        try {

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.hitoriImgsFolderPath}hitori_${Date.now()}.png` })

            console.log(`Hitori Screenshot num ${i + 1} of ${numOfImages} taken`);

            await helperFunctions.delay(3000)

            await page.click(newPuzzleSelector);
            await helperFunctions.delay(3000)

        } catch (error) {

            console.log("could not extract hitori image");

        }

    }

    await page.close()

    console.log("hitori image generation complete");


    try {
        await helperFunctions.delay(4000)

        console.log("starting upload");



        const files = await fs.promises.readdir(constants.hitoriImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("hitori shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.hitoriImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.hitoriImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            console.log("single hitori image uploaded to box: ", i);

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the hitori local folder");
                await storageController.deleteAllFilesInFolder([constants.hitoriImgsFolderPath])

            }


        }

        //Closes the browser instance
        // await browser.close();


        console.log("hitori images upload finished");
    } catch (error) {

        console.log("something went wrong with the hitori.js -> box interaction");

    }


}