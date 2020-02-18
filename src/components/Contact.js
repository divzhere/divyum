import React, { Component } from 'react'
import contact from '../images/contact.png'
import {Row,Col} from 'reactstrap'
import { FaGithub, FaTwitter,FaInstagram, FaLinkedin} from 'react-icons/fa';
import {AiFillInstagram, AiFillMail} from 'react-icons/ai'
import { Button } from 'reactstrap';
import axios from 'axios';
import {Helmet} from "react-helmet";

export class Contact extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'',email:'',message:''
        }
    }
    
    handleChange = (e)=>{
        this.setState({ [e.target.id]: e.target.value})
        console.log(this.state)
   }

   handleSubmit=(e)=>{
       e.preventDefault();
       const body = {
        name:this.state.name,
        email:this.state.email,
        message:this.state.message
       }
       axios.post('/api/ContactForms', {body}).then(
           this.setState({
            name:'',email:'',message:''
           })
       ) 
   }
    render() {
        return (
            <div>
            <Helmet>
    <title>Divyum - Contact &#x1F4DE;</title>
    </Helmet> 
            <Row>
       <Col md="3"></Col>
       <Col md="6">
         <img src={contact} className="img-fluid" style={{maxHeight:"600px"}}></img>
         </Col>
         <Col md="3"></Col>
         </Row> 
         <hr></hr>
             <h1 className="text-center">Say Hello!</h1> 
             <p style={{fontSize:"20px"}} className="text-center">
I’d love to hear from you! If you’d like to discuss a quote or are interested in more information about working with me, fill out the form and I’ll get back to you as soon as possible.         
</p>
<hr></hr>
        <div>
  <form onSubmit={this.handleSubmit}>
     <label for="name">Name</label>
     <input type="text" id="name" name="name" onChange={this.handleChange} value={this.state.name}></input>
     
     <label for="email">Email</label>
     <input type="email" id="email" name="email"  onChange={this.handleChange} value={this.state.email}></input>
     
     <label for="message">Message</label>
     <input type="text" id="message" name="message" placeholder="Write Something... "style={{height:"200px"}}  onChange={this.handleChange} value={this.state.message}></input>    
     
     <Button color="secondary" className="btn submit-btn" type="submit">Submit</Button>       
  
  </form>
    </div>
    <hr></hr>
        <div className="icons-group">
        <a href="https://twitter.com/divz7777" target="_blank" style={{color:"#222222"}}><FaTwitter/></a>
        
        <a href="https://www.instagram.com/divz_here/" target="_blank" style={{color:"#222222"}}><AiFillInstagram/></a>
        
        <a href="mailto:divz7777@gmail.com?Subject=Hello%20again" target="_blank" style={{color:"#222222"}}><AiFillMail /></a>

        <a href="https://github.com/divzhere" target="_blank" style={{color:"#222222"}}><FaGithub /></a>

        <a href="https://www.linkedin.com/in/divyum-bhumra-48718b102/" target="_blank" style={{color:"#222222"  }}><FaLinkedin/></a>

        </div>
        <hr></hr>
        <p className="text-center" style={{fontSize:"14px", fontWeight:"lighter"}}>&copy; 2020 Divyum Bhumra</p>
  
            </div>
        )
    }
}

export default Contact
