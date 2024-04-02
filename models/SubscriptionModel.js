const mongoose = require("mongoose")
const subscriptionsSchema = mongoose.Schema({
    package: {
        type: mongoose.Schema.ObjectId,
        ref: "package",
        required: [true, "subscription must belong to a package"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "subscription must have a user id"]
    },
    price: {
        type: Number,
        required: [true, "subscription must have a price"]
    },

    paypalCaptureId: {
        type: String,
        required: [true, "subscription must have a paypal capture id"]
    },

    paymentCycle: {
        type: String,
        required: [true, "subscription must have a paymentCycle"],
        enum: ["onetime", "recurring"]

    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    endDate: Date,

    paid: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        default: "active",
        enum: ["inactive", "pending", "active"]
    }
}
    ,
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


subscriptionsSchema.pre(/^find/, function (next) {
    this.populate({
        path: "package",
        select: "name price description"
    })

    // this.populate({
    //     path: "user",
    //     select: "name"
    // })

    next()
})

const subscriptionsModel = mongoose.model("Subscription", subscriptionsSchema)

module.exports = subscriptionsModel