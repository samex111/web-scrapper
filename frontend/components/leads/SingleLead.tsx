'use client';

import { useState } from 'react';
import { Lead } from '@/types/lead';
import { 
  Globe, Mail, Phone, ExternalLink, Star, Tag, 
  Calendar, TrendingUp, Target, Award, Github, 
  Twitter, Youtube, Linkedin, Instagram, Facebook
} from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
}

export default function LeadDetail({ lead }: LeadDetailProps) {
  const [isFavorite, setIsFavorite] = useState(lead.isFavorite);
  const [notes, setNotes] = useState(lead.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const toggleFavorite = async () => {
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !isFavorite })
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const socialIcons: { [key: string]: React.ReactNode } = {
    github: <Github className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {lead.logo && (
              <img 
                src={lead.logo} 
                alt={`${lead.name} logo`}
                className="w-20 h-20 rounded-lg object-cover border"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
                <button 
                  onClick={toggleFavorite}
                  className="transition-colors"
                >
                  <Star 
                    className={`w-6 h-6 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                </button>
              </div>
              <p className="text-gray-600 mb-3">{lead.description}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(lead.priority)}`}>
                  {lead.priority} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {lead.businessType}
                </span>
                {lead.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Lead Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{lead.leadScore}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${lead.leadScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Confidence</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{lead.confidence}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${lead.confidence}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Export Count</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{lead.exportCount}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Created</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(lead.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <a 
              href={lead.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              {lead.website}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {lead.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(lead.socials).map(([platform, url]) => 
            url && (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {socialIcons[platform]}
                <span className="capitalize text-sm font-medium">{platform}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )
          )}
        </div>
      </div>

      {/* Pages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(lead.pages).map(([page, url]) => 
            url && (
              <a
                key={page}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
              >
                <span className="capitalize font-medium text-gray-700">{page}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            )
          )}
        </div>
      </div>

      {/* SEO & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Title</span>
              <span className="font-medium">{lead.seo.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">H1 Count</span>
              <span className="font-medium">{lead.seo.h1Count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Links</span>
              <span className="font-medium">{lead.seo.linkCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Images</span>
              <span className="font-medium">{lead.seo.imageCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">OG Tags</span>
              <span className={`px-2 py-1 rounded text-sm ${lead.seo.hasOgTags ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {lead.seo.hasOgTags ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Twitter Card</span>
              <span className={`px-2 py-1 rounded text-sm ${lead.seo.hasTwitterCard ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {lead.seo.hasTwitterCard ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">DOM Nodes</span>
              <span className="font-medium">{lead.performance.nodes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">JS Heap Size</span>
              <span className="font-medium">{(lead.performance.jsHeap / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Documents</span>
              <span className="font-medium">{lead.performance.documents}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Notes</h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Notes
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Add notes about this lead..."
            />
            <div className="flex gap-2">
              <button
                onClick={saveNotes}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNotes(lead.notes || '');
                  setIsEditingNotes(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">{notes || 'No notes added yet.'}</p>
        )}
      </div>
    </div>
  );
}