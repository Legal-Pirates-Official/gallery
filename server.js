if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const ejsMate = require('ejs-mate');


const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const mysql = require('mysql');
const db = require('./database');
const compression = require('compression');


const multer = require('multer');
const morgan = require('morgan');
const { storage, cloudinary } = require('./cloudinary');
const upload = multer({ storage });



const router = require('./routes/home');
const auth = require('./routes/auth');
const maintemplate = require('./routes/maintemplate');
const templates = require('./routes/template');



const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());

app.use(cookieParser());

app.use(session({
    secret: "SecretSession",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})



app.use("/", router)
app.use("/auth", auth)
app.use("/maintemplate", maintemplate)
app.use("/templates", templates)




app.listen(process.env.port, () => {
    console.log(`Server is running in ${process.env.port}`);
})