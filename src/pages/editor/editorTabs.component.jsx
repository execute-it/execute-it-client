import React from "react";

import {Col, Result, Row, Tabs} from "antd";

import GlobalContext from "../../context/GlobalContext";
import Editor from "./editor.component";
import newFile from "../../assets/file.svg";

const {TabPane} = Tabs;

export default class EditorTabsComponent extends React.Component {
    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [];
        this.state = {
            activeKey: null,
            panes,
            loading: true,
        };
    }

    onChange = (activeKey) => {
        this.context.setActiveKey(activeKey);
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = () => {
        this.context
            .CreateFile()
            .then(() => {
                const {panes} = this.state;
                const activeKey = `newTab${this.newTabIndex}`;

                panes.push({
                    title: this.context.editors[this.newTabIndex].title,
                    content: (
                        <Editor
                            fileName={this.context.editors[this.newTabIndex].title}
                            fileModel={this.context.editors[this.newTabIndex].model}
                            historical={this.context.editors[this.newTabIndex].historical}
                            // key={pane.key}
                        />
                    ),
                    key: activeKey,
                });
                this.newTabIndex++;

                this.setState({panes, activeKey});
            })
            .catch((e) => {
                // console.log(e);
            });
    };

    remove = (targetKey) => {
        this.context.tabRemove(targetKey);
    };

    render() {
        // console.log(
        //     this.context.editors && this.context.editors.map((pane) => pane.modelId)
        // );

        return (
            <>
                {this.props.editors.length > 0 ? (
                    <Row>
                        <Col align="middle" xs={24}>
                            <Tabs
                                hideAdd
                                onChange={this.onChange}
                                activeKey={this.context.activeKey}
                                type="editable-card"
                                onEdit={this.onEdit}>
                                {this.context.editors &&
                                this.context.editors.map((pane) => (
                                    <TabPane key={pane.modelId} tab={pane.title}>
                                        <Editor
                                            fileName={pane.title}
                                            fileModel={pane.model}
                                            historical={pane.historical}
                                            key={pane.modelId}
                                        />
                                        {/* {this.context.setTerm(pane.model, pane.title)} */}
                                    </TabPane>
                                ))}
                            </Tabs>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col align="middle" xs={24}>
                            <Result
                                title="Create or Open New File"
                                icon={<img alt="banner" width={"80%"} src={newFile}/>}
                            />
                        </Col>
                    </Row>
                )}
            </>
        );
    }
}
