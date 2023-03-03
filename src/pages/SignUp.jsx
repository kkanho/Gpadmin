import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Col, Row, Form, Button, ListGroup, InputGroup, Alert, Container } from 'react-bootstrap'
import { auth, db, storage } from '../data/firebase'
import { AuthContext } from "../context/AuthContext"
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

//we may make a list of different school mail and let them choose in a drop table in future
const schoolMailTemp = "common.cpce-polyu.edu.hk"

export default function SignUp() {

    const [error, setError] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checked, setChecked] = useState(false)
    const [validated, setValidated] = useState(false)
    const [file, setFile] = useState("")
    const [data, setData] = useState({})
    const [uploadProgress, setUploadProgress] = useState(null)

    //navigate hooks
    const navigate = useNavigate()

    const { dispatch, currentUser } = useContext(AuthContext)

    //load this every time the page is loaded
    useEffect(() => {
        //if user already logged in
        if (currentUser !== null) {
            //back to home page
            navigate("/")
        }
    });

    //for upload a img file to the firestore 
    useEffect(() => {
        const uploadFile = () => {
            const uniqueName = new Date().getTime() + file.name
            // console.log(uniqueName)
            const storageRef = ref(storage, uniqueName)

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setUploadProgress(progress)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setData((prev) => ({ ...prev, img: downloadURL }))
                    });
                }
            );

        }
        //check if it is a png/jpeg img file

        //if there is a file, upload it
        file && uploadFile()
    }, [file])


    //handle all the input as an object using the form id
    const handleInput = (e) => {
        const id = e.target.id
        const value = e.target.value
        setData({ ...data, [id]: value })
        if(data.Password !== undefined){
            if ((data.Password).length < 6) {
            
        }}
    }
    // console.log(data)

    //check for terms and privacy
    const handleChecked = (event) => {
        setChecked(event.target.checked);
    }

    //Press the sign up button
    const handleSubmit = async(event) => {
        event.preventDefault()//prevent the page from reloading
            const form = event.currentTarget
            if (form.checkValidity() === false) {//check all the input fields, if there is any null input
                //stop the event shapely
                event.stopPropagation()
            } else {//there is no null input
                //check if the password strong enough(at least 6 characters)
                if ((data.Password).length < 6) {
                    setError("Password should be at least 6 characters")
                    return error
                }
                //check if the confirmPassword is equal to the password
                if (confirmPassword !== data.Password) {
                    setError("Password don't match!")
                    return error
                }
                //check if the GPA value valid
                console.log(parseFloat(data.CGPA))
                if (parseFloat(data.CGPA) < 0 || parseFloat(data.CGPA) > 4.3 || isNaN(parseFloat(data.CGPA))) {
                    setError("GPA value not valid!")
                    return error
                }
                //pass the data to the firebase
                console.log("trying to upload the data and create a new user")
                const passEmail = data.StudentID + "@" + schoolMailTemp
                const res = await createUserWithEmailAndPassword(
                    auth,
                    passEmail,
                    data.Password
                )
                .then((userCredential) => {
                    console.log("trying to store the user in local storage")
                    //store the user in local storage
                    const user = userCredential.user;// Signed in
                    dispatch({ type: "LOGIN", payload: user })
                    console.log("Success in Login")
                    
                    //set user information in firebase Firstore db by the uid just created
                    setDoc(doc(db, "users", userCredential.user.uid), {
                        ...data,
                        timeStamp: serverTimestamp()
                    })
                    console.log("Success in Setting document")
                    console.log("Finished")
                    //Back to homepage
                    navigate("/")
                })
                .catch((err) => {
                    console.log(err)
                    setError("UnSuccessful")
                })
            }
        setValidated(true)//now the data have been checked
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center customHeight"
            style={{ background: "#ccc" }}
        >
            <Card style={{ width: '45rem' }}>
                <Card.Header>
                    <Row className="justify-content-center p-4 fs-4">Sign Up</Row>
                    <Container className="ml-4">
                        <Form className="justify-content-center" noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className="mb-2">
                                <Form.Group as={Col} md="6" controlId="FullName">
                                    <Form.Label className="fs-5">Full Name</Form.Label>
                                    <Form.Control
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
                                            required
                                            name="studentID"
                                            onChange={handleInput}
                                            type="text"
                                            placeholder="Student ID"
                                            aria-describedby="inputGroupPrepend"
                                        />
                                        <InputGroup.Text id="inputGroupPrepend">@{schoolMailTemp}</InputGroup.Text>
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
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <input required type="checkbox" id="agree" className="form-check-input" onChange={handleChecked} style={{ marginRight: "5px" }} />
                                <label htmlFor="agree">I agree to the <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a></label>
                                <div className="invalid-feedback">You must agree before submitting.</div>
                            </Form.Group>
                            <Row className="mb-2">
                                <Col className="mb-3 d-flex justify-content-center">
                                    <Button style={{ width: "100%" }} type="submit" disabled={(uploadProgress !== null && uploadProgress < 100) || !checked}>Sign Up</Button>
                                </Col>
                            </Row>
                        </Form>
                        {error && <Alert variant="danger">Error! {error}</Alert>}
                    </Container>
                </Card.Header>

                <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-center">
                        <Link to="/login" style={{ textDecoration: "none" }}>Login here!</Link>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </div>
    )
}
