import React, { useContext, useEffect, useState } from 'react';
import '../../styles/client/ProjectWorking.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';
import { FaComments } from 'react-icons/fa';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState(localStorage.getItem('userId'));
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchProject();
    joinSocketRoom();
    fetchChats();
  }, [projectId]);

  useEffect(() => {
    if (!socket) return;
    socket.on('messages-updated', ({ chat }) => {
    setChats(chat?.messages || []);
    });
    return () => socket.off('message-from-user', fetchChats);
  }, [socket]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-project/${projectId}`);
      setProject(res.data);
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const joinSocketRoom = () => {
    socket.emit('join-chat-room', { projectId, freelancerId: '' });
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-chats/${projectId}`);
      setChats(res.data.messages || []);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const handleMessageSend = () => {
    if (!message.trim()) return;
    socket.emit('new-message', {
      projectId,
      senderId: clientId,
      message,
      time: new Date(),
    });
    setMessage('');
    fetchChats();
  };

  const handleApproveSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/approve-submission/${projectId}`);
      fetchProject();
      alert('✅ Submission approved!');
    } catch (err) {
      console.error(err);
      alert('❌ Operation failed!');
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/reject-submission/${projectId}`);
      fetchProject();
      alert('❌ Submission rejected!');
    } catch (err) {
      console.error(err);
      alert('❌ Operation failed!');
    }
  };

  if (!project) return <p>Loading project...</p>;

  return (
    <div className="project-data-page">
      {/* Project Details */}
      <div className="project-data-container">
        <div className="project-data">
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          <span>
            <h5>Required skills</h5>
            <div className="required-skills">
              {project.skills.map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            </div>
          </span>

          <span>
            <h5>Budget</h5>
            <h6>₹ {project.budget}</h6>
          </span>
        </div>

        {/* Submission */}
        {project.freelancerId && (
          <div className="project-submissions-container">
            <h4>Submission</h4>
            <div className="project-submissions">
              {project.submission ? (
                <div className="project-submission">
                  <span>
                    <h5>Project Link:</h5>
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                      {project.projectLink}
                    </a>
                  </span>


                  <h5>Description for work</h5>
                  <p>{project.submissionDescription}</p>

                  {project.submissionAccepted ? (
                    <h5 style={{ color: 'green' }}>Project completed ✅</h5>
                  ) : (
                    <div className="submission-btns">
                      <button className="btn btn-success" onClick={handleApproveSubmission}>
                        Approve
                      </button>
                      <button className="btn btn-danger" onClick={handleRejectSubmission}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p>No submissions yet!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Icon */}
      <div className="chat-toggle-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        <FaComments size={22} />
      </div>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h5>Chat with Freelancer</h5>
            <button className="btn-close" onClick={() => setIsChatOpen(false)}>×</button>
          </div>

          <div className="chat-body">
            <div className="chat-messages">
              {chats.length > 0 ? (
                chats.map((msg, idx) => (
                  <div
                    key={idx}
                    className={msg.senderId === clientId ? 'my-message' : 'received-message'}
                  >
                    <div>
                      <p>{msg.text}</p>
                      {/* <h6>
                        {msg.time?.slice(5, 10)} - {msg.time?.slice(11, 19)}
                      </h6> */}
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

export default ProjectWorking;
