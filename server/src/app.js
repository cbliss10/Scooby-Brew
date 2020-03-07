const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./models/configure');
const configController = require('./controllers/configure');

const app = express()
app.use(config.loadConfig)
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/configure', configController.getConfig)
app.post('/configure', configController.postConfig)
app.get('/', (req, res) => {
  res.send(
    [{}]
  )
})

app.listen(process.env.PORT || 8081)