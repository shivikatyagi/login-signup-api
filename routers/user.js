const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        user.setPassword(req.body.password);
        await user.save()
        const token = await user.AuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/login', async (req, res) => {
    try {
       
        const user = await User.findByCredentials(req.body.email, req.body.password,req.body.role)
        const token = await user.AuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send("user not found")
    }
})

module.exports = router
