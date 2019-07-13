import React from 'react'

const Sidebar = (props) => {
    return (
        <div>
            <h1>Influencair logo</h1>
            <h2>Brussels . Air-Quality . Health <br /> What about that?</h2>
            <pre>{JSON.stringify(props.story, null, 2)}</pre>
            {props.scroll}
        </div>
    )
}

export default Sidebar
