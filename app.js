const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// temporary dummy data (names from random name generator)
let people = [
  {
    name: 'Danielle Jones',
    id: 1,
    parents: ['Megan Brown', 'David Quinn'],
    partner: 'Christopher Guzman',
    children: ['Stephanie Taylor'],
    bio: 'TBD lolz'
  },
  {
    name: 'Christopher Guzman',
    id: 2,
    parents: ['Michael Dotson', 'Eryn Medina'],
    partner: 'Danielle Jones',
    children: ['Stephanie Taylor'],
    bio: 'blah blah'
  },
  {
    name: 'Stephanie Taylor',
    id: 3,
    parents: ['Danielle Jones', 'Christopher Guzman'],
    partner: null,
    children: null,
    bio: 'coolest person ever'
  }
];

const generateId = () => {
  const maxId = people.length > 0 
  ? Math.max(...people.map(p => p.id))
  : 0;
  return maxId + 1;
};

app.get('/', (req, res) => {
	res.send('Hello, welcome!');
});

app.get('/api/people', (req, res) => {
  res.json(people);
});

app.get('/api/people/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = people.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/people', (req, res) => {
  const { body } = req;

  if (!body.name) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const person = {
    name: body.name,
    id: generateId(),
    parents: body.parents || null,
    partner: body.partner || null,
    children: body.children || null,
    bio: body.bio || null
  };

  people = people.concat(person);
  res.json(person);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

app.listen(port, () => console.log(`family tree app listening on port ${port}`));
