import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/client/client.css';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [filterProject, setFilterProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const clientId = localStorage.getItem('userId');

      if (!clientId) {
        setError('Client not logged in.');
        setLoading(false);
        return;
      }

      const clientProjects = response.data.filter(
        (project) => project.clientId === clientId
      );

      const sortedProjects = [...clientProjects].reverse();
      setProjects(sortedProjects);
      setDisplayProjects(sortedProjects);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilterChange = (status) => {
    setFilterProject(status);
    if (status === '') {
      setDisplayProjects(projects);
    } else {
      const filtered = projects.filter((project) => {
        if (status === 'Un Assigned') return project.status === 'Available';
        if (status === 'In Progress') return project.status === 'Assigned';
        if (status === 'Completed') return project.status === 'Completed';
        return true;
      });
      setDisplayProjects(filtered.reverse());
    }
  };

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select
            className="form-control"
            value={filterProject}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">Choose project status</option>
            <option value="Un Assigned">Un Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <hr />

        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : displayProjects.length === 0 ? (
          <p>No projects to display.</p>
        ) : (
          displayProjects.map((project) => (
            <div
              className="listed-project"
              key={project._id}
              onClick={() => navigate(`/client-project/${project._id}`)}
            >
              <div className="listed-project-head">
                <h3>{project.title}</h3>
                <p>{String(project.postedDate).slice(0, 25)}</p>
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

export default Client;
