const express = require('express')
const open = require('open')

const PORT = process.env.PORT || 8080

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

    <script src="client/js/utils.js?ver=1578207272576.1743"></script>

  </head>

  <body>

    <div id="root"></div>

    <script src="client/js/index.js?ver=1578207420440.8667"></script>

  </body>

</html>
`))

app.use(express.static(__dirname))
app.use(express.json({limit: '100MB'}))

app.listen(PORT, () => console.log(`React Chess listening on port ${PORT}.`))

open(`http://localhost:${PORT}`)
