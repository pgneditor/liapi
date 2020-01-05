class App extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.state = {
            statetext: "Loading state ..."
        }
    }

    setstatetextfromobj(obj){
        this.setState({statetext: JSON.stringify(obj, null, 2)})
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
    }

    statetextkeydown(ev){        
        if(ev.keyCode == 13){
            let content = document.getElementById("statetext").value
            document.getElementById("statetext").value = ""
            this.lastcommand = content
            api({topic: "cli", command: content}, (response)=>{
                if(response.ok){
                    this.setstatetextfromobj(response.state)            
                    if(response.turl){
                        window.open(response.turl, "_blank")
                    }
                }
            })
        }
        if(ev.keyCode == 38){
            document.getElementById("statetext").value = this.lastcommand
        }
    }

    render(){        
        return e("div", p().dfcc().pad(5).bc("#afa")._,
            e('textarea', p({value: this.state.statetext, onChange: ()=>{}}).pad(5).w(900).h(300)._, null),
            e('input', p({id: "statetext", type: "text", onKeyDown: this.statetextkeydown.bind(this)}).ffm().mar(3).fs(18).pad(3).w(400)._, null)
        )
    }
}

ReactDOM.render(
    e(App, {}, null),
    document.getElementById('root')
)
