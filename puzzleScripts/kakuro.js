const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const puzzleImgSelector = "#canvasDiv"
const widthSelector = "#generateWidthField"
const heightSelector = "#generateHeightField"
const generateBtnSelector = "#generateButton"


const radioDifficulty = [
    "#easy",
    "#medium",
    "#hard"
]
exports.extractAndUploadkakuroImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto("https://www.kakuro-online.com/generator")

    await helperFunctions.delay(5000)

    if (rez?.status() === 200) {

        for (let i = 0; i < numOfImages; i++) {

            try {

                await page.goto("https://www.kakuro-online.com/generator")

                await helperFunctions.delay(5000)

                await page.$eval(widthSelector, el => el.value = `${14}`)
                await page.$eval(heightSelector, el => el.value = `${14}`)

                const diffEl = await page.$(radioDifficulty[helperFunctions.getRandomInt(0, 2)]);

                await diffEl.click();

                await helperFunctions.delay(6000)
                await page.click(generateBtnSelector);

                await helperFunctions.delay(8000)
                const element = await page.$(puzzleImgSelector)

                element.screenshot({ path: `${constants.kakuroImgsFolderPath}kakuro_${Date.now()}.png` })

                console.log(`kakuro Screenshot num ${i + 1} taken`);
                await helperFunctions.delay(5000)

            } catch (error) {
                console.log(error);

                console.log("could not extract kakuro image");

            }

        }

        await page.close()

        console.log("kakuro image generation complete");


        try {
            await helperFunctions.delay(4000)

            const files = await fs.promises.readdir(constants.kakuroImgsFolderPath)

            const shuffledArr = helperFunctions.shuffle(files)

            console.log("kakuro shuffledArr len: ", shuffledArr.length);


            if (shuffledArr.length === 0) return

            for (let i in shuffledArr) {
                let sFile = shuffledArr[i]

                let imagePath = `${constants.kakuroImgsFolderPath}/${sFile}`
                await storageController.uploadSingleFileBox(constants.kakuroImagesID, sFile, imagePath)

                await helperFunctions.delay(2000)


                if (Number(i) === (shuffledArr.length - 1)) {
                    console.log("delete everything in the kakuro local folder");
                    await storageController.deleteAllFilesInFolder([constants.kakuroImgsFolderPath])

                }

                console.log("single kakuro image uploaded to box: ", i);

            }

            //Closes the browser instance
            // await browser.close();


            console.log("kakuro images upload finished");
        } catch (error) {

            console.log("something went wrong with the kakuro.js -> box interaction");

        }

    }
    else {
        console.log("puppeteer couldn't load kakuro page");
    }

}