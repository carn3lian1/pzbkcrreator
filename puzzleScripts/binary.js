const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const puzzleImgSelector = "#Main > div:nth-child(1) > div.intekst"
const cookiesSelector = "#CookieAgree"

const size = [
    6, 8, 10, 12, 14
]
exports.extractAndUploadBinaryImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return
    const rez = await page.goto(`http://binarypuzzle.com/puzzles.php?size=${size[helperFunctions.getRandomInt(0, 4)]}&level=${helperFunctions.getRandomInt(1, 4)}&nr=${helperFunctions.getRandomInt(1, 200)}`)

    await helperFunctions.delay(5000)


    if (rez?.status() !== 200) return

    await page.click(cookiesSelector);


    for (let i = 0; i < numOfImages; i++) {

        try {

            const rez = await page.goto(`http://binarypuzzle.com/puzzles.php?size=${size[helperFunctions.getRandomInt(0, 4)]}&level=${helperFunctions.getRandomInt(1, 4)}&nr=${helperFunctions.getRandomInt(1, 200)}`)

            await helperFunctions.delay(5000)


            if (rez?.status() !== 200) return


            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.binaryImgsFolderPath}binary_${Date.now()}.png` })

            console.log(`binary Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(5000)

        } catch (error) {

            console.log("could not extract binary image");

        }

    }


    await page.close()

    console.log("binary image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.binaryImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("binary shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.binaryImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.binaryImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the binary local folder");
                await storageController.deleteAllFilesInFolder([constants.binaryImgsFolderPath])

            }

            console.log("single binary image uploaded to box: ", i);

        }

        //Closes the browser instance
        // await browser.close();


        console.log("binary images upload finished");
    } catch (error) {

        console.log("something went wrong with the binary.js -> box interaction");

    }


}