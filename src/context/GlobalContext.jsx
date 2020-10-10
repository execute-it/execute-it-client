import React, { Component } from "react";
import { findChildParentId, isNodeFolder, generateUUID } from "../utils/utils";
import EditorData from "../utils/editorData";

const GlobalContext = React.createContext();

class GlobalProvider extends Component {
  constructor(props) {
    super(props);
    // Context state
    this.state = {
      rtModel: null,
      folderMarkedForDeletion: null,
      editors: [],
      activeEditor: null,
      modelService: null,
      collectionId: null,
      username: null,
      selectedId: null,
      activeKey: null,
      ws: null,

      roomUrl: "",
    };
  }

  setInitStates = (rtModel) => {
    this.setState({
      modelService: rtModel.session().domain().models(),
      collectionId: "files",
      username: rtModel.session().user().username,
      rtModel: rtModel,
    });
  };

  dispose = () => {
    console.log("dispose");
    this.setState({
      editors: [],
      activeEditor: null,
      modelService: null,
      collectionId: null,
      username: null,
      rtModel: null,
      selectedId: null,
      activeKey: null,

      roomUrl: "",
      folderMarkedForDeletion: null,
    });
  };

  setWS = (ws, roomUrl) => {
    this.setState({ ws: ws, roomUrl: roomUrl });
  };

  runTerminal = () => {
    console.log(this.state);

    this.state.editors.map((editor) => {
      if (editor.modelId === this.state.selectedId) {
        const type = editor.title.split(".")[1];
        this.state.ws.send("\x03\n"); // Simulate ^C to terminate previously running command if any
        this.state.ws.send("clear\n"); // Clear Console
        setTimeout(() => {
          if (type === "py") {
            this.state.ws.send(`python3 ${editor.title}\n`);
          } else if (type === "js") {
            this.state.ws.send(`node ${editor.title}\n`);
          } else if (type === "c") {
            this.state.ws.send(`gcc ${editor.title} && ./a.out\n`);
          } else if (type === "cpp") {
            this.state.ws.send(`g++ ${editor.title} && ./a.out\n`);
          } else {
            this.state.ws.send('echo "FileNotSupported" ');
          }
        }, 400);
      }
      return editor;
    });
  };

  getStateFromContext = () => {
    return {
      editors: this.state.editors,
      activeEditor: this.state.activeEditor,
    };
  };

  // Method to update state
  createEditor = (id, model, historical) => {
    console.log("create editor");
    const editor = new EditorData(id, this.getFileName(id), model, historical);
    let editors = this.state.editors;
    editors.push(editor);
    // console.log(editors[0].modelId)
    this.setState({ activeEditor: editor, editors });
  };

  getFileName = (fileId) => {
    console.log(this.state.rtModel);
    return this.state.rtModel
      .elementAt(["tree", "nodes", fileId])
      .get("name")
      .value();
  };

  createModel = (id) => {
    return this.state.modelService.create({
      collection: this.state.collectionId,
      id,
      data: {
        content: "",
      },
    });
  };

  openModel = (modelId) => {
    return this.state.modelService.open(modelId);
  };

  //CREATE_FILE
  CreateFile = (name, parentId) => {
    const uuid = generateUUID();

    const nodes = this.state.rtModel.elementAt(["tree", "nodes"]);
    nodes.set(uuid, { name });
    const parentFolder = this.state.rtModel.elementAt([
      "tree",
      "nodes",
      parentId,
      "children",
    ]);
    parentFolder.push(uuid);

    return new Promise((resolve, reject) => {
      this.createModel(uuid)
        .then(() => {
          return this.openModel(uuid);
        })
        .then((model) => {
          this.createEditor(uuid, model, false);
          resolve({ id: uuid });
        });
    });
  };

  CreateFolder(name, parentId) {
    const newId = generateUUID();
    const nodes = this.getNodes();
    nodes.set(newId, { name: name, children: [] });
    nodes.elementAt([parentId, "children"]).push(newId);
  }

  isFileOpen = (id) => {
    return this.state.editors.some((editor) => {
      return editor.modelId === id && editor.historical === false;
    });
  };

  openFile = (id) => {
    if (!this.isFileOpen(id) && this.state.selectedId !== id) {
      console.log("this is open file");
      this.openModel(id).then((model) => {
        this.createEditor(id, model, false);
        this.setState({ activeKey: id });
      });
    }
  };

  setActiveKey = (id) => {
    this.setState({ activeKey: id, selectedId: id });
  };

  tabRemove = (id) => {
    let editors = this.state.editors;
    editors = editors.filter((editor) => editor.modelId !== id);
    this.setState({
      activeKey: editors.length > 0 ? editors[0].modelId : null,
      selectedId: editors.length > 0 ? editors[0].modelId : null,
      editors,
    });
  };

  // -----------------Tree---------------------

  getTreeState = () => {
    return {
      selectedId: this.state.selectedId,
      newNode: this.newNode,
      folderMarkedForDeletion: this.state.folderMarkedForDeletion,
    };
  };

  addNewNode = (type, nodeId, fileName) => {
    console.log("1");
    const nodes = this.getNodes();
    console.log("2");

    nodeId = nodeId || "root";
    let parentFolderId = nodeId;
    if (!isNodeFolder(nodes, nodeId)) {
      console.log("3");

      parentFolderId = findChildParentId(nodes, nodeId);
    }
    console.log("5");
    let name = fileName;
    if (type === "file") {
      this.CreateFile(name, parentFolderId).then((data) => {
        console.log(data.id);
        this.openFile(data.id);
        this.setActiveKey(data.id);
      });
    } else {
      this.CreateFolder(fileName, parentFolderId);
    }
  };

  setSelectedId = (id) => {
    if (this.state.activeKey !== id) {
      this.setState({ selectedId: id });
      this.setState({ activeKey: id });
    }
  };

  markFolderForDelete = (id) => {
    this.setState({ folderMarkedForDeletion: id });
  };

  deleteNode = (id) => {
    const nodes = this.getNodes();
    const parent = findChildParentId(nodes, id);

    // delete the parent's reference to this node
    const parentsChildren = nodes.get(parent).get("children");
    const childIndex = parentsChildren.findIndex(
      (childId) => childId.value() === id
    );
    parentsChildren.remove(childIndex);

    // delete the node
    nodes.remove(id);

    if (this.state.selectedId === id) {
      this.setState({ selectedId: null });
    }
  };

  getNodes = () => {
    return this.state.rtModel.elementAt(["tree", "nodes"]);
  };

  getNode = (id) => {
    return this.state.rtModel.elementAt(["tree", "nodes", id]);
  };

  render() {
    const { children } = this.props;
    const {
      rtModel,
      editors,
      activeEditor,
      selectedId,
      activeKey,
      ws,
      roomUrl,
    } = this.state;

    const {
      dispose,
      setInitStates,
      getNodes,
      getNode,
      getTreeState,
      addNewNode,
      markFolderForDelete,
      deleteNode,
      createEditor,
      CreateFile,
      getStateFromContext,
      setSelectedId,
      openFile,
      setActiveKey,
      tabRemove,
      setWS,
      runTerminal,
    } = this;

    return (
      <GlobalContext.Provider
        value={{
          rtModel,
          selectedId,
          dispose,
          setInitStates,
          getNodes,
          getNode,
          getTreeState,
          addNewNode,
          deleteNode,
          markFolderForDelete,
          editors,
          activeEditor,
          createEditor,
          getStateFromContext,
          CreateFile,
          setSelectedId,
          openFile,
          activeKey,
          setActiveKey,
          tabRemove,
          setWS,
          runTerminal,

          ws,
          roomUrl,
        }}>
        {" "}
        {children}{" "}
      </GlobalContext.Provider>
    );
  }
}

export default GlobalContext;

export { GlobalProvider };
