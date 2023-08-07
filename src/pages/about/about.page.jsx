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
                                        src={`https://media.licdn.com/dms/image/C4D03AQFj__5065xBIw/profile-displayphoto-shrink_800_800/0/1644052494109?e=1697068800&v=beta&t=8n7RcwrM85iZPVoaS2DfHtF1pPhszIPDxT7ooAt-kO8`}/>}
                        >
                            <Meta title={<Title level={3}>Pratik Daigavane</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/pratikdaigavane')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button
                                        onClick={() => this.redirectPage('https://www.linkedin.com/in/pratikdaigavane/')}
                                        icon={<LinkedinFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://pratikd.in')}
                                            icon={<GlobalOutlined/>} size='large'/>

                                </Space>
                            }/>
                        </Card> </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Card
                            hoverable
                            style={{width: 300}}
                            cover={<img alt="Prathamesh Shiralkar"
                                        src={`https://media.licdn.com/dms/image/D5603AQG35LxkqEqVUA/profile-displayphoto-shrink_800_800/0/1679129301595?e=1697068800&v=beta&t=e52EMGsSwBUWyAzBsVtKk6PbrrMI6yH5BsfEcMMLmG4`}/>}
                        >
                            <Meta title={<Title level={3}>Prathamesh Shiralkar</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/pnshiralkar')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button
                                        onClick={() => this.redirectPage('https://www.linkedin.com/in/pnshiralkar/')}
                                        icon={<LinkedinFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://prathams.dev')}
                                            icon={<GlobalOutlined/>} size='large'/>

                                </Space>
                            }/>
                        </Card> </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <Card
                            hoverable
                            style={{width: 300}}
                            cover={<img alt="Atharv Chavan"
                                        src={`https://media.licdn.com/dms/image/D4D03AQHKtPUpq0tuPQ/profile-displayphoto-shrink_800_800/0/1690999538634?e=1697068800&v=beta&t=hgzcIivi634gI8YZp2ipLeXnLofuKpPaq0q4-bNYQWs`}/>}
                        >
                            <Meta title={<Title level={3}>Atharv Chavan</Title>} description={
                                <Space>
                                    <Button onClick={() => this.redirectPage('https://github.com/AVC0706')}
                                            icon={<GithubFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://www.linkedin.com/in/avc0706/')}
                                            icon={<LinkedinFilled/>} size='large'/>
                                    <Button onClick={() => this.redirectPage('https://atharv.io')}
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