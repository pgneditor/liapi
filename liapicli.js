#!/usr/bin/env node

const { login, writestate, createtourney } = require('./liapi')

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
