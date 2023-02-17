import React from 'react'
import { Link } from "react-router-dom";


export default function UserIcon() {
    return (
        <Link to={"/"}>
            <div style={{ 
                // height:"40px", 
                // width:"40px", 
                // borderRadius:"50%",
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                // overflow: "hidden"
            }}>
                
                {/* <img src="https://picsum.photos/1200?random=1" alt="" style={{width:"100%", height:"100%"}} /> */}
                User Profile
            </div>
        </Link>
    )
}
