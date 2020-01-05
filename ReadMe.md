# liapi - a cookie based lichess API

Automate routines that need cookie authorization.

The module can be used in three ways.

# Installation

## As a Node.js module

Needs local installation:

`npm install liapi`

Usage:

```javascript
let { login } = require('liapi')

login(username, password)
```

## As a command interpreter

Needs global installation:

`npm install liapi -g`

Usage ( at the command prompt ):

`liapicli login username password`

## As a GUI

Needs global installation:

`npm install liapi -g`

Usage ( at the command prompt ):

`liapigui`

This will open up a browser window, in which you can see the state and issue commands.

# API

## login

Logs in the user, obtains the cookie and stores it in `state.json`.

### Node.js

```javascript
let { login } = require('liapi')

login(username, password)
```

### CLI / GUI

`login username password`

## jointourney

Joins a tourney.

### Node.js

```javascript
let { jointourney } = require('liapi')

jointourney(tourneyid, username, password, teamid, callbackopt)
```

Arguments `password` ( tourney password, not user password ! ), `teamid` ( for team battles only ) and `callbackopt` ( defines a callback upon success ) are optional, use `null` to ignore them.

### CLI / GUI

`jointourney tourneyid username[:password] teamid`

Note that you have to attach an optional password to the second argument with ":". You can omit the third teamid parameter.

## createtourney

Creates a tourney. Upon success the tourney create parameters are saved in `state.json`.

Tourneys are created from a username and a template. There is always a `default` template in `state.json`. You can copy it and add it to to `state.templates` under a new id. Edit the parameters, then you can use this id for creating a custom tournament.

```javascript
{
"templates": {
    "default": {
      "name": "Short Bullet Tourney",
      "clockTime": "2",
      "clockIncrement": "0",
      "minutes": "45",
      "waitMinutes": "5",
      "variant": "standard",
      "rated": "true",
      "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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
}
```

### Node.js

```javascript
let { createtourney } = require('liapi')

createtourney(username, template)
```

Template is either a full or partial template. It itself can have a template field `template.template`, which is a string that specifies which template to use from `state.json`. Other fields then modify this original template. If omitted, the default template will be used as a basis.

### CLI / GUI

`createtourney username template`

Here template is a template key in `state.json`. The whole template will be taken from `state.json`. The template parameter is optional, if not present the default template will be used. Note that this should not be edited. To edit a template you have to create a separate template under a custom key ( other than default ).


# Editing and saving `state.json`

You can either edit the state with a text editor, or you can use the editor in the GUI, in which case to save it type:

`save`

at the GUI's command prompt. You will get a success message. If not, your JSON may very well be syntactically incorrect.