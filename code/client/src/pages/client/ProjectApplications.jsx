import React, { useEffect, useState } from 'react';
import '../../styles/client/ClientApplications.css';
import axios from 'axios';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-applications');
      const clientId = localStorage.getItem('userId');

      const clientApplications = res.data.filter(
        (app) => app.clientId === clientId
      );

      setApplications(clientApplications);
      setDisplayApplications([...clientApplications].reverse());

      // Unique project titles
      const uniqueTitles = [
        ...new Set(clientApplications.map((app) => app.title)),
      ];
      setProjectTitles(uniqueTitles);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleFilterChange = (value) => {
    setProjectFilter(value);
    if (!value) {
      setDisplayApplications([...applications].reverse());
    } else {
      const filtered = applications.filter((app) => app.title === value);
      setDisplayApplications([...filtered].reverse());
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.get(`http://localhost:6001/approve-application/${id}`);
      alert('✅ Application approved!');
      fetchApplications();
    } catch (err) {
      alert('❌ Operation failed!');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`http://localhost:6001/reject-application/${id}`);
      alert('❌ Application rejected!');
      fetchApplications();
    } catch (err) {
      alert('❌ Operation failed!');
    }
  };

  return (
    <div className="client-applications-page">
      <h3>Applications</h3>

      {error && <p className="error-text">{error}</p>}

      {projectTitles.length > 0 && (
        <select
          className="form-control"
          value={projectFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All Projects</option>
          {projectTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      )}

      <div className="client-applications-body">
        {loading ? (
          <p>Loading applications...</p>
        ) : displayApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          displayApplications.map((app) => (
            <div className="client-application" key={app._id}>
              <div className="client-application-body">
                <div className="client-application-half">
                  <h4>{app.title}</h4>
                  <p>{app.description}</p>
                  <span>
                    <h5>Skills</h5>
                    <div className="application-skills">
                      {app.requiredSkills?.map((skill, idx) => (
                        <p key={idx}>{skill}</p>
                      ))}
                    </div>
                  </span>
                  <h6>Budget - ₹ {app.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                <div className="client-application-half">
                  <span>
                    <h5>Proposal</h5>
                    <p>{app.proposal}</p>
                  </span>

                  <span>
                    <h5>Freelancer Skills</h5>
                    <div className="application-skills">
                      {app.freelancerSkills?.map((skill, idx) => (
                        <p key={idx}>{skill}</p>
                      ))}
                    </div>
                  </span>

                  <h6>Proposed Budget - ₹ {app.bidAmount}</h6>

                  <div className="approve-btns">
                    {app.status === 'Pending' ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(app._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(app._id)}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <h6>
                        Status: <b>{app.status}</b>
                      </h6>
                    )}
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
