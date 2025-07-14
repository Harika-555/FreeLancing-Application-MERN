import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/AllProjects.css';

const AllProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-projects');
      const data = res.data || [];

      setProjects(data);
      setDisplayProjects([...data].reverse());

      // Create unique list of all skills
      const skillSet = new Set();
      data.forEach((project) =>
        project.skills.forEach((skill) => skillSet.add(skill))
      );
      setAllSkills([...skillSet]);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSkillFilterToggle = (skill) => {
    let updatedFilters = [...filterSkills];
    if (updatedFilters.includes(skill)) {
      updatedFilters = updatedFilters.filter((s) => s !== skill);
    } else {
      updatedFilters.push(skill);
    }
    setFilterSkills(updatedFilters);
    applyFilters(updatedFilters, search);
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    applyFilters(filterSkills, keyword);
  };

  const applyFilters = (skills, keyword) => {
    let filtered = [...projects];

    if (skills.length > 0) {
      filtered = filtered.filter((project) =>
        skills.every((skill) => project.skills.includes(skill))
      );
    }

    if (keyword.trim()) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setDisplayProjects(filtered.reverse());
  };

  return (
    <div className="all-projects-page">
      <div className="project-filters">
        <h3>Filters</h3>
        <hr />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
        />

        <div className="filters">
          <h5>Skills</h5>
          <div className="filter-options">
            {allSkills.map((skill) => (
              <div className="form-check" key={skill}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={skill}
                  id={`check-${skill}`}
                  checked={filterSkills.includes(skill)}
                  onChange={() => handleSkillFilterToggle(skill)}
                />
                <label className="form-check-label" htmlFor={`check-${skill}`}>
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-list">
        <h3>All Projects</h3>
        <hr />

        {displayProjects.length === 0 ? (
          <p>No projects match your filters.</p>
        ) : (
          displayProjects.map((project) => {
            const avgBid =
              project.bidAmounts?.length > 0
                ? project.bidAmounts.reduce((a, b) => a + b, 0) / project.bidAmounts.length
                : 0;

            return (
              <div
                className="listed-project"
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="listed-project-head">
                  <h3>{project.title}</h3>
                  <p>{String(project.postedDate).slice(0, 24)}</p>
                </div>
                <h5>Budget - ₹ {project.budget}</h5>
                <p>{project.description}</p>
                <div className="skills">
                  {project.skills.map((skill) => (
                    <h6 key={skill}>{skill}</h6>
                  ))}
                </div>
                <div className="bids-data">
                  <p>{project.bids?.length || 0} bids</p>
                  <h6>₹ {Math.round(avgBid)} (avg bid)</h6>
                </div>
                <hr />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllProjects;
