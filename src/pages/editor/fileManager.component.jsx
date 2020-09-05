import React from "react"
import GlobalContext from '../../context/GlobalContext'
import { isNodeFolder } from '../../utils/utils';
import { Button, Popconfirm, message, Tree,Space } from 'antd';
import { QuestionCircleOutlined, FolderAddOutlined, FileAddOutlined,DeleteOutlined } from "@ant-design/icons";

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
        if (this.context.rtModel) {
            this.setState({ treeNodes: this.props.rtModel.elementAt(['tree', 'nodes']), treeState: this.context.getTreeState() })
        }
    }

    componentWillMount() {
        this.setState({ isLoading: false })
    }

    handleNewFile = () => {
        console.log(this.context.selectedId)
        this.context.addNewNode('file', this.context.selectedId);
    }

    handleNewFolder = () => {
        this.context.addNewNode('folder', this.context.selectedId);
    }

    handleDelete = () => {
        const id = this.context.selectedId;
        console.log(this.props.rtModel.elementAt(['tree', 'nodes']))
        if (isNodeFolder(this.props.rtModel.elementAt(['tree', 'nodes']), id)) {
            // TODO: delete & remove tab recursively
            this.context.deleteNode(id);
        } else {
            
            this.context.deleteNode(id);
            this.context.tabRemove(id)
            message.success('File Deleted !!');
        }        

    }


    getFileTreeObject = (root = null, rootId) => {
        const nodes = this.props.rtModel.elementAt(['tree', 'nodes']);  // == treeNodes of convergence code
        if (!root){
            root = nodes.get("root")
            rootId = "root"
        }

        const childrenObj = root.get('children');

        let children = []

        childrenObj.forEach(child => {
            const id = child.value();
            let node = nodes.get(id);
            if (node.hasKey('children'))
                children.push(this.getFileTreeObject(node, id))
            else   
                children.push({
                    title: node.get('name').value(), // Convert to string
                    key: id, // Convert to string
                    isLeaf: true
                })
        })

        console.log(root.keys())

        let obj = {
            title: root.get('name').value(),
            key: rootId,
            // Error prone Zone
            children
        }

        return obj
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
        // keys[0] reqd ID

        this.context.setSelectedId(keys[0])

        if((!isNodeFolder(this.props.rtModel.elementAt(['tree', 'nodes']), keys[0]))){
            this.context.openFile(keys[0])
        }
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
                <div  style={{marginTop: "1rem"}}>
                    <Space>

                        <Button size="small" icon={<FileAddOutlined/>}  type="primary" onClick={this.handleNewFile} > File </Button>

                        <Button size="small"  icon={<FolderAddOutlined/>} type="primary" onClick={this.handleNewFolder} > Folder </Button>
                        <Button size="small"  icon={<FolderAddOutlined/>} type="primary" disabled={!this.context.fileName || this.context.editors.length === 0 } onClick={this.context.runTerminal} > Run </Button>


                        <Popconfirm disabled={!this.context.selectedId || this.context.selectedId === 'temproom'} placement="top" title="Are you sure？"
                            icon={<QuestionCircleOutlined style={{ color: "red" }} />} onConfirm={this.handleDelete} >
                            <Button size="small"  icon={<DeleteOutlined />} type="primary" danger disabled={!this.context.selectedId || this.context.selectedId === 'temproom'} > Delete </Button>
                        </Popconfirm>
                    </Space>


                    <DirectoryTree
                    style={{marginTop: "1rem"}}
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

