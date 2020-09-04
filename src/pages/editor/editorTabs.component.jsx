import React from "react"

import { Tabs, Button } from 'antd';

import EditorContext from '../../context/EditorContext';
import Editor from './editor.component'

const { TabPane } = Tabs;

export default class EditorTabsComponent extends React.Component {

    static contextType = EditorContext

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
        this.setState({ activeKey });
      };
    
      onEdit = (targetKey, action) => {
        this[action](targetKey);
      };
    
      add = () => {

        this.context.CreateFile().then(()=>{
          const { panes } = this.state;
          const activeKey = `newTab${this.newTabIndex}`;
          
          panes.push({ title:  this.context.editors[this.newTabIndex].title ,
             content: <Editor fileName = {this.context.editors[this.newTabIndex].title}
                              fileModel = {this.context.editors[this.newTabIndex].model}
                              historical={this.context.editors[this.newTabIndex].historical}

             />, key: activeKey });
          this.newTabIndex++;
          
          this.setState({ panes, activeKey });
        }).catch(e=>{
            console.log(e)
        })
        
      };
    

      remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.setState({ panes, activeKey });
      };
      
    
   

      render() {
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={this.add}>ADD</Button>
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              {this.state.panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key}>
                  {pane.content}
                </TabPane>
              ))}
            </Tabs>
          </div>
        );
      }

    }

    
