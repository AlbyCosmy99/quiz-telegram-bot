import express from 'express'
import bot from './quiz/quiz.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req,res) => {
    return res.send('Service is alive.')
})

app.listen(port, () => {
    bot.launch()
})
