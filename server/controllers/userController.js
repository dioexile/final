const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models');
const { validationResult } = require('express-validator');
const uuid = require('uuid')
const path = require('path');

const generateJwt = (id, email, username) => {
    return jwt.sign(
        {id, email, username},
        process.env.SECRET_KEY,
        {expiresIn: '1000h'}
    )
}

class UserController {
    async registration(req, res, next) {

        const {email, password, username} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Invalid email or password'))
        }
        const checkName = await User.findOne({where: {username}})
        if (checkName) {
            return next(ApiError.badRequest('This username is already in use'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('This email is already in use'))
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const user = await User.create({email, password: hashPassword, username: username, role: 'USER', img: 'user.png'})

        const token = generateJwt(user.id, user.email, user.username)
        return res.json({token})
    }

    async signIn(req, res, next) {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login details'
            })
        }
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('User not found'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Wrong password specified'))
        }
        const token = generateJwt(user.id, user.email, user.username)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    async getUser(req, res) {
        const {id} = req.params
        const user = await User.findOne(
            {
                where: {id}
            },
        )
        return res.json(user)
    }
    async getUserId(req, res) {
        const {id} = req.body
        const user = await User.findOne(
            {
                where: {id: id}
            },
        )
        return res.json(user)
    }
    async chatMember(req, res) {
        const {id} = req.body
        const user = await User.findOne({where: {id: id}})
        return res.json(user)
    }
    async uploadAvatar(req, res, next){
        try {
            const {id} = req.params
            const {img} = req.files
            const fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const user = await User.findOne({where: {id}})
            user.img = fileName
            await user.save()
            return res.json(user)
        } catch (error) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAvatar(req, res){
        const {id} = req.params
        const user = await User.findOne({where: {id}})
        user.img = null
        await user.save()
        return res.json(user)
    }
}

module.exports = new UserController()