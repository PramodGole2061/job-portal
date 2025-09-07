require('dotenv').config()
const connectToMongo = require('./db');
connectToMongo();
const express = require('express')
//This is necessary to allow external api to work on the website
//search 'resolve cors express' go to express website
var cors = require('cors')

// copy this part from express website
const app = express()
const port = 5000 //because react works on 3000

//This is necessary to resolve cors
app.use(cors())


// This middleware is necessary to send req.body
app.use(express.json());

// available routes
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/notes',require('./routes/notes.js'))

app.get('/', (req, res) => {
  res.send('Hello Pramod Gole!')
})

app.listen(port, () => {
  console.log(`iNoteBook is listening at http://localhost:${port}`)
})
