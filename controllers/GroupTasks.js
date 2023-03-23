import { StatusCodes } from 'http-status-codes';
import GroupTasks from '../models/GroupTasks.js';

/* CREATE */
export const createGroupTasks = async (req, res) => {
  try {
    const { name } = req.body;

    const newGroupTasks = new GroupTasks({
      name,
      user_id: req.user.id,
    });

    const savedGroupTasks = await newGroupTasks.save();
    res.status(201).json(savedGroupTasks);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

/* GET A GROUP*/
export const getGroupTasks = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await GroupTasks.findById(groupId).populate('tasks');

    if (!group) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Group not found' });
    }

    if (req.user.id !== group.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to update this group" });
    }

    return res.status(StatusCodes.OK).json({ group });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* GET ALL GROUPS OF A USER */
export const getAllGroups = async (req, res) => {
  try {
    const groups = await GroupTasks.find({ user_id: req.user.id }).populate(
      'tasks'
    );

    if (!groups) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Group not found' });
    }

    if (req.user.id !== groups.user_id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You don't have access to update this group" });
    }

    return res.status(StatusCodes.OK).json({ groups });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

/* UPDATE */
export const updateGroupTasks = async (req, res) => {
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
        .json({ message: "You don't have access to update this group" });
    }

    const { name } = req.body;

    group.name = name;
    const savedGroupTasks = await group.save();
    res.status(StatusCodes.OK).json(savedGroupTasks);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

/* DELETE */
export const deleteGroupTasks = async (req, res) => {
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
        .json({ message: "You don't have access to update this group" });
    }

    await group.exclude();
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};
