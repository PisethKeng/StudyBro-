import React from 'react'
import { FaGithub, FaTwitter } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
export default function Footer() {
  return (
    <>
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">© 2025 StudyMate. All rights reserved.</div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/PisethKeng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://x.com/PisethKeng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="http://linkedin.com/in/keng-piseth-3998632b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700"
            >
              <BsLinkedin size={24} />
            </a>
          </div>
        </div>
        </>
  )
}
