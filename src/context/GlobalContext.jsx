import React, { Component } from 'react'
import { findChildParentId, isNodeFolder, generateUUID } from '../utils/utils';
import EditorData from "../utils/editorData"


const GlobalContext = React.createContext()

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
      selectedId: null

    }
  }

  setInitStates = (rtModel) => {
    this.setState({ modelService: rtModel.session().domain().models(), collectionId: "files", username: rtModel.session().user().username, rtModel: rtModel })
  }



  dispose = () => {

    this.setState({
      editors: null,
      activeEditor: null,
      modelService: null,
      collectionId: null,
      username: null,
      rtModel: null,
      selectedId: null
    })
  }

  getStateFromContext = () => {
    return { editors: this.state.editors, activeEditor: this.state.activeEditor }
  }

  // Method to update state
  createEditor = (id, model, historical) => {
    console.log("create editor")
    const editor = new EditorData(id, this.getFileName(id), model, historical);
    let editors = this.state.editors;
    editors.push(editor);
    console.log(editors[0].title)
    this.setState({ activeEditor: editor, editors })
  }


  getFileName = (fileId) => {
    console.log(this.state.rtModel)
    return this.state.rtModel.elementAt(['tree', 'nodes', fileId]).get('name').value();
  }

  createModel = (id) => {
    return this.state.modelService.create({
      collection: this.state.collectionId,
      id,
      data: {
        content: ''
      }
    });
  }


  openModel = (modelId) => {
    return this.state.modelService.open(modelId);
  }


  //CREATE_FILE
  CreateFile = () => {
    const uuid = generateUUID()

    const nodes = this.state.rtModel.elementAt(['tree', 'nodes']);
    nodes.set(uuid, { name: "newF.js" });
    const parentFolder = this.state.rtModel.elementAt(['tree', 'nodes', "root", 'children']);
    parentFolder.push(uuid);

    return new Promise((resolve, reject) => {
      this.createModel(uuid).then(() => {
        return this.openModel(uuid);
      }).then(model => {
        this.createEditor(uuid, model, false);
        resolve()
      });
    })
  }


  isFileOpen= (id) => {
    return this.state.editors.some(editor => {
      return editor.modelId === id && editor.historical === false;
    });
  }

  openFile = (id) => {
    if (!this.isFileOpen(id)) {
      this.openModel(id).then(model => {
        this.createEditor(id, model, false);
      });
    }
  }
  
  
// -----------------Tree---------------------

  getTreeState = () => {
    return {
      selectedId: this.state.selectedId,
      newNode: this.newNode,
      folderMarkedForDeletion: this.state.folderMarkedForDeletion
    };
  }

  addNewNode = (type, nodeId) => {
    const nodes = this.getNodes();
    nodeId = nodeId || "root";
    let parentFolderId = nodeId;
    if (!isNodeFolder(nodes, nodeId)) {
      parentFolderId = findChildParentId(nodes, nodeId);
    }
    this.newNode = { type, folderId: parentFolderId };
  }

  setSelectedId= (id) => {
    console.log(id)

    this.setState({ selectedId : id })
    console.log(this.state.selectedId)
  }

  markFolderForDelete = (id) => {
    this.setState({ folderMarkedForDeletion: id })
  }

  deleteNode = (id) => {
    const nodes = this.getNodes();
    const parent = findChildParentId(nodes, id);

    // delete the parent's reference to this node 
    const parentsChildren = nodes.get(parent).get('children');
    const childIndex = parentsChildren.findIndex(childId => childId.value() === id);
    parentsChildren.remove(childIndex);

    // delete the node 
    nodes.remove(id);

    if (this.state.selectedId === id) {
      this.setState({selectedId: null})
    }
  }


  getNodes = () => {
    return this.state.rtModel.elementAt(['tree', 'nodes']);
  }

  getNode = (id) => {
    return this.state.rtModel.elementAt(['tree', 'nodes', id]);
  }


  render() {
    const { children } = this.props
    const { rtModel, editors, activeEditor, modelService, collectionId, username,selectedId } = this.state
    const { dispose, setInitStates, getNodes, getNode, getTreeState, addNewNode, markFolderForDelete, deleteNode, createEditor, CreateFile, getStateFromContext,setSelectedId, openFile } = this

    return (<GlobalContext.Provider value={
      {
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
        dispose,
        getStateFromContext,
        setInitStates,
        CreateFile,
        setSelectedId,
        openFile
      }
    } > {children} </GlobalContext.Provider>)
  }
}

export default GlobalContext

export { GlobalProvider }