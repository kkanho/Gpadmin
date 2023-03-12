import { useContext, useState, useEffect } from "react";
import { Alert, Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase";
import { AuthContext } from "../context/AuthContext"

export default function Login() {

    const [error, setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //navigate hooks
    const navigate = useNavigate()

    const { dispatch, currentUser } = useContext(AuthContext)

    //load this every time the page is loaded
    useEffect(() => {
        //if user already logged in
        if(currentUser !== null){ 
            //back to home page
            navigate("/")
        } 
    }, []);
    
    const handleLogin = (event) => {
        event.preventDefault() //prevent the page from loading
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user
                dispatch({type:"LOGIN", payload:user})
                //Back to homepage
                navigate("/")
                // console.log(auth)
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
            style={{background: "#ccc" }}
        >
            <Card style={{ width: '25rem' }}>
                <Card.Header>
                    <Col>
                        <Row className="justify-content-center p-4 fs-4">
                            Login
                        </Row>
                        <Row className="justify-content-center">
                            <form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fs-5">
                                        Email address
                                    </Form.Label>
                                    <Form.Control 
                                        name="email" 
                                        onChange={e => setEmail(e.target.value)} 
                                        type="email" 
                                        placeholder="Enter email" 
                                        autoFocus
                                    />
                                </Form.Group>
                                    <Form.Group className="mb-3">
                                    <Form.Label className="fs-5">
                                        Password
                                    </Form.Label>
                                    <Form.Control 
                                        name="password" 
                                        onChange={e => setPassword(e.target.value)} 
                                        type="password" 
                                        placeholder="Password" 
                                        autoComplete="on"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex justify-content-center">
                                    <Button
                                        variant="primary" 
                                        style={{width: "100%"}}
                                        type="submit"
                                    >
                                        Sign in
                                    </Button>
                                </Form.Group>
                                {error && <Alert variant="danger">Invalid Email or Password!</Alert>}
                            </form>
                        </Row>
                    </Col>
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-center">
                        <Link to="/signup" style={{textDecoration: "none"}}>Create an Account</Link>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            <Outlet />
        </div>
    )
}
