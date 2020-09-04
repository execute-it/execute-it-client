import React, { Component } from 'react'
import generateUUID from "../utils/uuid"

const TreeContext = React.createContext()

class TreeProvider extends Component {
    constructor(props){
        super(props);
        // Context state
        this.state = {
            rtModel: null
        }
    }

    setTreeInitStates = (rtModel) => {
        this.setState( { rtModel: rtModel })
    }

    dispose=()=>{

        this.setState ({
           
            rtModel: null
        })
    }

 

    render() {
        const { children } = this.props
        const {  rtModel } = this.state
        const { dispose, setTreeInitStates } = this

        return (<TreeContext.Provider value={
            {
               rtModel,
               dispose,
               setTreeInitStates
            }
        } > {children} </TreeContext.Provider>)
        }
    }

    export default TreeContext

    export { TreeProvider}