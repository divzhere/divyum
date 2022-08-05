import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";

let time = new Date();
let year = time.getFullYear();

export function Footer() {
  return (
    <footer>
      <hr></hr>
      <div className="footer_container">
        <div className="icons-group">
          <a
            href="mailto:divz7777@gmail.com?Subject=Hello%20again"
            target="_blank"
            style={{ color: "#333333" }}
            rel="noopener noreferrer"
          >
            <AiFillMail />
          </a>
          <a
            href="https://github.com/divzhere"
            target="_blank"
            style={{ color: "#333333" }}
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/divyum-bhumra-48718b102/"
            target="_blank"
            style={{ color: "#333333" }}
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
        <hr></hr>
        <p
          className="text-center"
          style={{ fontSize: "14px", fontWeight: "lighter" }}
        >
          &copy; {year} by Divyum Bhumra |
          <a
            href="https://www.icons8.com"
            target="_blank"
            style={{ color: "#333333" }}
            rel="noopener noreferrer"
          >
            {" "}
            &copy; {year} Icons8 LLC
          </a>
          <br></br>
        </p>
      </div>
    </footer>
  );
}
