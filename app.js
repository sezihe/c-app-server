const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

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

const app = express();

// bringing in the routes
const authRoutes = require('./routes/auth');

// using middlewares
app.use(morgan('tiny'));
app.use(helmet());
app.use(bodyParser.json());

// using routes
app.use('/auth', authRoutes);

// starting server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Listening now at http://localhost:${PORT}`));