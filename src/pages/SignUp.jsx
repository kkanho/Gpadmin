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
    const [fullNameValid, setFullNameValid] = useState()
    const [userNameValid, setUserNameValid] = useState()
    const [studentIdValid, setStudentIdValid] = useState()
    const [passwordValid, setPasswordValid] = useState()
    const [confirmPasswordValid, setConfirmPasswordValid] = useState()
    const [cgpaValid, setCgpaValid] = useState()
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
    }
    console.log(data)

    function onlyLettersAndNumbers(str) {//RegExp 
        return /^[A-Za-z0-9]*$/.test(str);
    }

    function onlyLettersAndSpace(str) {//RegExp 
        return (
            /^[A-Za-z0-9\s]*$/.test(str) //number shouldn't appear in the full name, but we let go this case
            // /[A-Za-z]/.test(str) &&
            // /\s/.test(str)
        )
    }


    //whenever data change, do some checking (for prompt purposes only)
    useEffect(()=>{
        //valid check for prompt
        if( !data.FullName || onlyLettersAndSpace(data.FullName) ){//full name checking
            setFullNameValid(true)
        } else {
            setFullNameValid(false)
        }
        if( !data.UserName || onlyLettersAndNumbers(data.UserName) ){//user name checking
            setUserNameValid(true)
        } else {
            setUserNameValid(false)
        }
        if( !data.StudentID || onlyLettersAndNumbers(data.StudentID) ){//Student ID checking
            setStudentIdValid(true)
        } else {
            setStudentIdValid(false)
        }
        if( !data.Password || (data.Password).length >= 6 ){//password checking
            setPasswordValid(true)
        } else {
            setPasswordValid(false)
        }
        if( !data.CGPA || (data.CGPA).length <= 4 &&
            !(
                parseFloat(data.CGPA) < 0 || 
                parseFloat(data.CGPA) > 4.3 || 
                isNaN(parseFloat(data.CGPA))
            )
        ){//cgpa checking
            setCgpaValid(true)
        } else {
            setCgpaValid(false)
        }

    }, [data])
    
    //whenever confirm password change
    useEffect(()=>{
        if(!confirmPassword || confirmPassword.length >= 6 ){//confirm password checking
            setConfirmPasswordValid(true)
        } else {
            setConfirmPasswordValid(false)
        }
    }, [confirmPassword])

    //for terms and privacy checkbox
    const handleChecked = (event) => {
        setChecked(event.target.checked);
    }

    //Press the sign up button
    const handleSubmit = async(event) => {
        event.preventDefault()//prevent the page from reloading
            const form = event.currentTarget
            if (form.checkValidity() === false) {//check all the input fields, if there is any null input
                //stop the event
                event.stopPropagation()
            } else {// no null input
                if(!fullNameValid) {
                    setError("Full name should not contain any special characters")
                    return error
                }
                else if(!userNameValid) {
                    setError("User name should not contain any special characters")
                    return error
                }
                else if(!studentIdValid) {
                    setError("Student email should not contain any special characters")
                    return error
                }
                else if(!passwordValid) {
                    setError("Password should be at least 6 characters")
                    return error
                }
                //check if the confirmPassword is equal to the password
                else if(confirmPassword !== data.Password) {
                    setError("Password don't match!")
                    return error
                }
                //check if the GPA value valid
                else if(!cgpaValid) {
                    setError("GPA value not valid!")
                    return error
                }
                //check if any not valid values
                else if(
                    !validated && 
                    !fullNameValid && 
                    !userNameValid && 
                    !studentIdValid && 
                    !passwordValid && 
                    !confirmPasswordValid && 
                    !cgpaValid
                ){
                    setError("Nothing should be null!!!")
                    return error
                }
                if(error){ 
                    console.log(error)
                    event.stopPropagation()
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
                    setError("UnSuccessful!")
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
                        <Form className="justify-content-center" onSubmit={handleSubmit}>
                            <Row className="mb-2">
                                <Form.Group as={Col} md="6" controlId="FullName">
                                    <Form.Label className="fs-5">Full Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter your full name here"
                                        onChange={handleInput}
                                        isInvalid={!fullNameValid}
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
                                        isInvalid={!userNameValid}
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
                                            placeholder="ID"
                                            aria-describedby="inputGroupPrepend"
                                            isInvalid={!studentIdValid}
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
                                        isInvalid={!passwordValid}
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
                                        isInvalid={!confirmPasswordValid}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <Form.Group as={Col} md="4" controlId="CGPA">
                                    <Form.Label className="fs-5">CGPA</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g.3.66"
                                        required
                                        onChange={handleInput}
                                        isInvalid={!cgpaValid}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a valid CGPA.
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
                                    <Button style={{ width: "100%" }} 
                                        type="submit" 
                                        disabled={(uploadProgress !== null && uploadProgress < 100) || !checked}
                                    >
                                        Sign Up
                                    </Button>
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
