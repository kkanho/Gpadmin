import React from 'react'
import { Container } from 'react-bootstrap'
import List from '../../components/List'
import MiniGame from '../../components/MiniGame';
import style from "./home.module.css";

export default function Home() {
    return (
        <Container>
            <h1 className={style.title}>Home</h1>
        </Container>
    )
}
