import { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file

const API_URL = "http://localhost:5000/api/projects";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [projectCount, setProjectCount] = useState(0);

    // Fetch all projects and update count
    const refreshProjects = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setProjects(data);
            
            const countRes = await fetch(`${API_URL}/count`);
            const countData = await countRes.json();
            setProjectCount(countData.total);
        } catch (err) {
            setError("Failed to load projects.");
        }
    };

    // Add a new project
    const addProject = async () => {
        setError("");
        if (newProject.length < 3) {
            setError("Project name must be at least 3 characters.");
            return;
        }
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newProject })
            });
            setNewProject("");
            await refreshProjects();
        } catch (err) {
            setError("Error adding project.");
        }
    };

    // Delete a project
    const deleteProject = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            await refreshProjects();
        } catch (err) {
            setError("Error deleting project.");
        }
    };

    useEffect(() => {
        refreshProjects();
    }, []);

    return (
        <div className="container">
            <h1>Project Management App</h1>
            <h3>Total Projects: <span className="project-count">{projectCount}</span></h3>

            <div className="input-container">
                <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="Enter project name"
                    className="input-field"
                />
                <button onClick={addProject} className="add-btn">Add Project</button>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <ul className="project-list">
                {projects.length === 0 ? (
                    <p className="empty-text">No projects available.</p>
                ) : (
                    projects.map((project) => (
                        <li key={project.id} className="project-item">
                            <span>{project.name}</span>
                            <button onClick={() => deleteProject(project.id)} className="delete-btn">Delete</button>
                        </li>
                    ))
                )}
            </ul>

            <button onClick={refreshProjects} className="refresh-btn">Refresh Projects</button>
        </div>
    );
}

export default App;