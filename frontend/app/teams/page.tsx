'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, Filter, MapPin, Calendar, User, MessageCircle } from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  description: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location?: string;
    mode: 'online' | 'offline';
  };
  leader: {
    _id: string;
    name: string;
    avatar?: string;
    skills: string[];
  };
  members: Array<{
    _id: string;
    name: string;
    avatar?: string;
    skills: string[];
  }>;
  maxMembers: number;
  skillsNeeded: string[];
  isOpen: boolean;
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      // For now, we'll use a mock API endpoint
      // In a real app, you'd fetch teams from the backend
      const mockTeams: Team[] = [
        {
          _id: '1',
          name: 'AI Innovators',
          description: 'Building the next generation of AI-powered applications',
          event: {
            _id: 'event1',
            title: 'AI Hackathon 2024',
            date: '2024-02-15T09:00:00Z',
            location: 'San Francisco, CA',
            mode: 'offline'
          },
          leader: {
            _id: 'user1',
            name: 'John Doe',
            skills: ['Python', 'Machine Learning', 'TensorFlow']
          },
          members: [
            {
              _id: 'user2',
              name: 'Jane Smith',
              skills: ['React', 'Node.js', 'MongoDB']
            }
          ],
          maxMembers: 4,
          skillsNeeded: ['Python', 'AI/ML', 'Data Science'],
          isOpen: true
        },
        {
          _id: '2',
          name: 'Blockchain Builders',
          description: 'Creating decentralized applications for the future',
          event: {
            _id: 'event2',
            title: 'Web3 Summit',
            date: '2024-02-20T10:00:00Z',
            location: 'Online',
            mode: 'online'
          },
          leader: {
            _id: 'user3',
            name: 'Mike Johnson',
            skills: ['Solidity', 'Web3', 'Ethereum']
          },
          members: [],
          maxMembers: 5,
          skillsNeeded: ['Blockchain', 'Smart Contracts', 'Web3'],
          isOpen: true
        }
      ];
      
      setTeams(mockTeams);
      
      // Extract unique skills for filtering
      const skills = new Set<string>();
      mockTeams.forEach(team => {
        team.skillsNeeded.forEach(skill => skills.add(skill));
        team.leader.skills.forEach(skill => skills.add(skill));
        team.members.forEach(member => member.skills.forEach(skill => skills.add(skill)));
      });
      setAvailableSkills(Array.from(skills));
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = filterSkills.length === 0 || 
                         filterSkills.some(skill => team.skillsNeeded.includes(skill));
    return matchesSearch && matchesSkills && team.isOpen;
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
          <p className="mt-4 text-gray-600">Loading teams...</p>
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
              Find Your Team
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect with developers and build amazing projects together
            </p>
            <Link
              href="/teams/create"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Team
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>All Teams</option>
                <option>Looking for Members</option>
                <option>Full Teams</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
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

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or create a new team.
              </p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div key={team._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {team.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        team.event.mode === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {team.event.mode}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        team.members.length < team.maxMembers
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {team.members.length < team.maxMembers ? 'Open' : 'Full'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {team.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(team.event.date)}
                    </div>
                    {team.event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {team.event.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {team.members.length}/{team.maxMembers} members
                    </div>
                  </div>

                  {team.skillsNeeded.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Skills Needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.skillsNeeded.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {team.skillsNeeded.length > 3 && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                            +{team.skillsNeeded.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Team Members:</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-medium text-gray-600">
                            {team.leader.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {team.members.slice(0, 3).map((member, index) => (
                          <div key={index} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs font-medium text-gray-600">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {team.members.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{team.members.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-600" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Led by {team.leader.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Join Team
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
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

export default TeamsPage;
