const Workout = require('../models/workout');

// Add Workout
// Add Workout
exports.addWorkout = async (req, res) => {
    try {
        const { name, duration } = req.body;

        if (!name || !duration) {
            return res.status(400).json({ message: 'Name and duration are required' });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id;

        console.log("User ID from Token in addWorkout:", userId); // Debug log

        const newWorkout = new Workout({
            userId,
            name,
            duration,
            status: 'pending',
            dateAdded: new Date()
        });

        await newWorkout.save();

        res.status(201).json(newWorkout); // Return the full workout object as per the expected structure
    } catch (error) {
        res.status(500).json({ message: 'Error adding workout', error });
    }
};

// Get Workouts
exports.getMyWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;

        const workouts = await Workout.find({ userId });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workouts', error });
    }
};

// Update Workout
exports.updateWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;
        const { name, duration } = req.body; // Removed `status` from destructuring

        console.log("Workout ID:", workoutId);
        console.log("User ID from Token:", req.user.id);

        // Always set status to "pending" if name or duration is updated
        const updateFields = { name, duration };
        if (name || duration) {
            updateFields.status = 'pending';
        }

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id }, // Ensure the workout belongs to the user
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        res.status(200).json({
            message: 'Workout updated successfully',
            updatedWorkout: {
                _id: updatedWorkout._id,
                userId: updatedWorkout.userId,
                name: updatedWorkout.name,
                duration: updatedWorkout.duration,
                status: updatedWorkout.status,
                dateAdded: updatedWorkout.dateAdded,
                __v: updatedWorkout.__v
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating workout', error: error.message });
    }
};

// Delete Workout
exports.deleteWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log("Workout ID:", workoutId);
        console.log("User ID from Token:", req.user.id);

        const deletedWorkout = await Workout.findOneAndDelete({
            _id: workoutId,
            userId: req.user.id // Ensure the workout belongs to the user
        });

        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        res.status(200).json({
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout', error: error.message });
    }
};

// Complete Workout
exports.completeWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;

        const completedWorkout = await Workout.findByIdAndUpdate(
            workoutId,
            { status: 'completed' },
            { new: true }
        );

        if (!completedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        res.status(200).json({
            message: 'Workout status updated successfully',
            workout: completedWorkout
        });
    } catch (error) {
        res.status(500).json({ message: 'Error completing workout', error });
    }
};