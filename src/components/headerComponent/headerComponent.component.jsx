import React, { useContext } from "react";
import { Space, Avatar, Typography } from "antd";
import logo from "../../logo.svg";
import UserContext from "../../context/UserContext";
import { Menu, Dropdown } from "antd";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import GlobalContext from "../../context/GlobalContext";

const { Title } = Typography;


const HeaderComponent = (props) => {

  // const { isDarkMode, toggleTheme} = props
  const globalContext = useContext(GlobalContext)
  const userContext = useContext(UserContext);

  const { user } = userContext;
  console.log(user, "sdfdlfkdfjlskjf");

  const logout = () => {
    console.log('logout')
    cookie.remove('jwt', { path: '/' })
    userContext.dispose()
    globalContext.dispose()
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a href="/login" onClick={logout}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Space style={{ width: "100%", height: "5vh" }}>
      <img width={70} src={logo} alt="" href="/" />

      <Space style={{ marginTop: "1rem", marginLeft: "1rem" }}>
        <Title style={{ color: "white" }} level={3} onClick={()=>{props.history.push('/rooms')}}>{`< Execute It />`}</Title>
      </Space>

      <Space size="middle" style={{ marginLeft: "70vw" }}>
        {/*<Switch*/}
        {/*  checkedChildren="Dark Mode On"*/}
        {/*  unCheckedChildren="Dark Mode Off"*/}
        {/*  checked={isDarkMode}*/}
        {/*  onChange={toggleTheme}*/}
        {/*/>*/}

        {user !== null ? (
          <Dropdown overlay={menu}>
            <Avatar size={50} src={user.image} />
          </Dropdown>
        ) : null}
      </Space>
    </Space>
  );
};

export default withRouter(HeaderComponent);
