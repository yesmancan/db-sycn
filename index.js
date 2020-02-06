const cool = require('cool-ascii-faces');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const parser = require('body-parser');
const path = require('path')
const cors = require('cors');

const PORT = process.env.PORT || 5000

require('dotenv/config');

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: true, resave: true }))
  .use(parser.json())
  // .use(bodyParser.urlencoded({ extended: true }))
  .use(cors({ origin: ['http://localhost:5000/', 'https://sync-database.herokuapp.com/'] }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

//Middlewares

//Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const viewsDbRoute = require('./routes/views-db');
// Routes
app.use('/posts', postsRoute);
app.use('/api/user', authRoute);
app.use('/database', viewsDbRoute);

app.get('/', (req, res) => res.render('pages/index'))

app.get('/login', (req, res) => res.render('pages/auth/login'));
app.get('/register', (req, res) => res.render('pages/auth/register'));
app.get('/lock', (req, res) => res.render('pages/auth/lock'));
app.get('/user', (req, res) => res.render('pages/auth/user'));

app.get('/cool', (req, res) => res.send(cool()))
app.get('/times', (req, res) => res.send(showTimes()))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}

//Connect To DB
mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {
    console.log('connected to DB!');
  })


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
