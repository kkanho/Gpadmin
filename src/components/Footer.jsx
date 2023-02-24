import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Button, Modal } from 'react-bootstrap';
import MiniGame from "./MiniGame";

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    MiniGame
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <MiniGame />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function Footer() {

    const [modalShow, setModalShow] = useState(false);

    return (
        <React.Fragment>
            <footer className="bg-light border-top py-3 fixed-bottom">
                <Container>
                    <span className="kick" onClick={() => setModalShow(true)}>&copy;</span> Gpadmin - 2023
                </Container>
            </footer>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </React.Fragment>
    );
}
