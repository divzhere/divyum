import React, { Component } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import AnimatedCursor from "react-animated-cursor";
export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div className="container">
        <AnimatedCursor
          innerSize={20}
          outerSize={30}
          color="250, 101, 60"
          outerAlpha={0.2}
          innerScale={0.7}
          outerScale={5}
          clickables={[
            "a",
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'input[type="image"]',
            "label[for]",
            "select",
            "textarea",
            "button",
            ".link",
          ]}
        />
        <NavMenu />
        <Container>{this.props.children}</Container>
      </div>
    );
  }
}
