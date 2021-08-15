const express = require('express')
const bodyParser = require('body-parser')
require('./db/postgres')
const userRoute = require('./routes/user')

const app = express()
const port = 3000 || process.env.port

// Setup for express app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))
app.use(userRoute)


app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})