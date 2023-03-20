import express from 'express';
import {
  createGroupTasks,
  deleteGroupTasks,
  getAllGroups,
  getGroupTasks,
  updateGroupTasks,
} from '../controllers/GroupTasks.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* CREATE A NEW GROUP TASKS */
router.post('/new-group', verifyToken, createGroupTasks);

/* GET A GROUP TASKS WITH TASKS */
router.get('/:id', verifyToken, getGroupTasks);

/* GET ALL GROUPS OF A USER */
router.get('/all/:id', verifyToken, getAllGroups);

/* UPDATE A GROUP NAME */
router.put('/:id/update', verifyToken, updateGroupTasks);

/* DELETE A GROUP */
router.delete('/:id/delete', verifyToken, deleteGroupTasks);

export default router;
