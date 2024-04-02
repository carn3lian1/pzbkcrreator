//downloads fillomino puzzle images from the given webpage
const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

exports.extractAndUploadFillominoImgs = async (numOfImages) => {
    /**
     * extracts 50 images from the site
     * uploads them to the appropriate folder on box.com
     * deletes all images in the folder
     */
    const page = await puppeteerSetup.puppeteerInit()

    if (!page) return;

    let levelsList = helperFunctions.diffLevel()
    let diffLevel = null

    for (let i = 0; i < numOfImages; i++) {

        try {

            // // Navigates to the page to be scraped 
            const rez = await page.goto(`https://www.kakuro-online.com/fillomino/`);

            if (rez.status() === 200) {
                //generate a new puzzle and create a screenshot of the puzzle element

                await page.goto(`https://www.kakuro-online.com/fillomino/`)
                await helperFunctions.delay(5000)

                await page.$eval('#genWidthField', el => el.value = '12');
                await page.$eval('#genHeightField', el => el.value = '12');

                diffLevel = levelsList[helperFunctions.getRandomInt(0, levelsList.length - 1)]

                await page.click(`#${diffLevel}`);

                await page.waitForSelector('#generateButton');
                await page.click('#generateButton');

                await helperFunctions.delay(3000)
                await page.waitForSelector('#generateButton');

                await page.waitForSelector("#puzzleInterface")
                const element = await page.$("#puzzleInterface")

                const el = await page.waitForSelector("#buttonsDiv");
                await el.evaluate(el => el.remove());

                element.screenshot({ path: `${constants.fillominoImgsFolderPath}/fillomino_${diffLevel}_${Date.now()}.png` })

                await helperFunctions.delay(5000)

                console.log(`fillomino Screenshot num ${i + 1} taken`);
            }

            else {
                console.log("something went wrong in the fillomino screen capture process: ", rez.status);
            }
        } catch (error) {
            console.log(error);
            console.log("error in fillomino image screen capture");

        }
    }

    await page.close()

    try {

        await helperFunctions.batchFolderRename(constants.fillominoImgsFolderPath, "fillomino")
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.fillominoImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("fillomino shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.fillominoImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.fillominoImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the fillomino local folder");
                await storageController.deleteAllFilesInFolder([constants.fillominoImgsFolderPath])

            }

            console.log("single fillomino image uploaded to box: ", i);

        }



        console.log("fillomino images upload finished");
    } catch (error) {

        console.log("something went wrong with the fillomino.js -> box interaction");

    }


}