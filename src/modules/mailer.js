const nodemailer = require('nodemailer');
const hbs = require('express-handlebars');
const path = require('path');

const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

transport.use('compile', hbs({ 
    viewEngine: hbs.create({ partialsDir: path.resolve('./src/resources/mail/auth') }),
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
 }));

module.exports = transport;