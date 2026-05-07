import React, { useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [view, setView] = useState('overview');
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setEmail(''); setPassword('');
        loadLessons(data.token);
      }
    } catch (err) { console.error('Login failed:', err); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, school, subject })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); setToken(data.token);
        localStorage.setItem('token', data.token);
        setIsRegister(false);
        setEmail(''); setPassword(''); setName(''); setSchool(''); setSubject('');
      }
    } catch (err) { console.error('Register failed:', err); }
  };

  const loadLessons = async (authToken) => {
    try {
      const res = await fetch(`${API_URL}/lessons`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setLessons(await res.json());
    } catch (err) { console.error('Error loading lessons:', err); }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: lessonTitle, description: lessonDescription, subject: 'Math', grade_level: '9', duration_minutes: 45 })
      });
      if (res.ok) { setLessonTitle(''); setLessonDescription(''); loadLessons(token); }
    } catch (err) { console.error('Error creating lesson:', err); }
  };

  const loadStudents = async (authToken) => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setStudents(await res.json());
    } catch (err) { console.error('Error loading students:', err); }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: studentName, email: 'student@example.com', grade_level: '9' })
      });
      if (res.ok) { setStudentName(''); loadStudents(token); }
    } catch (err) { console.error('Error creating student:', err); }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>TeachHub</h1>
          <p className="subtitle">Lesson planning, grading & student management</p>
          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
              <>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} />
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  <option value="English">English</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                </select>
              </>
            )}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary">{isRegister ? 'Create Account' : 'Sign In'}</button>
          </form>
          <p className="toggle-auth">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>{isRegister ? 'Sign In' : 'Create Account'}</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>TeachHub Dashboard</h1>
        <div className="user-menu">
          <span>{user?.name}</span>
          <button onClick={() => { setToken(null); setUser(null); localStorage.removeItem('token'); }} className="btn-secondary">Logout</button>
        </div>
      </header>
      <nav className="sidebar">
        <button className={`nav-item ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>Overview</button>
        <button className={`nav-item ${view === 'lessons' ? 'active' : ''}`} onClick={() => { setView('lessons'); loadLessons(token); }}>Lessons</button>
        <button className={`nav-item ${view === 'students' ? 'active' : ''}`} onClick={() => { setView('students'); loadStudents(token); }}>Students</button>
      </nav>
      <main className="dashboard-content">
        {view === 'overview' && (
          <div className="view-container">
            <h2>Dashboard Overview</h2>
            <p>Welcome to TeachHub! Create lessons, manage students, and track grades.</p>
          </div>
        )}
        {view === 'lessons' && (
          <div className="view-container">
            <h2>Lessons</h2>
            <form onSubmit={handleCreateLesson} className="form-card">
              <input type="text" placeholder="Lesson Title" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required />
              <textarea placeholder="Description" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} />
              <button type="submit" className="btn-primary">Create Lesson</button>
            </form>
            <div className="lessons-grid">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === 'students' && (
          <div className="view-container">
            <h2>Students</h2>
            <form onSubmit={handleCreateStudent} className="form-card">
              <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              <button type="submit" className="btn-primary">Add Student</button>
            </form>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th></tr></thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}><td>{student.name}</td><td>{student.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
