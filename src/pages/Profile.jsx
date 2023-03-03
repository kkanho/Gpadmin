import { TextField } from '@mui/material';
import React, { useState, useContext } from 'react'
import { Card, Container, Form, Row, Col, InputGroup } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../data/firebase'

export default function Profile() {

    const [error, setError] = useState()

    const { currentUser } = useContext(AuthContext)
    
    //get current user data by their uid
    const docRef = doc(db, "users", currentUser.uid);
    getDoc(docRef)
        .then((doc) => {
            console.log(doc.data())
        })
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // } else {
    // // doc.data() will be undefined in this case
    // console.log("No such document!");
    // }

    function handleSubmit() {

    }

    function handleInput() {

    }

    return (
        <Container className="d-flex flex-column justify-content-center align-items" style={{ height: "90vh" }}>
            <Container className="d-flex justify-content-center">
                <Card style={{ width: '50rem' }}>
                    <Row className="justify-content-center p-4 fs-4">Hello There!</Row>
                    <Container className="ml-4">
                        <Form className="justify-content-center" noValidate onSubmit={handleSubmit}>
                            <Row className="mb-2">
                                <Col>
                                    <TextField
                                        label="Full Name"
                                        type="search"
                                        //variant="standard"
                                        fullWidth
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        label="User Name"
                                        type="search"
                                        //variant="standard"
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <TextField
                                        label="Email"
                                        type="search"
                                        //variant="standard"
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <TextField
                                        label="Password"
                                        type="search"
                                        //variant="standard"
                                        fullWidth
                                    />
                                </Col>
                                <Col>
                                    <TextField
                                        label="Confirm Password"
                                        type="search"
                                        //variant="standard"
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">

                            </Row>
                        </Form>
                        {error && <Alert variant="danger">Error! {error}</Alert>}
                    </Container>
                </Card>
            </Container>
        </Container>
    )
}
