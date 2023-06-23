var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Ticket from '../models/ticket.model';
import TambolaTicket from '../utils/TambolaTicket';
import { toInteger } from 'lodash';
export const createTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { count = 6 } = req.query;
        if (count > 6 || count < 1) {
            next({
                status: 400,
                message: 'Count should be between 1 and 6',
            });
            return;
        }
        const tambolaTickets = new TambolaTicket(toInteger(count)).tickets();
        const ticket = new Ticket({
            user: req.user.id,
            tickets: tambolaTickets,
        });
        const result = yield ticket.save();
        res.status(201).send(result);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            next({
                status: 400,
                message: error.message,
            });
        }
    }
});
export const getTickets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // with pagination
    try {
        const { page = 1, limit = 10 } = req.query;
        const tickets = yield Ticket.find({ user: req.user.id })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .exec();
        const count = yield Ticket.countDocuments();
        res.status(200).json({
            tickets,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    }
    catch (error) {
        next({
            status: 400,
            message: error.message,
        });
    }
});
//# sourceMappingURL=ticket.controller.js.map