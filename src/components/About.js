import React, { Component } from 'react'
import about from '../images/about.png'
import {Row,Col} from 'reactstrap'
import { FaGithub, FaTwitter,FaLinkedin,FaReact} from 'react-icons/fa';
import {AiFillInstagram, AiFillMail} from 'react-icons/ai'
import { Timeline, Event } from "react-timeline-scribble";
import {Helmet} from "react-helmet";

export class About extends Component {
    render() {
    
        return (
            <div>
            <Helmet>
    <title>Divyum - About &#x1F468;&#x200D;&#x1F4BB;</title>
    </Helmet> 
            <Row>
       <Col md="3"></Col>
       <Col md="6">
         <img src={about} className="img-fluid" style={{maxHeight:"600px"}}></img>
         </Col>
         <Col md="3"></Col>
         </Row>     
         <hr></hr>
        <p style={{fontSize:"20px"}}>My name is Divyum and I'm currently based in Chandigarh, India <i class="em em-flag-in" aria-role="presentation" aria-label="India Flag"></i> . I have a strong passion for Design & Development <i class="em em-male-technologist" aria-role="presentation" aria-label=""></i>. Recently I was working as a UI Developer Intern at  <a href="https://www.xenonstack.com/" target="_blank">XenonStack</a>. I have completed my Bachelor's in Engineering from <a href="http://uiet.puchd.ac.in/" target="_blank">UIET, Panjab University</a>, and I'm currently looking for Full-time Opportunities and I'm open to relocation.
<br></br>
<br></br>
For me, Happiness Lies in the Joy of Achievement. If there's anything I love, it's a good challenge, big or small, and I firmly believe that given enough time and resources, I can achieve any goal. I'm an adaptive person & I look forward to establishing myself by adopting new technologies as well. I'm a Team Player and I have strong technical and interpersonal skills for working in a team and completing a project. 
</p>
        <hr></hr>
     <h1 className="text-center">EDUCATION</h1>
     <hr></hr>
        <Timeline>
      <Event interval={"2015 – 2019"} title={"UIET,Panjab University"} subtitle={"Bachelor's of Engineering, Information Technology"}>
      </Event>
      <Event interval={"2015"} title={"Mount Carmel School, Chandigarh"} subtitle={"CBSE, 12th Standrd"}>
      </Event>
      <Event interval={"2013"} title={"Christ King Convent School, Kapurthala"} subtitle={"ICSE, 10th Standard"}>
      </Event>
    </Timeline>
    <hr></hr>
    <h1 className="text-center">EXPERIENCE</h1>
    <hr></hr>
        <Timeline>
      <Event interval={"Jul 2019 – Jan 2020"} title={"XenonStack"} subtitle={"UI Developer Intern"}>
      • Developing new features, Integerating APIs for web apps using React, Redux.<br></br>
      • Testing of Components using Jest, Enzyme & Taiko.<br></br>
      • Documenting and refactoring the frontend codebase.
      </Event>
      <Event interval={"Jun 2018 - Jun 2019"} title={"Rotaract Club Chandigarh Himalayan"} subtitle={"President"}>
      As the Club President’s my primary role is to lead the club and preside at all meetings of the Club and Board of directors. I also have to motivate, inspire, and coach club committees to ensure that the club’s professional and leadership development activities and Service projects are successful. We are a Non for Profit Organisation based in Tricity, with a membership of more than 700 Club Members.
      </Event>
    </Timeline>
    <hr></hr>
    <h1 className="text-center">Skills</h1>
    <hr></hr>
        <Timeline>
      <Event interval={"Frontend Framework"} title={""} subtitle={""}>React</Event>
      <Event interval={"Data Layer"} title={""} subtitle={""}>Redux</Event>
      <Event interval={"Testing"} title={""} subtitle={""}>Jest, Enzyme, Taiko</Event>
      <Event interval={"Text Editor"} title={""} subtitle={""}>VS Code</Event>
      <Event interval={"Languages"} title={""} subtitle={""}>Java, Javascript</Event>
      <Event interval={"Graphic Designing & Prototyping"} title={""} subtitle={""}>Adobe Photoshop, Adobe XD, Canva</Event>
      <Event interval={"Other Skills"} title={""} subtitle={""}>Version Control(Git), Responsive Layout & Design, Agile Methodology, Team Leadership, Leadership Development</Event>
    </Timeline>
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

export default About
