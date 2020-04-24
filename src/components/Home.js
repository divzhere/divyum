import React, { Component } from 'react';
import crayon from '../images/crayon-success.png'
import {Row,Col} from 'reactstrap'
import {Helmet} from "react-helmet";
import {Footer} from './Footer'

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
     <>
     <Helmet>
    <title>Divyum - Home</title>
    </Helmet>
       <div className="text-center">
        <h1 className="display-3">Hello, I'm Divyum.</h1>
        <p className="lead">UI Developer based in India. <i class="em em-flag-in" aria-role="presentation" aria-label="India Flag"></i> </p>
        <hr></hr>
        <Row>
       <Col md="3"></Col>
       <Col md="6">
         <img src={crayon} className="img-fluid" loading="lazy" style={{maxHeight:"600px"}}></img>
         </Col>
         <Col md="3"></Col>
         </Row>  
       <Footer/>
       </div>
    
     </>
    );
  }
}
