'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Types
export interface ExportFormData {
  isEmail?: boolean;
  businessType?: BusinessType;
  minLeadScore?: number;
  from?: Date;
  to?: Date;
  today?: boolean;
  lastSevenDays?: boolean;
}

type BusinessType =
  | 'Developer Platform'
  | 'General Business'
  | 'B2B SaaS'
  | 'Consumer SaaS'
  | 'E-Commerce'
  | 'Service Business'
  | 'EdTech'
  | 'Agency'
  | 'Media/Blog';

type ExportFormat = 'CSV' | 'JSON' | 'Excel';

const businessTypes: BusinessType[] = [
  'Developer Platform',
  'General Business',
  'B2B SaaS',
  'Consumer SaaS',
  'E-Commerce',
  'Service Business',
  'EdTech',
  'Agency',
  'Media/Blog',
];

const leadScoreOptions = [
  { label: 'All Scores', value: '' },
  { label: '> 30', value: '30' },
  { label: '> 50', value: '50' },
  { label: '> 70', value: '70' },
  { label: '> 90', value: '90' },
];

export default function Export() {
  const [formData, setFormData] = useState<ExportFormData>({
    isEmail: false,
    businessType: undefined,
    minLeadScore: undefined,
    from: undefined,
    to: undefined,
  });

  const [format, setFormat] = useState<ExportFormat>('CSV');
  const [onlyWithEmail, setOnlyWithEmail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [matchingLeads, setMatchingLeads] = useState(950);

  // Handle date selection
  const handleDateSelect = (field: 'from' | 'to', date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleLeadScoreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      minLeadScore: value ? parseInt(value) : undefined,
    }));
  };

  const handleBusinessTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessType: value === 'All' ? undefined : (value as BusinessType),
    }));
  };

  // Export handler
  const handleExport = async () => {
    setIsExporting(true);

    try {
      const queryParams = new URLSearchParams();

      if (onlyWithEmail) queryParams.append('isEmail', 'true');
      if (formData.businessType) queryParams.append('businessType', formData.businessType);
      if (formData.minLeadScore) queryParams.append('minLeadScore', formData.minLeadScore.toString());
      if (formData.from) queryParams.append('from', formData.from.toISOString());
      if (formData.to) queryParams.append('to', formData.to.toISOString());

      const response = await fetch(`http://localhost:3001/api/export/leads?${queryParams.toString()}`, {
        method: 'GET',
        credentials:'include'
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${Date.now()}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export leads. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-fit  text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Export Leads</h1>

        <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#2a2a2a]">
          {/* Filter Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Filter Leads</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Date Range with Shadcn Calendar */}
                <div>
                  <label className="block text-sm font-medium mb-3">Date Range</label>
                  <div className="flex gap-4">
                    {/* From Date */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start text-left font-normal bg-[#0a0a0a] border-[#333] text-white hover:bg-[#1a1a1a] hover:text-white hover:border-teal-500"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.from ? format(formData.from, 'M/d/yyyy') : '1/1/2024'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.from}
                          onSelect={(date) => handleDateSelect('from', date)}
                          initialFocus
                          className="bg-[#1a1a1a] text-white"
                          classNames={{
                            months: "text-white",
                            caption: "text-white",
                            caption_label: "text-white",
                            nav_button: "text-white hover:bg-[#2a2a2a]",
                            head_cell: "text-gray-400",
                            cell: "text-white",
                            day: "text-white hover:bg-teal-500/20 hover:text-teal-400",
                            day_selected: "bg-teal-500 text-white hover:bg-teal-600",
                            day_today: "bg-[#2a2a2a] text-white",
                            day_outside: "text-gray-600",
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* To Date */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start text-left font-normal bg-[#0a0a0a] border-[#333] text-white hover:bg-[#1a1a1a] hover:text-white hover:border-teal-500"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.to ? format(formData.to, 'M/d/yyyy') : '1/31/2024'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.to}
                          onSelect={(date) => handleDateSelect('to', date)}
                          initialFocus
                          disabled={(date) => formData.from ? date < formData.from : false}
                          className="bg-[#1a1a1a] text-white"
                          classNames={{
                            months: "text-white",
                            caption: "text-white",
                            caption_label: "text-white",
                            nav_button: "text-white hover:bg-[#2a2a2a]",
                            head_cell: "text-gray-400",
                            cell: "text-white",
                            day: "text-white hover:bg-teal-500/20 hover:text-teal-400",
                            day_selected: "bg-teal-500 text-white hover:bg-teal-600",
                            day_today: "bg-[#2a2a2a] text-white",
                            day_outside: "text-gray-600",
                            day_disabled: "text-gray-700 opacity-50",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Lead Score */}
                <div>
                  <label className="block text-sm font-medium mb-3">Lead Score</label>
                  <select
                    value={formData.minLeadScore || ''}
                    onChange={(e) => handleLeadScoreChange(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    {leadScoreOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">Business Type</label>
                  <select
                    value={formData.businessType || 'All'}
                    onChange={(e) => handleBusinessTypeChange(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="All">All</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Only Email Checkbox */}
           

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Format Section (Duplicate for design) */}
                <div>
                  <label className="block text-xl font-semibold mb-4">Format</label>
                  <div className="space-y-3">
                    {(['CSV'] as ExportFormat[]).map((fmt) => (
                      <label key={`right-${fmt}`} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="format-right"
                            checked={format === fmt}
                            onChange={() => setFormat(fmt)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-[#333] bg-[#0a0a0a] peer-checked:border-teal-500 transition-all flex items-center justify-center">
                            {format === fmt && <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Only With Email Checkbox */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={onlyWithEmail}
                        onChange={(e) => setOnlyWithEmail(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-[#333] rounded bg-[#0a0a0a] peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all flex items-center justify-center">
                        {onlyWithEmail && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium">Only Leads with Email</span>
                  </label>
                </div>

                {/* Matching Leads Count */}
                {/* <div className="mt-6">
                  <p className="text-teal-400 text-sm">
                    <span className="font-semibold">{matchingLeads}</span> leads matching filters
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export Leads'}
          </button>
        </div>
      </div>
    </div>
  );
}