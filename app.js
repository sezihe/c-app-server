const Koa = require('koa');
const koaMorgan = require('koa-morgan');
const koaHelmet = require('koa-helmet');
const koaBodyParser = require('koa-bodyparser');

const mongoose = require('mongoose');

require('dotenv').config();

// connect MongoDb database
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
).then(() => console.log("DB connected!"));

// check for MongoDb connection error
mongoose.connection.on("error", err => console.log(`DB connection error: ${err.message}`));

const app = new Koa();

// bringing in the routes
const authRoutes = require('./routes/auth');

// using middlewares
app.use(koaMorgan('tiny'));
app.use(koaHelmet());
app.use(koaBodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: err => {
        console.log("Body Parser Error!", err);
    }
}));

// using routes
app.use(authRoutes.routes());

































































// starting server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Listening now at http://localhost:${PORT}`));