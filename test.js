const fs = require("fs")
const axios = require("axios")
const sharp = require("sharp")
const prom_fs = require("node:fs/promises")

const path = require("node:path")
const pdfLib = require('pdf-lib')

const ProductModel = require("./models/ProductModel.js")

const constants = require("./utils/constants.js")

deleteAllFilesInFolder = async (folderPath) => {

    requiredPath = path.join(__dirname, `../${folderPath}`)

    for (const file of await prom_fs.readdir(requiredPath)) {

        await prom_fs.unlink(path.join(requiredPath, file));
    }
}


createNewProduct = async () => {
    const product = await ProductModel.create({
        name: "manuscript fixed price",
        price: 7,
        paymentCycle: "onetime",
        description: "one time payment for a single generated pdf manuscript"

    })

}

readFilesInFolder = () => {
    let files = fs.readdirSync(constants.previewManuscriptFolderPath);

    console.log(files);
}

// readFilesInFolder()

async function testCopy() {
    let tempFilePath = "./tempPDF/manuscript_651326e26437581ae23dad50_300_15.24_x_22.86_1696372406567.pdf"
    let fullFilePath = "./fullPDF/final.pdf"

    try {

        let res = await fs.copyFileSync(tempFilePath, fullFilePath);

        console.log("copyresult: ", res);

        //     await helperFunctions.delay(10000)

        //     fs.readFile(tempFilePath, (err, data) => {
        //         fs.writeFile(fullFilePath, data, err => {
        //             console.error(err);
        //         });
        //     });

    } catch (error) {
        console.log(error);

        console.log("copy file error");



    }

}


async function prevPdf() {
    const pdfData = await fs.readFileSync("puzzleOutput/fm89d226005sd3521e1832sd/652462cc2b6fdf783d145330/manuscript_652462cc2b6fdf783d145330_250_10.16_x_15.24_1696886035938.pdf");

    const pdfDoc = await pdfLib.PDFDocument.load(pdfData)
    const pages = pdfDoc.getPages()
    let pdfBinary = null;
    let pdfBytes = null;

    for (let i in pages) {

        pages[i].drawText('preview preview!\n\nsome images\n\nare mussing\n\nfull version\n\nhas everything', {
            x: 5,
            y: 500,
            size: 20,
            color: pdfLib.rgb(0.95, 0.1, 0.1),
        })
    }

    pdfBytes = await pdfDoc.save()
    pdfBinary = Buffer.from(pdfBytes, 'base64');
    return fs.writeFileSync('test/file.pdf', pdfBinary)
}


async function getWords() {
    const res = await axios({
        url: "https://random-word-api.herokuapp.com/word?number=20&length=10",


    })
    console.log(res.data.join(","));
}


async function shuffler() {
    const words = await fs.readFileSync("teset.txt").toString('utf-8');;
    var array = words.split("\n")


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

    for (let i in array) {
        fs.appendFile('final.txt', `${array[i]}\n`, err => {
            if (err) console.error(err);
            else console.log('Data written to file successfully.');
        });
    }

}


