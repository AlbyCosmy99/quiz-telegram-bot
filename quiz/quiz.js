import {questions} from '../questions/questions.js'
import { Telegraf } from 'telegraf'

let points = 0;

let shuffledQuestions = []
let quizOnGoing = false;

const bot =new Telegraf('5995490548:AAG_zcPMlc6sHxkIKYs-sEpKVZiqCyNYVcI')

const NUMBER_OF_QUESTIONS = questions.length
const TEST_PASSED_PERCENTAGE = 6/10

const MY_ID = 905720014
let allowedAll = true

let index = 0

bot.hears('test', ctx => {
    ctx.reply('test eseguito con successo')
})

bot.command('disable', ctx => {
    if(ctx && ctx.message && ctx.message.chat && ctx.message.chat.id !== MY_ID) {
        ctx.reply("Non possiedi l'autorizzazione per l'utilizzo di questo comando.")
        return
    }
    allowedAll = false
    ctx.reply("Bot disabilitato per tutti gli utenti tranne l'admin (@AlbyCosmy99).")
})

bot.command('enable', ctx => {
    if(ctx && ctx.message && ctx.message.chat && ctx.message.chat.id !== MY_ID) {
        ctx.reply("Non possiedi l'autorizzazione per l'utilizzo di questo comando.")
        return
    }
    allowedAll = true
    ctx.reply("Bot abilitato per tutti gli utenti.")
})

bot.start((ctx) => {
    if(!allowedAll && ctx && ctx.message && ctx.message.chat && ctx.message.chat.id !== MY_ID) {
        ctx.reply("Attualmente non possiedi l'autorizzazione per utilizzare questo bot. Chiedi l'accesso ad Andrei (@AlbyCosmy99)")
        return
    }

    setTimeout(function func() {
        bot.telegram.sendMessage(905720014, 'tutto ok!!')
    }, 1000)

    ctx.reply('Hi ' + ctx.message.from.first_name)
    bot.telegram.getUpdates().then(res => {
    })
    console.log('Preparing the quiz for: ' + ctx.message.chat.id)
    ctx.reply("\ud83c\udf40\n")
    let message ='Welcome to my test. Good luck!\nStart when you are ready.'
    
    bot.telegram.sendMessage(ctx.chat.id, message, {
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
    quizOnGoing = true
    reset()
    nextQuestion(ctx);
})

function nextQuestion(ctx) {
    if(quizOnGoing) {
        if(index < NUMBER_OF_QUESTIONS) {
            let message = shuffledQuestions[index].question + ' (question ' + (index + 1) + '/' + NUMBER_OF_QUESTIONS + ')'
            let answers = []
    
            let incorrectAnswers = shuffledQuestions[index].incorrect_answers
            let correctAnswer = [shuffledQuestions[index].correct_answer]
            let answersStrings = incorrectAnswers.concat(correctAnswer)
            answersStrings = shuffleArray(answersStrings)

            let numAnswers = answersStrings.length

            for(const answerString of answersStrings) {
                answers.push([
                    {
                        text: answerString,
                        callback_data: answerString
                    }
                ])
    
                bot.action(answerString, ctx => {  
                    if(quizOnGoing) {
                        if(answerString === shuffledQuestions[index].correct_answer) {
                            points++
                        } 
                        index++;
                        nextQuestion(ctx)
                    }
                })
            }

            let keyboard = []
            for(let i = 0; i <numAnswers; i++) {
                keyboard.push(answers[i])
            }

            bot.telegram.sendMessage(ctx.chat.id, message, {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            })
        }
        else {
            //quiz finished
            showResults(ctx)
        }
    }
}
  
function showResults(ctx) {
    ctx.reply('Points: ' + points +'\n')

    let message;

    if ((points/NUMBER_OF_QUESTIONS) >= TEST_PASSED_PERCENTAGE) {
        ctx.reply('\ud83d\udc4f')
        message = 'You passed the test. Congratulations!'

        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text:'Celebrate!',
                            callback_data: 'celebrate'
                        }
                    ],
                    [
                        {
                            text:'Try again',
                            callback_data: 'start'
                        }
                    ]
                ]
            }
        });
    }
    else {
        ctx.reply('\ud83e\udd72')
        message = "I'm sorry! You didn't pass the test."
        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text:'Try again.',
                            callback_data: 'start'
                        }
                    ]
                ]
            }
        });
        
    }
    
    quizOnGoing = false
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function reset() {
    points = 0;
    index = 0;
    shuffledQuestions = shuffleArray(questions)
}

bot.action('celebrate', ctx => {
    ctx.reply('\ud83c\udf89')
})

bot.launch()