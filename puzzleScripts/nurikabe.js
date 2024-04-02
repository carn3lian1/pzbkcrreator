//#puzzleContainer
//#btnNew

const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const newPuzzleSelector = "#btnNew"
const puzzleImgSelector = "#puzzleContainer"


exports.extractAndUploadNurikabeImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()
    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://www.puzzle-nurikabe.com/?size=10`)

    if (rez?.status() !== 200) return

    await helperFunctions.delay(3000)

    for (let i = 0; i < numOfImages; i++) {

        try {

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.nurikabeImgsFolderPath}nurikabe_${Date.now()}.png` })

            console.log(`nurikabe Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

            await page.click(newPuzzleSelector);
            await helperFunctions.delay(3000)



        } catch (error) {

            console.log("could not extract nurikabe image");

        }

    }

    await page.close()

    console.log("nurikabe image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.nurikabeImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("nurikabe shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.nurikabeImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.nurikabeImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            console.log("single nurikabe image uploaded to box: ", i);

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the nurikabe local folder");
                await storageController.deleteAllFilesInFolder([constants.nurikabeImgsFolderPath])

            }


        }

        //Closes the browser instance
        // await browser.close();


        console.log("nurikabe images upload finished");
    } catch (error) {

        console.log("something went wrong with the nurikabe.js -> box interaction");

    }


}