const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })

const app = require("./app.js")

const port = process.env.PORT || 8081

async function nodeServerInit() {
    while (true) {

        try {

            await mongoose.connect(process.env.MONGO_CONN_STR)

            app.listen(port, () => {
                console.log(`pzbkcr db listening on port ${port}`);


            });
            break;

        } catch (error) {
            console.log("pzbkcr db connection error");


        }
    }

}

nodeServerInit()