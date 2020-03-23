const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./models/configure');
const brewery = require('./models/brewery');
const configController = require('./controllers/configure');
const brewController = require('./controllers/brew');

const app = express()
app.use(config.loadConfig)
app.use(brewery.loadBrewery)
// app.use(brewController.loadBrewery)
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/configure', configController.getConfig)
app.post('/configure', configController.postConfig)
//console.log(brewController);
app.get('/get-data', brewController.getData)
app.post('/brewery-input', brewController.breweryInput)
app.get('/', (req, res) => {
  res.send(
    [{}]
  )
})

app.listen(process.env.PORT || 8081)

process.on('SIGINT', function() {
  // closing functions here
  console.log("Exiting ...");
  app.use(brewery.close)
  process.exit();
})

process.on(2, function() {
  // closing functions here
  console.log("Exiting ...");
  app.use(brewery.close)
  process.exit();
})