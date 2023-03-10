import React, { useState, useContext, useEffect } from 'react'
import { Card, Container, Form, Row, Col, InputGroup, Button } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../data/firebase'

const subjects = {
    BHMH: "Business and Hospitality Management",
    LCH: "Languages and Communication",
    SEHS: "Science, Engineering and Health Studies",
    SHDH: "Social Sciences, Humanities and Design",
}

export default function Profile() {

    const [error, setError] = useState()
    const [userData, setUserData] = useState({})
    const [data, setData] = useState({}) //this is the data we modify in this page
    const [checked, setChecked] = useState([])
    const [onChange, setOnChange] = useState(false)

    const { currentUser } = useContext(AuthContext)

    const docRef = doc(db, "users", currentUser.uid)

    //get current user data by their uid 
    useEffect(() => {
        //this is in realtime, when the firebase database data change, this change correspondingly
        const unsub = onSnapshot(docRef,
            (doc) => {
                console.log("Current data: ", doc.data());
                setUserData(doc.data())
            },
            (error) => {
                console.log(error)
                setError(error)
            }
        )
    }, [])

    // Add/Remove checked item from list
    const handleCheck = (e) => {
        var updatedList = [...checked];
        if (e.target.checked) {
            updatedList = [...checked, e.target.value];
        } else {
            //remove the element
            updatedList.splice(checked.indexOf(e.target.value), 1);
        }
        setChecked(updatedList);
    }

    const handleInput = (e) => {
        const id = e.target.id
        const value = e.target.value
        setData({ ...data, [id]: value })
        if (data.Password !== undefined) {
            if ((data.Password).length < 6) {
                
            }
        }
    }

    function change() {
        setOnChange(true)
    }

    function handleDone() {
        //check the password input field first
        setOnChange(false)
        //push the checked item array to data object
        setData({...data, "Subject": checked})
        //update the data in the firebase
        updateDoc(docRef, data)
            .then(docRef => {
                //prompt user for complete
                alert("Change Successfully");
            })
            .catch(error => {
                console.log(error);
            })
    }

    // console.log(data)
    // console.log(checked)
    // console.log(userData)

    return (
        <Container className="d-flex flex-column justify-content-center align-items" style={{ height: "90vh" }}>
            <Container className="d-flex justify-content-center">
                <Card style={{ width: '50rem' }}>
                    <Row className="justify-content-center p-4 fs-4">Hello There!</Row>
                    <Container className="ml-4">
                        <Form className="justify-content-center">
                            {
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6" controlId="UserName">
                                            <Form.Label className="fs-5">User Name</Form.Label>
                                            <Form.Control
                                                disabled={!onChange}
                                                type="text"
                                                defaultValue={userData.UserName || ''}
                                                required
                                                onChange={handleInput}
                                            />
                                            <Form.Control.Feedback>
                                                Looks cool!
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="Password">
                                            <Form.Label className="fs-5">Password</Form.Label>
                                            <Form.Control
                                                disabled={!onChange}
                                                type="password"
                                                defaultValue={userData.Password || ''}
                                                required
                                                onChange={handleInput}
                                                autoComplete="new-password"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Password.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                </>
                            }
                            <InputGroup className="mb-3">
                                <Col key="title">
                                    Subject Studied:
                                </Col>
                                {
                                    Object.entries(subjects).map(([key, value], index) =>
                                        <Col key={index}>
                                            <Form.Check
                                                disabled={!onChange}
                                                type="checkbox"
                                                label={key}
                                                value={key}
                                                onClick={handleCheck}
                                                defaultChecked={userData.Subject?.includes(key)}
                                            />
                                        </Col>
                                    )
                                }
                            </InputGroup>
                        </Form>
                        {error && <Alert variant="danger">Error! {error}</Alert>}
                        <div className='d-flex justify-content-end mb-3'>
                            {
                                (onChange) ? (
                                    <Button onClick={handleDone}>Save</Button>
                                ) : (
                                    <Button onClick={change}>Change</Button>
                                )
                            }
                        </div>
                    </Container>
                </Card>
            </Container>
        </Container>
    )
}
