const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
}, 
{
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

const TodoModel = mongoose.model('tasks', todoSchema);

module.exports = TodoModel;

