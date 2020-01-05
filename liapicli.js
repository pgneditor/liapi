#!/usr/bin/env node

const { login, writestate, createtourney, jointourney } = require('./liapi')

let command = process.argv[2]

if(command == "init"){
    writestate()
}

if(command == "login"){
    login(process.argv[3], process.argv[4])
}

if(command == "createtourney"){
    createtourney(process.argv[3], process.argv[4])
}

if(command == "jointourney"){
    let id = process.argv[3]
    let usernameparts = process.argv[4].split(":")
    let username = usernameparts[0]
    let password = usernameparts.length > 1 ? usernameparts[1] : null    
    let teamid = process.argv[5] || null

    jointourney(id, username, password, teamid)
}
