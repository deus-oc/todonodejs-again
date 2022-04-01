const mongoose = require("mongoose");

// * id will be mongo _id 
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    }
})

const NoteModel = mongoose.model('Note', noteSchema)
module.exports = NoteModel;