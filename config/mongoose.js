import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('mongoose running...')
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); //mongodb://localhost/issue_tracker
  console.log('sucessfully connected to the database')
}

main().catch(err => console.log(err));
export const db = mongoose.connection;
