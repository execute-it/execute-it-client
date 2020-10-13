import React from 'react'
import {Button, Card, Col, Layout, Row, Space, Typography} from 'antd';
import {GithubFilled, GlobalOutlined, LinkedinFilled} from '@ant-design/icons';
import {withRouter} from "react-router-dom";

const {Content} = Layout;
const {Meta} = Card
const {Title, Paragraph} = Typography;

class AboutUs extends React.Component {

    redirectPage = (link) => {
        window.location.href = link;
    }

    render() {
        return (
            <Content style={{margin: '5rem'}}>
                <Title level={1}>About Us</Title>

                <Paragraph style={{fontSize: "1.5rem"}}>
                    Execute It is a Real Time Code Collaboration Platform


                </Paragraph>

                <Paragraph style={{fontSize: "1.5rem"}}>
                    Currently, this project is in beta.

                </Paragraph>
                <Paragraph style={{fontSize: "1.5rem"}}>
                    If you have any feedback or suggestions feel free to reach us at executeit00@gmail.com

                </Paragraph>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Card
                            style={{width: 300}}
                            cover={<img alt="Pratik Daigavane"
                                        src={`https://media-exp1.licdn.com/dms/image/C5103AQFCIO3g3EDNxg/profile-displayphoto-shrink_400_400/0?e=1608163200&v=beta&t=90rbg0bv_16WnOZAkhXXpXcSm45OxPU7X6rf-WCXABQ`}/>}
                        >
                            <Meta title={<Title level={3}>Pratik Daigavane</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/pratikdaigavane')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button
                                        onClick={() => this.redirectPage('https://www.linkedin.com/in/pratikdaigavane/')}
                                        icon={<LinkedinFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://www.pratikdaigavane.me')}
                                            icon={<GlobalOutlined/>} size='large'/>

                                </Space>
                            }/>
                        </Card> </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Card
                            hoverable
                            style={{width: 300}}
                            cover={<img alt="Prathamesh Shiralkar"
                                        src={`https://media-exp1.licdn.com/dms/image/C5603AQFvoKbRgFLwPw/profile-displayphoto-shrink_400_400/0?e=1608163200&v=beta&t=EFQqylFsGw-Jscc9becQGZccQff-6jygmMlMpQTw4XE`}/>}
                        >
                            <Meta title={<Title level={3}>Prathamesh Shiralkar</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/pnshiralkar')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button
                                        onClick={() => this.redirectPage('https://www.linkedin.com/in/pnshiralkar/')}
                                        icon={<LinkedinFilled/>} size='large'/>

                                </Space>
                            }/>
                        </Card> </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Card
                            hoverable
                            style={{width: 300}}
                            cover={<img alt="Atharv Chavan"
                                        src={`https://media-exp1.licdn.com/dms/image/C5103AQEgw5gMzmontQ/profile-displayphoto-shrink_400_400/0?e=1608163200&v=beta&t=3z4FStraOZv_I1TfgQFna7x_dW-uS64hxvf4wsp7Dko`}/>}
                        >
                            <Meta title={<Title level={3}>Atharv Chavan</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/AVC0706')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://www.linkedin.com/in/avc0706/')}
                                            icon={<LinkedinFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://www.atharvchavan.me')}
                                            icon={<GlobalOutlined/>} size='large'/>

                                </Space>
                            }/>
                        </Card> </Col>
                </Row>

            </Content>
        )
    }
}

export default withRouter(AboutUs)