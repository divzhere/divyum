import React, { Component } from 'react';
import about from '../images/about.png';
import { Row, Col } from 'reactstrap';
import { Timeline, Event } from 'react-timeline-scribble';
import { Helmet } from 'react-helmet';
import { Footer } from './Footer';
export class About extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Divyum - About</title>
                </Helmet>
                <Row>
                    <Col md='3'></Col>
                    <Col md='6'>
                        <img
                            src={about}
                            className='img-fluid'
                            loading='lazy'
                            style={{ maxHeight: '600px' }}
                        ></img>
                    </Col>
                    <Col md='3'></Col>
                </Row>
                <hr></hr>
                <p style={{ fontSize: '20px' }}>
                    My name is Divyum and I'm currently based in Hyderabad, India working as a UI
                    Developer at{' '}
                    <a href='https://finacplus.com/' target='_blank'>
                        FinacPlus
                    </a>{' '}
                    . Recently I was working as a UI Developer Intern at{' '}
                    <a href='https://www.xenonstack.com/' target='_blank'>
                        XenonStack
                    </a>{' '}
                    . I have completed my Bachelor's in Engineering from{' '}
                    <a href='http://uiet.puchd.ac.in/' target='_blank'>
                        UIET, Panjab University
                    </a>
                    .<br></br>
                    <br></br>
                    For me, Happiness Lies in the Joy of Achievement. If there's anything I love,
                    it's a good challenge.<br></br>
                    If you are interested in more information about collaborating or working with
                    me, Reach out to me at{' '}
                    <a href='mailto:divz7777@gmail.com?Subject=Hello%20again' target='_blank'>
                        divz7777@gmail.com
                    </a>
                </p>
                <hr></hr>
                <h2 className='text-center'>EXPERIENCE</h2>
                <hr></hr>
                <Timeline>
                    <Event
                        interval={'Feb 2020 –  Present'}
                        title={'UI Developer'}
                        subtitle={'FinacPlus'}
                    >
                        • Developing a Single Page application from scratch, while converting
                        wireframes and prototypes to high-quality code in React for managing Loan
                        Underwriting Process.<br></br>• Configuring the CI/CD Pipeline using Azure
                        Pipelines & Managing Deployment using Azure App Services.<br></br>• Working
                        in a Remote Team.
                    </Event>
                    <Event
                        interval={'Jul 2019 – Jan 2020'}
                        title={'UI Developer Intern'}
                        subtitle={'XenonStack'}
                    >
                        • Redesigning and developing New Product Features, User Interface, CMS,
                        Integrating API Endpoints using React and Redux for Career Portal of
                        XenonStack which resulted in an increased number of Job Applications.
                        <br></br>• Creating Reusable React Packages for Modal, Chips, Accordion for
                        XenonStack Design System.<br></br>• Developing the User Interface of Website
                        Security & Technology Stack Scanner in React, Redux and integrating API
                        Endpoints.<br></br>• Performing Unit Testing using Jest & Enzyme and
                        Automation Testing using Taiko.<br></br>• Worked in an agile Scrum Team
                    </Event>
                    <Event
                        interval={'Jun 2018 - Jun 2019'}
                        title={'President'}
                        subtitle={'Rotaract Club Chandigarh Himalayan'}
                    >
                        A non-profit organization based in Chandigarh, India has a strength of more
                        than 700 members working for the Development of Underprivileged Kids,
                        Renovating Schools, Menstrual Hygiene, Leadership Development in Youth, and
                        a lot more.
                        <br></br>• Lead the Club and preside all meetings of the club and Board of
                        Directors.<br></br>• Awarded Best Club and Best President for the tenure
                        2018-19 by Rotaract International District 3080.<br></br>
                    </Event>
                </Timeline>
                <hr></hr>
                <h2 className='text-center'>SKILLS</h2>
                <hr></hr>
                <Timeline>
                    <Event interval={'Frontend'} title={''} subtitle={''}>
                        JavaScript, ES6, JSX, React, Redux, HTML, CSS
                    </Event>
                    <Event interval={'Testing'} title={''} subtitle={''}>
                        Jest, Enzyme, Taiko, TDD
                    </Event>
                    <Event interval={'Design'} title={''} subtitle={''}>
                        Adobe Photoshop, Adobe XD
                    </Event>
                    <Event interval={'Others'} title={''} subtitle={''}>
                        Leadership, Graphics Designing, HR Management, NGOs, Social Media
                    </Event>
                </Timeline>
                <hr></hr>
                <h2 className='text-center'>EDUCATION</h2>
                <hr></hr>
                <Timeline>
                    <Event
                        interval={'2015 – 2019'}
                        title={'UIET,Panjab University'}
                        subtitle={"Bachelor's of Engineering, Information Technology"}
                    ></Event>
                    <Event
                        interval={'2015'}
                        title={'Mount Carmel School, Chandigarh'}
                        subtitle={'CBSE, 12th Standrd'}
                    ></Event>
                    <Event
                        interval={'2013'}
                        title={'Christ King Convent School, Kapurthala'}
                        subtitle={'ICSE, 10th Standard'}
                    ></Event>
                </Timeline>
                <Footer />
            </div>
        );
    }
}

export default About;
