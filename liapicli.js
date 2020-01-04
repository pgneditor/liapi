#!/usr/bin/env node

const { login } = require('./liapi')

let command = process.argv[2]

if(command == "login"){
    login(process.argv[3], process.argv[4])
}
