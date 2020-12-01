import React from 'react';
import contact from '../images/contact.png';
import { Row, Col } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Timeline, Event } from 'react-timeline-scribble';
import { Footer } from './Footer';
export function Portfolio() {
    return (
        <div>
            <Helmet>
                <title>Divyum - Portfolio</title>
            </Helmet>
            <Row>
                <Col md='3'></Col>
                <Col md='6'>
                    <img
                        src={contact}
                        className='img-fluid'
                        loading='lazy'
                        style={{ maxHeight: '600px' }}
                    ></img>
                </Col>
                <Col md='3'></Col>
            </Row>
            <hr></hr>
            <Timeline>
            <Event
                    interval={'Jun 2020 - Dec 2020'}
                    title={<a href='https://dev.wrkspot.com/cloud/signin' target='_blank'>
                    Wrkspot Onboarding
                </a>}
                    subtitle={'Wrkspot, Artesia'}
                >
                    • Developing features to assist the Onboarding Process for new Corporations and New Hotels.<br></br>• Technologies used: Reactjs, HTML, SCSS, Javascript
                </Event>
                <Event
                    interval={'Feb 2020 - May 2020'}
                    title={'Icecap Loan Underwriting'}
                    subtitle={'Icecap Group, New York'}
                >
                    • Web app for Private & Hard Money Mortgage Lending company to manage the Loan
                    Underwriting Process.<br></br>• Technologies used: React, HTML, CSS, Azure for
                    CI/CD, and Deployment
                </Event>
                <Event
                    interval={'Feb 2020 - Present'}
                    title={
                        <a href='https://divz.xyz/' target='_blank'>
                            divz.xyz
                        </a>
                    }
                    subtitle={'Personal Website'}
                >
                    • Technologies used: React, HTML, CSS, Netlify for CI/CD and Deployment, Google
                    Analytics.<br></br>
                </Event>
                <Event
                    interval={'December 2019'}
                    title={
                        <a href='https://webscanner.akirastack.io/' target='_blank'>
                            Website Scanner
                        </a>
                    }
                    subtitle={'XenonStack, Chandigarh'}
                >
                    • Web app for scanning the Technology Stack and Security Check for websites.
                    <br></br>• Technologies used: React, Redux, JavaScript, HTML, CSS.
                </Event>
                <Event
                    interval={'September 2019 - November 2019'}
                    title={
                        <a href='https://careers.xenonstack.com/' target='_blank'>
                            XenonStack Careers
                        </a>
                    }
                    subtitle={'XenonStack, Chandigarh'}
                >
                    • Worked on adding new features in Content Management System for Admin & User
                    Portal, Integrated API Endpoints.<br></br>• Technologies used: React, Redux,
                    JavaScript, HTML, CSS.
                </Event>
            </Timeline>
            <Footer />
        </div>
    );
}
