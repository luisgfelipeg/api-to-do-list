import express from 'express';
import { login, register } from '../controllers/auth.js';

const router = express.Router();

/* CREATE A NEW USER */
router.post('/register', register);

/* LOGIN IN */
router.post('/login', login);

export default router;
