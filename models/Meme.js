var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var MemeSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "Channel"
    },
});

var Meme = mongoose.model("Meme", MemeSchema);

module.exports = Meme;
