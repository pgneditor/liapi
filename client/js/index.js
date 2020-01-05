class App extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {            
        }
    }

    setstatetextfromobj(obj){
        document.getElementById("statetextarea").value = JSON.stringify(obj, null, 2)
        document.getElementById("statetext").focus()
    }

    getstate(){
        api({topic: "getstate"}, (response)=>{                   
            if(response.ok){
                this.setstatetextfromobj(response.state)            
            }            
        })
    }

    componentDidMount(){
        this.getstate()

        this.apitimeout = setTimeout(function(){
            window.close()
        }.bind(this), 6000)

        this.watchapitimeout = setInterval(function(){
            api({topic: "tick"}, (response)=>{
                if(response.ok){
                    clearTimeout(this.apitimeout)

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
                        this.setstatetextfromobj(response.state)            
                        if(response.turl){
                            window.open(response.turl, "_blank")
                        }
                    }
                })
            }            
        }
        if(ev.keyCode == 38){
            document.getElementById("statetext").value = this.lastcommand
        }
    }

    alert(text){
        document.getElementById("alerttext").value = text
        setTimeout(function(){
            document.getElementById("alerttext").value = ""
        }, 3000)
    }

    render(){        
        return e("div", p().dfcc().pad(5).bc("#afa")._,
            e('textarea', p({id: "statetextarea", onChange: ()=>{}}).pad(5).w(1325).h(585)._, null),
            e('div', {},
                e('input', p({id: "statetext", type: "text", onKeyDown: this.statetextkeydown.bind(this)}).ffm().mar(3).fs(18).pad(3).w(400)._, null),
                e('input', p({id: "alerttext", type: "text"}).ffm().mar(3).fs(18).pad(3).w(400).bc("#eee")._, null)
            )            
        )
    }
}

ReactDOM.render(
    e(App, {}, null),
    document.getElementById('root')
)
