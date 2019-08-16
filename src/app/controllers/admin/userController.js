const express = require('express');
const authMiddleware = require('../../middlewares/admin');

const User = require('../../models/User');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        return res.send({ users });
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao listar usuários' });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        return res.send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao exibir o usuário' });
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const { name, username, email } = req.body;

        const user = await User.findByIdAndUpdate(req.params.userId,
            { name, username, email });

        await user.save();

        return res.send({ user });
    } catch (err) {
        console.log(err);

        return res.status(400).send({ error: 'Erro ao atualizar usuário' });
    }
});

module.exports = app => app.use('/admin/users', router);