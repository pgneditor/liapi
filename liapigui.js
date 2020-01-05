const express = require('express')
const open = require('open')
const fs = require('fs')

const { state, login, jointourney, TOURNEY_URL, createtourney } = require('./liapi')

const PORT = process.env.PORT || 8080

const SUCCESS = true
const ERROR = false

function IS_DEV(){
    return !(!process.env.LIAPI_DEV)
}

const app = express()

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8" />

    <title>Liapi GUI</title>

    <link rel="icon" href="/client/icon/favicon.ico" />

    <link rel="stylesheet" href="client/css/style.css?ver=1577052137991.4358" />       

    ${(IS_DEV())?
    `
        <!--<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>--!>
        <script src="client/cdn/react.development.js"></script>
        <script src="client/cdn/react-dom.development.js"></script>        
    `:`
        <!--<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>--!>
        <script src="client/cdn/react.production.min.js"></script>
        <script src="client/cdn/react-dom.production.min.js"></script>        
    `}

    <script src="client/js/utils.js?ver=1578211139281.2131"></script>

  </head>

  <body>

    <div id="root"></div>

    <script src="client/js/index.js?ver=1578214068342.458"></script>

  </body>

</html>
`))

app.use(express.static(__dirname))
app.use(express.json({limit: '100MB'}))

function apisend(res, ok, obj){
    obj.ok = ok
    res.send(JSON.stringify(obj))
}

function getstate(res, payload){
    apisend(res, SUCCESS, {state: state})
}

function cli(res, payload){
    let command = payload.command
    let commandparts = command.split(" ")
    command = commandparts[0]
    if(command == "login"){
        login(commandparts[1], commandparts[2], (response)=>{
            response.state = state
            apisend(res, response.ok, response)
        })
    }
    if(command == "jointourney"){
        let id = commandparts[1]
        let usernameparts = commandparts[2].split(":")
        let username = usernameparts[0]
        let password = usernameparts.length > 1 ? usernameparts[1] : null
        let teamid = commandparts[3] || null
        jointourney(id, username, password, teamid, (response)=>{
            apisend(res, response.ok, {turl: `${TOURNEY_URL}/${id}`, state: state})
        })
    }
    if(command == "createtourney"){        
        let username = commandparts[1]
        let args = {
            template: commandparts[2] || null
        }
        createtourney(username, args, (response)=>{
            apisend(res, response.ok, response)
        })
    }
}

app.post('/api', (req, res) => {                
    let body = req.body

    try{
        eval(`${body.topic}(res, body)`)
    }catch(err){
        console.log(err)
        apisend(res, ERROR, `${err}`)
    }
})

app.listen(PORT, () => console.log(`React Chess listening on port ${PORT}.`))

open(`http://localhost:${PORT}`)
