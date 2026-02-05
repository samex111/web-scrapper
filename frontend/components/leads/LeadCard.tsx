import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface LeadCardProps {
  lead: any;
  onClick?: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition"  onClick={onClick}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{lead.name || 'Unknown'}</h3>
            <a 
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
              onClick={(e:any) => e.stopPropagation()}
            >
              {lead.website}
            </a>
          </div>
          <Badge variant={lead.priority === 'HIGH' ? 'destructive' : lead.priority === 'MEDIUM' ? 'secondary' : 'default'}>
{lead.priority}
</Badge>
</div>
{/* Info Grid */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Business Type</p>
        <p className="font-medium">{lead.businessType || 'Unknown'}</p>
      </div>
      <div>
        <p className="text-gray-600">Lead Score</p>
        <p className="font-bold text-lg">{lead.leadScore}</p>
      </div>
      <div>
        <p className="text-gray-600">Email</p>
        <p className="font-medium truncate">{lead.email || '-'}</p>
      </div>
      <div>
        <p className="text-gray-600">Phone</p>
        <p className="font-medium">{lead.phone || '-'}</p>
      </div>
    </div>
    {/* Info Grid */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Business Type</p>
        <p className="font-medium">{lead.businessType || 'Unknown'}</p>
      </div>
      <div>
        <p className="text-gray-600">Lead Score</p>
        <p className="font-bold text-lg">{lead.leadScore}</p>
      </div>
      <div>
        <p className="text-gray-600">Email</p>
        <p className="font-medium truncate">{lead.email || '-'}</p>
      </div>
      <div>
        <p className="text-gray-600">Phone</p>
        <p className="font-medium">{lead.phone || '-'}</p>
      </div>
    </div>
    
    {/* Tech Stack */}
    {lead.technologies && lead.technologies.length > 0 && (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {lead.technologies.slice(0, 4).map((tech: string) => (
            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tech}
            </span>
          ))}
          {lead.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{lead.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-600">
      <span>Confidence: {lead.confidence}%</span>
      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
</Card>
  )}