import { Button, Carousel, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import List from "../components/List"


export default function Find() {

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Find Teammates</h1>
            <Container className="col-xl-5 col-lg-8 col-md-10 col-12">
                <List />
            </Container>
        </Container>
    )
}
