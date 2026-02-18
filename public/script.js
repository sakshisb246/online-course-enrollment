const API_URL = 'http://localhost:5000/api';

// Helper to get headers
const getHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Registration successful! Please login.');
            window.location.reload();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred.');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);

            if (data.role === 'student') {
                window.location.href = 'student.html';
            } else {
                window.location.href = 'instructor.html';
            }
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred.');
    }
}


function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}


function checkAuth(requiredRole) {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!userId || (requiredRole && role !== requiredRole)) {
        window.location.href = 'index.html';
    }

    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = `Welcome, ${localStorage.getItem('username')}`;
    }
}


async function fetchCourses() {
    try {
        const res = await fetch(`${API_URL}/courses`);
        const courses = await res.json();
        displayCourses(courses);
    } catch (err) {
        console.error(err);
    }
}


function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    if (!container) return;
    container.innerHTML = '';

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="card-footer">
                <span>Instructor: ${course.instructor ? course.instructor.username : 'Unknown'}</span>
                <button onclick="enrollCourse('${course._id}')" class="btn" style="width:auto; padding: 5px 15px; margin-left:10px;">Enroll</button>
            </div>
        `;
        container.appendChild(card);
    });
}


async function enrollCourse(courseId) {
    const studentId = localStorage.getItem('userId');
    try {
        const res = await fetch(`${API_URL}/courses/enroll`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ courseId, studentId })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Enrolled successfully!');
            fetchMyCourses();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
}


async function fetchMyCourses() {
    const studentId = localStorage.getItem('userId');
    try {
        const res = await fetch(`${API_URL}/courses/student/${studentId}`);
        const courses = await res.json();
        displayMyCourses(courses);
    } catch (err) {
        console.error(err);
    }
}

function displayMyCourses(courses) {
    const container = document.getElementById('my-courses-container');
    if (!container) return;
    container.innerHTML = '';

    if (courses.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1;">You are not enrolled in any courses yet.</p>';
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="card-footer">
                <span>Instructor: ${course.instructor ? course.instructor.username : 'Unknown'}</span>
                <span style="color: var(--success-color); font-weight:bold;">Enrolled</span>
            </div>
        `;
        container.appendChild(card);
    });
}


async function handleAddCourse(event) {
    event.preventDefault();
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-desc').value;
    const instructorId = localStorage.getItem('userId');

    try {
        const res = await fetch(`${API_URL}/courses/add`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ title, description, instructorId })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Course added successfully!');
            document.getElementById('add-course-form').reset();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error adding course');
    }
}
