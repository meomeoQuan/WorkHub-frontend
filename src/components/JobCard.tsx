import { Link } from "react-router";
import { MapPin, Clock, DollarSign, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  postedDate?: string;
  logo?: string;
}

export function JobCard({
  id,
  title,
  company,
  location,
  type,
  description,
  salary,
  postedDate,
  logo,
}: JobCardProps) {
  const typeColors: Record<string, string> = {
    "Part-time": "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
    "Part Time": "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
    Freelance: "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    Seasonal: "bg-[#4ADE80]/10 text-[#2E7D32] border border-[#4ADE80]/20",
    "Full-time": "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    "Full Time": "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    Contract: "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
  };

  const typeIcons: Record<string, string> = {
    "Part-time": "⏰",
    "Part Time": "⏰",
    Freelance: "💼",
    Seasonal: "🌟",
    "Full-time": "🏢",
    "Full Time": "🏢",
    Contract: "📑",
  };

  return (
    <Card className="p-6 hover:shadow-xl transition border-2 hover:border-[#FF9800] group bg-white">
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
          {logo ? (
            <img
              src={logo}
              alt={company}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <span className="text-[#263238] text-xl">
              {company.charAt(0)}
            </span>
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-[#263238] mb-1 group-hover:text-[#FF9800] transition truncate">
                {title}
              </h3>
              <p className="text-sm text-[#263238]/70">
                {company}
              </p>
            </div>
            <Badge className={`${typeColors[type as keyof typeof typeColors] || 'bg-[#263238]/10 text-[#263238]'} rounded-xl px-3 py-1 flex items-center gap-1`}>
              <span className="mr-1">{typeIcons[type as keyof typeof typeIcons] || '💼'}</span>
              {type}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[#263238]/60 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                <span className="text-[#263238]">{salary}</span>
              </div>
            )}
            {postedDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{postedDate}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-[#263238]/70 mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex gap-2">
            <Link to={`/job/${id}`} className="flex-1">
              <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                <Zap className="w-4 h-4 mr-2" />
                Quick Apply
              </Button>
            </Link>
            <Link to={`/job/${id}`}>
              <Button
                variant="outline"
                className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
              >
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}