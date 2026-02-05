import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface LeadCardProps {
  lead: any;
  onClick?: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  if (!lead) throw new Error("Please provide lead data to LeadCard component");

  return (
    <Card
      className="w-[380px] cursor-pointer hover:shadow-lg transition bg-background"
      onClick={onClick}
    >
      <div className='absolute top-4 right-4 text-black cursor-pointer' onClick={(e) => { e.stopPropagation() }}>
        X
      </div>
      <div className="p-6">

        {/* ---------- Header ---------- */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">
             <Image src={lead?.logo } width={'120'} height={'120'} alt={lead?.name || 'Lead Avatar'}></Image>
              {lead.name || 'Unknown'}
            </h3>
 
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline truncate block"
                onClick={(e) => e.stopPropagation()}
              >
                {new URL(lead.website).hostname}
              </a>
            )}
          </div>

          <Badge
            variant={
              lead.priority === 'HIGH'
                ? 'destructive'
                : lead.priority === 'MEDIUM'
                ? 'secondary'
                : 'default'
            }
          >
            {lead.priority || 'LOW'}
          </Badge>
        </div>

        {/* ---------- Info Grid ---------- */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Business</p>
            <p className="font-medium truncate">
              {lead.businessType || '-'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Lead Score</p>
            <p className="font-bold text-lg">
              {lead.leadScore ?? '-'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium truncate">
              {lead.email || '-'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">
              {lead.phone || '-'}
            </p>
          </div>
        </div>

        {/* ---------- Tech Stack ---------- */}
        {Array.isArray(lead.technologies) && lead.technologies.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {lead.technologies.slice(0, 4).map((tech: string) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-muted text-foreground text-xs rounded"
                >
                  {tech}
                </span>
              ))}
              {lead.technologies.length > 4 && (
                <span className="px-2 py-1 bg-muted text-xs rounded">
                  +{lead.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* ---------- Footer ---------- */}
        <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
          <span>Confidence: {lead.confidence ?? 0}%</span>
          <span>
            {lead.createdAt
              ? new Date(lead.createdAt).toLocaleDateString()
              : '-'}
          </span>
        </div>

      </div>
    </Card>
  );
}
