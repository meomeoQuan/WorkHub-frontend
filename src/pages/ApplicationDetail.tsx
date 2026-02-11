import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
  Send,
  Paperclip,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
  const [selectedStatus, setSelectedStatus] = useState(application.status);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = () => {
    setStatus(selectedStatus);
    toast.success('Status updated successfully!', {
      style: {
        background: '#4ADE80',
        color: '#ffffff',
        border: '2px solid #22C55E',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'subject') {
      setEmailSubject(value);
    } else if (name === 'message') {
      setEmailMessage(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(Array.from(files));
    }
  };

  const handleSendEmail = () => {
    setIsSendingEmail(true);
    // Simulate email sending
    setTimeout(() => {
      setIsSendingEmail(false);
      toast.success('Email sent successfully!', {
        style: {
          background: '#4ADE80',
          color: '#ffffff',
          border: '2px solid #22C55E',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    }, 2000);
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

            {/* Send Email Notification */}
            <Card className="p-8 border-2 border-[#263238]/10 bg-gradient-to-br from-[#263238] to-[#37474F]">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-[#FF9800]" />
                <h3 className="text-white text-lg">Send Email Notification</h3>
              </div>
              <p className="text-white/60 text-sm mb-6">
                Send important announcements, policy updates, or notifications to this user.
              </p>

              <div className="space-y-5">
                {/* Email Subject */}
                <div>
                  <label className="block text-white text-sm mb-2">Email Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={emailSubject}
                    onChange={handleEmailChange}
                    placeholder="e.g., Important: Policy Update on WorkHub"
                    className="w-full px-4 py-3 bg-[#1A1F2E] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white text-sm mb-2">Message</label>
                  <textarea
                    name="message"
                    value={emailMessage}
                    onChange={handleEmailChange}
                    placeholder={`Dear ${application.candidate.name},\n\nWe're writing to inform you about important updates to our platform policies...`}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#1A1F2E] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Send Email Button */}
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || !emailSubject || !emailMessage}
                  className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:shadow-lg text-white rounded-xl px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Sending...' : 'Send Email'}</span>
                </Button>

                {/* Recipient Info */}
                <div className="flex items-center gap-3 p-4 bg-[#1A1F2E] rounded-xl border border-[#4FC3F7]/20">
                  <Mail className="w-5 h-5 text-[#4FC3F7]" />
                  <div className="flex-1">
                    <span className="text-[#4FC3F7] text-sm font-medium">Recipient: </span>
                    <span className="text-white text-sm">
                      {application.candidate.name} ({application.candidate.email})
                    </span>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-white text-sm mb-3">Attachments (Optional)</label>
                  <div className="flex flex-col gap-3">
                    <label htmlFor="email-file-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-3 bg-[#1A1F2E] border border-white/20 border-dashed rounded-xl hover:border-[#FF9800] hover:bg-[#1A1F2E]/70 transition-all">
                        <Upload className="w-5 h-5 text-[#FF9800]" />
                        <span className="text-white/70 text-sm">Add Files</span>
                      </div>
                      <input
                        id="email-file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                    </label>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#1A1F2E] rounded-xl border border-white/10"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Paperclip className="w-4 h-4 text-[#4FC3F7] flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-white/50">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setAttachments(attachments.filter((_, i) => i !== index))
                              }
                              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4 text-white/50 hover:text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
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
              <Button 
                className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl mt-4"
                onClick={handleSaveStatus}
              >
                Save Status
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-2 border-[#263238]/10">
              <h3 className="text-[#263238] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-2 border-[#263238]/20 hover:border-[#4ADE80] hover:text-[#4ADE80] rounded-xl">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Schedule Interview
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