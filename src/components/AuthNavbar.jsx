import React, { useContext } from "react";
import { Navbar, Container, Button, Nav, Offcanvas, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import UserIcon from "../components/UserIcon"

export default function AuthNavbar() {

    const expand = 'md'

    const { currentUser } = useContext(AuthContext)

    // The forwardRef is important!!
    // Dropdown needs access to the DOM node in order to position the Menu
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
            e.preventDefault();
            onClick(e);
            }}
            className="d-flex align-items-center"
        >
            {children}
            {/* &#x25bc; */}
        </a>
    ));

    // forwardRef again here!
    // Dropdown needs access to the DOM of the Menu to measure it
    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            (child) =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ul>
                </div>
            );
        },
    );

    return (
        <>
            <Navbar key={expand} bg="light" expand={expand}>
                <Container>
                    <Link to={"/"} className="nav-link">
                        <Navbar.Brand>Gpadmin</Navbar.Brand>
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
                                    Gpadmin
                                </Offcanvas.Title>
                            </Link>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav className="me-auto gap-2 d-flex justify-content-center">
                                        <Link to={"/"} className="nav-link navbarDec">Home</Link>
                                        <Link to={"/find"} className="nav-link navbarDec">Find</Link>
                                        <Link to={"/about"} className="nav-link navbarDec">About</Link>
                                    </Nav>
                                </Nav>
                                {
                                    //if user is not logged in
                                    (currentUser === null) ? (
                                        <Link to={"/login"} className="d-flex justify-content-end">
                                            <Button>
                                                Login
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="d-flex justify-content-end">
                                            <Dropdown className="d-flex" align="end">
                                                <Dropdown.Toggle as={CustomToggle}>
                                                    <UserIcon />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item eventKey="1" as={Link} to="/profile">
                                                        Profile
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item eventKey="2" onClick={() => {
                                                            window.localStorage.removeItem("user")
                                                            window.location.reload()
                                                        }}
                                                        style={{color: "red"}}
                                                    >
                                                        Logout
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                                
                                            </Dropdown>
                                        </div>
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