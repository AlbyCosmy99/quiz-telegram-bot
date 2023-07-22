import {questions} from '../questions/questions.js'
import { Telegraf } from 'telegraf'

let points = 0;

let shuffledQuestions = []

const bot =new Telegraf('6470077174:AAGHacq_jz2X9SNOO6l8j1z4qWZ5OrzJUS0')

const NUMBER_OF_QUESTIONS = questions.length
let index = 0

bot.start((ctx) => {
    console.log(questions)
    console.log('Preparing the quiz.')
    ctx.reply("\ud83c\udf40")
    ctx.reply('Welcome to my test! Good luck.')
    
    bot.telegram.sendMessage(ctx.chat.id, 'Start when ready.', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text:'Start',
                        callback_data: 'start'
                    }
                ]
            ]
        }
    })
})

bot.action('start', ctx => {
    reset()
    nextQuestion(ctx);
})

function nextQuestion(ctx) {
    if(index < NUMBER_OF_QUESTIONS) {
        let message = shuffledQuestions[index].question + ' (question ' + (index + 1) + '/' + NUMBER_OF_QUESTIONS + ')'

        let answers = []

        let answersStrings = shuffledQuestions[index].incorrect_answers
        answersStrings.push(shuffledQuestions[index].correct_answer)
        answersStrings = shuffleArray(answersStrings)


        for(const answerString of answersStrings) {
            answers.push({
                text: answerString,
                callback_data: answerString
            })

            bot.action(answerString, ctx => {  
                if(answerString === shuffledQuestions[index].correct_answer) {
                    points++
                } 
                index++;
                nextQuestion(ctx)
            })
        }

        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    answers
                ]
            }
        })
    }
    else {
        //quiz finished
        showResults(ctx)
    }
}
  
function showResults(ctx) {
    ctx.reply('Points: ' + points)
}

// bot.on('text',async ctx => {
//     let text = ctx.update.message.text
//     await ctx.reply(text)
//     ctx.replyWithPhoto({ source: 'jIyQj5y.png' }, { caption: "cat photo" })
// })

// bot.on('photo',async ctx => {
//     ctx.replyWithPhoto({ source: 'jIyQj5y.png' }, { caption: "cat photo" })
// })

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function reset(ctx) {
    points = 0;
    index = 0;
    shuffledQuestions = shuffleArray(questions)
}

bot.launch()