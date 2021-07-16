import React from "react";
import contact from "../images/contact.png";
import netflix from "../images/netflix.png";
import loan from "../images/loan.png";
import multiSelect from "../images/multiselect.png";
import csv from "../images/csv.png";
import bettermaps from "../images/bettermaps.png"
import divz from "../images/divz.png";
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
  CardGroup,
} from "reactstrap";
import { Footer } from "./Footer";
export function Portfolio() {
  return (
    <div>
      <Helmet>
        <title>Divyum - Portfolio</title>
      </Helmet>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
          <img
            src={contact}
            className="img-fluid animate__animated animate__fadeIn"
            loading="lazy"
            style={{ maxHeight: "600px" }}
          ></img>
        </Col>
        <Col md="3"></Col>
      </Row>
      <hr className="animate__animated animate__fadeIn"></hr>
      <div className="card-row animate__animated animate__fadeIn animate__delay-1s">
        <CardGroup>
          <Card>
            <CardImg top width="100%" src={bettermaps} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">Better Maps</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                React, JavaScript, HTML, CSS
              </CardSubtitle>
              <CardText>MVP for a Web app for creating Maps using Mapbox and Maptiler APIs.</CardText>
              <Button color="link">
                <a href="https://hungry-hypatia-83f595.netlify.app/" target="_blank">
                  Link
                </a>
              </Button>
              <Button color="link">
                <a
                  href="https://github.com/divzhere/BetterMaps"
                  target="_blank"
                >
                  Github Repo
                </a>
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardImg top width="100%" src={netflix} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">Netflix Home Page Clone</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                React,JavaScript, HTML, CSS
              </CardSubtitle>
              <CardText>
                Used Movies Database API for making a clone of Netflix Home page
                UI
              </CardText>
              <Button color="link">
                <a
                  href="https://compassionate-galileo-0c56b8.netlify.app/"
                  target="_blank"
                >
                  Link
                </a>
              </Button>
              <Button color="link">
                <a
                  href="https://github.com/divzhere/netflix-clone"
                  target="_blank"
                >
                  Github Repo
                </a>
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardImg top width="100%" src={multiSelect} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">react-multiselect-dropdown</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                React,JavaScript, HTML, CSS
              </CardSubtitle>
              <CardText>Reusable Multiselect Dropdown Component</CardText>
              <Button color="link">
                <a href="https://csb-duysh.netlify.app/" target="_blank">
                  Link
                </a>
              </Button>
              <Button color="link">
                <a
                  href="https://github.com/divzhere/react-multiselect-dropdown"
                  target="_blank"
                >
                  Github Repo
                </a>
              </Button>
            </CardBody>
          </Card>
        </CardGroup>
        <CardGroup>
          <Card>
            <CardImg top width="100%" src={divz} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">Personal Website</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                React,JavaScript, HTML, CSS
              </CardSubtitle>
              <Button color="link">
                <a href="https://www.divz.xyz/" target="_blank">
                  Link
                </a>
              </Button>
              <Button color="link">
                <a href="https://github.com/divzhere/divyum" target="_blank">
                  Github Repo
                </a>
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardImg top width="100%" src={csv} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">CSV Viewer</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                React,JavaScript, HTML, CSS
              </CardSubtitle>
              <CardText>Converts a .CSV file to a Table</CardText>
              <Button color="link">
                <a
                  href="https://condescending-panini-86281d.netlify.app/"
                  target="_blank"
                >
                  Link
                </a>
              </Button>
              <Button color="link">
                <a href="https://github.com/divzhere/CSViewer" target="_blank">
                  Github Repo
                </a>
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardImg top width="100%" src={loan} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5">Fix n Flip Loans</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                HTML, CSS
              </CardSubtitle>
              <CardText>Landing page for a Loan lending Company.</CardText>
              <Button color="link">
                <a
                  href="https://loving-goldstine-af3e96.netlify.app/"
                  target="_blank"
                >
                  Link
                </a>
              </Button>
            </CardBody>
          </Card>
        </CardGroup>
      </div>
      <Footer />
    </div>
  );
}
