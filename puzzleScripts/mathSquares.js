const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const titleSelector = "#puzzle_title"
const sizeSelector = "#puzzle_size"
const createSelector = "#btn-submit"

const puzzleImgSelector = "#pzl"
const rebuildPuzzleSelector = "#btn-rebuild"

exports.extractAndUploadMathSquaresImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://puzzlemaker.discoveryeducation.com/math-squares`)

    await helperFunctions.delay(5000)

    await page.$eval(titleSelector, el => el.value = 'test');
    await page.$eval(sizeSelector, el => el.value = '5');

    await page.waitForSelector(createSelector);
    await page.click(createSelector);

    if (rez?.status() !== 200) return

    for (let i = 0; i < numOfImages; i++) {

        try {
            await helperFunctions.delay(5000)

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.tempmathSquareImgsFolderPath}mathSquares_${Date.now()}.png` })

            console.log(`mathSquares Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(5000)
            await page.waitForSelector(rebuildPuzzleSelector);
            await page.click(rebuildPuzzleSelector);


        } catch (error) {
            console.log(error);

            console.log("could not extract mathSquares image");

        }

    }

    await page.close()

    console.log("mathSquares image generation complete");

    await helperFunctions.imageProcessor(90, null, 700, 0, 0, constants.tempmathSquareImgsFolderPath, constants.temp2mathSquareImgsFolderPath, constants.mathSquaresImgsFolderPath)


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.mathSquaresImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("mathSquares shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.mathSquaresImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.mathSquaresImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the mathSquares local folder");
                await storageController.deleteAllFilesInFolder([
                    constants.mathSquaresImgsFolderPath,
                    constants.tempmathSquareImgsFolderPath,
                    constants.temp2mathSquareImgsFolderPath,])

            }

            console.log("single mathSquares image uploaded to box: ", i);

        }

        //Closes the browser instance
        // await browser.close();


        console.log("mathSquares images upload finished");
    } catch (error) {

        console.log("something went wrong with the mathSquares.js -> box interaction");

    }


}