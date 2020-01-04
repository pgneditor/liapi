const fs = require('fs')

const superagent = require('superagent')

const BASE_URL = "https://lichess.org"

const LOGIN_URL = BASE_URL + "/login?referrer=%2F"

const STATE_PATH = "state.json"
const LOG_PATH = "log.json"

let state = {
    users: {        
    }
}

function readstate(){
    try{
        let content = fs.readFileSync(STATE_PATH)
        state = JSON.parse(content)
    }catch(err){
        console.log("no stored state could be obtained, falling back to empty state")
    }
}

function writestate(){
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))
}

function log(err, res){
    fs.writeFileSync(LOG_PATH, JSON.stringify({err: err, res: res}, null, 2))
}

readstate()

function login(username, password){
    superagent.agent()
    .post(LOGIN_URL)        
    .set("Referer", LOGIN_URL)                
    .type("form")
    .send({username: username, password: password})        
    .end((err, res)=>{
        log(err, res)

        let hdr = res.header

        if(!hdr["set-cookie"]){
            console.log("no set-cookie header")                
            process.exit()
        }
        
        let setcookie = hdr['set-cookie'][0]

        console.log("set-cookie", setcookie)

        let m = setcookie.match(/lila2=([^;]+);/)

        if(!m){
            console.log("no lila2 cookie")
            process.exit()
        }

        let lila2 = m[1]

        console.log("obtained cookie", lila2)

        state.users[username] = {
            lila2: lila2
        }

        writestate()
    })
}

module.exports.login = login
