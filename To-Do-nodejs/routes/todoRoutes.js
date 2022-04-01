const express = require("express");
const {addNote, getNote, editNote, deleteNote, getAllNotes, deleteAllNotes} = require("../controllers/todoController");
const authJwt = require("../auth/auth")

const todoRouter = express.Router();

todoRouter.use(authJwt);

todoRouter.post('/add', addNote)
    .patch('/edit/:id', editNote)
    .get('/get/:id', getNote)
    .get('/get', getAllNotes)
    .delete('/delete/:id', deleteNote)
    .delete('/delete', deleteAllNotes);

module.exports = todoRouter;