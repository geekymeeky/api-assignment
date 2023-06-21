import express from 'express'
import { login, me, signup } from '../controllers/user.controller'
import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/me', protect, me)
router.post('/signup', signup)
router.post('/login', login)

export default router
