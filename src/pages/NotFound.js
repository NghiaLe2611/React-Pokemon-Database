import { Fragment } from "react";


const NotFound = (props) => {    
    return (
        <div style={{padding: 50, backgroundColor: '#fff'}}>
            <h5 style={{textAlign: "center", fontSize: 30, marginBottom: '30px'}}>Page Not Found</h5>
            <p  style={{textAlign: "center", fontSize: 20}}>Sorry! The page you're looking for is not here.</p>
            {props.children ? props.children : null}
        </div>
    )
};

export default NotFound;