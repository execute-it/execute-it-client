import React from "react";
import GlobalContext from "../../context/GlobalContext";
import "./editor.css";
import MonacoBinder from "./MonacoBinder.js"
import {Spin} from 'antd'
import Editor from '@monaco-editor/react';

import '@convergencelabs/monaco-collab-ext/css/monaco-collab-ext.css'

const fileTypes= {
        css: 'css',
        js: 'javascript',
        json: 'json',
        md: 'markdown',
        mjs: 'javascript',
        ts: 'typescript',
        py: 'python',
        c: 'cpp',
        cpp: 'cpp',
        go: 'go',
        java: 'java',
        html: 'html'
}

export default class EditorComponent extends React.Component {
    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        console.log(props);

        this.lang = fileTypes[this.props.fileName.split('.').pop()]
        console.log(this.lang)

        this.state = {
            editor: null,
            cursor: {
                row: 0,
                column: 0,
            },
            participants: []
        };
    }

    componentDidMount() {
        // this.initEditor();
    }

    componentWillUnmount() {
        if (this._participantsSubscription !== undefined) {
            this._participantsSubscription.unsubscribe();
        }
    }

    handleCursorMove = (cursor) => {
        console.log(cursor, this.state.cursor);
        this.setState({cursor: cursor});
    };

    initEditor = ()=>{
        const contentModel = this.props.fileModel.root().get("content");
        const editor = this.state.editor
       editor.getModel().setValue(contentModel.value());
        const monacoBinder = new MonacoBinder(this.state.editor,contentModel,!this.props.historical)
        monacoBinder.bind()
    }

    handleEditorDidMount = async (_, editor) => {
        await this.setState({ editor: editor })
        await this.initEditor()
    }

    render() {
        return this.props.fileModel !== undefined ? (
              <div className="editor-container">
                  <Editor
                      className="editor"
                      language={this.lang}
                      loading={<Spin size="large" />}
                      editorDidMount={this.handleEditorDidMount}
                      theme='dark'
                      options={{
                          automaticLayout: true,
                          fontSize: 16,
                      }}
                  />
              </div>

        ) : (
            <div>loading...</div>
        );
    }
}
