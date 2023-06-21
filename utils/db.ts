import mongoose from 'mongoose'

export default function connectDB(): Promise<typeof mongoose> {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise
    mongoose.connection.on('error', (err: string) => {
      console.log(`MongoDB connection error: ${err}`)
      reject(err)
    })
    mongoose.connection.once('open', () => {
      console.log('Connected to database')
      resolve(mongoose)
    })
    mongoose.connect(process.env.MONGO_URI || '')
  })
}
