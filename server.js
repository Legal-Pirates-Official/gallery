const express = require('express');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path/posix');
const router = require('./routes/home');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use("/" , router)




app.listen(3000, () => {
    console.log("Server is running in 3000");
})