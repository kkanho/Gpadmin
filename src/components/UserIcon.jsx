import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';


export default function UserIcon() {

    const { currentUser } = useContext(AuthContext)

    return (
            <div style={{ 
                height:"40px", 
                width:"40px", 
                borderRadius:"50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            }}>
                {
                    (currentUser !== null)? (//if user have a img uploaded, use it
                        <img src="https://picsum.photos/1200?random=1" alt="" style={{width:"100%", height:"100%"}} />
                    ) : (
                        <FaUser color='black'/>
                    )
                }
            </div>
    )
}
