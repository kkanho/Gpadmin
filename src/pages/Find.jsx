import { Button, Carousel, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import users from "../data/users.json"


export default function Find() {

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Find Teammates</h1>
            <Container className="col-xl-5 col-lg-8 col-md-10 col-12">
                <Carousel prevIcon data-bs-ride="false">
                    {users.map(user => {
                        return (
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={user.prove}
                                    alt="{user.id}"
                                    style={{ objectFit: "cover",filter: "brightness(50%)" }}
                                    />
                                <Carousel.Caption>
                                    <h3>{user.name}</h3>
                                    <p>GPA: {user.cgpa}</p>
                                    <Link to=""><Button>Get Content Now!</Button></Link>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </Container>
        </Container>
    )
}
