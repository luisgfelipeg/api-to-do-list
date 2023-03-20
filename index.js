import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import mongoose from 'mongoose';
import group from './routes/groupTasks.js';
import task from './routes/tasks.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

/* ROUTES */
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Congratulatiins' });
});
app.use('/auth', authRoutes);
app.use('/group', group);
app.use('/group', task);

/* MONGOOSE SETUP */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const PORT = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
