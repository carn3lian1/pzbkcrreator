//#puzzleContainer
//#btnNew

const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const newPuzzleSelector = "#btnNew"
const puzzleImgSelector = "#puzzleContainer"


exports.extractAndUploadShikakuImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()
    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://www.puzzle-shikaku.com/?size=5`)

    if (rez?.status() !== 200) return

    await helperFunctions.delay(3000)

    for (let i = 0; i < numOfImages; i++) {

        try {

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.shikakuImgsFolderPath}shikaku_${Date.now()}.png` })

            console.log(`shikaku Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

            await page.click(newPuzzleSelector);
            await helperFunctions.delay(3000)



        } catch (error) {

            console.log("could not extract shikaku image");

        }

    }

    await page.close()

    console.log("shikaku image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.shikakuImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("shikaku shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.shikakuImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.shikakuImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            console.log("single shikaku image uploaded to box: ", i);

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the shikaku local folder");
                await storageController.deleteAllFilesInFolder([constants.shikakuImgsFolderPath])

            }


        }

        //Closes the browser instance
        // await browser.close();


        console.log("shikaku images upload finished");
    } catch (error) {

        console.log("something went wrong with the shikaku.js -> box interaction");

    }


}