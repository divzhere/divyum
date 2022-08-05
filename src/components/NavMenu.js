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
              as={Link}
              to="/portfolio"
              style={{ color: "#FA653C" }}
              className={window.location.pathname === "/portfolio" ? "aok" : ""}
            >
              Portfolio
            </Nav.Link>
            <Nav.Link
              href="https://medium.com/@divyumbhumra"
              style={{ color: "#FA653C" }}
              target="_blank"
            >
              Blog
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
