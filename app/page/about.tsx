import React from 'react';
import Footer from '~/components/footer';

export default function About() {
  return (
    <>

    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex-grow">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">About StudyMate</h1>
            <div className="flex flex-col gap-6 m-4 mt-6">
            <p className="text-gray-600 mb-4 text-xl">
              Welcome to <span className="font-semibold">StudyMate</span>, your all-in-one platform for planning and organizing your studies. <br></br>We provide intuitive tools to help you track tasks, set priorities, and monitor your progress.
            </p>
            <p className="text-gray-600 mb-4 text-xl">
              Our mission is to empower students to achieve academic success through seamless collaboration and effective time management. Whether you’re tackling assignments, preparing for exams, or managing group projects, StudyMate is here to support you every step of the way.
            </p>
            <p className="text-gray-600 text-xl">
              Founded in 2025 by a solo developer in Cambodia that is currently pursuing in BSC of Computer Science degree. 
            </p>
            </div>
        </div>
      </div>
    </div>
     {/* Footer */}
     <Footer></Footer>
    </>
  );
}