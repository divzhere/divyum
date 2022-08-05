import React, { Component } from "react";
import about from "../images/about.png";
import { Row, Col } from "reactstrap";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";

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
              <Tilt className="track-on-window" trackOnWindow={true}>
                <img
                  src={about}
                  className="img-fluid animate__animated animate__fadeIn"
                  loading="lazy"
                  style={{ maxHeight: "600px" }}
                  alt="about_illustration"
                ></img>
              </Tilt>
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
            A product role aspirant with over 3+ years of experience in building
            tech products. Seeking an opportunity to leverage my diverse skills
            and experience in Product Management, Software Engineering, Frontend
            Engineering, Responsive UI/UX Development, Wireframing, Stakeholder
            Management, and Quality Assurance.
            <br></br>
            <br></br>A Bachelor in Engineering in Information Technology from{" "}
            <a
              href="http://uiet.puchd.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              UIET, Panjab University
            </a>{" "}
            along with Diploma in Product Management from{" "}
            <a
              href="https://pragmaticleaders.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pragmatics Leaders
            </a>{" "}
            coupled with ample profoessional experience in tech will make me a
            positive asset to your organization.
            <br></br>
            <br></br>
            <a
              href="https://calendly.com/divyum/meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let's Talk 🚀
            </a>
            {/* My name is Divyum and I'm currently working as a Product Engineer
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
            <br></br>I have 2+ years of experience working as a Product Engineer
            👨🏻‍💻 with hands-on experience in Frontend Development of web
            applications 🌐 . I'm proficient in translating designs & wireframes
            into responsive, high-quality code 🚀 .<br></br>
            <br></br>Being a product engineer I already have relevant experience
            of working with Design, Backend, and QA Teams to ensure that a good
            solution is built. During my previous role at different startups, I
            have had the opportunity of working in the full product development
            lifecycle, from ideation to prototyping to developing to testing and
            finally launching the product. And to hone my product skills I have
            also completed a PG diploma course in Product Management by
            Pragmatics Leaders
            <br></br> */}
          </p>
        </article>
      </div>
    );
  }
}

export default About;
