const mongoose = require("mongoose")

const BoxSchema = mongoose.Schema(
    {
        boxRefreshToken: {
            type: String,
            trim: true,
        },
        boxAccessToken: {
            type: String,
            trim: true,
        },
    },
    {
        //allows virtual fields to show up in responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const BoxModel = mongoose.model("Box", BoxSchema)

module.exports = BoxModel