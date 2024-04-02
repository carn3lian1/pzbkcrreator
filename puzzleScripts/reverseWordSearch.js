const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const sliderSelector = "#sg"
const createSelector = "#container_left > form > input"

const submitSelector = "#container_left > form > input.button_green"

const puzzleImgSelector = "#container"


exports.extractAndUploadReverseWordSearchImgs = async (numOfImages) => {



    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return


    for (let i = 0; i < numOfImages; i++) {

        try {

            const rez = await page.goto(`https://rws.puzzlebaron.com/init.php`)

            await helperFunctions.delay(5000)

            if (rez?.status() !== 200) return

            await page.$eval(sliderSelector, el => el.value = "11")

            await page.waitForSelector(createSelector);
            await page.click(createSelector);

            await helperFunctions.delay(5000)

            await page.waitForSelector(submitSelector);
            await page.click(submitSelector);
            await helperFunctions.delay(5000)

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.tempReverseWordSearchImgsFolderPath}reverseWordSearch_${Date.now()}.png` })

            console.log(`reverseWordSearch Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)


        } catch (error) {
            console.log(error);

            console.log("could not extract reverseWordSearch image");

        }

    }
    await page.close()


    console.log("reverseWordSearch image generation complete");

    //process images here (rotate 90 degrees and crop out empty spaces)

    await helperFunctions.imageProcessor(90, 550, 990, 1300, 0, constants.tempReverseWordSearchImgsFolderPath, constants.temp2ReverseWordSearchImgsFolderPath, constants.reverseWordSearchImgsFolderPath)

    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.reverseWordSearchImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("reverseWordSearch shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.reverseWordSearchImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.reverseWordSearchImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {

                console.log("delete everything in the reverseWordSearch local folders");
                await storageController.deleteAllFilesInFolder([
                    constants.reverseWordSearchImgsFolderPath,
                    constants.tempReverseWordSearchImgsFolderPath,
                    constants.temp2ReverseWordSearchImgsFolderPath
                ])

            }

            console.log("single reverseWordSearch image uploaded to box: ", i);

        }


        console.log("reverseWordSearch images upload finished");
    } catch (error) {

        console.log("something went wrong with the reverseWordSearch.js -> box interaction");

    }


}