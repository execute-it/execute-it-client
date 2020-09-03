import React from "react";
import {withRouter} from "react-router-dom";
import cookie from 'react-cookies'
import axios from 'axios'
class HomepageComponent extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.checkCookie()
    }

    checkCookie = async ()=>{
        const token = await cookie.load('jwt')

        if(token){
            //verify token
            axios.get(`${process.env.REACT_APP_MAIN_SERVER}/auth/verify`,{
                headers: {
                    'x-api-key': token
                }
            })
                .then((res)=>{
                    //if successfull then store user details in global state
                    console.log(res.data)
                })
                .catch(()=>{
                    this.props.history.push('/login')
                })
        }else{
            this.props.history.push('/login')
        }
    }

    render() {
        return(
            <h1>Home Page</h1>
        )
    }
}

export default withRouter(HomepageComponent)