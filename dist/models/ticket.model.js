import mongoose from 'mongoose';
const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
//# sourceMappingURL=ticket.model.js.map