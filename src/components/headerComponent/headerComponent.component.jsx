import React, { useContext } from "react";
import { Space, Avatar, Typography, Row, Col } from "antd";
import logo from "../../logo.svg";
import UserContext from "../../context/UserContext";
import { Menu, Dropdown } from "antd";
import {Link, withRouter} from "react-router-dom";
import cookie from "react-cookies";
import GlobalContext from "../../context/GlobalContext";

const { Title } = Typography;

const HeaderComponent = (props) => {
  // const { isDarkMode, toggleTheme } = props;
  const globalContext = useContext(GlobalContext);
  const userContext = useContext(UserContext);

  const { user } = userContext;
//   console.log(user, "sdfdlfkdfjlskjf");

  const logout = () => {
    // console.log("logout");
    cookie.remove("jwt", { path: "/" });
    window.sessionStorage.removeItem("convergence-reconnect-token")
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
      <a href="/rooms">
        <Space size='large' align="center"  >
          <img
            width={70}
            src={logo}
            alt=""
            href="/"
          />
          <Title
            id="title"
            style={{ color: "white", fontSize: '200%', cursor: 'pointer', marginTop: '1rem' }}
            level={3}
            >{`< Execute It />`}</Title>
        </Space>
        </a>


      </Col>

      <Col xs={12}>
        <Row justify="end">
          <Col xs={24} style={{ textAlign: "right" }}>

            <Space>
              {user !== null ? (
                <Dropdown overlay={menu}>
                  <Avatar size={50} src={JSON.parse(user.displayName).image} />
                </Dropdown>
              ) : null}
              <Link
                to={{
                  pathname: "/about",

                }}
              id="aboutus">About Us</Link>



            </Space>

          </Col>
        </Row>
      </Col>

    </Row>
  );
};

export default withRouter(HeaderComponent);
