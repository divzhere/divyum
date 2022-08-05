import React, { Component } from "react";
import crayon from "../images/crayon-success.png";
import { Row, Col } from "reactstrap";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <>
        <Helmet>
          <title>divz.xyz - Home </title>
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
          <div className="text-center">
            <h1 className="display-3 animate__animated animate__fadeIn">
              Hello, my name is Divyum.
            </h1>
            <p className="lead animate__animated animate__fadeIn">
              Product Engineer based in India.{" "}
              <i
                class="em em-flag-in"
                aria-role="presentation"
                aria-label="India Flag"
              ></i>{" "}
            </p>
            <hr className="animate__animated animate__fadeIn"></hr>
            <Row>
              <Col md="3"></Col>
              <Col md="6">
                <Tilt className="track-on-window" trackOnWindow={true}>
                  <img
                    src={crayon}
                    className="img-fluid animate__animated animate__fadeIn animate__delay-1s"
                    loading="lazy"
                    style={{ maxHeight: "600px" }}
                    alt="home_illustration"
                  ></img>
                </Tilt>
              </Col>
              <Col md="3"></Col>
            </Row>
          </div>
        </header>
      </>
    );
  }
}
