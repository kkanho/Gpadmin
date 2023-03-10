import React from 'react'
import { Button, Container } from 'react-bootstrap'
import style from "./home.module.css";
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"
import { Link } from 'react-router-dom';

export default function Home() {

    const { currentUser } = useContext(AuthContext)



    return (
        <Container>
            <h1 className={style.title}>Home</h1>
            {
                (currentUser === null)? (
                    <Link to={"/signUp"}>
                        <Button>Register Now</Button>
                    </Link>
                ): (<></>) //if user already login in, show nothing
            }
        </Container>
    )
}
