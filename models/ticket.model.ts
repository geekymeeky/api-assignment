import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tickets: {
      type: [[[Number]]],
      required: true,
    },
  },
  {
    timestamps: {
      updatedAt: false,
    },
  }
)

export interface ITicket extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId
  tickets: [[[Number]]]
}

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket
