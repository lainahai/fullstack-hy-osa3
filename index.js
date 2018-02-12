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
    .catch(error => {
      console.log(error)
      // ...
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
  })
    .catch(error => {
      console.log(error)
      // ...
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
      .then(person => {
        if (person){
          response.json(formatPerson(person))
        } else {
          response.status(404).end()
        }
    })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => {
        response.status(400).send({ error: 'malformatted id' })
      })
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body

  if (newPerson.name === undefined ){
    return response.status(400).json("Error: name missing")
  }
  if (newPerson.number === undefined ){
    return response.status(400).json("Error: number missing")
  }
  /*
  if (persons.find(person => person.name === newPerson.name)){
    return response.status(400).json("Error: name must be unique")
  } 
§ */

  const person = new Person(newPerson)
  
  person
    .save()
      .then(result => {
        response.json(formatPerson(result))
      })
      .catch(error => {
        console.log(error)
        // ...
      })
  })

  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        response.json(formatPerson(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})