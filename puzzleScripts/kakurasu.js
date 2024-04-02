//#puzzleContainer
//#btnNew

const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")
const mPath = require("path")

const newPuzzleSelector = "#btnNew"
const puzzleImgSelector = "#puzzleContainer"


exports.extractAndUploadKakurasuImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()
    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://www.puzzle-kakurasu.com/?size=11`)

    if (rez?.status() !== 200) return

    await helperFunctions.delay(3000)

    for (let i = 0; i < numOfImages; i++) {

        try {

            const element = await page.$(puzzleImgSelector)

            //element.screenshot({ path: mPath.join(__dirname, `${constants.kakurasuImgsFolderPath}kakurasu_${Date.now()}.png`) })

            element.screenshot({ path: `${constants.kakurasuImgsFolderPath}kakurasu_${Date.now()}.png` })

            console.log(`kakurasu Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

            await page.click(newPuzzleSelector);
            await helperFunctions.delay(3000)



        } catch (error) {

            console.log("could not extract kakurasu image");

        }

    }

    await page.close()

    console.log("kakurasu image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.kakurasuImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("kakurasu shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.kakurasuImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.kakurasuImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            console.log("single kakurasu image uploaded to box: ", i);

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the kakurasu local folder");
                await storageController.deleteAllFilesInFolder([constants.kakurasuImgsFolderPath])

            }


        }

        //Closes the browser instance
        // await browser.close();


        console.log("kakurasu images upload finished");
    } catch (error) {

        console.log("something went wrong with the kakurasu.js -> box interaction");

    }


}