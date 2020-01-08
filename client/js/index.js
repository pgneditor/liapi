class App extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {            
            statejson: {message: "Loading state ..."}
        }
    }

    setstatetextfromobj(obj){
        this.setState({statejson: obj})        
        setTimeout(function(){document.getElementById("statetext").focus()}, 0)
    }

    getstate(){
        api({topic: "getstate"}, (response)=>{                   
            if(response.ok){
                this.setstatetextfromobj(response.state)            
            }            
        })
    }

    componentDidMount(){
        setTimeout(this.getstate.bind(this), 500)

        this.apitimeout = setTimeout(function(){
            window.close()
        }.bind(this), 6000)

        this.watchapitimeout = setInterval(function(){
            api({topic: "tick"}, (response)=>{
                if(response.ok){
                    clearTimeout(this.apitimeout)

                    document.getElementById("logtextarea").value = JSON.stringify(response.log, null, 2)

                    this.apitimeout = setTimeout(function(){                        
                        window.close()
                    }.bind(this), 6000)
                }                
            })
        }.bind(this), 3000)
    }

    statetextkeydown(ev){        
        if(ev.keyCode == 13){
            let content = document.getElementById("statetext").value
            document.getElementById("statetext").value = ""
            this.lastcommand = content
            let aliases = getlocalelse("aliases", {})
            if(content == "a"){
                this.alert("aliases:\n" + Object.entries(aliases).map((entry)=> ` --> ${entry[0]} = ${entry[1]}`).join("\n"))
                return
            }
            let m = content.match(/^a ([^=]+)=(.*)/)            
            if(m){
                let alias = m[1]
                let command = m[2]                                
                if(command){
                    aliases[alias] = command
                }else{
                    delete aliases[alias]
                }
                storelocal("aliases", aliases)
                return
            }
            let fa = aliases[content]
            if(fa){
                content = fa
            }
            if(content == "save"){
                let state = JSON.parse(document.getElementById("statetextarea").value)
                api({topic: "savestate", state: state}, (response)=>{
                    if(response.ok){
                        this.setstatetextfromobj(response.state)                                    
                        this.alert("Saved state ok.")
                    }
                })
            }else{
                api({topic: "cli", command: content}, (response)=>{
                    if(response.ok){
                        if(response.state){
                            this.setstatetextfromobj(response.state)            
                        }                        
                        if(response.turl){
                            window.open(response.turl, "_blank")
                        }
                    }
                })
            }            
        }
        if(ev.keyCode == 38){
            document.getElementById("statetext").value = this.lastcommand || ""
        }
    }

    alert(text){
        let ad = document.getElementById("alertdiv")
        ad.innerHTML = text
        ad.style.display = "block"
        setTimeout(function(){
            ad.style.display = "none"
        }, 3000)
    }

    show(element){
        document.getElementById(element).scrollIntoView()
    }

    buildcreated(statejson){        
        if(!statejson.created){return null}
        let createdentries = Object.entries(statejson.created)
        return createdentries.map((entry)=>
            e('div', p({key: entry[0]}).dib()._,
                e('a', p({target: "_blank", href: entry[0]}).mar(5).fs(10)._, entry[0].match(/\/([^\/]*)$/)[1])
            )
        )
    }

    render(){        
        return e("div", p({id: "maindiv"}).dfcc().por()._,
            e('textarea', p({id: "statetextarea", value: JSON.stringify(this.state.statejson, null, 3), onChange: function(ev){this.setState({statejson: JSON.parse(ev.target.value)})}.bind(this)}).pad(5).w(1325).h(600)._, null),
            e('div', {},                
                e('input', p({id: "statetext", type: "text", onKeyDown: this.statetextkeydown.bind(this)}).ffm().mar(3).fs(18).pad(3).w(400)._, null),                
                e('input', p({type: "button", onClick: this.show.bind(this, "logtextarea"), value: "Show log"})._, null),
                e('input', p({type: "button", onClick: this.show.bind(this, "maindiv"), value: "Show state"})._, null),
                this.buildcreated(this.state.statejson),
            ),            
            e('textarea', p({id: "logtextarea", onChange: ()=>{}}).pad(5).w(1325).h(600)._, null),            
            e('pre', p({id: "alertdiv"}).poa().t(50).l(50).bc("#efe").fs(20).pad(10).disp("none")._, null)
        )
    }
}

ReactDOM.render(
    e(App, {}, null),
    document.getElementById('root')
)
