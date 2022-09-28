const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const User = require('./models/user')
require('dotenv/config')
const cors = require('cors')
const app = express()
app.use(cors())
const port = process.env.PORT||3000

app.use(express.json())
app.use(userRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

