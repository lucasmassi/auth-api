const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../../config/admin');

const Admin = require('../../models/Admin');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    const { name } = req.body;

    try {
        if (await Admin.findOne({ email }))
            return res.status(400).send({ error: 'E-mail ja existente.' });

        if (!name)
            return res.status(400).send({ error: 'Nome do usuário não informado' });

        const admin = await Admin.create(req.body);

        admin.password = undefined;

        return res.send({
            admin,
            token: generateToken({ id: admin.id }),
        });
    }
    catch (err) {
        return res.status(400).send({ error: 'Erro ao criar o registro' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin)
        return res.status(400).send({ error: 'Usuário não encontrado' });

    if (!await bcrypt.compare(password, admin.password))
        return res.status(400).send({ error: 'Senha inválida' });

    admin.password = undefined;

    res.send({
        admin,
        token: generateToken({ id: admin.id }),
    });
});

module.exports = app => app.use('/admin', router);