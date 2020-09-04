import React, { useContext } from 'react'
import { Switch, Button, Space, Avatar } from 'antd'
import logo from '../../logo.svg'
import UserContext from '../../context/UserContext';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">
        Logout
      </a>
    </Menu.Item> 
  </Menu>
);


const HeaderComponent = ({ isDarkMode, toggleTheme }) => {
    const userContext = useContext(UserContext)

    const { user } = userContext
    console.log(user,'sdfdlfkdfjlskjf')
    return (
        <Space>
            <img width={70} src={logo} alt="" />

            <Button>sdffsdf</Button>
            <Button>sdffsdf</Button>

            <Button>sdffsdf</Button>

            <Button>sdffsdf</Button>

            <Switch checked={isDarkMode} onChange={toggleTheme} />
            <Dropdown overlay={menu}>

            <Avatar size={50} src={user.image} />
            </Dropdown>

            {/* 
        <DarkModeToggle
            onChange={toggleTheme}
            checked={isDarkMode}
            size={80}
        /> */}
        </Space>
    )
}

export default HeaderComponent