import express from 'express'
import {
  createTicket,
  getAllTicketsOfUser,
  getOneTicketList,
} from '../controllers/ticket.controller'
import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/', protect, getAllTicketsOfUser)
router.post('/', protect, createTicket)
router.get('/:ticketId', protect, getOneTicketList)

export default router
