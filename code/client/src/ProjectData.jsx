import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ProjectData = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:6001/fetch-project/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p><strong>Budget:</strong> ${project.budget}</p>
      <p><strong>Skills:</strong> {project.skills.join(', ')}</p>
    </div>
  );
};

export default ProjectData;
