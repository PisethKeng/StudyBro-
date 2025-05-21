// src/pages/landing.tsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import Footer from '~/components/footer'
import { auth } from '../lib/types/config'
import DeleteAccount from '~/components/DeleteAccount'
// Nav Components import
import UnAuthNav from '~/components/UnAuthnav'
import Authnav from '~/components/Authnav'



export default function Landing() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [])

  // if signed in → show private UI
  if (user) return <Authenticated user={user} onSignOut={() => {
    signOut(auth).then(() => navigate('/'))
  }} />

  // else → public landing
  return <Unauthenticated />
}

function Unauthenticated() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">StudyBro</h1>
          <nav className="hidden md:flex space-x-6">
            {/* Theme Toggle */}
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

interface AuthProps {
  user: User
  onSignOut: () => void
}
function Authenticated({ user, onSignOut }: AuthProps) {
  return (
    <>
    {/* Nav Bar Section */}
    <Authnav></Authnav>
    <div className="min-h-screen bg-white text-gray-800">
    {/* Main Content */}
      <main className="py-12 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* replace these cards with your protected widgets */}
        <Link to="/planner" className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg">
          <h3 className="font-bold text-xl mb-2">Your Planner</h3>
          <p>View and manage your study tasks.</p>
        </Link>
        <Link to="/groupchat" className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg">
          <h3 className="font-bold text-xl mb-2">Group Chats</h3>
          <p>Continue your class discussions.</p>
        </Link>
        <Link to="/aichat" className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg">
          <h3 className="font-bold text-xl mb-2">AI Q&A</h3>
          <p>Ask new questions or review past answers.</p>
        </Link>   
      </main>
      <DeleteAccount></DeleteAccount>
    </div>
    {/* Delete account */}
    {/* Footer */}
    <Footer></Footer>
    </>
  )
}
