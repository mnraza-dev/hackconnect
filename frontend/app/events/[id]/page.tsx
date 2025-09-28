'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, User, ExternalLink, Plus } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  mode: 'online' | 'offline';
  location?: string;
  organizer: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    skills: string[];
  };
  skillsRequired: string[];
  tags: string[];
  currentParticipants: number;
  maxParticipants?: number;
  isActive: boolean;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  leader: {
    name: string;
    avatar?: string;
  };
  members: Array<{
    name: string;
    avatar?: string;
  }>;
  maxMembers: number;
  skillsNeeded: string[];
  isOpen: boolean;
}

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
    fetchTeams();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/event/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/events" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Events
          </Link>
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
              <Link href="/events" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Events
              </Link>
              <Link href="/teams" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Teams
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Event Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/events" className="text-indigo-600 hover:text-indigo-700 flex items-center">
                  ← Back to Events
                </Link>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  event.mode === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.mode}
                </span>
                {!isEventUpcoming(event.date) && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                    Past Event
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formatDate(event.date)}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {event.currentParticipants}/{event.maxParticipants || '∞'} participants
                </div>
              </div>
            </div>
            
            <div className="ml-8 flex space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Join Event
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Teams Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Teams ({teams.length})</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </button>
              </div>
              
              {teams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Be the first to create a team for this event.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{team.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>{team.members.length}/{team.maxMembers} members</span>
                            <span>Led by {team.leader.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              team.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {team.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </div>
                          
                          {team.skillsNeeded.length > 0 && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {team.skillsNeeded.map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                            Join Team
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                  <p className="text-sm text-gray-500">{event.organizer.email}</p>
                </div>
              </div>
              {event.organizer.bio && (
                <p className="mt-3 text-sm text-gray-600">{event.organizer.bio}</p>
              )}
              {event.organizer.skills.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {event.organizer.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {event.organizer.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{event.organizer.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Required Skills */}
            {event.skillsRequired.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {event.skillsRequired.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Start: {formatDate(event.date)}</span>
                </div>
                {event.endDate && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">End: {formatDate(event.endDate)}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">
                    {event.currentParticipants} participants
                    {event.maxParticipants && ` / ${event.maxParticipants} max`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
