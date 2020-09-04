import React from "react"
import GlobalContext from '../../context/GlobalContext'
import { isNodeFolder } from '../../utils/utils';
import { Button, Popconfirm, message, Tree } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";

const { DirectoryTree } = Tree;

export default class FileManagerComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props) {
        super(props)
        this.state = {
            treeNodes: null,
            treeState: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.context.setInitStates(this.props.rtModel)
        if(this.context.rtModel){
        this.setState({ treeNodes :  this.props.rtModel.elementAt(['tree', 'nodes']) , treeState: this.context.getTreeState() })
    }
    }

    componentWillMount() {
        this.setState({ isLoading: false })
    }

    handleNewFile = () => {
        this.context.addNewNode('file', this.state.treeState.selectedId);
    }

    handleNewFolder = () => {
        this.context.addNewNode('folder', this.state.treeState.selectedId);
    }

    handleDelete = () => {
        const id = this.context.selectedId;
        console.log(this.props.rtModel.elementAt(['tree', 'nodes']))
        if (isNodeFolder(this.props.rtModel.elementAt(['tree', 'nodes']), id)) {
            this.context.markFolderForDelete(id);
        } else {
            this.context.deleteNode(id);
        }

    }


    getFileTreeObject = (root = null) => {
        const nodes = this.props.rtModel.elementAt(['tree', 'nodes']);  // == treeNodes of convergence code
        if (!root)
            root = nodes.get("root")
        
        const childrenObj = root.get('children');
        
        let children = []

        childrenObj.forEach(child => {
            const id = child.value();
            let node = nodes.get(id);
            if (node.hasKey('children'))
                children.push(this.getFileTreeObject(node))
            // console.log(node.hasKey('children'))    
            children.push({
                title: node.get('name').value(), // Convert to string
                key: id, // Convert to string
                isLeaf: true
            })
        })

        let obj = {
            title: root.get('name').value(),
            key: root.get('name').value(),
            // Error prone Zone
            children
        }

        return obj
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
        // keys[0] reqd ID
        this.context.setSelectedId(keys[0])
        this.context.openFile(keys[0])
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

 

    render() {
        const loading = this.state.isLoading;
        const data = []
        data.push(this.getFileTreeObject())
        
        // console.log(data)
        // console.log("sID", this.context.selectedId)

        return (
            loading ?
                <div></div>
                :
                <div style={{ width: "200px", height: "600px" }} >

                    <Button type="primary"  onClick={this.handleNewFile} > Add </Button>

                    <Button type="primary" onClick={this.handleNewFolder} > New folder </Button>

                    <Popconfirm  disabled={!this.context.selectedId || this.context.selectedId==='temproom'} placement="top" title="Are you sure？"
                        icon={<QuestionCircleOutlined style={{ color: "red" }} />} onConfirm={this.handleDelete} >
                        <Button type="primary" danger disabled={!this.context.selectedId || this.context.selectedId==='temproom'} > Delete </Button>
                    </Popconfirm>

                    <DirectoryTree
                        multiple
                        defaultExpandAll
                        onSelect={this.onSelect}
                        onExpand={this.onExpand}
                        treeData={data}
                    />

                </div>
        )
    }
}

