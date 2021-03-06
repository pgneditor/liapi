# liapi - a cookie based lichess API

Automate routines that need cookie authorization.

The module can be used in three ways, as a Node.js module, as a CLI or as a GUI.

# Installation

## As a Node.js module

Needs local installation:

`npm install liapi`

Usage:

```javascript
let { login } = require('liapi')

login(username, password)
```

## As a CLI

Needs global installation:

`npm install liapi -g`

Usage ( at the command prompt ):

`liapicli login username password`

## As a GUI

Needs global installation:

`npm install liapi -g`

Usage ( at the command prompt ):

`liapigui`

This will open up a browser window, in which you can edit the state and issue commands.

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

Arguments `password` ( tourney password, not user password ! ), `teamid` ( for team battles only ) and `callbackopt` ( defines a callback upon success ) are optional ( depending on tourney type ), use `null` to ignore them. If `callbackopt` is a function it will be called after submitting the request.

### CLI / GUI

`jointourney tourneyid username[:password] teamid`

Note that you can attach a tourney(!) password to the second argument with ":" for joining a password protected tourney. The `teamid` parameter should only be used for joining a team battle.

## createtourney

Creates a tourney. Upon success the tourney create parameters are saved in `state.json`.

Tourneys are created from a username and a template. There is always a `default` template in `state.json`. You can copy it and add it to to `state.templates` under a new id. Edit the parameters, then you can use this id for creating a custom tournament.

For team battles the template should have a `teamBattleByTeam` field, containing the `teamid` of the team creating the team battle.

For team battles the template should also have a `teams` field. Its format is newline separated lines of text, each line describing a team in `teamid "Team name" by teamleader` format, as required in the second step of team battle creation. However it should be properly encoded as a JSON string with escapes for quotation marks and newlines.

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
    },
    "custom": {
      "name": "Short Blitz Tourney",
      "clockTime": "3",
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

Template is either a full or partial template object. It itself can have a template id field `template.template`, which is a string that specifies which template to use from `state.json` as a basis ( if `template.template` is omitted, then the default template will be used as a basis.). Other fields in `template` argument modify this original template.

Examples:

`createtourney("userfoo", {})` default template will be used

`createtourney("userfoo", {template: "custom"})` "custom" template will be used

`createtourney("userfoo", {template: "custom", waitMinutes: "10"})` "custom" template with `waitMinutes` modified to 10

In case of team battles you can use a wildcard `*` for username, in that case the username will be inferred to be the leader of the team creating the battle.

If `startDate` is `next`, the start date will be the start date of the last created tourney having a `startDate` property, plus 7 hours. If no such tourney was created, you get an error message.

Keep in mind that old tourneys are deleted from `state.json` upon startup.

### CLI / GUI

`createtourney username template`

Here `template` is a template id in `state.json`. The whole template will be taken from `state.json`. The template parameter is optional, if not present the default template will be used. Note that the default template should not be edited. To edit a template you have to create a separate template under a custom id ( other than `default` ).

# Editing and saving `state.json`

You can either edit the state with a text editor, or you can use the editor in the GUI, in which case to save it type:

`save`

at the GUI's command prompt. You will get a success message. If not, your JSON may very well be syntactically incorrect.

# Using the GUI

## Aliases

You can define an alias with:

`a aliasname=command`

then invoke the command with:

`aliasname`

To view aliases type:

`a`

To delete an alias type:

`a aliasname=`

You can always bring back the last issued command using the Up cursor key.
