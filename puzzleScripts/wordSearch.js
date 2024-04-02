const fs = require("fs")
const axios = require("axios")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const wordsSelector = "#wordsForm > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) > p > textarea"
const createSelector = "#create"

const topTableSelector = "#printReady > table:nth-child(2)"

const puzzleImgSelector = "#printReady"


async function getWords() {
    const res = await axios({
        url: `https://random-word-api.herokuapp.com/word?number=20&length=${helperFunctions.getRandomInt(8, 12)}`,


    })
    const wordArr = res.data

    if (wordArr.length === 0) return

    return wordArr.join(" , ")
}



exports.extractAndUploadWordSearchImgs = async (numOfImages) => {

    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return


    for (let i = 0; i < numOfImages; i++) {

        try {
            let words = await getWords()

            if (!words) return;
            const rez = await page.goto(`https://tools.atozteacherstuff.com/word-search-maker/wordsearch.php`)

            await helperFunctions.delay(5000)

            if (rez?.status() !== 200) return

            await page.$eval(wordsSelector, (el, mWords) => {

                return el.value = mWords

            }, words);

            await page.waitForSelector(createSelector);
            await page.click(createSelector);

            await helperFunctions.delay(5000)

            await page.$eval(topTableSelector, el => el.remove());

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.tempWordSearchImgsFolderPath}wordSearch_${Date.now()}.png` })

            console.log(`wordSearch Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)


        } catch (error) {
            console.log(error);

            console.log("could not extract wordSearch image");

        }

    }
    await page.close()


    console.log("wordSearch image generation complete");


    //process images here (rotate 90 degrees and crop out empty spaces)
    await helperFunctions.imageProcessor(90, null, 850, 0, 500, constants.tempWordSearchImgsFolderPath, constants.temp2WordSearchImgsFolderPath, constants.wordSearchImgsFolderPath)


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.wordSearchImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("wordSearch shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]
            console.log(`uploading ${sFile} num ${i}`);

            let imagePath = `${constants.wordSearchImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.wordSearchImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {

                console.log("delete everything in the wordSearch local folders");
                await storageController.deleteAllFilesInFolder([
                    constants.wordSearchImgsFolderPath,
                    constants.tempWordSearchImgsFolderPath,
                    constants.temp2WordSearchImgsFolderPath
                ])

            }

            console.log("single wordSearch image uploaded to box: ", i);

        }



        console.log("wordSearch images upload finished");
    } catch (error) {

        console.log("something went wrong with the wordSearch.js -> box interaction");

    }


}