const cool = require('cool-ascii-faces');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const parser = require('body-parser');
const path = require('path')
const cors = require('cors');
const cron = require('node-cron');

const PORT = process.env.PORT || 5000

const { verifySession } = require('./modules/verifyToken');

require('dotenv/config');

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: true, resave: true }))
  .use(parser.json())
  .use(cors())
  // .use(cors({ origin: ['http://localhost:5000/', 'https://sync-database.herokuapp.com/'] }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

//Middlewares

//Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const viewsDbRoute = require('./routes/views-db');
const sycnRoute = require('./routes/sycn');
const groupRoute = require('./routes/group');

// Routes
app.use('/posts', postsRoute);
app.use('/api/user', authRoute);
app.use('/database', viewsDbRoute);
app.use('/sycn', sycnRoute);
app.use('/group', groupRoute);

app.get('/',
  verifySession,
  (req, res) => res.render('pages/index'))

app.get('/login', (req, res) => res.render('pages/auth/login'));
app.get('/register', (req, res) => res.render('pages/auth/register'));
app.get('/lock', (req, res) => res.render('pages/auth/lock'));
app.get('/user', (req, res) => res.render('pages/auth/user'));

app.get('/cool', (req, res) => res.json(cool()));

//Connect To DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to DB!');
});

cron.schedule('0 */1 * * * *', () => {
  console.log('running a task every minute');
});

app.use((req, res, next) => {
  res.status(404);
  if (req.accepts('html')) {
    res.render('pages/404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
})
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

