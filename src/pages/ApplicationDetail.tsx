import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

interface ApplicationDetailData {
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantLocation: string;
  applicantAvatar: string;
  appliedDate: string;
  coverLetter: string;
  cvUrl: string;
  status: string;
  recruitmentId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  educations: Array<{
    id: number;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
  }>;
  experiences: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
  }>;
}

const statusConfig: Record<string, any> = {
  'New': {
    label: 'New',
    color: 'bg-[#FFC107]/20 text-[#F57C00] border-[#FFC107]/30',
    icon: Clock,
  },
  'Reviewing': {
    label: 'Reviewing',
    color: 'bg-[#4FC3F7]/20 text-[#0277BD] border-[#4FC3F7]/30',
    icon: FileText,
  },
  'Accepted': {
    label: 'Accepted',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  'Rejected': {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
};

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ApplicationDetail/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplication(data.data);
        setStatus(data.data.status);
        setSelectedStatus(data.data.status);
      } else {
        toast.error(data.message || 'Failed to fetch details');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = statusConfig[status] || statusConfig['New'];
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ApplicationDetail/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          applicationId: Number(id),
          status: selectedStatus
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatus(selectedStatus);
        toast.success('Status updated successfully!', {
          style: { background: '#4ADE80', color: '#ffffff', borderRadius: '12px' },
        });
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'subject') setEmailSubject(value);
    else if (name === 'message') setEmailMessage(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachments(Array.from(e.target.files));
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    const formData = new FormData();
    formData.append('ApplicationId', id || '0');
    formData.append('Subject', emailSubject);
    formData.append('Body', emailMessage);
    attachments.forEach(file => formData.append('Attachments', file));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ApplicationDetail/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Email sent successfully!', {
          style: { background: '#4ADE80', color: '#ffffff', borderRadius: '12px' },
        });
        setEmailSubject('');
        setEmailMessage('');
        setAttachments([]);
      } else {
        toast.error(data.message || 'Send failed');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#FF9800] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#263238]/60 font-medium italic">Loading application details...</p>
      </div>
    );
  }

  if (!application) return null;

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
                  <h2 className="text-[#263238] mb-2 text-xl">{application.applicantName}</h2>
                  <Badge className={`${currentStatus.color} border py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {currentStatus.label}
                  </Badge>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#FF9800]/10 overflow-hidden flex-shrink-0">
                  {application.applicantAvatar ? (
                    <img src={application.applicantAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FF9800] to-[#FFC107] flex items-center justify-center">
                      <span className="text-white text-2xl">{application.applicantName.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF9800]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#FF9800]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Email</p>
                    <p className="text-sm text-[#263238]">{application.applicantEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#4FC3F7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#4FC3F7]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Phone</p>
                    <p className="text-sm text-[#263238]">{application.applicantPhone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#4ADE80]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Location</p>
                    <p className="text-sm text-[#263238]">{application.applicantLocation || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#263238]/60">Applied</p>
                    <p className="text-sm text-[#263238]">{new Date(application.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[#263238]/10" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#FF9800] mt-1" />
                  <div>
                    <p className="text-sm font-medium text-[#263238] mb-1">Education</p>
                    {application.educations && application.educations.length > 0 ? (
                      application.educations.map((edu) => (
                        <p key={edu.id} className="text-sm text-[#263238]/70">
                          {edu.degree} in {edu.fieldOfStudy} - {edu.school}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-[#263238]/60">No education history provided</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#4FC3F7] mt-1" />
                  <div>
                    <p className="text-sm font-medium text-[#263238] mb-1">Experience</p>
                    {application.experiences && application.experiences.length > 0 ? (
                      application.experiences.map((exp) => (
                        <p key={exp.id} className="text-sm text-[#263238]/70">
                          {exp.position} at {exp.company} ({new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'})
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-[#263238]/60">No professional experience provided</p>
                    )}
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
            {application.cvUrl && (
              <Card className="p-6 border-2 border-[#263238]/10 hover:border-[#FF9800] transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FF9800]/20 transition-colors">
                      <FileText className="w-6 h-6 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-[#263238] font-medium">Candidate Resume</p>
                      <p className="text-sm text-[#263238]/60">PDF Document</p>
                    </div>
                  </div>
                  <a href={application.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-2 border-[#263238]/20 rounded-xl hover:bg-[#FF9800] hover:text-white hover:border-[#FF9800] transition-all">
                      View Resume
                    </Button>
                  </a>
                </div>
              </Card>
            )}

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
                    placeholder={`Dear ${application.applicantName},\n\nWe're writing to inform you about important updates to our platform policies...`}
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
                      {application.applicantName} ({application.applicantEmail})
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
                <p className="font-medium text-[#263238] mb-1">{application.jobTitle}</p>
                <p className="text-sm text-[#263238]/70 mb-2">{application.companyName}</p>
                <div className="flex items-center gap-2 text-sm text-[#263238]/60">
                  <MapPin className="w-4 h-4" />
                  <span>{application.jobLocation}</span>
                </div>
              </div>
              <Link to={`/job/${application.recruitmentId}`}>
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
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl mt-4"
                onClick={handleSaveStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Saving...' : 'Save Status'}
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
                <Link to={`/profile/${application.applicantId}`}>
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