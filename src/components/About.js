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
          <title>Divyum - About</title>
        </Helmet>
        <Row>
          <Col md="3"></Col>
          <Col md="6">
            <img
              src={about}
              className="img-fluid animate__animated animate__fadeIn"
              loading="lazy"
              style={{ maxHeight: "600px" }}
            ></img>
          </Col>
          <Col md="3"></Col>
        </Row>
        <hr className="animate__animated animate__fadeIn"></hr>
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
          <a href="http://uiet.puchd.ac.in/" target="_blank">
            UIET, Panjab University 🎓.
          </a>
          <br></br>
          <br></br>I have 2+ years of experience working as a Software Developer
          👨🏻‍💻 with hands-on experience in Frontend Development of web
          applications 🌐 . I'm proficient in translating designs & wireframes
          into responsive, high-quality code 🚀 . I have worked in the past with
          mid-size tech companies such as{" "}
          <a href="http://collegedunia.com/" target="_blank">
            CollegeDunia,
          </a>{" "}
          <a href="https://www.wrkspot.com/" target="_blank">
            Wrkspot,
          </a>{" "}
          <a href="https://www.finacplus.com/" target="_blank">
            Finacplus,
          </a>{" "}
          and{" "}
          <a href="https://www.xenonstack.com/" target="_blank">
            Xenonstack
          </a>
          .<br></br>
          <br></br>
          I'm also an aspiring Product Manager, I'm also pursuing PG Diploma in
          Product Management by{" "}
          <a href="https://pragmaticleaders.io/" target="_blank">
            Pragmatics Leaders
          </a>{" "}
          currently.
        </p>
        <Footer />
      </div>
    );
  }
}

export default About;
