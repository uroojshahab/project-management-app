const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy database (Array)
let projects = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" }
];

// Get all projects
app.get("/api/projects", (req, res) => {
    res.json(projects);
});

// Get project count
app.get("/api/projects/count", (req, res) => {
    res.json({ total: projects.length });
});

// Add a new project
app.post("/api/projects", (req, res) => {
    const { name } = req.body;
    if (!name || name.length < 3) {
        return res.json({ status: "error", message: "Project name must be at least 3 characters" });
    }
    if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        return res.json({ status: "error", message: "Project name already exists" });
    }
    
    const newProject = { id: projects.length + 1, name };
    projects.push(newProject);
    res.json(newProject);
});

// Delete a project
app.delete("/api/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
        return res.json({ status: "error", message: "Project not found" });
    }
    
    const deletedProject = projects.splice(index, 1)[0];
    res.json(deletedProject);
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

