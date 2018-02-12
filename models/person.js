const mongoose = require('mongoose')

const config = require('../secrets')

const url = `mongodb://${config.user}:${config.pass}@ds133558.mlab.com:33558/fullstackpuhelin`
mongoose.connect(url)



const Person = mongoose.model('Person', {
  name: String,
  number: String
})


module.exports = Person