import React from "react";
import contact from "../images/contact.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  Badge,
} from "reactstrap";
import { projects } from "./portfolioJson";
import Tilt from "react-parallax-tilt";

export function Portfolio() {
  return (
    <div>
      <Helmet>
        <title>divz.xyz - Portfolio</title>
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
                src={contact}
                className="img-fluid animate__animated animate__fadeIn"
                loading="lazy"
                style={{ maxHeight: "600px" }}
                alt="portfolio_illustration"
              ></img>
            </Tilt>
          </Col>
          <Col md="3"></Col>
        </Row>
      </header>
      <hr className="animate__animated animate__fadeIn"></hr>
      <article>
        <div className="card-row animate__animated animate__fadeIn animate__delay-1s">
          {projects.map((project, i) => (
            <Card key={i}>
              <CardImg top width="100%" src={project.img} alt={project.title} />
              <CardBody>
                <CardTitle tag="h5">{project.title}</CardTitle>
                <CardSubtitle className="mb-2 text-muted">
                  {project.tags.map((tag, j) => (
                    <Badge key={j} pill style={{ margin: "3px" }}>
                      {tag}
                    </Badge>
                  ))}
                </CardSubtitle>
                <CardText>{project.description}</CardText>
                <Button color="link">
                  <Link
                    to={{ pathname: project.website }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </Link>
                </Button>
                <Button color="link">
                  {project.code && (
                    <Link
                      to={{ pathname: project.code }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Code
                    </Link>
                  )}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </article>
    </div>
  );
}
