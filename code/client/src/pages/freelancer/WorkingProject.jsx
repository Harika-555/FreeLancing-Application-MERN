import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/freelancer/WorkingProject.css';
import { useNavigate } from 'react-router-dom';

const WorkingProject = () => {
  const [workingProject, setWorkingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const freelancerId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkingProject();
  }, []);

  const fetchWorkingProject = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-projects');
      const assignedProject = res.data.find(
        (project) =>
          project.freelancerId === freelancerId &&
          project.status === 'Assigned'
      );
      setWorkingProject(assignedProject || null);
    } catch (err) {
      console.error('Error fetching working project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading project...</p>;

  if (!workingProject)
    return <p>No working project assigned to you yet.</p>;

  return (
    <div className="working-project-page">
      <h3>Working Project</h3>
      <div className="project-card">
        <h4>{workingProject.title}</h4>
        <p>{workingProject.description}</p>

        <div className="project-skills">
          <strong>Skills Required:</strong>
          <div className="skills">
            {workingProject.skills.map((skill) => (
              <span className="skill-tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <p>
          <strong>Status:</strong> {workingProject.status}
        </p>

        {workingProject.submission ? (
          <p className="text-success">✅ Submission Done</p>
        ) : (
          <p className="text-warning">⚠️ Submission Pending</p>
        )}

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(`/project/${workingProject._id}`)}
        >
          Go to Project Page
        </button>
      </div>
    </div>
  );
};

export default WorkingProject;
