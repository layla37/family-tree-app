require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const Person = require('./models/person');
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/', (req, res) => {
	res.send('Hello, welcome!');
});

app.get('/api/people', (req, res) => {
  Person.find({}).then(people => {
    res.json(people);
  });
});

app.get('/api/people/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person);
  });
});

app.post('/api/people', (req, res) => {
  const { body } = req;

  if (!body.name) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const person = new Person({
    name: body.name,
    parents: body.parents || [],
    partners: body.partner || [],
    children: body.children || [],
    bio: body.bio || '',
    url: body.url || ''
  });

  person.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.put('/api/people/:id', function (req, res) {
  res.send('Got a PUT request at /user')
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

app.listen(PORT, () => console.log(`family tree app listening on port ${PORT}`));
