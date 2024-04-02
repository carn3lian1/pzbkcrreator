const fs = require("fs")
const readline = require('readline');


async function readLineByLine(fileName) {
    const ytArr = []

    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        // console.log(`Line from file: ${line}`);
        ytArr.push(line)

    }

    return ytArr
}

async function YTchannelSieve() {

    let newChannelArr = await readLineByLine('YTNewChannels.txt')
    let mainChannelArr = await readLineByLine('YTMainChannels.txt')


    let ytSet = new Set()

    for (let i in newChannelArr) {
        if (!mainChannelArr.includes(newChannelArr[i])) {
            ytSet.add(newChannelArr[i])
        }
    }

    let YTsetItr = ytSet.values()

    for (let sYTC of YTsetItr) {
        fs.appendFileSync('YTFinalChannels.txt', `${sYTC}\n`);

    }

    console.log("done");

}



// YTchannelSieve()