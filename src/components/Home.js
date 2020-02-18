import React, { Component } from 'react';
import crayon from '../images/crayon-success.png'
import {Row,Col} from 'reactstrap'
import { FaGithub, FaTwitter,FaInstagram, FaLinkedin} from 'react-icons/fa';
import {AiFillInstagram, AiFillMail} from 'react-icons/ai'
import {Helmet} from "react-helmet";

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
     <>
     <Helmet>
    <title>Divyum - Home &#x1F64B;&#x200D;&#x2642;&#xFE0F;</title>
    </Helmet>
       <Row>
       <Col md="3"></Col>
       <Col md="6">
         <img src={crayon} className="img-fluid" style={{maxHeight:"600px"}}></img>
         </Col>
         <Col md="3"></Col>
         </Row>  
       <div className="text-center">
        <h1 className="display-3">Hello, I'm Divyum.</h1>
        <hr></hr>
        <p className="lead">UI Developer based in Chandigarh, India. <i class="em em-flag-in" aria-role="presentation" aria-label="India Flag"></i> </p>
        <hr></hr>
        <div className="icons-group">
        <a href="https://twitter.com/divz7777" target="_blank" style={{color:"#222222"}}><FaTwitter/></a>
        
        <a href="https://www.instagram.com/divz_here/" target="_blank" style={{color:"#222222"}}><AiFillInstagram/></a>
        
        <a href="mailto:divz7777@gmail.com?Subject=Hello%20again" target="_blank" style={{color:"#222222"}}><AiFillMail /></a>

        <a href="https://github.com/divzhere" target="_blank" style={{color:"#222222"}}><FaGithub /></a>

        <a href="https://www.linkedin.com/in/divyum-bhumra-48718b102/" target="_blank" style={{color:"#222222"  }}><FaLinkedin/></a>

        </div>
        <hr></hr>
       </div>
      <p className="text-center" style={{fontSize:"14px", fontWeight:"lighter"}}>&copy; 2020 Divyum Bhumra</p>
     </>
    );
  }
}
