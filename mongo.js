const mongoose = require('mongoose')

const config = require('./secrets')


// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = `mongodb://${config.user}:${config.pass}@ds133558.mlab.com:33558/fullstackpuhelin`
mongoose.connect(url)

const generateId = () => {
  return Math.floor(Math.random() * 10000 + 1)
}

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

const name = process.argv[2]
const number = process.argv[3]

if (name && number){
  const person = new Person({
    name: name,
    number: number,
    id: generateId()
  })

  person
    .save()
      .then(response => {
        console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)
        mongoose.connection.close()
      })
}

const printPerson = (person) => console.log(person.name, person.number)

if(!name) {
  console.log("Puhelinluettelo:")
  Person.find({})
    .then(persons => {
      persons.forEach(person => printPerson(person))
      mongoose.connection.close()
    })
}


