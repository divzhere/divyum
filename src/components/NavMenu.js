import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/NavMenu.css";

export default function NavMenu() {
  return (
    <div>
      <Navbar className="navbar" expand="lg">
        <Navbar.Brand as={Link} to="/" style={{ color: "#FA653C" }}>
          D
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto nav-items">
            <Nav.Link
              as={Link}
              to="/"
              style={{ color: "#FA653C" }}
              className={window.location.pathname === "/" ? "aok" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              style={{ color: "#FA653C" }}
              className={window.location.pathname === "/about" ? "aok" : ""}
            >
              About
            </Nav.Link>
            <Nav.Link
              style={{ color: "#FA653C" }}
              href="https://drive.google.com/file/d/1_vWBCUNn_pvBPo9Xt8hp66xhLisdEEaj/view?usp=sharing"
              target="_blank"
            >
              Resume
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/portfolio"
              style={{ color: "#FA653C" }}
              className={window.location.pathname === "/portfolio" ? "aok" : ""}
            >
              Portfolio
            </Nav.Link>
            <Nav.Link
              href="mailto:divz7777@gmail.com?Subject=Hello"
              style={{ color: "#FA653C" }}
              target="_blank"
            >
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
