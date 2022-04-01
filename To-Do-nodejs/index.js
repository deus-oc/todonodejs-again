const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./dbase/connect");
const todoRouter = require("./routes/todoRoutes");
const userRouter = require("./routes/userRoutes");

dotenv.config({
    path: './config.env'
});

connectDB();

const PORT = process.env.port || 8001;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Routes
app.use('/', userRouter);
app.use('/note', todoRouter);

//frontend
app.use(express.static('public'));

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to run the server: ${err}`)
        return
    }
    console.log(`Server started on port ${PORT}`)
})
