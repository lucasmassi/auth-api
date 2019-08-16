const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//const mailer = require('../../modules/mailer');

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
    const { username } = req.body;

    try {
        if (await Admin.findOne({ email }))
            return res.status(400).send({ error: 'E-mail ja existente.' });

        if (await Admin.findOne({ username }))
            return res.status(400).send({ error: 'Username ja existente.' });


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

/*router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'Usuário não encontrado' }); 

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        //mongoose.set('useFindAndModify', false);
        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        
        mailer.sendMail({
            to: email,
            from: 'suporte@itragoo.com.br',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Nao foi possivel enviar a recuperação de senha' });
            
            return res.send();
        });

    }catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Erro! Por favor tente novamente' });
    }
});*/

module.exports = app => app.use('/admin', router);