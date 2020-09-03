import React, {useContext} from 'react'
import UserContext from '../../context/UserContext';
import ChatComponent from '../../components/chatComponent/chat.component'

const TestPage = ()=>{

    const userContext = useContext(UserContext)

    const {projectData, domain} = userContext

    return(
        <div>
            <ChatComponent projectData={projectData} domain={domain}/>
        </div>
    )
}


export default TestPage