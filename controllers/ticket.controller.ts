import { NextFunction, Request, Response } from 'express'
import Ticket, { ITicket } from '../models/ticket.model'
import { IToken } from '../utils/token'
import TambolaTicket from '../utils/TambolaTicket'
import { toInteger } from 'lodash'

export const createTicket = async (
  req: Request & { user: IToken },
  res: Response,
  next: NextFunction
) => {
  try {
    const { count = 6 } = req.query as unknown as { count: number }

    if (count > 6 || count < 1) {
      next({
        status: 400,
        message: 'Count should be between 1 and 6',
      })
      return
    }

    const tambolaTickets = new TambolaTicket(toInteger(count)).tickets()
    const ticket = new Ticket({
      user: req.user.id,
      tickets: tambolaTickets,
    })
    const result = await ticket.save()
    res.status(201).send({
      message: 'Ticket created successfully',
      id: result._id,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({
        status: 400,
        message: error.message,
      })
    }
  }
}

export const getOneTicketList = async (
  req: Request & { user: IToken },
  res: Response,
  next: NextFunction
) => {
  const { ticketId } = req.params as { ticketId: string }
  try {
    const ticket = await Ticket.findById(ticketId).lean()
    // match ticket with user
    if (ticket.user.toString() !== req.user.id) {
      console.log(ticket.user.toString(), req.user.id)
      next({
        status: 401,
        message: 'Unauthorized',
      })
      return
    }

    if (!ticket) {
      return []
    }
    return res.status(200).json(ticket)
  } catch (error) {
    next({
      status: 500,
      message: error.message,
    })
  }
}

export const getAllTicketsOfUser = async (
  req: Request & { user: IToken },
  res: Response,
  next: NextFunction
) => {
  // with pagination
  try {
    const { page = 1, limit = 10 } = req.query as unknown as {
      page: number
      limit: number
    }

    const tickets = await Ticket.find({ user: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec()
    const count = await Ticket.countDocuments()
    res.status(200).json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    })
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    })
  }
}
