const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const sizeSelector = "#size"
const diffSelector = "#difficulty"
const mgsSelector = "#groupSize"
const substractionSelector = "#operations > label:nth-child(4)"
const maxSelector = "#operations > label:nth-child(13)"


const generateSelector = "#generate"
const puzzleImgSelector = "#kenken"

exports.extractAndUploadKenkenImgs = async (numOfImages) => {
    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return

    const rez = await page.goto(`https://wilsoa.github.io/Gengen/`)

    await helperFunctions.delay(5000)

    if (rez?.status() !== 200) return

    for (let i = 0; i < numOfImages; i++) {

        try {

            await page.$eval(sizeSelector, el => el.value = `7`)
            await page.$eval(diffSelector, el => el.value = `4`)
            await page.$eval(mgsSelector, el => el.value = `7`)


            const check1 = await page.$(substractionSelector)
            await check1.click()

            const check2 = await page.$(maxSelector)
            await check2.click()
            await page.click(generateSelector);
            await helperFunctions.delay(3000)

            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.kenkenImgsFolderPath}kenken_${Date.now()}.png` })

            console.log(`kenken Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(5000)


        } catch (error) {
            console.log(error);

            console.log("could not extract kenken image");

        }

    }

    await page.close()

    console.log("kenken image generation complete");


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.kenkenImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("kenken shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.kenkenImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.kenkenImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete everything in the kenken local folder");
                await storageController.deleteAllFilesInFolder([constants.kenkenImgsFolderPath])

            }

            console.log("single kenken image uploaded to box: ", i);

        }



        console.log("kenken images upload finished");
    } catch (error) {

        console.log("something went wrong with the kenken.js -> box interaction");

    }


}