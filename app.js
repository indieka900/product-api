require('dotenv').config()
//async errors
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')

const notFound = require('./middleware/not-found')
const errorhandler = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products</a>')
})

app.use('/api/v1/products', productRouter)

//products route

app.use(notFound)
app.use(errorhandler)

//port
const port = process.env.PORT || 5500

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening to port: ${port}...`))
    } catch (error) {
        
    }
}

start()