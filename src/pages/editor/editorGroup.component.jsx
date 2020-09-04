import React from "react"
import GlobalContext from '../../context/GlobalContext';
import EditorTabs from './editorTabs.component'
import {Result} from 'antd'
import newFile from '../../assets/file.svg'
export default class EditorGoupComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props){
        super(props)
        this.state = {

        }

        //----------USE GLOBAL STATES---------

        // this.store = new EditorsStore(props.rtModel);
        // this.state = this.context.getStateFromContext()

        // console.log(props.rtModel)
  }

  componentDidMount() {

    // this.store.addChangeListener(this.onChange);
    this.context.setInitStates(this.props.rtModel);
  }

  componentWillUnmount() {
    // this.store.removeChangeListener(this.onChange);
    this.context.dispose();
  }

//   onChange = () => {
//     this.setState(this.context.getStateFromContext());
//   };

    render(){
      const editors = this.context.editors  
        return(
                  editors.length >0 ?
          <EditorTabs
                    editors={this.context.editors}
                    activeEditor={this.context.activeEditor}
                />
                : <Result
                title="Create or Open New File"
                icon={<img width={600} src={newFile}/>}
              />
                
                )
    }
}