import express from 'express';
import { database } from './database.js';
import cors from "cors";

const app = express();
const port = 5001;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/bog/users', (req, res) => {
    res.json(database).status(200);
});


app.get('/api/bog/users/:id', (req, res) => {
    const user = database.filter((user) => user.id === req.params.id)[0]
    res.json(user).status(200)
});

app.post('/api/bog/users', (req, res) => {
  const newUser = req.body;
  newUser.id = `${Date.now()}`; // Generate a unique ID based on current time
  database.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/bog/users/:id', (req, res) => {
  const id = req.params.id;
  const index = database.findIndex(user => user.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  database[index] = { ...database[index], ...req.body };
  res.status(200).json(database[index]);
});

app.delete('/api/bog/users/:id', (req, res) => {
  const id = req.params.id;
  const index = database.findIndex(user => user.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  database.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
