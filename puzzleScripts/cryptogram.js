const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")

const puzzleImgSelector = "#cform"
const buttonsSelector = "#cform > div.buttons"



exports.extractAndUploadcryptogramImgs = async (numOfImages) => {

    const page = await puppeteerSetup.puppeteerInit()

    await page.setViewport({ width: 1920, height: 1080 });

    if (!page) return


    for (let i = 0; i < numOfImages; i++) {

        try {

            const rez = await page.goto(`https://cryptograms.puzzlebaron.com/play.php`)

            await helperFunctions.delay(5000)

            if (rez?.status() !== 200) return


            await page.$eval(buttonsSelector, el => el.remove());
            await helperFunctions.delay(3000)


            const element = await page.$(puzzleImgSelector)

            element.screenshot({ path: `${constants.cryptogramImgsFolderPath}cryptogram_${Date.now()}.png` })

            console.log(`cryptogram Screenshot num ${i + 1} taken`);
            await helperFunctions.delay(3000)

        } catch (error) {
            console.log(error);

            console.log("could not extract cryptogram image");

        }

    }

    await page.close()

    console.log("cryptogram image generation complete");

    //this is for rotating and cropping if i decide to do so. The dimensions should be dynamic
    // await helperFunctions.imageProcessor(90, 367, 695, 0, 0, constants.tempCryptogramImgsFolderPath, constants.temp2CryptogramImgsFolderPath, constants.cryptogramImgsFolderPath)


    try {
        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.cryptogramImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("cryptogram shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]

            let imagePath = `${constants.cryptogramImgsFolderPath}/${sFile}`
            await storageController.uploadSingleFileBox(constants.cryptogramImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)


            if (Number(i) === (shuffledArr.length - 1)) {

                console.log("delete everything in the cryptogram local folders");
                await storageController.deleteAllFilesInFolder([
                    constants.cryptogramImgsFolderPath,
                    constants.tempCryptogramImgsFolderPath,
                    constants.temp2CryptogramImgsFolderPath
                ])

            }

            console.log("single cryptogram image uploaded to box: ", i);

        }


        console.log("cryptogram images upload finished");
    } catch (error) {

        console.log("something went wrong with the cryptogram.js -> box interaction");

    }


}