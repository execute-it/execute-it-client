import React from "react"
import TreeContext from '../../context/TreeContext'
import EditorContext from '../../context/EditorContext'
import { isNodeFolder } from '../../utils/utils';
import { Button, Popconfirm, message, Tree } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";

const { DirectoryTree } = Tree;

export default class FileManagerComponent extends React.Component {

    static contextType = TreeContext

    constructor(props) {
        super(props)
        this.state = {
            treeNodes: null,
            treeState: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.context.setTreeInitStates(this.props.rtModel)
        this.setState({ treeNodes :  this.context.getNodes() , treeState: this.context.getTreeState() })

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

    handleDeleteFolderOk = () => {
        const id = this.props.treeState.selectedId;
        if (isNodeFolder(this.state.treeNodes, id)) {
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
            children.push({
                title: node.get('name'), // Convert to string
                key: node.value(), // Convert to string
                isLeaf: true
            })
        })

        let obj = {
            title: root.get('name').value(),
            key: root.value(),
            // Error prone Zone
            children
        }

        return obj
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    render() {
        const loading = this.state.isLoading;
        const data = this.getFileTreeObject()
        console.log(data)

        return (
            loading ?
                <div></div>
                :
                <div style={{ width: "200px", height: "600px" }} >

                    <Button type="primary" shape="circle" onClick={this.handleNewFile} > Add </Button>

                    <Button type="primary" shape="circle" onClick={this.handleNewFolder} > New folder </Button>

                    <Popconfirm placement="top" title="Are you sure？"
                        icon={<QuestionCircleOutlined style={{ color: "red" }} />} onConfirm={this.handleDelete} >
                        <Button type="primary" shape="circle" danger > Delete </Button>
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

