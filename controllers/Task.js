import { StatusCodes } from 'http-status-codes';
import GroupTasks from '../models/GroupTasks.js';
import Task from '../models/Task.js';

/* CREATE */
export const createTask = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;
    const groupId = req.params.id;
    const group = await GroupTasks.findById(groupId);

    if (!group) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Group not found' });
    }

    if (req.user.id !== group.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to add tasks to this group" });
    }

    const newTask = new Task({
      name,
      description,
      deadline,
      group_id: group._id,
    });

    const savedTask = await newTask.save();

    group.tasks.push(savedTask._id);
    const savedGroup = await group.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ task: savedTask, group: savedGroup });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* GET A TASK */
export const getTasks = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate('group_id');
    const groupId = await GroupTasks.findById(task.group_id);

    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Task not found' });
    }

    if (req.user.id !== groupId.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to view this task" });
    }

    if (task.group_id._id.toString() !== req.params.groupId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'This task belong to other group' });
    }

    return res.status(StatusCodes.OK).json({ task });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* GET ALL TASKS */
export const getAllTasks = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await GroupTasks.findById(groupId);

    if (!group) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Group not found' });
    }

    if (req.user.id !== group.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to view this group's tasks" });
    }

    const tasks = await Task.find({ group_id: groupId });

    return res.status(StatusCodes.OK).json({ tasks });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* UPDATE */
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate('group_id');
    const groupId = await GroupTasks.findById(task.group_id);

    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Task not found' });
    }

    if (req.user.id !== groupId.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to update this task" });
    }

    if (task.group_id._id.toString() !== req.params.groupId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'This task belong to other group' });
    }

    const { name, description, deadline } = req.body;

    task.name = name;
    task.description = description;
    task.deadline = deadline;

    const savedTask = await task.save();
    return res.status(StatusCodes.OK).json({ task: savedTask });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* DELETE A TASK */
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate('group_id');
    const groupId = await GroupTasks.findById(task.group_id);

    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Task not found' });
    }

    if (req.user.id !== groupId.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to update this task" });
    }

    if (task.group_id._id.toString() !== req.params.groupId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'This task belong to other group' });
    }

    await GroupTasks.findByIdAndUpdate(groupId, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Task deleted successfully' });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};
