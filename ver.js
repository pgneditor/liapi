const fs = require('fs')

let server = fs.readFileSync('liapigui.js').toString()

for(let matcher of [
    [new RegExp('client\/js\/[^"]+', 'g'), new RegExp('(client\/js\/[a-zA-Z0-9\.]+)')],
    [new RegExp('client\/css\/[^"]+', 'g'), new RegExp('(client\/css\/[a-zA-Z0-9\.]+)')]
]){
    for(let wholematch of server.match(matcher[0])){
        const path = wholematch.match(matcher[1])[1]        
        const mtimeMs = fs.statSync(path).mtimeMs
        const wholereplace = path + "?ver=" + mtimeMs
        if(wholematch != wholereplace){
            console.log("versioning", path)
            server = server.replace(wholematch, wholereplace)
        }        
    }
}

fs.writeFileSync('liapigui.js', server)
