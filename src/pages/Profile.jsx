import React, { useState } from 'react'
import { Card, Container, Form, Row, Col, InputGroup } from 'react-bootstrap'

export default function Profile() {

    const [error, setError] = useState()

    function handleSubmit(){

    }

    function handleInput(){
        
    }
    
    return (
        <Container className="d-flex flex-column justify-content-center align-items" style={{ height: "90vh" }}>
            <Container className="d-flex justify-content-center">
            <Card style={{ width: '50rem'}}>
                <Row className="justify-content-center p-4 fs-4">Hello There!</Row>
                <Container className="ml-4">
                    <Form className="justify-content-center" noValidate onSubmit={handleSubmit}>
                        <Row className="mb-2">
                            <Form.Group as={Col} md="6" controlId="FullName">
                                <Form.Label className="fs-5">Full Name</Form.Label>
                                <Form.Control
                                    disabled
                                    required
                                    type="text"
                                    placeholder="Enter your full name here"
                                    onChange={handleInput}
                                />
                                <Form.Control.Feedback>Looks cool!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="UserName">
                                <Form.Label className="fs-5">User Name</Form.Label>
                                <Form.Control
                                    disabled
                                    type="text"
                                    placeholder="UserName"
                                    required
                                    onChange={handleInput}
                                />
                                <Form.Control.Feedback>
                                    Looks cool!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col} md="12" controlId="StudentID">
                                <Form.Label className="fs-5">Student Email</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        disabled
                                        required
                                        name="studentID"
                                        onChange={handleInput}
                                        type="text"
                                        placeholder="Student ID"
                                        aria-describedby="inputGroupPrepend"
                                    />
                                    {/* <InputGroup.Text id="inputGroupPrepend">@{schoolMailTemp}</InputGroup.Text> */}
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid Student Email
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col} md="6" controlId="Password">
                                <Form.Label className="fs-5">Password</Form.Label>
                                <Form.Control
                                    disabled
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={handleInput}
                                    autoComplete="new-password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid Password.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="confirmPassword">
                                <Form.Label className="fs-5">Confirm Password</Form.Label>
                                <Form.Control
                                    disabled
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col} md="4" controlId="CGPA">
                                <Form.Label className="fs-5">CGPA</Form.Label>
                                <Form.Control
                                    disabled
                                    type="text"
                                    placeholder="e.g.3.66"
                                    required
                                    onChange={handleInput}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter a CGPA.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="8" className="position-relative mb-3">
                                <Form.Label className="fs-5">Image Prove</Form.Label>
                                <Form.Control
                                    disabled
                                    id="file"
                                    type="file"
                                    required
                                    name="file"
                                    accept="image/*"//accept image type file only
                                    onChange={(e) => {setFile(e.target.files[0]);}}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please send us a copy of your transcript to confirm your GPA
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                    {error && <Alert variant="danger">Error! {error}</Alert>}
                </Container>
            </Card>
            </Container>
        </Container>
    )
}
