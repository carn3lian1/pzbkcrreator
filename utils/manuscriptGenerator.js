/*
will generate a pdf manuscript from the downloaded images in the folder
public/assets/img/puzzle_imgs/dl
*/

const fs = require("fs")
const PDFDocument = require("pdfkit")
const helperFunctions = require("./helperFunctions.js")
const constants = require("./constants.js")
const squarePuzzlesArr = helperFunctions.squarePuzzleArr()
const rectangularPuzzleArr = helperFunctions.rectangularPuzzleArr()
const girlNamesArr = helperFunctions.girlNamesArr()
let fullFilePath = null

exports.pdfFromDldImgs = async (
    platform,
    fontSize,
    pageWidth,
    pageHeight,
    numOfPages,
    marginsObj,
    imageObj,
    userId) => {

    let textPos = null
    let xOffset = null;
    let yOffset = null;
    let boxWidth = null;
    let boxHeight = null
    let puzzleTitle = null
    let time = null
    let notes = null
    let manuscriptName = null


    try {
        console.log("started!");

        // Create a document
        const doc = new PDFDocument(
            {
                size: [pageWidth * constants.cmToPSP, pageHeight * constants.cmToPSP],

                margins: { // by default, all are 72
                    top: marginsObj.top,
                    bottom: marginsObj.bottom,
                    left: marginsObj.left,
                    right: marginsObj.right
                }
            }
        );

        // Pipe its output somewhere, like to a file or HTTP response

        manuscriptName = `manuscript_${userId}_${numOfPages}_${pageWidth}_x_${pageHeight}_${Date.now()}.pdf`

        fullFilePath = `${constants.fullManuscriptFolderPath}${userId}/${manuscriptName}`


        doc.pipe(fs.createWriteStream(fullFilePath));

        const files = await fs.promises.readdir(`${constants.imgDestFolderPath}${userId}/`)

        console.log("num of downloaded images: ", files.length);

        const shuffledArr = helperFunctions.shuffle(files)

        if (shuffledArr.length === 0) return


        // doc
        //     .addPage()
        //     .fontSize(fontSize)
        //     .text(`Here are your manuscript details:`, imageObj.rectangle.dimensions.height + 60, imageObj.rectangle.dimensions.height + 60)
        //     .text(`number of pages: ${numOfPages}`, imageObj.rectangle.dimensions.height + 90, imageObj.rectangle.dimensions.height + 90)
        //     .text(`page height (centimeters): ${pageHeight} `, boxHeight + 120, imageObj.rectangle.dimensions.height + 120)
        //     .text(`page width (centimeters): ${pageWidth}`, imageObj.rectangle.dimensions.height + 150, imageObj.rectangle.dimensions.height + 150)
        //     .text(`platform: ${platform}`, imageObj.rectangle.dimensions.height + 180, imageObj.rectangle.dimensions.height + 180)

        for (let i in shuffledArr) {
            let sFile = shuffledArr[i];
            fileNameArr = sFile.split("_")

            let currFileName = fileNameArr[0]

            if (currFileName === "maze") {
                notes = "hint: start/end from sides or center"

            }
            else {
                notes = "notes:__________________________"
            }

            doc.addPage()

            if (rectangularPuzzleArr.includes(currFileName)) {
                //run lines for a rectangular puzzles

                xOffset = imageObj.rectangle.offset.x
                yOffset = imageObj.rectangle.offset.y
                boxWidth = imageObj.rectangle.dimensions.width
                boxHeight = imageObj.rectangle.dimensions.height
                textPos = boxHeight + 60

                puzzleTitle = `puzzle name: the ${girlNamesArr[helperFunctions.getRandomInt(0, girlNamesArr.length - 1)]} ${currFileName} puzzle`
                time = `time to complete(min): ${helperFunctions.getRandomInt(10, 30)}`
                notes = notes

                try {

                    doc.image(`${constants.imgDestFolderPath}${userId}/${sFile}`, xOffset, yOffset, { width: boxWidth, height: boxHeight }).fontSize(fontSize)
                        .font(constants.fontPath)
                        .text(notes, xOffset, textPos)
                } catch (error) {
                    console.log(`single ${currFileName} img to pdf page error`);

                }

            }
            else if (squarePuzzlesArr.includes(currFileName)) {
                //run lines for a square puzzles

                xOffset = imageObj.square.offset.x
                yOffset = imageObj.square.offset.y
                boxWidth = imageObj.square.fit.width
                boxHeight = imageObj.square.fit.height
                textPos = boxHeight + 80

                //run lines for a square puzzle

                puzzleTitle = `puzzle name: the ${girlNamesArr[helperFunctions.getRandomInt(0, girlNamesArr.length - 1)]} ${currFileName} puzzle`
                time = `time to complete(min): ${helperFunctions.getRandomInt(10, 30)}`
                notes = notes

                try {
                    // Add an image, constrain it to a given size, and center it vertically and horizontally
                    doc.image(`${constants.imgDestFolderPath}${userId}/${sFile}`, xOffset, yOffset, { fit: [boxWidth, boxHeight], align: 'center', valign: 'center' })
                        .rect(xOffset, yOffset, boxWidth, boxHeight).stroke()
                        .fontSize(fontSize)
                        .font(constants.fontPath)
                        .text(puzzleTitle, xOffset, textPos)
                        .text(time, xOffset, textPos + 30)
                        .text(notes, xOffset, textPos + 60)

                } catch (error) {
                    console.log(`${currFileName} to pdf page error`);

                }
            }

        }


        doc.end();

        return { name: manuscriptName }

    } catch (error) {
        console.log(error);
        console.log("pdf generation failed");
        console.log(error);

        return null

    }




}
