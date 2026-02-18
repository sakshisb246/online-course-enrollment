const Course = require('../models/Course');
const User = require('../models/User');

exports.addCourse = async (req, res) => {
    try {
        const { title, description, instructorId } = req.body;

        const course = new Course({
            title,
            description,
            instructor: instructorId
        });

        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // Check if already enrolled (convert ObjectIds to strings for comparison)
        if (course.studentsEnrolled.map(id => id.toString()).includes(studentId)) {
            return res.status(400).json({ error: 'Already enrolled' });
        }

        course.studentsEnrolled.push(studentId);
        await course.save();

        student.enrolledCourses.push(courseId);
        await student.save();

        res.json({ message: 'Enrolled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentCourses = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await User.findById(studentId).populate({
            path: 'enrolledCourses',
            populate: { path: 'instructor', select: 'username' }
        });

        if (!student) return res.status(404).json({ error: 'Student not found' });

        res.json(student.enrolledCourses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
