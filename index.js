const express = require('express')
const app = express()

let notes = {
  "persons": [
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
}

app.get('/info', (req, res) => {
  const today = new Date()
  res.send(`<p>Puhelinluettelossa ${notes.persons.length} henkilön tiedot</p>\n
            <p>${today.toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})