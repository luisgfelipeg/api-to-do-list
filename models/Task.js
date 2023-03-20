import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  solvedAt: {
    type: Date,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupTasks',
  },
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
