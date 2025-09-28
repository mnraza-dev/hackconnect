'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Users, MessageCircle, MapPin, Code, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">HackConnect</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Collaborate. 
            <span className="text-indigo-600"> Create.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join hackathons, find teammates, and build amazing projects together. 
            The ultimate platform for developers, designers, and innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors">
              Start Building
            </Link>
            <Link href="/events" className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors">
              Browse Events
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600">Powerful tools for hackathon participants and organizers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Discovery</h3>
              <p className="text-gray-600">Find hackathons and events that match your interests and skills.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Formation</h3>
              <p className="text-gray-600">Create teams, find teammates, and collaborate on amazing projects.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Communicate with your team through instant messaging and video calls.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location-based</h3>
              <p className="text-gray-600">Discover local events and connect with developers in your area.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Matching</h3>
              <p className="text-gray-600">Find teammates with complementary skills for your projects.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Built with modern technology for the best user experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of developers building the future together.</p>
          <Link href="/auth/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">HackConnect</h3>
            <p className="text-gray-400">Connecting developers, one hackathon at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;