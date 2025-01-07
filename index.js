require("dotenv").config();
const express = require('express');
const cors = require('cors');
const middleware = require('./middleware/headerValidator');
const jwt=require('jsonwebtoken');
const app = express();

const user = require('./modules/v1/Auth/route');

app.use(cors());
app.use(express.json());


app.use(middleware.validateHeaderApiKey); // Check Key

// For Apis
app.use('/api/v1/auth/', user);


try {
    app.listen(process.env.PORT);
    console.log(`Server running on port: ${process.env.PORT}`);
} catch (error) {
    console.error(`Error occurred: ${error}`);
}
