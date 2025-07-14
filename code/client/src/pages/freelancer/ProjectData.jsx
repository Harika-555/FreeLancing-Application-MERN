import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';
import { FaComments } from 'react-icons/fa';
const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const { id: projectId } = useParams();

  const freelancerId = localStorage.getItem('userId');
  const [clientId, setClientId] = useState('');
  const [project, setProject] = useState(null);

  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchChats();
    joinSocketRoom();
  }, [projectId]);

  useEffect(() => {
  if (!socket) return;

  // update messages on new chat
  socket.on('messages-updated', ({ chat }) => {
    setChats(chat?.messages || []);
  });

  // 👉 refresh project status if client assigns this project
  socket.on('project-assigned', () => {
    fetchProject(); // 👈 this will update the status to "In Progress"
  });

  return () => {
    socket.off('message-from-user', fetchChats);
    socket.off('project-assigned'); // cleanup
  };
}, [socket]);


  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-project/${projectId}`);
      setProject(res.data);
      setClientId(res.data.clientId);
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-chats/${projectId}`);
      setChats(res.data?.messages || []);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const joinSocketRoom = () => {
    socket.emit('join-chat-room', { projectId, freelancerId });
  };

  const handleMessageSend = () => {
    if (!message.trim()) return;
    socket.emit('new-message', {
      projectId,
      senderId: freelancerId,
      message,
      time: new Date(),
    });
    setMessage('');
    fetchChats();
  };

  const handleBidding = async () => {
    if (!clientId || !freelancerId || !projectId || !proposal || !bidAmount || !estimatedTime) {
      alert('⚠️ Please fill all fields before submitting your bid.');
      return;
    }

    try {
      await axios.post('http://localhost:6001/make-bid', {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount: parseInt(bidAmount),
        estimatedTime: parseInt(estimatedTime),
      });
      alert('✅ Bidding successful!');
      setProposal('');
      setBidAmount('');
      setEstimatedTime('');
      fetchProject();
    } catch (err) {
      alert('❌ Bidding failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleProjectSubmission = async () => {
    try {
      await axios.post('http://localhost:6001/submit-project', {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription,
      });
      alert('✅ Submission successful!');
      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      fetchProject();
    } catch (err) {
      alert('❌ Submission failed!');
    }
  };

  if (!project) return <p>Loading...</p>;

  const alreadyBidded = project.bids.includes(freelancerId);

  return (
    <div className="project-data-page">
      <div className="project-data-container">
        <div className="project-data">
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          <div>
            <h5>Required skills</h5>
            <div className="required-skills">
              {project.skills.map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            </div>
          </div>

          <h6>Budget: ₹ {project.budget}</h6>
        </div>

        {project.status === 'Available' && (
          <div className="project-form-body">
            <h4>Send Proposal</h4>

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Bid Amount (₹)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Estimated Time (days)"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Proposal Description"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />

            {alreadyBidded ? (
              <button className="btn btn-secondary" disabled>
                Already Bidded
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleBidding}>
                Post Bid
              </button>
            )}
          </div>
        )}

        {project.freelancerId === freelancerId && (
          <div className="project-form-body">
            <h4>Submit the Project</h4>
            {project.submissionAccepted ? (
              <p className="text-success">✅ Project marked as completed</p>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Project Link"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />

            

                <textarea
                  className="form-control mb-2"
                  placeholder="Submission Description"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                />

                {project.submission ? (
                  <button className="btn btn-secondary" disabled>
                    Already Submitted
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleProjectSubmission}>
                    Submit Project
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
{/* Floating Chat Icon */}
      <div className="chat-toggle-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        <FaComments size={22} />
      </div>

      {isChatOpen && (
        <div className="chat-pop">
          <div className="chat-head">
            <h5>Chat with Client</h5>
              <button className="btn-close" onClick={() => setIsChatOpen(false)}>×</button>
          </div>

        <div className="chat-bod">
          <div className="chat-message">
          {chats.length > 0 ? (
                chats.map((msg, idx) => (
                  <div
                    key={idx}
                    className={msg.senderId === freelancerId ? 'my-messag' : 'received-messag'}
                  >
                    <div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No messages yet.</p>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                className="form-control"
                placeholder="Enter message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleMessageSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectData;
