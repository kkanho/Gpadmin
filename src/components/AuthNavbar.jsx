import React, { useContext } from "react";
import { Navbar, Container, Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

export default function AuthNavbar(){

    const expand = 'md'

    const { currentUser } = useContext(AuthContext) 

    function loginBtn() {
        return(
            <Link to={"/login"} className="d-flex justify-content-end">
                <Button>
                    Login
                </Button>
            </Link>
        )
    }

    return (
        <>        
            <Navbar key={expand} bg="light" expand={expand}>
            <Container>
                <Link to={"/"} className="nav-link">
                    <Navbar.Brand>GPA_SBMM</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Link to={"/"} className="nav-link">
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                GPA_SBMM
                            </Offcanvas.Title>
                        </Link>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav className="me-auto gap-2 d-flex justify-content-center">
                                <Link to={"/"} className="nav-link">Home</Link>
                                <Link to={"/find"} className="nav-link">Find</Link>
                                <Link to={"/about"} className="nav-link">About</Link>
                            </Nav>
                        </Nav>
                        {
                            (currentUser === null)?(
                                <Link to={"/login"} className="d-flex justify-content-end">
                                    <Button>
                                        Login
                                    </Button>
                                </Link> 
                            ) : (
                                <Link className="d-flex justify-content-end">
                                    <Button onClick={() => {
                                        window.localStorage.removeItem("user")
                                        window.location.reload()
                                    }}>
                                        Logout
                                    </Button>
                                </Link> 
                            )
                        }
                        </>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar>
        </>
    )
}