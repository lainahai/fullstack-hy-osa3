const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')



morgan.token("body-content", (req, res) => {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body-content"))
app.use(express.static('build'))



const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/info', (request, response) => {
  const today = new Date()
  Person.find({})
    .then(persons => {
      response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>\n
                     <p>${today.toString()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
      .then(person => {
        response.json(formatPerson(person))
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log("Deleting person with id", id)
  persons = persons.filter(person => person.id != id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000 + 1)
}

app.post('/api/persons', (request, response) => {
  const newPerson = request.body

  if (newPerson.name === undefined ){
    return response.status(400).json("Error: name missing")
  }
  if (newPerson.number === undefined ){
    return response.status(400).json("Error: number missing")
  }
  if (persons.find(person => person.name === newPerson.name)){
    return response.status(400).json("Error: name must be unique")
  } 

  let id = generateId()
  while(persons.find(person => person.id === id)){
    id = generateId()
  }

  newPerson.id = id

  //console.log("Added new person ", newPerson)

  persons = persons.concat(newPerson)
  response.json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})