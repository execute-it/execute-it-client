import React, { useContext } from 'react'
import { Switch, Button, Space, Avatar } from 'antd'
import logo from '../../logo.svg'
import UserContext from '../../context/UserContext';
import { Menu, Dropdown,Typography } from 'antd';
import {withRouter} from 'react-router-dom'

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">
        Logout
      </a>
    </Menu.Item>
  </Menu>
);


const HeaderComponent = ({ isDarkMode, toggleTheme,history }) => {
  const userContext = useContext(UserContext)

  const { user } = userContext
  console.log(user, 'sdfdlfkdfjlskjf')
  return (
    <Space style={{width: '100%', height:'5vh'}}>
      <img width={70} src={logo} alt="" href="/" />


      <Space size='middle' style={{marginLeft: '80vw'}}>
        <Switch checkedChildren="Dark Mode On" unCheckedChildren="Dark Mode Off" checked={isDarkMode} onChange={toggleTheme} />            

        {
          history.location.pathname !== '/login'?
            <Dropdown overlay={menu}>
            <Avatar size={50} src={user.image} />
          </Dropdown>:null          
        }

      </Space>





    </Space>
  )
}

export default withRouter(HeaderComponent)