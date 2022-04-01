const NoteModel = require("../models/note");
/*
    @params: {json_body}{content: String}
    @return: noteId
*/
const addNote = (req, res) => {
    const bodyContent = req.body.content, userId = req.id;
    if (bodyContent == null || bodyContent.length === 0) {
        return res.status(400).json({
            success: false,
            err: "data empty"
        });
    }
    const newNote = new NoteModel({
        content: bodyContent,
        userId: userId,
        isDone: false
    })
    newNote.save((err, note) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err: err
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                id: note._id,
                userid: note.userid
            }
        });
    })
}


/*
    @params: {url_id}
    @return: note_document
*/
const getNote = (req, res) => {
    const noteId = req.params.id, userId = req.id;
    NoteModel.find({_id: noteId, userId: userId}, (err, note) => {
        if (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        if (!note) {
            return res.status(404).json({
                success: true,
                err: "invalid ID"
            });
        }
        return res.status(200).json({
            success: true,
            data: note
        });
    })
}

/*
    @params: {url_id}
    @return: note_document
*/
const editNote = (req, res) => {
    const noteId = req.params.id, userId = req.id;
    const notePatchBody = req.body;
    if (Object.keys(notePatchBody).length === 0) {
        res.status(400).json({
            success: false,
            err: "Please provide field and values"
        });
    }
    NoteModel.findOneAndUpdate({_id: noteId, userId: userId}, notePatchBody, {new: true}, (err, note) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        if (!note) {
            return res.status(404).json({
                success: false,
                err: "invalid id"
            })
        }
        return res.status(200).json({
            success: true,
            data: note
        });
    })
}

/*
    @params: {url_id}
    @return: note_document
*/
const deleteNote = (req, res) => {
    const noteId = req.params.id, userId = req.id;
    NoteModel.findOneAndDelete({_id: noteId, userId: userId}, (err, note) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err.message
            });
        }
        if (!note) {
            return res.status(400).json({
                success: true,
                err: "invalid ID"
            })
        }
        return res.status(200).json({
            success: true,
            data: note
        })
    })
}

/*
    @params: NONE
    @return: all notes
*/
const getAllNotes = (req, res) => {
    const userId = req.id;
    NoteModel.find({userId: userId}, (err, notes) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        return res.status(200).json({
            success: true,
            data: notes
        });
    })
}

/*
    @params: NONE
    @return: NONE
*/
const deleteAllNotes = (req, res) => {
    const userId = req.id;
    NoteModel.deleteMany({userId: userId}, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        return res.status(200).json({
            success: true,
        })
    })
}

module.exports = {addNote, getNote, editNote, deleteNote, getAllNotes, deleteAllNotes}