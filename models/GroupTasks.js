import mongoose from 'mongoose';

const GroupTasksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

GroupTasksSchema.methods.exclude = async function () {
  await this.model('Task').deleteMany({ group_id: this._id });
  return await this.deleteOne();
};

const GroupTasks = mongoose.model('GroupTasks', GroupTasksSchema);
export default GroupTasks;
