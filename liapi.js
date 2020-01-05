const fs = require('fs')

const superagent = require('superagent')
const open = require('open')

const BASE_URL = "https://lichess.org"

const LOGIN_URL = BASE_URL + "/login?referrer=%2F"
const TOURNEY_URL = BASE_URL + "/tournament"
const CREATE_TOURNEY_URL = BASE_URL + "/tournament/new"

const STATE_PATH = "state.json"
const LOG_PATH = "log.json"

const STANDARD_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

let state

function readstate(){
    try{
        let content = fs.readFileSync(STATE_PATH)
        state = JSON.parse(content)
    }catch(err){
        console.log("no stored state could be obtained, falling back to empty state")
        state = {}
    }
    if(!state.users){
        state.users = {}
    }
    if(!state.templates){
        state.templates = {}
    }
    state.templates.default = {
        "name": "Short Bullet Tourney",
        "clockTime": "2",
        "clockIncrement": "0",
        "minutes": "45",
        "waitMinutes": "5",
        "variant": "standard",
        "rated": "true",
        "position": STANDARD_START_FEN,
        "password": "",
        "conditions.teamMember.teamId": "",
        "conditions.minRating.rating": "",
        "conditions.minRating.perf": "",
        "conditions.maxRating.rating": "",
        "conditions.maxRating.perf": "",
        "conditions.nbRatedGame.nb": "",
        "conditions.nbRatedGame.perf": "",
        "berserkable": "true",
        "startDate": "",
        "teamBattleByTeam": ""
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

function cookie(username){
    return "lila2=" + state.users[username].lila2
}

function createtourney(username, argsopt){
    let args = argsopt || {}

    if(!args.template) args.template = "default"

    let template = state.templates[args.template]

    for(let key in template){
        if(args[key]){
            template[key] = args[key]
        }
    }

    if((template.variant != "standard")||(template.position == STANDARD_START_FEN)){
        delete template.position
    }

    if(!template.teamBattleByTeam){
        delete template.teamBattleByTeam
    }

    superagent
    .post(CREATE_TOURNEY_URL)
    .redirects(0)
    .type("form")
    .send(template)        
    .set("Cookie", cookie(username))
    .end((err, res)=>{            
        log(err, res)

        let location = err.response.header.location

        if(location){
            let m = location.match(/edit\/(.*)/)

            if(m){
                let id = m[1]

                let turl = TOURNEY_URL + "/" + id

                superagent.agent()
                .post(BASE_URL + location)    
                .redirects(0)
                .type("form")
                .send({
                    "teams": template.teams,
                    "nbLeaders": template.nbLeaders || "5"
                })        
                .set("Cookie", cookie(username))
                .end((err, res)=>{            
                    log(err, res)

                    open(turl)
                })
            }else{
                open(location)
            }
        }
    })    
}

function jointourney(id, username, password, teamid){
    let turl = TOURNEY_URL + "/" + id
    let jurl = turl + "/join"

    superagent
    .post(jurl)
    .redirects(0)
    .set("Content-Type", "application/json; charset=UTF-8")
    .set("Cookie", cookie(username))
    .send({
        p: password || null,
        team: teamid || null
    })
    .end((err, res)=>{            
        log(err, res)
    })           
}

module.exports.login = login
module.exports.writestate = writestate
module.exports.createtourney = createtourney
module.exports.jointourney = jointourney
