const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")
const wordsBank = require("../utils/wordsBank.js")

const wordsSelector = "#puzzle_words"
const createBtnSelector = "#btn-submit"
const del1Selector = "body > div > div.container.p-0 > div.container.mt-2.pt-2 > div:nth-child(2) > div > div:nth-child(1) > div > h2"
const del2Selector = "body > div > div.container.p-0 > div.container.mt-2.pt-2 > div:nth-child(2) > div > div:nth-child(1) > div > div.row.pt-2.pb-3.no-print"
const puzzleImgSelector = "body > div > div.container.p-0 > div.container.mt-2.pt-2 > div:nth-child(2) > div > div:nth-child(1)"





exports.extractAndUploadCrosswordImgs = async (numOfImages) => {


    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    for (let i = 0; i < numOfImages; i++) {

        try {

            const words = wordsBank.getRandomWords()

            const rez = await page.goto(`https://puzzlemaker.discoveryeducation.com/criss-cross/`)

            await helperFunctions.delay(5000)

            if (rez?.status() !== 200) return

            await page.$eval(wordsSelector, (el, mWords) => {

                return el.value = mWords

            }, words);

            await helperFunctions.delay(5000)

            await page.click(createBtnSelector);

            await helperFunctions.delay(5000)
            await page.$eval(del1Selector, el => el.remove());
            await page.$eval(del2Selector, el => el.remove());

            await helperFunctions.delay(5000)

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.crosswordImgsFolderPath}crossword_${Date.now()}.png` })

            console.log(`crossword Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

        } catch (error) {
            console.log(error);

            console.log("could not extract crossword image");

        }

    }


    await page.close()

    console.log("crossword image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.crosswordImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("crossword shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.crosswordImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.crosswordImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {

                console.log("delete everything in the crossword local folders");
                await storageController.deleteAllFilesInFolder([
                    constants.crosswordImgsFolderPath,
                ])

            }

            console.log("single crossword image uploaded to box: ", i);

        }


        console.log("crossword images upload finished");
    } catch (error) {

        console.log("something went wrong with the crossword.js -> box interaction");

    }


}