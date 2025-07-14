import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/MyApplications.css';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-applications');
      const userApps = res.data
        .filter((app) => app.freelancerId === userId)
        .reverse();
      setApplications(userApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  return (
    <div className="user-applications-page">
      <h3>My Applications</h3>

      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <div className="user-applications-body">
          {applications.map((application) => (
            <div className="user-application" key={application._id}>
              <div className="user-application-body">
                {/* Left Half - Project Info */}
                <div className="user-application-half">
                  <h4>{application.title}</h4>
                  <p>{application.description}</p>
                  <span>
                    <h5>Required Skills</h5>
                    <div className="application-skills">
                      {application.requiredSkills?.map((skill) => (
                        <p key={skill}>{skill}</p>
                      ))}
                    </div>
                  </span>
                  <h6>Budget - ₹ {application.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                {/* Right Half - Your Application */}
                <div className="user-application-half">
                  <span>
                    <h5>Your Proposal</h5>
                    <p>{application.proposal}</p>
                  </span>
                  <span>
                    <h5>Your Skills</h5>
                    <div className="application-skills">
                      {application.freelancerSkills?.map((skill) => (
                        <p key={skill}>{skill}</p>
                      ))}
                    </div>
                  </span>
                  <h6>Proposed Budget - ₹ {application.bidAmount}</h6>
                  <h6>Status: <b>{application.status}</b></h6>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
