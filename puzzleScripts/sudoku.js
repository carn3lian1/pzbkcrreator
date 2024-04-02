const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const pageURLS = [
    "/sudoku4x4/",
    "/sudoku6x6/puzzle/easy/",
    "/sudoku6x6/puzzle/medium/",
    "/sudoku6x6/puzzle/hard/",
    "/sudoku12x12/puzzle/evil/",
    "/sudoku12x12/puzzle/easy/",
    "/sudoku12x12/puzzle/medium/",
    "/sudoku12x12/puzzle/hard/",
    "/sudoku12x12/puzzle/evil/",
    "/sudoku9x9/1_level_36_hint/",
    "/sudoku9x9/2_level_35_hint/",
    "/sudoku9x9/3_level_34_hint/",
    "/sudoku9x9/4_level_33_hint/",
    "/sudoku9x9/5_level_32_hint/",
    "/sudoku9x9/6_level_31_hint/",
    "/sudoku9x9/7_level_30_hint/",
    "/sudoku9x9/8_level_29_hint/",
    "/sudoku9x9/9_level_28_hint/",
    "/sudoku9x9/10_level_27_hint/",
    "/sudoku9x9/11_level_26_hint/",
    "/sudoku9x9/12_level_25_hint/",
    "/sudoku9x9/13_level_24_hint/",
    "/sudoku9x9/14_level_23_hint/",
    "/sudoku9x9/15_level_22_hint/",
    "/sudoku9x9/16_level_21_hint/",
    "/sudoku9x9/17_level_20_hint/",
    "/sudoku9x9/18_level_19_hint/",
    "/sudoku9x9/19_level_18_hint/",
    "/sudoku9x9/20_level_17_hint/",

]

const puzzleImgSelector = "#tab_q_group"

exports.extractAndUploadSudokuImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    if (!page) return

    const sIndex = helperFunctions.getRandomInt(0, pageURLS.length - 1)

    await page.setViewport({ width: 1920, height: 1080 });


    for (let i = 0; i < numOfImages; i++) {
        try {

            const rez = await page.goto(`http://sudoku99.com${pageURLS[sIndex]}`, { waitUntil: 'networkidle2' })

            if (rez.status() !== 200) return

            await helperFunctions.delay(2000)
            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.sudokuImgsFolderPath}soduku_${Date.now()}.png` })

            console.log(`sudoku Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(5000)

        } catch (error) {
            console.log(error);
            console.log("could not extract sudoku image");

        }

    }

    await page.close()

    console.log("sudoku image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.sudokuImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("sudoku shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.sudokuImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.sudokuImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the sudoku local folder");
                await storageController.deleteAllFilesInFolder([constants.sudokuImgsFolderPath])

            }

            console.log("single sudoku image uploaded to box: ", i);

        }

        //Closes the browser instance
        // await browser.close();


        console.log("sudoku images upload finished");
    } catch (error) {

        console.log("something went wrong with the sudoku.js -> box interaction");

    }


}