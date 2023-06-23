import express from 'express'
import { createTicket, getTickets } from '../controllers/ticket.controller'
import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/', protect, getTickets)
router.post('/', protect, createTicket)

export default router
