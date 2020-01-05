const e = React.createElement

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

/////////////////////////////////////////////////////
// widget utils
class ComponentProps_{
    constructor(objopt){
        this.obj = objopt || {}
    }

    addstyle = function(name, value){
        if(!this.obj.style) this.obj.style = {}
        this.obj.style[name] = value
    }

    w(x){this.addstyle("width", x + "px");return this}
    h(x){this.addstyle("height", x + "px");return this}
    bc(x){this.addstyle("backgroundColor", x);return this}
    mar(x){this.addstyle("margin", x + "px");return this}
    pad(x){this.addstyle("padding", x + "px");return this}
    disp(x){this.addstyle("display", x);return this}
    fd(x){this.addstyle("flexDirection", x);return this}
    ai(x){this.addstyle("alignItems", x);return this}    
    dfcc(){return this.disp("flex").fd("column").ai("center")}
    ff(x){this.addstyle("fontFamily", x);return this}
    fs(x){this.addstyle("fontSize", x + "px");return this}
    ffm(){return this.ff("monospace")}
    get _(){return this.obj}
}
function p(objopt){return new ComponentProps_(objopt)}
/////////////////////////////////////////////////////

function api(body, callback){
    fetch('/api', {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(
        (response)=>response.text().then(
            (text)=>{
                //console.log("api ok", text)
                try{                    
                    let response = JSON.parse(text)
                    callback(response)
                }catch(err){
                    console.log("parse error", err)
                    callback({ok: false, status: "Error: Could not parse response JSON."})
                }                
            },
            (err)=>{
                console.log("api error", err)
                callback({ok: false, status: "Error: API error in get response text."})
            }
        ),
        (err)=>{
            console.log("api error", err)
            callback({ok: false, status: "Error: API error in fetch."})
        }
    )
}
