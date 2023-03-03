import { Button, Container } from "react-bootstrap"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import React, { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebase"

export default function Find() { 
    console.log("================================================================")

    const [data, setData] = useState([]) // database

    //use getDocs just for getting data for once
    useEffect(() => {
        const fetchData = async () => {
            let list = []
            try{
                const querySnapshot = await getDocs(collection(db, "users"));
                //loop through all the users
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()})
                });
                console.log("list: ", list)
                setData(list)
            }catch(err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])
    console.log("data: ", data)

    var matchedUsers = [] // subject list
    var filteredUser = [] // cgpa filtered list

    const { currentUser } = useContext(AuthContext) // get current uid
    const current = data.filter( user => user.id === currentUser.uid) // get data through uid

    function match(){
        console.log("--------------------match() start--------------------")
        var filtered = false
        var matched = false

        for(var i=0; i<=data.length-1; i++){
            console.log("data[i]: ", data[i].id)
            console.log("current[0]: ", current[0].id)
            // for(var j=0; j<=data[i].Subject.length-1; j++){
            //     if(data[i].Subject[j] == "SEHH" // test subject code as SEHH
            //         && data[i].id !== current[0].id){ // filter out current user
            //             matchedUsers.push(data[i])
            //             matched = true
            //             console.log("matched list: ", matchedUsers, matchedUsers.length)
            //         }
            // }
        }
        if(!matched){
            console.log("no matched")
        }
        console.log("matched status:", matched) 
        if(matched){
            for(var i=0; i<=matchedUsers.length-1; i++){
                console.log("--------------------filter loop", i, "start--------------------") 
                for(var j=3; j<=30; j+=3){
                    console.log("matching user: ",matchedUsers[i].id, matchedUsers[i].CGPA)
                    if(matchedUsers[i].CGPA >= current[0].CGPA - j/10 // lower limit
                        && matchedUsers[i].CGPA <= current[0].CGPA + j/10){ // upper limit
                            filteredUser.push(matchedUsers[i])
                            filtered = true
                            console.log("filtered list: ", filteredUser)
                            break
                            }
                    console.log("match loop: ", i, "gpa range:", j/10)
                }     
                console.log("--------------------filter loop", i, "end--------------------") 
            }
        console.log("filtered status: ", filtered)
        console.log("--------------------match() end--------------------")
        }
    }

    function display(){
        console.log("--------------------display() start--------------------")
        match()
        if(filteredUser[0] != null) {
            return (
                <div>
                    <div>Full Name: {filteredUser[0].FullName}</div>
                    <div>User Name: {filteredUser[0].UserName}</div>
                    <div>ID: {filteredUser[0].StudentID}</div>
                    <div><img src={filteredUser[0].img} alt={filteredUser[0].UserName + " img prove"} style={{width: "100px", height: "100px"}}/></div>
                    <div>CGPA: {filteredUser[0].CGPA}</div>
                    {console.log("displaying filtered user")}
                    {console.log("--------------------display() end--------------------")}
                </div>
            )
        }
        else {
            return (
                <div>
                    <p align="center">No match found!</p>
                    {console.log("--------------------display() end--------------------")}
                </div>
            )
        }  
    }


    return (
        <Container className="mt-4">
            <h1 className="mb-4">Find Teammates</h1>
            <Container></Container>
            <Container className="col-xl-5 col-lg-8 col-md-10 col-12">
                <div className="row">
                    <div className="col-3">
                        <Button style={{ width: "100px", height: "500px",}} type="submit" value="reject">Reject</Button>
                    </div>
                    <div className="col-6">
                        {
                            display()
                        }
                    </div>
                    <div className="col-3">
                        <Button style={{ width: "100px", height: "500px",}} type="submit" value="accept">Accept</Button>
                    </div>
                </div>
            </Container>
        </Container>
    )
    
}