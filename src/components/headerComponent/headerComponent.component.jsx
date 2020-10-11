import React, { useContext } from "react";
import { Space, Avatar, Typography, Row, Col } from "antd";
import logo from "../../logo.svg";
import UserContext from "../../context/UserContext";
import { Menu, Dropdown, Switch } from "antd";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import GlobalContext from "../../context/GlobalContext";

const { Title } = Typography;

const HeaderComponent = (props) => {
  const { isDarkMode, toggleTheme } = props;
  const globalContext = useContext(GlobalContext);
  const userContext = useContext(UserContext);

  const { user } = userContext;
  console.log(user, "sdfdlfkdfjlskjf");

  const logout = () => {
    console.log("logout");
    cookie.remove("jwt", { path: "/" });
    userContext.dispose();
    globalContext.dispose();
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a href="/login" onClick={logout}>
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={12} >
        <Space size='large' align="center"  >
          <img
            width={70}
            src={logo}
            alt=""
            href="/"
          />
          <Title
            id="title"
            style={{ color: "white", fontSize: '200%', cursor: 'pointer',marginTop: '1rem' }}
            level={3}
            onClick={() => {
              props.history.push("/rooms");
            }}>{`< Execute It />`}</Title>
        </Space>


      </Col>
      {user !== null ? (
        <Col xs={12}>
          <Row justify="end">
            <Col xs={24} style={{ textAlign: "right" }}>


              <Dropdown overlay={menu}>
                <Avatar size={50} src={JSON.parse(user.displayName).image} />
              </Dropdown>

            </Col>
          </Row>
        </Col>
      ) : <Col xs={12}></Col>}
    </Row>
  );
};

export default withRouter(HeaderComponent);
