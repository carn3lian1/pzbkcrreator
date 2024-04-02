const fs = require("fs")

const pdfLib = require('pdf-lib')
const storageController = require("./storageController.js")
const constants = require("../utils/constants.js")
const helperFunctions = require("../utils/helperFunctions.js")
const fillomino = require("../puzzleScripts/fillomino.js")
const maze = require("../puzzleScripts/maze.js")
const sudoku = require("../puzzleScripts/sudoku.js")
const hashi = require("../puzzleScripts/hashi.js")
const kakuro = require("../puzzleScripts/kakuro.js")
const masyu = require("../puzzleScripts/masyu.js")
const binary = require("../puzzleScripts/binary.js")
const arithmagon = require("../puzzleScripts/arithmagon.js")
const mathSquares = require("../puzzleScripts/mathSquares.js")
const kenken = require("../puzzleScripts/kenken.js")
const wordSearch = require("../puzzleScripts/wordSearch.js")
const reverseWordSearch = require("../puzzleScripts/reverseWordSearch.js")
const cryptogram = require("../puzzleScripts/cryptogram.js")
const crypticCrossword = require("../puzzleScripts/crypticCrossword.js")
const crossword = require("../puzzleScripts/crossword.js")
const nurikabe = require("../puzzleScripts/nurikabe.js")
const slitherLink = require("../puzzleScripts/slitherLink.js")
const shakashaka = require("../puzzleScripts/shakashaka.js")
const nonogram = require("../puzzleScripts/nonogram.js")
const shikaku = require("../puzzleScripts/shikaku.js")
const stitches = require("../puzzleScripts/stitches.js")
const shingoki = require("../puzzleScripts/shingoki.js")
const kakurasu = require("../puzzleScripts/kakurasu.js")
const hitori = require("../puzzleScripts/hitori.js")
const manuscriptGenerator = require("../utils/manuscriptGenerator.js")
const SocialUsersModel = require("../models/SocialUsersModel.js")
const UsersModel = require("../models/UsersModel.js");

/*
the following things are done in a loop
1 extracts puzzles from webpages
2.uploads to box.com
3.cleans up associated local folder
*/


exports.autoExtractBot = async (request, response, next) => {

    try {
        console.log("autoExtractBot started at: ", new Date());

        for (let i = 0; i < constants.mainPuzzleLoopNum; i++) {
            helperFunctions.refreshTokens(request.protocol, request.get("host"));
            wordSearch.extractAndUploadWordSearchImgs(constants.numOfImages)
            await crypticCrossword.extractAndUploadCrypticCrosswordImgs(constants.numOfImages)
            maze.extractAndUploadMazeImgs(constants.numOfImages)
            await reverseWordSearch.extractAndUploadReverseWordSearchImgs(constants.numOfImages)
            cryptogram.extractAndUploadcryptogramImgs(constants.numOfImages)
            await shingoki.extractAndUploadShingokiImgs(constants.numOfImages)
            kakuro.extractAndUploadkakuroImgs(constants.numOfImages)
            helperFunctions.refreshTokens(request.protocol, request.get("host"));
            await hashi.extractAndUploadHashiImgs(constants.numOfImages)
            slitherLink.extractAndUploadSlitherLinkImgs(constants.numOfImages)
            await shikaku.extractAndUploadShikakuImgs(constants.numOfImages)
            kenken.extractAndUploadKenkenImgs(constants.numOfImages)
            await masyu.extractAndUploadMasyuImgs(constants.numOfImages)
            crossword.extractAndUploadCrosswordImgs(constants.numOfImages)
            await shakashaka.extractAndUploadShakashakaImgs(constants.numOfImages)
            nonogram.extractAndUploadNonogramImgs(constants.numOfImages)
            helperFunctions.refreshTokens(request.protocol, request.get("host"));
            await mathSquares.extractAndUploadMathSquaresImgs(constants.numOfImages)
            nurikabe.extractAndUploadNurikabeImgs(constants.numOfImages)
            await binary.extractAndUploadBinaryImgs(constants.numOfImages)
            arithmagon.extractAndUploadArithmagonImgs(constants.numOfImages)
            await hitori.extractAndUploadHitoriImgs(constants.numOfImages)
            sudoku.extractAndUploadSudokuImgs(constants.numOfImages)
            await kakurasu.extractAndUploadKakurasuImgs(constants.numOfImages)
            stitches.extractAndUploadStitchesImgs(constants.numOfImages)
            await fillomino.extractAndUploadFillominoImgs(constants.numOfImages)




        }

        response.status(200).json({ message: "autoExtractBot started" })

        console.log("autoExtractBot actions finished");
    } catch (error) {
        console.log(error);
        console.log("autoExtractBot error at: ", new Date());
        await helperFunctions.restartExtraction(request.protocol, request.get("host"));

        response.status(400).json({ message: "autoExtractBot error" })

    }


};

async function imgDownloader(puzzleName, boxFolderId, destFolder, userId, numOfLoops, delayTime) {
    console.log(`downloading ${puzzleName}...`);

    const imgIdArr = await storageController.listAllfilesInFolderBox(boxFolderId)

    console.log(`remote ${puzzleName} folder image num: `, imgIdArr.length);

    for (let i = 0; i < numOfLoops; i++) {

        let sFileId = imgIdArr[helperFunctions.getRandomInt(0, (imgIdArr.length - 1))]

        await storageController.downloadSingleFileBox(sFileId, `${destFolder}${userId}/`, `${puzzleName}_${Date.now()}`, i)
        await helperFunctions.delay(delayTime)

    }
}


exports.initGenerate = async (request, response, next) => {
    /*\
    1. first create temp user folders to download all media needed for manuscript generation
    2. determine which dimensions object to use depending ont he request.body.selectedPlatform
    3. extract the dimensions of the book depending on request.body.page_size
    4. determine which functions will run depending on request.body.selectedPuzzleIdList
    5. create the full manuscript, upload it to box and create a watermarked version for viewing
    6. delete all unnecessary files and folders and return an appropriate response to the client
     */
    try {
        console.log("started generation process");

        await helperFunctions.refreshTokens(request.protocol, request.get("host"));

        const currFilePathArr =
            [
                `${constants.previewManuscriptFolderPath}`,
                `${constants.fullManuscriptFolderPath}`,
                `${constants.imgDestFolderPath}`,
            ]

        await helperFunctions.deleteUserFolders(currFilePathArr, request.user.id)

        helperFunctions.createUserFolders(currFilePathArr, request.user.id)

        let dimensionsObj = null
        let parsedPuzzleIds = []
        let puzzleIds = request.body.selectedPuzzleIdList;
        for (let i in puzzleIds) {
            if (puzzleIds[i].length > 0) parsedPuzzleIds.push(puzzleIds[i])

        }

        let selectedPlatform = request.body.selectedPlatform
        let bookSize = request.body.page_size;
        let pageNum = request.body.pageNum
        const numOfLoops = Math.ceil(pageNum / parsedPuzzleIds.length)

        if (Number(pageNum) < 50 || Number(pageNum) > 300) {

            return response.status(400).json({ message: "number of pages must be between 50 and 300" })
        }

        if (selectedPlatform === "LULU") {
            //parse the lulu dimensions object
        }
        else if (selectedPlatform === "Amazon KDP") {

            //parse the amazon kdp amazon object
            //1
            const KDP_DimensionsObj = await fs.promises.readFile(constants.dimensionsObjPath, "utf8");
            const parsed_KDP_Obj = JSON.parse(KDP_DimensionsObj);

            //2
            dimensionsObj = helperFunctions.KDP_DimensionsExtractor(parsed_KDP_Obj, bookSize)
        }

        const puzzleInfoObj = await fs.promises.readFile(constants.puzzleObjPath, "utf8")
        const parsedPuzzleObj = JSON.parse(puzzleInfoObj)

        const puzzleList = helperFunctions.puzzleInfoExtractor(parsedPuzzleObj, puzzleIds)


        for (let i in puzzleList) {

            let sPuzzle = puzzleList[i]
            console.log("puzzle type: ", sPuzzle);

            if (sPuzzle === "fillomino") {

                await imgDownloader("fillomino", constants.fillominoImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)

            }

            else if (sPuzzle === "maze") {

                await imgDownloader("maze", constants.mazeImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)

            }

            else if (sPuzzle === "sudoku") {
                await imgDownloader("sudoku", constants.sudokuImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "hashi") {
                await imgDownloader("hashi", constants.hashiImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "kakuro") {
                await imgDownloader("kakuro", constants.kakurasuImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "masyu") {
                await imgDownloader("masyu", constants.masyuImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "binary") {
                await imgDownloader("binary", constants.binaryImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "arithmagon") {
                await imgDownloader("arithmagon", constants.arithmagonImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "math squares") {
                await imgDownloader("mathSquares", constants.mathSquaresImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "kenken") {
                await imgDownloader("kenken", constants.kenkenImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "word search") {
                await imgDownloader("wordSearch", constants.wordSearchImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "reverse word search") {
                await imgDownloader("reverseWordSearch", constants.reverseWordSearchImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "cryptogram") {
                await imgDownloader("cryptogram", constants.cryptogramImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "cryptic crossword") {
                await imgDownloader("crypticCrossword", constants.crypticCrosswordImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "crossword") {
                await imgDownloader("crossword", constants.crosswordImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "nurikabe") {
                await imgDownloader("nurikabe", constants.nurikabeImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "slitherLink") {
                await imgDownloader("slitherLink", constants.slitherLinkImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "shakashaka") {
                await imgDownloader("shakashaka", constants.shakashakaImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "nonogram") {
                await imgDownloader("nonogram", constants.nonogramImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "shikaku") {
                await imgDownloader("shikaku", constants.shikakuImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "stitches") {
                await imgDownloader("stitches", constants.stitchesImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "shingoki") {
                await imgDownloader("shingoki", constants.shingokiImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "kakurasu") {
                await imgDownloader("kakurasu", constants.kakurasuImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }
            else if (sPuzzle === "hitori") {
                await imgDownloader("hitori", constants.hitoriImagesID, constants.imgDestFolderPath, request.user.id, numOfLoops, 500)


            }

            //add else ifs for the rest of the puzzle types
        }
        console.log("1");
        //after all the images are downloaded generate a pdf manuscript from the images
        let generationRes = await manuscriptGenerator.pdfFromDldImgs(
            selectedPlatform,
            dimensionsObj.fontSize,
            Number(dimensionsObj.size.split("x")[0]),
            Number(dimensionsObj.size.split("x")[1]),
            pageNum,
            dimensionsObj.page_margins,
            dimensionsObj.image,
            request.user.id
        )

        // let generationRes = { name: "manuscript_651326e26437581ae23dad50_300_15.24_x_22.86_1696012691357.pdf" }

        console.log("2", generationRes.name);

        if (!generationRes) return;
        // create watermarked version and save it in the preview folder from the full folder
        await helperFunctions.delay(15000)

        const fullManuscriptPath = `${constants.fullManuscriptFolderPath}${request.user.id}/${generationRes.name}`

        await createWatermarkedPDF(fullManuscriptPath, `${constants.previewManuscriptFolderPath}${request.user.id}/preview_${generationRes.name}`)

        //since render.com isnt saving files. there's no need to delete imges and pdfs after manuscript creation
        //will revisit if/when i get a premium account

        response.status(200).json({ message: "manuscript generation success" })

    } catch (error) {

        console.log(error);
        response.status(400).json({ message: "manuscript generation failed. Please try again in a few minutes" })

    }
}


async function createWatermarkedPDF(inputPath, outputPath) {

    try {

        const pdfData = await fs.readFileSync(inputPath);

        const pdfDoc = await pdfLib.PDFDocument.load(pdfData)
        const pages = pdfDoc.getPages()
        let pdfBinary = null;
        let pdfBytes = null;

        for (let i in pages) {

            pages[i].drawText(' \n\n       preview!\n\n \n\n       preview!\n\n  \n\n       preview!\n\n', {
                x: 5,
                y: 500,
                size: 50,
                color: pdfLib.rgb(0.95, 0.1, 0.1),
            })
        }

        pdfBytes = await pdfDoc.save()
        pdfBinary = Buffer.from(pdfBytes, 'base64');
        return fs.writeFileSync(outputPath, pdfBinary)
    } catch (error) {
        console.log(error);
    }
}


//updates the appropriate db document. currently not being used 
async function updateDbWithGeneratedManuscriptInfo(request, fileName, fileId, dlURL) {
    console.log(`updating ${fileName} to db`);

    try {

        let updatedUserRez = null;

        if (request.user.provider === "manual") {
            updatedUserRez = await UsersModel.findByIdAndUpdate(request.user.id,
                {
                    $push: {
                        generatedManuscripts: {
                            manuscriptName: fileName,
                            boxFileId: fileId,
                            downloadURL: dlURL

                        },

                    }
                },
                { new: true }
            )
        }
        else {
            updatedUserRez = await SocialUsersModel.findByIdAndUpdate(request.user.id,
                {
                    $push: {
                        generatedManuscripts: {
                            manuscriptName: fileName,
                            boxFileId: fileId,
                            downloadURL: dlURL

                        },

                    }
                },
                { new: true }
            )

        }
        console.log("update complete");

        return updatedUserRez
    } catch (error) {
        console.log("dbUpdater error");

    }
}

