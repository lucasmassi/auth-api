const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// USER ROUTES \\
require('./app/controllers/user/authController')(app);
require('./app/controllers/user/productController')(app);

// ADMIN ROUTES \\
require('./app/controllers/admin/authController')(app);
require('./app/controllers/admin/userController')(app);

// GUEST ROUTES \\

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.listen(process.env.PORT || 3000);
