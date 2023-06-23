"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tickets: {
        type: [[[Number]]],
        required: true,
    },
}, {
    timestamps: {
        updatedAt: false,
    },
});
const Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.default = Ticket;
