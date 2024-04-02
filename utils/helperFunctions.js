const fs = require("fs")
const sharp = require("sharp")
const axios = require("axios")
const fsExtra = require("fs-extra")
const constants = require("./constants.js")

exports.girlNamesArr = () => {

    const girlNamesArr = [
        "Liam",
        "Noah",
        "Emma",
        "Levi",
        "Luna",
        "Jack",
        "Owen",
        "Ezra",
        "John",
        "Luca",
        "Luke",
        "Mila",
        "Aria",
        "Ella",
        "Nova",
        "Nora",
        "Lily",
        "Isla",
        "Ryan",
        "Zoey",
        "Lucy",
        "Axel",
        "Maya",
        "Leah",
        "Jose",
        "Beau",
        "Theo",
        "Adam",
        "Ruby",
        "Jace",
        "Gael",
        "Amir",
        "Luka",
        "Eden",
        "Eden",
        "Milo",
        "Enzo",
        "Cora",
        "Iris",
        "Anna",
        "Luis",
        "Jade",
        "Evan",
        "Sage",
        "Zion",
        "Ayla",
        "Remi",
        "Juan",
        "Lyla",
        "Cole",
        "Jude",
        "Leon",
        "Ivan",
        "Rose",
        "Arlo",
        "Dean",
        "Rory",
        "Finn",
        "Alex",
        "Mary",
        "Alan"

    ]

    return girlNamesArr
}

exports.diffLevel = () => {
    const levelsList = [
        "easy",
        "medium",
        "hard"
    ]

    return levelsList
}

exports.squarePuzzleArr = () => {

    //add all square puzzle names here
    const puzzleList = [
        "fillomino",
        "sudoku",
        "hashi",
        "kakuro",
        "masyu",
        "binary",
        "arithmagon",
        "kenken",
        "cryptogram",
        "nurikabe",
        "slitherLink",
        "shakashaka",
        "nonogram",
        "shikaku",
        "hitori",
        "kakurasu",
        "stitches",
        "shingoki",

    ]

    return puzzleList
}

exports.rectangularPuzzleArr = () => {

    //add all square puzzle names here
    const puzzleList = [
        "maze",
        "wordSearch",
        "reverseWordSearch",
        "mathSquares",
        "crypticCrossword",
        "crossword",
    ]
    return puzzleList
}


exports.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.shuffle = function (array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

exports.delay = async function (time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

exports.KDP_DimensionsExtractor = function (KDP_Obj, bookSize) {
    let Curr_KDP_Obj = {}

    for (key in Object.keys(KDP_Obj)) {
        if (KDP_Obj[key].size === bookSize) {
            Curr_KDP_Obj = KDP_Obj[key];
            break
            // console.log(KDP_Obj[key].image.square);

        }
        else if (KDP_Obj[key].size === bookSize) {
            Curr_KDP_Obj = KDP_Obj[key];
            break
            // console.log(KDP_Obj[key].image.square);

        }
        else if (KDP_Obj[key].size === bookSize) {
            Curr_KDP_Obj = KDP_Obj[key];
            break
            // console.log(KDP_Obj[key].image.square);

        }
        else if (KDP_Obj[key].size === bookSize) {
            Curr_KDP_Obj = KDP_Obj[key];
            break
            // console.log(KDP_Obj[key].image.square);

        }
        else if (KDP_Obj[key].size === bookSize) {
            Curr_KDP_Obj = KDP_Obj[key];
            break
            // console.log(KDP_Obj[key].image.square);

        }
    }

    return Curr_KDP_Obj
}

exports.puzzleInfoExtractor = function (parsedPuzzleObj, puzzleIds) {
    let puzzleList = []

    for (let i in puzzleIds) {
        let puzzleId = puzzleIds[i]

        for (key in Object.keys(parsedPuzzleObj)) {
            if (parsedPuzzleObj[key].id === puzzleId) {
                puzzleList.push(parsedPuzzleObj[key].name)
            }
        }
    }
    return puzzleList
}

exports.batchFolderRename = async function (imageFolderPath, puzzleName) {

    try {

        fs.readdir(imageFolderPath, (err, files) => {
            files.forEach((file, i) => {

                fs.rename(`${imageFolderPath}/${file}`, `${imageFolderPath}/${puzzleName}_${Date.now()}_${i}.png`, function (err) {
                    if (err) console.log('ERROR: ' + err);
                });
            });
        });

    } catch (error) {
        console.log("batchFolderRename error");
    }





}

exports.createUserFolders = (filePathArr, userId) => {
    console.log("creating temp user folders");
    for (let i in filePathArr) {
        try {

            let sFilePath = `${filePathArr[i]}${userId}`

            fsExtra.ensureDirSync(sFilePath)

        } catch (error) {
            console.log(error);
            console.log("createUserFolders error");
        }
    }

}

exports.deleteUserFolders = async (filePathArr, userId) => {
    console.log("deleting temp user folders");

    for (let i in filePathArr) {
        try {

            let sFilePath = `${filePathArr[i]}${userId}`
            fs.rmSync(sFilePath, { recursive: true, force: true });

        } catch (error) {
            console.log(error);
            console.log("deleteUserFolders error");

        }

    }

}


async function rotateImages(degree, tempPath, temp2Path) {
    try {
        const imageList = await fs.promises.readdir(tempPath)

        for (let i in imageList) {
            await sharp(`${tempPath}${imageList[i]}`)
                .rotate(degree, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toFile(`${temp2Path}rotated_${imageList[i]}`);

        }
    } catch (error) {
        console.log(error);
        console.log("image rotation error");
    }
}


async function cropImages(w, h, l, t, temp2Path, finalPath) {
    let newW = w
    let newH = h
    const rotatedImageList = await fs.promises.readdir(temp2Path)

    try {
        for (let i in rotatedImageList) {
            let currImagePath = `${temp2Path}${rotatedImageList[i]}`

            imageData = await getMetadata(currImagePath)

            if (w === null) newW = imageData.width
            if (h === null) newH = imageData.height

            await sharp(currImagePath)
                .extract({ width: newW, height: newH, left: l, top: t })
                .toFile(`${finalPath}cropped_${rotatedImageList[i]}`);

        }
    } catch (error) {
        console.log(error);
        console.log("image crop error");
    }

}


async function getMetadata(imgPath) {

    try {
        const metadata = await sharp(imgPath).metadata();
        return metadata
    } catch (error) {

        console.log(`getMetadata error: ${error}`);
    }
}

exports.imageProcessor = async (degree, width, height, left, top, tempImageFolderPath, temp2ImgFolderPath, finalImageFolderPath) => {

    await rotateImages(degree, tempImageFolderPath, temp2ImgFolderPath)
    await cropImages(width, height, left, top, temp2ImgFolderPath, finalImageFolderPath)
}

exports.refreshTokens = async (protocol, host) => {

    try {
        const res = await axios.get(`${protocol}://${host}/storage/refresh_tokens`)
        console.log(res.data);
    } catch (error) {
        console.log(`refreshTokens error ${error}`);
    }

}


exports.restartExtraction = async (protocol, host) => {

    try {
        const res = await axios.get(`${protocol}://${host}/man/ie`)
        console.log(res.data);
    } catch (error) {
        console.log(`restartExtraction error ${error}`);
    }

}


exports.endDate = (numOfDays) => {
    // use the following to calculate expiry date
    let someDate = new Date();
    let numberOfDaysToAdd = numOfDays;
    let result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    return [result, new Date(result)]

}
