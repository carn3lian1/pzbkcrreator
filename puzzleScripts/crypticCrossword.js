const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const puzzleImgSelector = "body > center"
const topTableSelector = "body > center > table:nth-child(1)"
const titleSelector = "body > center > h1"
const bottomTableSelector = "#foot"



exports.extractAndUploadCrypticCrosswordImgs = async (numOfImages) => {


    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    for (let i = 0; i < numOfImages; i++) {

        try {
            const randomYear = helperFunctions.getRandomInt(2022, 2023)
            let randomMonth = helperFunctions.getRandomInt(1, 9)
            let randomDay = helperFunctions.getRandomInt(1, 28)

            if (randomMonth >= 1 && randomMonth <= 9) randomMonth = `0${randomMonth}`
            if (randomDay >= 1 && randomDay <= 9) randomDay = `0${randomDay}`

            const rez = await page.goto(`https://simplydailypuzzles.com/daily-cryptic/puzzles/${randomYear}-${randomMonth}/dc1-${randomYear}-${randomMonth}-${randomDay}.html`)

            await helperFunctions.delay(5000)

            if (rez?.status() !== 200) return

            await page.$eval(topTableSelector, el => el.remove());
            await helperFunctions.delay(1000)
            await page.$eval(titleSelector, el => el.remove());
            await helperFunctions.delay(1000)
            await page.$eval(bottomTableSelector, el => el.remove());
            await helperFunctions.delay(5000)

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.tempCrypticCrosswordImgsFolderPath}crypticCrossword_${Date.now()}.png` })

            console.log(`crypticCrossword Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

        } catch (error) {
            console.log(error);

            console.log("could not extract crypticCrossword image");

        }

    }

    await page.close()

    console.log("crypticCrossword image generation complete");

    await helperFunctions.imageProcessor(90, null, 820, 0, 500, constants.tempCrypticCrosswordImgsFolderPath, constants.temp2CrypticCrosswordImgsFolderPath, constants.crypticCrosswordImgsFolderPath)



    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.crypticCrosswordImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("crypticCrossword shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.crypticCrosswordImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.crypticCrosswordImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {

                console.log("delete everything in the crypticCrossword local folders");
                await storageController.deleteAllFilesInFolder([
                    constants.crypticCrosswordImgsFolderPath,
                    constants.tempCrypticCrosswordImgsFolderPath,
                    constants.temp2CrypticCrosswordImgsFolderPath
                ])

            }

            console.log("single crypticCrossword image uploaded to box: ", i);

        }


        console.log("crypticCrossword images upload finished");
    } catch (error) {

        console.log("something went wrong with the crypticCrossword.js -> box interaction");

    }


}