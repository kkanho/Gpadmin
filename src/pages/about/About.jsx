import { Container, Accordion } from "react-bootstrap";
import style from "./about.module.css";

export default function About() {

    //!!!!!You should change the text right here!!!!!!
    //for you to see the whole paragraph, you can click "view", then click "Word Warp"
    const list = [
        {
            id: 1,
            title: "Title 1",
            body: "Here is where you should write your paragraph!!!"
        },
        {
            id: 2,
            title: "Title 2",
            body: "Here is where you should write your paragraph!!!"
        },
        {
            id: 3,
            title: "Title 3",
            body: "Here is where you should write your paragraph!!!"
        },
        {
            id: 4,
            title: "Title 4",
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.",
        },
    ]

    return (
        <div style={{ background: "" }}>
            <h1 className={style.title}>About</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Accordion defaultActiveKey="0" style={{ width: '40rem' }}>{
                    list.map((item) => (
                        <Accordion.Item eventKey={item.id}>
                            <Accordion.Header>{item.title}</Accordion.Header>
                            <Accordion.Body>
                                {item.body}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                }</Accordion>
            </Container>
        </div>
    )
}
