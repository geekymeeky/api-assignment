"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTicketsOfUser = exports.getOneTicketList = exports.createTicket = void 0;
const ticket_model_1 = __importDefault(require("../models/ticket.model"));
const TambolaTicket_1 = __importDefault(require("../utils/TambolaTicket"));
const lodash_1 = require("lodash");
const createTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { count = 6 } = req.query;
        if (count > 6 || count < 1) {
            next({
                status: 400,
                message: 'Count should be between 1 and 6',
            });
            return;
        }
        const tambolaTickets = new TambolaTicket_1.default((0, lodash_1.toInteger)(count)).tickets();
        const ticket = new ticket_model_1.default({
            user: req.user.id,
            tickets: tambolaTickets,
        });
        const result = yield ticket.save();
        res.status(201).send({
            message: 'Ticket created successfully',
            id: result._id,
        });
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
exports.createTicket = createTicket;
const getOneTicketList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    try {
        const ticket = yield ticket_model_1.default.findById(ticketId).lean();
        // match ticket with user
        if (ticket.user.toString() !== req.user.id) {
            console.log(ticket.user.toString(), req.user.id);
            next({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        if (!ticket) {
            return [];
        }
        return res.status(200).json(ticket);
    }
    catch (error) {
        next({
            status: 500,
            message: error.message,
        });
    }
});
exports.getOneTicketList = getOneTicketList;
const getAllTicketsOfUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // with pagination
    try {
        const { page = 1, limit = 10 } = req.query;
        const tickets = yield ticket_model_1.default.find({ user: req.user.id })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .exec();
        const count = yield ticket_model_1.default.countDocuments();
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
exports.getAllTicketsOfUser = getAllTicketsOfUser;
