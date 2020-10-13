import React, {useContext} from 'react'
import UserContext from '../../context/UserContext';

const TestPage = () => {

    const userContext = useContext(UserContext)

    const {projectData, domain} = userContext

    return (
        <div>

        </div>
    )
}


export default TestPage