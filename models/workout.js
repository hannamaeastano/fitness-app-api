const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Workout name is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    }
});

module.exports = mongoose.model('Workout', workoutSchema);