import React, { Component } from "react";
import { Route, useParams } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Portfolio } from "./components/Portfolio";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import "./styles/custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/about" component={About} />
        <Footer />
      </Layout>
    );
  }
}
