const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

/* Load data from the JSON file */
let data = [];
try {
    const filePath = path.join(__dirname, 'assets', 'files', 'items.json');
    data = JSON.parse(fs.readFileSync(filePath));
} catch (error) {
    console.error('Error reading data:', error);
}

/* API endpoint to get all entries */
app.get('/api/tasks', (req, res) => {
    res.json(data);
});

/* API endpoint to create a new entry */
app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: data.length,
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
    };
    data.push(newTask);
    saveData();
    res.json(newTask);
});

/* API endpoint to update an existing entry */
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = {
        id: taskId,
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
    };
    data[taskId] = updatedTask;
    saveData();
    res.json(updatedTask);
});

/* API endpoint to delete an existing entry */
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    if (taskId < data.length) {
        data.splice(taskId, 1);
        // Update the ids of the tasks after deletion
        for (let i = taskId; i < data.length; i++) {
            data[i].id = i;
        }
        saveData();
        res.json({ message: 'Task deleted successfully' });
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

/* Save data to the JSON file */
function saveData() {
    const filePath = path.join(__dirname, 'assets', 'files', 'items.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});