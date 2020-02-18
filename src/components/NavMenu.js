import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,DropdownItem, Nav, DropdownText, DropdownToggle, UncontrolledDropdown, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../styles/NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    return (
      <header>
        <Navbar expand="md" light fixed>
        <NavbarBrand href="/" style={{color:"#FA653C"}} className="px-2">D</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
        <Collapse  className="d-sm-inline-flex flex-sm-row-reverse d-xsinline-flex flex-xs-row-reverse" isOpen={this.state.collapsed} navbar>
          <Nav className="ml-auto px-2 nav-items" navbar>
          <NavItem>
              <NavLink href="/" style={{color:"#FA653C"}}>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about" style={{color:"#FA653C"}}>About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://drive.google.com/file/d/1uuUtQesY9Pr-BJKgTCIofMFdCARTAscJ/view?usp=sharing" target="_blank"  style={{color:"#FA653C"}}>Resume</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact" style={{color:"#FA653C"}}>Contact</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      </header>
    );
  }
}
