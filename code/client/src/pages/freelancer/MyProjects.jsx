import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/MyProjects.css';

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-projects');
      const userId = localStorage.getItem('userId');

      const userProjects = res.data.filter(
        (project) => project.freelancerId === userId
      );

      setProjects(userProjects);
      setDisplayProjects([...userProjects].reverse());
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (!status) {
      setDisplayProjects([...projects].reverse());
    } else {
      const filtered = projects.filter((project) => project.status === status);
      setDisplayProjects([...filtered].reverse());
    }
  };

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr />

        {displayProjects.length === 0 ? (
          <p>No projects found for selected status.</p>
        ) : (
          displayProjects.map((project) => (
            <div
              className="listed-project"
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="listed-project-head">
                <h3>{project.title}</h3>
                <p>{String(project.postedDate)?.slice(0, 24)}</p>
              </div>
              <h5>Budget - ₹ {project.budget}</h5>
              <p>{project.description}</p>

              <div className="bids-data">
                <h6>Status - {project.status}</h6>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProjects;
