import express from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasks,
  updateTask,
} from '../controllers/Task.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* CREATE A NEW TASK */
router.post('/:id/new-task', verifyToken, createTask);

/* GET A TASK */
router.get('/:groupId/task/:id', verifyToken, getTasks);

/* GET ALL TASKS */
router.get('/:id/all-tasks', verifyToken, getAllTasks);

/* UPDATE A TASK */
router.put('/:groupId/task/:id/update', verifyToken, updateTask);

/* DELETE A TASK */
router.delete('/:groupId/task/:id/delete', verifyToken, deleteTask);

export default router;
