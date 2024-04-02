//downloads maze images from the given webpage
const fs = require("fs")
const storageController = require("../controllers/storageController.js")
const puppeteerSetup = require("../utils/puppeteerSetup.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")


exports.extractAndUploadMazeImgs = async (numOfImages) => {
    /**
 * extracts {numofImages} images from the site
 * uploads them to the appropriate folder on box.com
 * deletes all images in the local folder
 */

    const shapeSelector = "#ShapeDropDownList"
    const styleSelector = "#S1TesselationDropDownList"
    const hexStyleSelector = "#S4TesselationDropDownList"
    const hexSideSelector = "#S4SideLengthTextBox"
    const hexInnerSelector = "#S4InnerSideLengthTextBox"
    const widthSelector = "#S1WidthTextBox"
    const heightSelector = "#S1HeightTextBox"
    const generateBtnSelector = "#GenerateButton"
    const downloadBtnSelector = "#DownloadFileButton"
    const fileFormatSelector = "#FileFormatSelectorList"
    const sideLengthSelector = "#S3SideLengthTextBox"
    const innerSideLengthSelector = "#S3InnerSideLengthTextBox"
    const outerDiameterSelector = "#S2OuterDiameterTextBox"
    const innerDiameterSelector = "#S2InnerDiameterTextBox"
    const advancedESelector = "#AlgorithmParameter1TextBox"
    const advancedRSelector = "#AlgorithmParameter2TextBox"
    const mazeDisplaySelector = "#MazeDisplay"

    const page = await puppeteerSetup.puppeteerInit()

    if (!page) return

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: `./${constants.mazeImgsFolderPath}` });

    const rez = await page.goto("https://www.mazegenerator.net/")

    await helperFunctions.delay(3000)

    if (rez?.status() === 200) {

        for (let i = 0; i < numOfImages; i++) {

            try {

                let shapeVal = null

                console.log("start maze generation number: ", i + 1);
                let randShapeValue = helperFunctions.getRandomInt(1, 4)
                // let randShapeValue = 4
                await page.select(shapeSelector, `${randShapeValue}`)

                //rectangular
                if (randShapeValue === 1) {
                    shapeVal = "rectangle"
                    await helperFunctions.delay(2000)
                    await page.select(styleSelector, `${helperFunctions.getRandomInt(1, 3)}`)
                    await helperFunctions.delay(3000)
                    await page.$eval(widthSelector, el => el.value = `25`);
                    await page.$eval(heightSelector, el => el.value = `30`);
                    await helperFunctions.delay(1000)


                }
                //circular
                else if (randShapeValue === 2) {
                    shapeVal = "circle"
                    await helperFunctions.delay(2000)
                    await page.$eval(outerDiameterSelector, el => el.value = `40`)
                    await page.$eval(innerDiameterSelector, el => el.value = `10`)
                    await page.$eval(advancedESelector, el => el.value = `50`)
                    await page.$eval(advancedRSelector, el => el.value = `50`)

                }
                //triangular
                else if (randShapeValue === 3) {
                    shapeVal = "tri"
                    await helperFunctions.delay(2000)
                    await page.$eval(sideLengthSelector, el => el.value = `40`)
                    await page.$eval(innerSideLengthSelector, el => el.value = `4`)
                    await page.$eval(advancedESelector, el => el.value = `50`)
                    await page.$eval(advancedRSelector, el => el.value = `50`)

                }//hexagonal
                else if (randShapeValue === 4) {
                    shapeVal = "hex"
                    await helperFunctions.delay(2000)
                    await page.select(hexStyleSelector, `${helperFunctions.getRandomInt(1, 2)}`)
                    await page.$eval(hexSideSelector, el => el.value = `20`)
                    await page.$eval(hexInnerSelector, el => el.value = `4`)
                    await page.$eval(advancedESelector, el => el.value = `50`)
                    await page.$eval(advancedRSelector, el => el.value = `50`)

                }
                else {
                    console.log("unaccounted for shape");
                }

                await page.waitForSelector(generateBtnSelector);
                await helperFunctions.delay(1000)
                await page.click(generateBtnSelector);
                await helperFunctions.delay(1000)
                await page.select(fileFormatSelector, `9`)
                await helperFunctions.delay(2000)
                await page.waitForSelector(downloadBtnSelector);
                await helperFunctions.delay(2000)
                await page.click(downloadBtnSelector);


                await helperFunctions.delay(2000)

                console.log(`maze screenshot num ${i + 1} taken`);
            } catch (error) {
                console.log("error in maze image screen capture");

            }

        }

    }
    else {
        console.log("single maze generation image failed maybe webpage isnt loading");
    }

    await page.close()


    try {
        await helperFunctions.batchFolderRename(constants.mazeImgsFolderPath, "maze")

        await helperFunctions.delay(4000)

        const files = await fs.promises.readdir(constants.mazeImgsFolderPath)

        const shuffledArr = helperFunctions.shuffle(files)

        console.log("maze shuffledArr len: ", shuffledArr.length);


        if (shuffledArr.length === 0) return

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i]
            let imagePath = `${constants.mazeImgsFolderPath}/${sFile}`
            storageController.uploadSingleFileBox(constants.mazeImagesID, sFile, imagePath)

            await helperFunctions.delay(2000)

            if (Number(i) === (shuffledArr.length - 1)) {
                console.log("delete all maze images the folder");
                storageController.deleteAllFilesInFolder([constants.mazeImgsFolderPath])
            }
            console.log("single maze image uploaded to box", i);
        }


        //Closes the browser instance
        // await browser.close();


        console.log("maze images upload finished");
    } catch (error) {
        console.log("maze image upload error");

    }

}