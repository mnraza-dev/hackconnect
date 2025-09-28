'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, MessageCircle, Plus, Search, Filter, MapPin, Clock } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  mode: 'online' | 'offline';
  location?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  skillsRequired: string[];
  currentParticipants: number;
  maxParticipants?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  availability: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'offline'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || event.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                HackConnect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/events" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Events
              </Link>
              <Link href="/teams" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Teams
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Messages
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 text-sm font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Discover hackathons, find teammates, and build amazing projects together.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Events Joined</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Teams</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Messages</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Projects</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
                Upcoming Events
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as 'all' | 'online' | 'offline')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Events</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <Link
                  href="/events/create"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterMode !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by creating your first event.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.mode === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.mode}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {event.currentParticipants}/{event.maxParticipants || '∞'} participants
                      </div>
                    </div>

                    {event.skillsRequired.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {event.skillsRequired.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {event.skillsRequired.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{event.skillsRequired.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {event.organizer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{event.organizer.name}</span>
                      </div>
                      <Link
                        href={`/events/${event._id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
