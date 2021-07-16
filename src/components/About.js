import React, { Component } from "react";
import about from "../images/about.png";
import { Row, Col } from "reactstrap";
import { Helmet } from "react-helmet";
import { Footer } from "./Footer";
export class About extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>divz.xyz - About</title>
          <meta name="title" content="Divyum - divz.xyz" />
          <meta
            name="description"
            content="Divyum Bhumra : Frontend Developer based in India"
          />
          <meta
            name="keywords"
            content="Personal, Portfolio, React, Frontend, HTML, Resume, India, Developer"
          />
          <meta name="robots" content="index, follow" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta name="author" content="Divyum Bhumra"></meta>
        </Helmet>
        <header>
          <Row>
            <Col md="3"></Col>
            <Col md="6">
              <img
                src={about}
                className="img-fluid animate__animated animate__fadeIn"
                loading="lazy"
                style={{ maxHeight: "600px" }}
                alt="about_illustration"
              ></img>
            </Col>
            <Col md="3"></Col>
          </Row>
        </header>
        <hr className="animate__animated animate__fadeIn"></hr>
        <article>
          <p
            style={{ fontSize: "20px" }}
            className="animate__animated animate__fadeIn animate__delay-1s"
          >
            My name is Divyum and I'm currently working as a Frontend Engineer
            based in India{" "}
            <i
              class="em em-flag-in"
              aria-role="presentation"
              aria-label="India Flag"
            ></i>
            . I have completed my Bachelor's in Engineering in Information
            Technology from{" "}
            <a
              href="http://uiet.puchd.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              UIET, Panjab University 🎓.
            </a>
            <br></br>
            <br></br>I have 2+ years of experience working as a Software
            Developer 👨🏻‍💻 with hands-on experience in Frontend Development of web
            applications 🌐 . I'm proficient in translating designs & wireframes
            into responsive, high-quality code 🚀 . I have worked in the past
            with mid-size tech companies such as{" "}
            <a
              href="http://collegedunia.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CollegeDunia,
            </a>{" "}
            <a
              href="https://www.wrkspot.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wrkspot,
            </a>{" "}
            <a
              href="https://www.finacplus.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Finacplus,
            </a>{" "}
            and{" "}
            <a
              href="https://www.xenonstack.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xenonstack
            </a>
            .<br></br>
            <br></br>
            I'm also an aspiring Product Manager, I'm also pursuing PG Diploma
            in Product Management by{" "}
            <a
              href="https://pragmaticleaders.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pragmatics Leaders
            </a>{" "}
            currently.
          </p>
        </article>
        <Footer />
      </div>
    );
  }
}

export default About;
