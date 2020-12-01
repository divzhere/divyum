import React from 'react'
import { FaGithub, FaTwitter,FaInstagram, FaLinkedin} from 'react-icons/fa';
import {AiFillInstagram, AiFillMail} from 'react-icons/ai'

export function Footer() {
    return (
        <div>
        <hr></hr>
        <div className="icons-group">
        <a href="https://twitter.com/divz7777" target="_blank" style={{color:"#333333"}}><FaTwitter/></a>
        
        <a href="mailto:divz7777@gmail.com?Subject=Hello%20again" target="_blank" style={{color:"#333333"}}><AiFillMail /></a>

        <a href="https://github.com/divzhere" target="_blank" style={{color:"#333333"}}><FaGithub /></a>

        <a href="https://www.linkedin.com/in/divyum-bhumra-48718b102/" target="_blank" style={{color:"#333333"}}><FaLinkedin/></a>

        </div>
        <hr></hr>
        <p className="text-center" style={{fontSize:"14px", fontWeight:"lighter"}}>&copy; 2020 Divyum Bhumra</p>
     </div>
    )
}
