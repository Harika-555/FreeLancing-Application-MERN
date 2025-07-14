import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !budget || !skills) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      budget: parseInt(budget),
      skills: skills.split(',').map((skill) => skill.trim()), // Convert comma-separated string to array
      clientId: localStorage.getItem('userId'),
      clientName: localStorage.getItem('username'),
      clientEmail: localStorage.getItem('email'),
      postedDate: new Date().toISOString(),
      status: 'Available',
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:6001/new-project', payload);
      alert('✅ New project posted successfully!');
      setTitle('');
      setDescription('');
      setBudget('');
      setSkills('');
      navigate('/client');
    } catch (err) {
      console.error('Project creation failed:', err);
      alert('❌ Failed to post project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-project-page">
      <h3>Post New Project</h3>

      <div className="new-project-form">
        <div className="form-floating">
          <input
            type="text"
            className="form-control mb-3"
            id="title"
            value={title}
            placeholder="Project Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="title">Project Title</label>
        </div>

        <div className="form-floating">
          <textarea
            className="form-control mb-3"
            id="description"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="description">Description</label>
        </div>

        <div className="form-floating">
          <input
            type="number"
            className="form-control mb-3"
            id="budget"
            value={budget}
            placeholder="Budget"
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <label htmlFor="budget">Budget (in ₹)</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control mb-3"
            id="skills"
            value={skills}
            placeholder="Required skills"
            onChange={(e) => setSkills(e.target.value)}
            required
          />
          <label htmlFor="skills">Required skills (separate by comma)</label>
        </div>

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default NewProject;
