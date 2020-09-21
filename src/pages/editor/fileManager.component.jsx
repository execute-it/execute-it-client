import React from "react";
import GlobalContext from "../../context/GlobalContext";
import { isNodeFolder } from "../../utils/utils";
import {
  Button,
  Popconfirm,
  message,
  Tree,
  Input,
  Modal,
  Row,
  Col,
} from "antd";
import {
  QuestionCircleOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  DeleteOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
const { DirectoryTree } = Tree;

export default class FileManagerComponent extends React.Component {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);
    this.state = {
      treeNodes: null,
      treeState: null,
      isLoading: true,
      newName: "",
      visibleNewFileModal: false,
      visibleNewFolderModal: false,
    };
  }

  componentDidMount() {
    this.context.setInitStates(this.props.rtModel);
    if (this.context.rtModel) {
      this.setState({
        treeNodes: this.props.rtModel.elementAt(["tree", "nodes"]),
        treeState: this.context.getTreeState(),
      });
    }
  }

  componentWillMount() {
    this.setState({ isLoading: false });
  }

  handleNewFile = () => {
    console.log(this.context.selectedId);
    this.handleCancel();
    this.context.addNewNode(
      "file",
      this.context.selectedId,
      this.state.newName
    );
    this.setState({ newName: "" });
  };

  handleNewFolder = () => {
    this.handleCancel();
    this.context.addNewNode(
      "folder",
      this.context.selectedId,
      this.state.newName
    );
    this.setState({ newName: "" });
  };

  handleDelete = () => {
    const id = this.context.selectedId;
    console.log(this.props.rtModel.elementAt(["tree", "nodes"]));
    if (isNodeFolder(this.props.rtModel.elementAt(["tree", "nodes"]), id)) {
      // TODO: delete & remove tab recursively
      this.context.deleteNode(id);
    } else {
      this.context.deleteNode(id);
      this.context.tabRemove(id);
      message.success("File Deleted !!");
    }
  };

  getFileTreeObject = (root = null, rootId) => {
    const nodes = this.props.rtModel.elementAt(["tree", "nodes"]); // == treeNodes of convergence code
    if (!root) {
      root = nodes.get("root");
      rootId = "root";
    }

    const childrenObj = root.get("children");

    let children = [];

    childrenObj.forEach((child) => {
      const id = child.value();
      let node = nodes.get(id);
      if (node.hasKey("children"))
        children.push(this.getFileTreeObject(node, id));
      else
        children.push({
          title: node.get("name").value(), // Convert to string
          key: id, // Convert to string
          isLeaf: true,
        });
    });

    console.log(root.keys());

    let obj = {
      title: root.get("name").value(),
      key: rootId,
      // Error prone Zone
      children,
    };

    return obj;
  };

  onSelect = (keys, event) => {
    console.log("Trigger Select", keys, event);
    // keys[0] reqd ID

    this.context.setSelectedId(keys[0]);
    
    if (
      !isNodeFolder(this.props.rtModel.elementAt(["tree", "nodes"]), keys[0])
    ) {
      this.context.openFile(keys[0]);
    }
  };

  onExpand = () => {
    console.log("Trigger Expand");
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visibleNewFileModal: false,
      visibleNewFolderModal: false,
    });
  };

  changeNewName = (e) => {
    this.setState({ newName: e.target.value });
  };

  render() {
    const loading = this.state.isLoading;
    const data = [];
    data.push(this.getFileTreeObject());

    // console.log(data)
    // console.log("sID", this.context.selectedId)

    return loading ? (
      <div></div>
    ) : (
      <Row align="middle" style={{ marginTop: "2rem" }}>
        <Col align="middle" xs={24}>
          <Row gutter={[4, 12]}>
            <Col lg={24} xl={8}>
              <Button
                size="small"
                icon={<FileAddOutlined />}
                type="primary"
                onClick={(_) => this.setState({ visibleNewFileModal: true })}>
                {" "}
                File{" "}
              </Button>
            </Col>
            {<Button size="small"  icon={<FolderAddOutlined/>} type="primary" onClick={_=>this.setState({visibleNewFolderModal: true})} > Folder </Button>}
            <Col lg={24} xl={8}>
              <Popconfirm
                disabled={
                  !this.context.selectedId ||
                  this.context.selectedId === "temproom"
                }
                placement="top"
                title="Are you sure？"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={this.handleDelete}>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  type="primary"
                  danger
                  disabled={
                    !this.context.selectedId ||
                    isNodeFolder(
                      this.props.rtModel.elementAt(["tree", "nodes"]),
                      this.context.selectedId
                    )
                  }>
                  {" "}
                  Delete{" "}
                </Button>
              </Popconfirm>
            </Col>
            <Col lg={24} xl={8}>
              <Button
                size="small"
                icon={<CaretRightOutlined />}
                type="primary"
                disabled={
                  !this.context.activeKey ||
                  isNodeFolder(
                    this.props.rtModel.elementAt(["tree", "nodes"]),
                    this.context.selectedId
                  )
                }
                onClick={this.context.runTerminal}>
                Run{" "}
              </Button>
            </Col>
          </Row>
        </Col>

        <Col xs={24}>
          <DirectoryTree
            style={{ marginTop: "1rem" }}
            multiple
            defaultExpandAll
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            treeData={data}
          />
        </Col>
        <Modal
          title="Create File"
          visible={this.state.visibleNewFileModal}
          onOk={this.handleNewFile}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: this.state.newName.length === 0 }}>
          <Input
            value={this.state.newName}
            onChange={this.changeNewName}
            placeholder="File Name"
          />
        </Modal>

        <Modal
          title="Create Folder"
          visible={this.state.visibleNewFolderModal}
          onOk={this.handleNewFolder}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: this.state.newName.length === 0 }}>
          <Input
            value={this.state.newName}
            onChange={this.changeNewName}
            placeholder="Folder Name"
          />
        </Modal>
      </Row>
    );
  }
}
