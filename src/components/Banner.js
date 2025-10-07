import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import headerImg from '../assets/img/header-img.svg';
import lucas_passos_cv from '../assets/lucas_passos_cv.pdf'; 
import 'animate.css';

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Backend Developer", "Frontend Developer", "Fullstack Developer"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(30);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta)

        return () => { clearInterval(ticker) };
    }, [text])

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }
        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(50);
        }
    }

    return (
        <section className="banner" id="home">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">Welcome to my Portfolio</span>
                        <h1>{`Lucas Passos `}</h1>
                        <h2><span className="wrap">.{text}</span></h2>
                        <p>Desenvolvedor Backend com foco na construção de APIs e sistemas de alta performance. Eu crio a lógica de negócios e a infraestrutura de dados, utilizando PHP, Java e Python para garantir escalabilidade e segurança em cada projeto.</p>

                        <span className="navbar-text">
                            <div className="social-icon">
                               
                            </div>
                            <a href={lucas_passos_cv} download="lucas_passos_cv.pdf"><button className="vvd" >
                                <span>
                                    Download CV
                                </span></button></a>
                        </span>

                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={headerImg} alt="Header Img" />
                    </Col>
                </Row>
            </Container>
        </section>
    )
}