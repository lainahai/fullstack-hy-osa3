const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const getId = () => {
  return Math.floor(Math.random() * 10000 + 1)
}

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]

app.get('/info', (request, response) => {
  const today = new Date()
  response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>\n
            <p>${today.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log("Deleting person with id", id)
  persons = persons.filter(person => person.id != id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  let id = getId()
  while(persons.find(person => person.id === id)){
    id = getId()
  }

  person.id = id

  console.log("Added new person ", person)

  persons = persons.concat(person)
  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})