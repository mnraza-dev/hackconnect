'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, MapPin, Clock, Search, Filter, Plus, ExternalLink } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  mode: 'online' | 'offline';
  location?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  skillsRequired: string[];
  tags: string[];
  currentParticipants: number;
  maxParticipants?: number;
  isActive: boolean;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'offline'>('all');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEvents(data.events || []);
      
      // Extract unique skills for filtering
      const skills = new Set<string>();
      data.events?.forEach((event: Event) => {
        event.skillsRequired.forEach(skill => skills.add(skill));
      });
      setAvailableSkills(Array.from(skills));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMode = filterMode === 'all' || event.mode === filterMode;
    const matchesSkills = filterSkills.length === 0 || 
                         filterSkills.some(skill => event.skillsRequired.includes(skill));
    return matchesSearch && matchesMode && matchesSkills && event.isActive;
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

  const isEventUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const toggleSkillFilter = (skill: string) => {
    setFilterSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
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
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/teams" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Teams
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Messages
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover Hackathons & Events
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Find your next challenge and connect with amazing developers
            </p>
            <Link
              href="/events/create"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Sort by Date</option>
                <option>Sort by Participants</option>
                <option>Sort by Title</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMode('all');
                setFilterSkills([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Skills Filter */}
          {availableSkills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {availableSkills.slice(0, 10).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterSkills.includes(skill)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
                {availableSkills.length > 10 && (
                  <span className="px-3 py-1 text-sm text-gray-500">
                    +{availableSkills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or create a new event.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.mode === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.mode}
                      </span>
                      {!isEventUpcoming(event.date) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Past
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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

                  {event.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {event.tags.length > 3 && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                            +{event.tags.length - 3} more
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
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                    >
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
