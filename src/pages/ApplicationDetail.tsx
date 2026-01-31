import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock application data
const applicationData: Record<string, any> = {
  '1': {
    id: '1',
    candidate: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      education: 'BA in Communications - NYU',
      experience: '2 years in customer service',
    },
    job: {
      title: 'Part-time Barista',
      company: 'Coffee & Co.',
      location: 'New York, NY',
    },
    status: 'pending',
    appliedDate: '2024-01-20',
    coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the Part-time Barista position at Coffee & Co. With over 2 years of customer service experience and a genuine passion for coffee culture, I am confident I would be a valuable addition to your team.\n\nDuring my previous role at a busy cafe, I developed excellent multitasking abilities and learned to work efficiently in fast-paced environments. I pride myself on creating positive customer experiences and building rapport with regular customers.\n\nI am particularly drawn to Coffee & Co. because of your commitment to quality and community. I would love the opportunity to contribute to your team's success while continuing to develop my barista skills.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to Coffee & Co.\n\nBest regards,\nSarah Johnson`,
  },
};

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const application = applicationData[id || '1'] || applicationData['1'];
  
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState('');

  const statusConfig = {
    pending: {
      label: 'Pending Review',
      color: 'bg-[#FFC107]/20 text-[#F57C00] border-[#FFC107]/30',
      icon: Clock,
    },
    reviewed: {
      label: 'Reviewed',
      color: 'bg-[#4FC3F7]/20 text-[#0277BD] border-[#4FC3F7]/30',
      icon: FileText,
    },
    accepted: {
      label: 'Accepted',
      color: 'bg-[#4ADE80]/20 text-[#15803D] border-[#4ADE80]/30',
      icon: CheckCircle,
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircle,
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig];
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // In a real app, this would update the backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Applications</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#263238] mb-3 text-3xl">Application Details</h1>
          <p className="text-[#263238]/70">Review candidate information and manage application status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Info */}
            <Card className="p-8 border-2 border-[#263238]/10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[#263238] mb-2 text-xl">{application.candidate.name}</h2>
                  <Badge className={`${currentStatus.color} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {currentStatus.label}
                  </Badge>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800]/20 to-[#4FC3F7]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">{application.candidate.name.charAt(0)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF9800]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#FF9800]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Email</p>
                    <p className="text-sm text-[#263238]">{application.candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#4FC3F7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#4FC3F7]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Phone</p>
                    <p className="text-sm text-[#263238]">{application.candidate.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#4ADE80]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Location</p>
                    <p className="text-sm text-[#263238]">{application.candidate.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Applied</p>
                    <p className="text-sm text-[#263238]">{application.appliedDate}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[#263238]/10" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#FF9800] mt-1" />
                  <div>
                    <p className="text-sm font-medium text-[#263238] mb-1">Education</p>
                    <p className="text-sm text-[#263238]/70">{application.candidate.education}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#4FC3F7] mt-1" />
                  <div>
                    <p className="text-sm font-medium text-[#263238] mb-1">Experience</p>
                    <p className="text-sm text-[#263238]/70">{application.candidate.experience}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cover Letter */}
            <Card className="p-8 border-2 border-[#263238]/10">
              <h3 className="text-[#263238] mb-4 flex items-center gap-2">
                <div className="w-6 h-1 bg-[#FF9800] rounded"></div>
                Cover Letter
              </h3>
              <p className="text-[#263238]/80 whitespace-pre-line leading-relaxed">{application.coverLetter}</p>
            </Card>

            {/* Resume */}
            <Card className="p-6 border-2 border-[#263238]/10 hover:border-[#FF9800] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#FF9800]" />
                  </div>
                  <div>
                    <p className="text-[#263238] font-medium">Resume.pdf</p>
                    <p className="text-sm text-[#263238]/60">245 KB</p>
                  </div>
                </div>
                <Button variant="outline" className="border-2 border-[#263238]/20 rounded-xl">
                  Download
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Info */}
            <Card className="p-6 border-2 border-[#263238]/10">
              <h3 className="text-[#263238] mb-4">Applied For</h3>
              <div className="p-4 bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 rounded-xl mb-4">
                <p className="font-medium text-[#263238] mb-1">{application.job.title}</p>
                <p className="text-sm text-[#263238]/70 mb-2">{application.job.company}</p>
                <div className="flex items-center gap-2 text-sm text-[#263238]/60">
                  <MapPin className="w-4 h-4" />
                  <span>{application.job.location}</span>
                </div>
              </div>
              <Link to={`/job/${application.id}`}>
                <Button variant="outline" className="w-full border-2 border-[#263238]/20 hover:border-[#FF9800] rounded-xl">
                  View Job Details
                </Button>
              </Link>
            </Card>

            {/* Status Management */}
            <Card className="p-6 border-2 border-[#263238]/10">
              <h3 className="text-[#263238] mb-4">Update Status</h3>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="border-2 border-[#263238]/20 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Separator className="my-4 bg-[#263238]/10" />

              <div className="space-y-3">
                <Label className="text-[#263238]">Internal Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  rows={4}
                  className="border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                />
                <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl">
                  Save Notes
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-2 border-[#263238]/10">
              <h3 className="text-[#263238] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-2 border-[#263238]/20 hover:border-[#4ADE80] hover:text-[#4ADE80] rounded-xl">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start border-2 border-[#263238]/20 hover:border-[#4FC3F7] hover:text-[#4FC3F7] rounded-xl">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Link to="/profile/candidate">
                  <Button variant="outline" className="w-full justify-start border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}