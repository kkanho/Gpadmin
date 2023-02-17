import React, { useState, useEffect } from 'react'
import { Container, Button, Col, Row, Form, InputGroup } from 'react-bootstrap'
import { auth, db, storage } from '../data/firebase'
import { setDoc, doc, collection, addDoc, serverTimestamp, FieldValue } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


export default function UserForm() {

    const [validated, setValidated] = useState(false)
    const [file, setFile] = useState("")
    const [data, setData] = useState({})
    const [uploadProgress, setUploadProgress] = useState(null)

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
        //if there is a file, upload it
        file && uploadFile()
    }, [file])


    //handle all the input as an object using the form id
    const handleInput = (e) => {
        const id = e.target.id
        const value = e.target.value
        setData({ ...data, [id]: value })
    }
    // console.log(data)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {//check all the input fields, if not valid
            //stop the event
            event.stopPropagation()
        } else {//pass the data to the firebase
            try {
                const passEmail = data.StudentID + "@" + schoolMailTemp
                const res = await createUserWithEmailAndPassword(
                    auth,
                    passEmail,
                    data.Password
                );
                await setDoc(doc(db, "users", res.user.uid), {
                    ...data,
                    timeStamp: serverTimestamp()
                })
                // console.log(res)
            } catch (err) {
                console.log(err)
            }
        }
        setValidated(true)//now the data was-validated
    }

    return (
        <Container className="d-flex justify-content-center align-items-center customHeight customWidth">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-2">
                    <Form.Group as={Col} md="8" controlId="FullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter your full name here"
                            onChange={handleInput}
                        />
                        <Form.Control.Feedback>Looks cool!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="UserName">
                        <Form.Label>UserName</Form.Label>
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
                    <Form.Group as={Col} md="6" controlId="StudentID">
                        <Form.Label>Student Email</Form.Label>
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
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="Password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            onChange={handleInput}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid Password.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="CGPA">
                        <Form.Label>CGPA</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="CGPA"
                            required
                            onChange={handleInput}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please Enter a CGPA.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group className="position-relative mb-3">
                        <Form.Label>File</Form.Label>
                        <Form.Control
                            id="file"
                            type="file"
                            required
                            name="file"
                            onChange={
                                (e) => {
                                    setFile(e.target.files[0]);
                                    // handleInput(e)
                                }
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            Please send us a copy of your transcript to confirm your GPA
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                />
                </Form.Group>
                <Row className="mb-2">
                    <Col className="d-flex justify-content-end">
                        <Button type="submit" disabled={uploadProgress !== null && uploadProgress < 100}>Submit form</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}