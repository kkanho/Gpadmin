import React from 'react'
import { Container } from 'react-bootstrap'
import List from '../components/List'

export default function Home() {
    return (
        <div style={{background: ""}}>
            <Container>
                <h1>Home</h1>
                <List />
            </Container>
        </div>
    )
}
