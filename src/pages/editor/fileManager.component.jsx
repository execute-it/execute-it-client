import React from "react"

export default class FileManagerComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    getFileTreeObject = (root) => {
        const nodes = this.props.rtModel.elementAt(['tree', 'nodes']);
        let obj = {
        title: root.get('name').value(),
        key: root.value(),
        // Continue from here
        children: [
            {
            title: 'leaf 0-0',
            key: '0-0-0',
            isLeaf: true,
            },
            {
            title: 'leaf 0-1',
            key: '0-0-1',
            isLeaf: true,
            },
        ],
        }
        return obj
    }

    render(){
        return <div style={{width: "200px", height: "600px"}} />
    }
}