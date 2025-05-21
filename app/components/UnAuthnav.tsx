import React from 'react'
import {Link, useNavigate } from 'react-router'
import Footer from './footer'
export default function UnAuthNav() {
  return (
    <>
     <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">StudyMate</h1>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Register
          </Link>
        </div>
      </header>

      {/* Hero & Features as before */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-100 to-purple-200">
        <h2 className="text-4xl font-extrabold mb-4">Your AI-Powered Study Buddy</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Manage your studies, join groups, share notes, and get AI help — all in one app.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Join for Free
        </button>
      </section>
      <section className="py-16 px-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Link to="/groupchat" className="p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-200">
          <h3 className="font-bold text-xl mb-2">Group Chats</h3>
          <p className="text-gray-600">Connect in real time with classmates.</p>
        </Link>
        <Link to="/planner" className="p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-200">
          <h3 className="font-bold text-xl mb-2">Study Planner</h3>
          <p className="text-gray-600">Organize tasks & track progress.</p>
        </Link>
        <Link to="/aichat" className="p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-200">
          <h3 className="font-bold text-xl mb-2">AI Q&A</h3>
          <p className="text-gray-600">Get instant AI-powered explanations.</p>
        </Link>
      </section>
    </div>
    <Footer></Footer>
    </>
  )
}
