import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Form, Button, ListGroup, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { auth } from "../data/firebase"
import { AuthContext } from "../context/AuthContext"


export default function SignUp() {

    const [error, setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checked, setChecked] = useState(false)

    //navigate hooks
    const navigate = useNavigate()

    //check for terms and privacy
    const handleChecked = (event) => {
        setChecked(event.target.checked);
    }

    const { dispatch, currentUser } = useContext(AuthContext)

    //load this every time the page is loaded
    useEffect(() => {
        //if user already logged in
        if(currentUser !== null){ 
            //back to home page
            navigate("/")
        } 
    });

    const handleSignUp = (event) => {
        event.preventDefault() //prevent the page from loading

        // if (confirmPassword !== password) return error

        //we have to check for email address if match any in the DB

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            dispatch({type:"LOGIN", payload:user})
            //Back to homepage
            navigate("/")
        })
        .catch((error) => {
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }
    
    return (
        <div 
            className="d-flex justify-content-center align-items-center customHeight"
            style={{ background: "#bbb" }}
        >
        <Card style={{ width: '25rem'}}>
            <Card.Header>
                <Col>
                    <Row className="justify-content-center p-4 fs-4">Sign Up</Row>
                    <Row className="justify-content-center">
                        <form onSubmit={handleSignUp}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5">Name</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Name" autoFocus/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5">Email address</Form.Label>
                                <Form.Control name="email" onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"/>
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fs-5">Password</Form.Label>
                                <Form.Control name="password" onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="new-password"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control name="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" autoComplete="new-password"/>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex justify-content-center">
                                <Button 
                                    variant="primary" 
                                    style={{width: "100%"}}
                                    type="submit"
                                    disabled={!checked}
                                >
                                    Sign Up
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                {/* <Form.Check onChange={handleChecked} id="agree" type="checkbox"  /> */}
                                <input onChange={handleChecked} type="checkbox" id="agree" className="form-check-input me-1" />
                                <label htmlFor="agree"> I agree to the <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a></label>
                            </Form.Group>
                            {error && <Alert variant="danger">Error!{error}</Alert>}
                        </form>
                    </Row>
                </Col>
            </Card.Header>
            <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-center">
                    <Link to="/login" style={{textDecoration: "none"}}>Sign In</Link>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    </div>
    )
}
