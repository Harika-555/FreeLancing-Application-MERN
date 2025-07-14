import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:6001/fetch-freelancer/${userId}`)
      .then(res => {
        const { currentProjects, completedProjects } = res.data;
        const ids = [...currentProjects, ...completedProjects];
        axios.get(`http://localhost:6001/fetch-projects`)
          .then(projectsRes => {
            const filtered = projectsRes.data.filter(p => ids.includes(p._id));
            setProjects(filtered);
          });
      });
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Projects</h3>
      {projects.map(project => (
        <div key={project._id} className="card mt-3 p-3">
          <h5>{project.title}</h5>
          <p>Status: <strong>{project.status}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default MyProjects;
