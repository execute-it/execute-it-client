import React from "react"
import EditorContext from '../../context/EditorContext';
import EditorTabs from './editorTabs.component'


export default class EditorGoupComponent extends React.Component {

    static contextType = EditorContext

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

        return( <EditorTabs
                    editors={this.context.editors}
                    activeEditor={this.context.activeEditor}
                />)
    }
}