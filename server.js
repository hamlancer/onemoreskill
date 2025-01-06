const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Mock database
let students = [
    {
        id: '123',
        admissionNumber: 'A001',
        name: 'John Doe',
        fatherName: 'Richard Doe',
        course: 'Computer Science',
        verified: true,
        picture: 'link-to-picture',
        certificatePDF: 'link-to-pdf',
        certificatePNG: 'link-to-png'
    }
];

// Routes
app.post('/verify', (req, res) => {
    const { studentId, admissionNumber } = req.body;
    const student = students.find(s => s.id === studentId && s.admissionNumber === admissionNumber);
    if (student) {
        res.json({ verified: student.verified, details: student });
    } else {
        res.json({ verified: false });
    }
});

app.post('/admin/login', (req, res) => {
    const { adminId, password } = req.body;
    if (adminId === 'skil_hamza' && password === '$HamzA0258skillCraft-Hami') {
        req.session.admin = true;
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/admin/students', (req, res) => {
    if (req.session.admin) {
        res.json(students);
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/admin/add-student', (req, res) => {
    if (req.session.admin) {
        const newStudent = req.body;
        students.push(newStudent);
        res.status(201).send('Student added');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.put('/admin/edit-student/:id', (req, res) => {
    if (req.session.admin) {
        const studentId = req.params.id;
        const updatedStudent = req.body;
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students[index] = updatedStudent;
            res.status(200).send('Student updated');
        } else {
            res.status(404).send('Student not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.delete('/admin/delete-student/:id', (req, res) => {
    if (req.session.admin) {
        const studentId = req.params.id;
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students.splice(index, 1);
            res.status(200).send('Student deleted');
        } else {
            res.status(404).send('Student not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
