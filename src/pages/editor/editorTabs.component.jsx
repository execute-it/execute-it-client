import React from "react"

import { Tabs, Button } from 'antd';

import GlobalContext from '../../context/GlobalContext';
import Editor from './editor.component'

const { TabPane } = Tabs;

export default class EditorTabsComponent extends React.Component {

  static contextType = GlobalContext

  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [];
    this.state = {
      activeKey: null,
      panes,
    };
  }

  onChange = activeKey => {
    this.context.setActiveKey(activeKey);
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {

    this.context.CreateFile().then(() => {
      const { panes } = this.state;
      const activeKey = `newTab${this.newTabIndex}`;

      panes.push({
        title: this.context.editors[this.newTabIndex].title,
        content: <Editor fileName={this.context.editors[this.newTabIndex].title}
          fileModel={this.context.editors[this.newTabIndex].model}
          historical={this.context.editors[this.newTabIndex].historical}
          // key={pane.key}
        />, key: activeKey
      });
      this.newTabIndex++;

      this.setState({ panes, activeKey });
    }).catch(e => {
      console.log(e)
    })

  };


  remove = targetKey => {
    this.context.tabRemove(targetKey)
  };




  render() {

    console.log(this.context.editors && this.context.editors.map(pane => (pane.modelId)))

    return (
      <div>
        {/* <div style={{ marginBottom: 16 }}>
              <Button onClick={this.add}>ADD</Button>
            </div> */}
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.context.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.context.editors && this.context.editors.map(pane => (
            
            <TabPane key={pane.modelId} tab={pane.title}>
              <Editor fileName={pane.title}
                fileModel={pane.model}
                historical={pane.historical}
                key={pane.modelId}
              />                
              </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }

}


