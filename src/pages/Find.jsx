import { Button, Card, Container } from "react-bootstrap"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import React, { useState, useEffect } from 'react'
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../data/firebase"


export default function Find() {

    const [filteredUser, setFilteredUser] = useState([]) // cgpa filtered list
    const [acceptList, setAcceptList] = useState([]) // cgpa filtered list
    const [rejectList, setRejectList] = useState([]) // cgpa filtered list
    const [userDisplaying, setUserDisplaying] = useState(0) // the index of user currently displaying

    const { currentUser } = useContext(AuthContext) // get current uid

    //use getDocs just for getting all the data(including current user) for once
    useEffect(() => {
        const fetchData = async () => {
            let users = []
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                //loop through all the users
                querySnapshot.forEach((doc) => {
                    users.push({ id: doc.id, ...doc.data() })
                });
                console.log(users)
                //get current user data by their uid
                const docRef = doc(db, "users", currentUser.uid);
                getDoc(docRef)
                    .then((doc) => {
                        const currentUserWithInfo = doc.data()
                        // console.log(doc.data())
                        return currentUserWithInfo
                    })
                    //start filter the user
                    .then((currentUserWithInfo) => {
                        setFilteredUser(users
                            .filter((user) => { 
                                return (user.id !== currentUser.uid) && //remove the currentUser form the data
                                    (user.CGPA <= currentUserWithInfo.CGPA + 0.8) && //remove user data that exceed the range
                                    (user.CGPA >= currentUserWithInfo.CGPA - 0.8)
                            })
                        )
                    })
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])
    console.log("Filtered Data: ", filteredUser)

    function displayNextUser() {
        setUserDisplaying(prev => prev + 1)
        if(userDisplaying > filteredUser.length) {
            //if no more matching users
            console.log(acceptList)
            console.log(rejectList)
        }
    }

    function handleAccept() {
        //store it in the accept list

        displayNextUser()
    }

    function handleReject() {
        //store it in the reject list

        displayNextUser()
    }




    // var matchedUsers = [] // subject list
    // console.log(currentUser)
    // const current = data.filter( user => user.id === currentUser.uid) // get data through uid
    // function match(){
    //     console.log("--------------------match() start--------------------")
    //     var filtered = false
    //     var matched = false

    //     for(var i=0; i<=data.length-1; i++){
    //         console.log("data["+i+"] id: ", data[i].id)
    //         console.log("data["+i+"]: ", data[i])
    //         // console.log("current[0]: ", current[0].id)
    //         // for(var j=0; j<=data[i].Subject.length-1; j++){
    //         //     if(data[i].Subject[j] == "SEHH" // test subject code as SEHH
    //         //         && data[i].id !== current[0].id){ // filter out current user
    //         //             matchedUsers.push(data[i])
    //         //             matched = true
    //         //             console.log("matched list: ", matchedUsers, matchedUsers.length)
    //         //         }
    //         // }
    //     }
    //     data.forEach(item => (
    //         (item.id === current.id)? (
    //             matched = false
    //         ) : (
    //             matchedUsers.push(item.id),
    //             matched = true
    //         )
    //     ))
    //     if(!matched){
    //         console.log("no matched")
    //     }
    //     console.log("matched status:", matched) 
    //     if(matched){
    //         for(var i=0; i<=matchedUsers.length-1; i++){
    //             console.log("--------------------filter loop", i, "start--------------------") 
    //             for(var j=3; j<=30; j+=3){
    //                 console.log("matching user: ",matchedUsers[i].id, matchedUsers[i].CGPA)
    //                 if(matchedUsers[i].CGPA >= current[0].CGPA - j/10 // lower limit
    //                     && matchedUsers[i].CGPA <= current[0].CGPA + j/10){ // upper limit
    //                         filteredUser.push(matchedUsers[i])
    //                         filtered = true
    //                         console.log("filtered list: ", filteredUser)
    //                         break
    //                         }
    //                 console.log("match loop: ", i, "gpa range:", j/10)
    //             }     
    //             console.log("--------------------filter loop", i, "end--------------------") 
    //         }
    //     console.log("filtered status: ", filtered)
    //     console.log("--------------------match() end--------------------")
    //     }
    // }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Find Teammates</h1>
            <Container></Container>
            <Container className="col-xl-5 col-lg-8 col-md-10 col-12">
                <div className="row">
                    <div className="col-3">
                        <Button style={{ width: "100px", height: "500px", }} type="submit" value="reject" variant="danger" onClick={handleReject}>Reject</Button>
                    </div>
                    <div className="col-6">
                        {
                            (filteredUser != null) ? (
                                filteredUser && filteredUser.filter((user, index) => index === userDisplaying).map(user =>(
                                    <Card className="mb-4" key={user.id}>
                                        <div>Full Name: {user.FullName}</div>
                                        <div>User Name: {user.UserName}</div>
                                        <div>ID: {user.StudentID}</div>
                                        <div><img src={user.img} alt={user.UserName + " img prove"} style={{width: "100px", height: "100px"}}/></div>
                                        <div>CGPA: {user.CGPA} </div>
                                    </Card>
                                ))
                            ) : (
                                <div>
                                    <p align="center">No match found!</p>
                                </div>
                            )
                        }
                    </div>
                    <div className="col-3">
                        <Button style={{ width: "100px", height: "500px", }} type="submit" value="accept" onClick={handleAccept}>Accept</Button>
                    </div>
                </div>
            </Container>
        </Container>
    )

}