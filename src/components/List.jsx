import React, { useState, useEffect } from 'react'
import { Card, Container } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebase"

export default function List() {

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let list = []
            try{
                const querySnapshot = await getDocs(collection(db, "users"));
                //loop through all the users
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()})
                });
                // console.log(list)
                setData(list)
            }catch(err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])
    // console.log(data)

    return (
        <div className='list'>
            <br />
            <Container className="d-flex gap-3">
                {data.map(user =>(
                    <Card className="mb-4">
                        <div>Full Name: {user.FullName}</div>
                        <div>User Name: {user.UserName}</div>
                        <div>ID: {user.StudentID}</div>
                        <div><img src={user.img} alt={user.UserName + " img prove"} style={{width: "100px", height: "100px"}}/></div>
                        <div>CGPA: {user.CGPA}</div>
                    </Card>
                ))}
            </Container>
        </div>
    )
}
