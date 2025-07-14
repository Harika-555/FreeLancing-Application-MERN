import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/freelancer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Freelancer = () => {
  const navigate = useNavigate();

  const [freelancerData, setFreelancerData] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [skillsInput, setSkillsInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchFreelancerData(userId);
    fetchApplications(userId);
  }, [userId]);

  const fetchFreelancerData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-freelancer/${id}`);
      const data = res.data;
      setFreelancerData(data);
      setSkillsInput(data.skills?.join(', ') || '');
      setDescriptionInput(data.description || '');
    } catch (err) {
      console.error('Error fetching freelancer data:', err);
    }
  };

  const fetchApplications = async (id) => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-applications');
      const userApplications = res.data.filter((app) => app.freelancerId === id);
      setApplicationsCount(userApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleUpdate = async () => {
  try {
    await axios.post('http://localhost:6001/update-freelancer', {
      freelancerId: freelancerData._id,
      updateSkills: skillsInput, // send as plain string
      description: descriptionInput.trim(),
    });
    alert('Profile updated successfully ✅');
    setIsEditing(false);
    fetchFreelancerData(userId);
  } catch (err) {
    alert('Failed to update profile ❌');
    console.error(err);
  }
};


  if (!freelancerData) return <p>Loading your profile...</p>;

  return (
    <div className="freelancer-home">
      {/* Dashboard Cards */}
      <div className="home-cards">
        <div className="home-card">
          <h4>Current Projects</h4>
          <p>{freelancerData.currentProjects?.length || 0}</p>
          <button onClick={() => navigate('/my-projects')}>View Projects</button>
        </div>

        <div className="home-card">
          <h4>Completed Projects</h4>
          <p>{freelancerData.completedProjects?.length || 0}</p>
          <button onClick={() => navigate('/my-projects')}>View Projects</button>
        </div>

        <div className="home-card">
          <h4>Applications</h4>
          <p>{applicationsCount.length}</p>
          <button onClick={() => navigate('/myApplications')}>View Applications</button>
        </div>

        <div className="home-card">
          <h4>Funds</h4>
          <p>Available: ₹ {freelancerData.funds || 0}</p>
        </div>
      </div>

      {/* Freelancer Profile */}
      <div className="freelancer-details">
        {!isEditing ? (
          <div className="freelancer-details-data">
            <span>
              <h4>My Skills</h4>
              <div className="skills">
                {freelancerData.skills?.length > 0 ? (
                  freelancerData.skills.map((skill) => (
                    <h5 key={skill} className="skill">
                      {skill}
                    </h5>
                  ))
                ) : (
                  <p>No skills available</p>
                )}
              </div>
            </span>

            <span>
              <h4>Description</h4>
              <p>{freelancerData.description || 'Please add your description'}</p>
            </span>

            <button
              className="btn btn-outline-success"
              onClick={() => setIsEditing(true)}
            >
              Update
            </button>
          </div>
        ) : (
          <div className="freelancer-details-update">
            <span>
              <label htmlFor="mySkills">
                <h4>My Skills</h4>
              </label>
              <input
                type="text"
                className="form-control"
                id="mySkills"
                placeholder="e.g. React, Node.js"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </span>

            <span>
              <label htmlFor="description-textarea">
                <h4>Description</h4>
              </label>
              <textarea
                className="form-control"
                id="description-textarea"
                rows={4}
                placeholder="Tell us about your experience..."
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
              ></textarea>
            </span>

            <button className="btn btn-outline-success mt-3" onClick={handleUpdate}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freelancer;
