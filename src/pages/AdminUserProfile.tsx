import { useState } from 'react';
import { Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Calendar, ArrowLeft, Edit, Save, X, Upload, Eye, Ban, Unlock, Crown, Shield, CheckCircle, XCircle, AlertTriangle, Star, TrendingUp, Send } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useNavigate, useParams } from 'react-router';
import type { PaymentPlan } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Helper to get query params
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

// Mock user data (in real app, this would be fetched based on userId from params)
const mockUserData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'jobseeker@gmail.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    school: 'Columbia University',
    major: 'Computer Science',
    graduationYear: '2026',
    bio: 'Motivated college student seeking part-time opportunities in technology and customer service. Strong communication skills and quick learner.',
    skills: ['Customer Service', 'Data Entry', 'Microsoft Office', 'Social Media', 'Problem Solving'],
    experience: [
      {
        title: 'Sales Associate',
        company: 'Retail Store',
        period: 'Summer 2024',
        description: 'Assisted customers, managed inventory, and processed transactions.',
      },
      {
        title: 'Volunteer Tutor',
        company: 'Community Center',
        period: '2023 - Present',
        description: 'Help students with homework and test preparation.',
      },
    ],
    jobTypes: ['Part-time', 'Freelance'],
    desiredRate: '$18 - $25/hr',
    paymentPlan: 'free' as PaymentPlan,
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-02-08',
    revenue: 0,
    // Credibility data
    credibility: {
      score: 75,
      trustLevel: 'Medium',
      verifications: {
        email: true,
        phone: false,
        identity: false,
        backgroundCheck: false,
      },
      performance: {
        responseRate: 85,
        completionRate: 90,
        reliabilityScore: 78,
        totalJobs: 12,
        rating: 4.2,
      },
      adminNotes: 'Good performance. Consistent attendance.',
      flags: [] as string[],
    },
  },
  '2': {
    id: '2',
    name: 'Company HR',
    email: 'employer@gmail.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    school: 'Stanford University',
    major: 'Business Administration',
    graduationYear: '2020',
    bio: 'Experienced HR professional managing recruitment and talent acquisition for tech companies.',
    skills: ['Recruitment', 'HR Management', 'Interviewing', 'Onboarding', 'Talent Development'],
    experience: [
      {
        title: 'Senior HR Manager',
        company: 'Tech Corp',
        period: '2021 - Present',
        description: 'Lead recruitment and employee relations for 500+ employees.',
      },
      {
        title: 'HR Specialist',
        company: 'StartUp Inc',
        period: '2020 - 2021',
        description: 'Managed hiring process and employee onboarding.',
      },
    ],
    jobTypes: ['Full-time', 'Contract'],
    desiredRate: '$50 - $75/hr',
    paymentPlan: 'gold' as PaymentPlan,
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '2024-02-09',
    revenue: 19.99,
    // Credibility data
    credibility: {
      score: 95,
      trustLevel: 'Verified',
      verifications: {
        email: true,
        phone: true,
        identity: true,
        backgroundCheck: true,
      },
      performance: {
        responseRate: 98,
        completionRate: 100,
        reliabilityScore: 96,
        totalJobs: 47,
        rating: 4.9,
      },
      adminNotes: 'Excellent employer. Verified business credentials.',
      flags: [] as string[],
    },
  },
};

export function AdminUserProfile() {
  const navigate = useNavigate();
  const query = useQuery();
  const userId = query.get('userId') || '1';

  const initialData = mockUserData[userId] || mockUserData['1'];
  const [userData, setUserData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [resumeFile] = useState<{ name: string, uploadDate: string }>({
    name: 'resume.pdf',
    uploadDate: 'Last updated 1 week ago'
  });

  // Email notification state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editedData);
    toast.success('User profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleSuspendUser = () => {
    const newStatus = userData.status === 'suspended' ? 'active' : 'suspended';
    setUserData({ ...userData, status: newStatus });
    toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully!`);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...editedData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setEditedData({ ...editedData, experience: newExperience });
  };

  const addSkill = (skill: string) => {
    if (skill && !editedData.skills.includes(skill)) {
      setEditedData({ ...editedData, skills: [...editedData.skills, skill] });
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = editedData.skills.filter((_, i) => i !== index);
    setEditedData({ ...editedData, skills: newSkills });
  };

  const handleViewResume = () => {
    const resumeUrl = '/sample-resume.pdf';
    window.open(resumeUrl, '_blank');
    toast.info('Opening resume in new tab...');
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in both subject and message fields');
      return;
    }

    setIsSendingEmail(true);

    // Simulate sending email
    setTimeout(() => {
      const attachmentInfo = emailAttachments.length > 0
        ? ` with ${emailAttachments.length} attachment${emailAttachments.length > 1 ? 's' : ''}`
        : '';
      toast.success(`Email sent to ${userData.name} (${userData.email})${attachmentInfo}`);
      setEmailSubject('');
      setEmailMessage('');
      setEmailAttachments([]);
      setIsSendingEmail(false);
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setEmailAttachments([...emailAttachments, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setEmailAttachments(emailAttachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getPlanBadge = (plan: PaymentPlan) => {
    const styles: Record<string, string> = {
      gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      silver: 'bg-gray-400/20 text-gray-300 border-gray-400',
      free: 'bg-slate-500/20 text-slate-300 border-slate-500',
    };
    return styles[plan] || styles.free;
  };

  const getPlanIcon = (plan: PaymentPlan) => {
    if (plan === 'gold') {
      return <Crown className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Cyberpunk Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-purple-400/70 hover:text-purple-300 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Admin Dashboard</span>
          </button>

          {/* Profile Header */}
          <Card className="p-8 mb-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-lg shadow-purple-500/20">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-md relative">
                <span className="text-white text-5xl font-bold">{userData.name.charAt(0)}</span>
                <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30"></div>
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-purple-300 text-sm">Full Name</Label>
                      <Input
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 text-sm">Bio</Label>
                      <Textarea
                        value={editedData.bio}
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        className="bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1 min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-purple-300 text-sm">Email</Label>
                        <Input
                          value={editedData.email}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                          className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300 text-sm">Phone</Label>
                        <Input
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300 text-sm">Location</Label>
                        <Input
                          value={editedData.location}
                          onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                          className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300 text-sm">School</Label>
                        <Input
                          value={editedData.school}
                          onChange={(e) => setEditedData({ ...editedData, school: e.target.value })}
                          className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-purple-300 text-3xl">{userData.name}</h1>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getPlanBadge(userData.paymentPlan)} font-bold uppercase flex items-center gap-1`}>
                            {getPlanIcon(userData.paymentPlan)}
                            {userData.paymentPlan}
                          </span>
                          {userData.status === 'suspended' && (
                            <span className="text-xs px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 font-bold uppercase">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-purple-400/70 flex items-center gap-2">
                          {userData.email}
                          <span className="flex items-center gap-1 text-yellow-400 ml-2">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="font-semibold">{userData.credibility.performance.rating}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-purple-400/70 mb-4">{userData.bio}</p>

                    {/* Admin Info Bar */}
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-purple-400/60">Joined:</span>
                          <p className="text-purple-300 font-semibold">{userData.joinDate}</p>
                        </div>
                        <div>
                          <span className="text-purple-400/60">Last Active:</span>
                          <p className="text-purple-300 font-semibold">{userData.lastActive}</p>
                        </div>
                        <div>
                          <span className="text-purple-400/60">Revenue:</span>
                          <p className="text-green-400 font-semibold">${userData.revenue.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-purple-400/60">Status:</span>
                          <p className={`font-semibold ${userData.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                            {userData.status.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        <span>{userData.school}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-green-500/80 hover:bg-green-500 text-white rounded-xl shadow-md hover:shadow-lg transition border border-green-500/50">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-xl">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleEdit} className="bg-cyan-500/80 hover:bg-cyan-500 text-white rounded-xl shadow-md hover:shadow-lg transition border border-cyan-500/50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleSuspendUser}
                        className={`rounded-xl shadow-md hover:shadow-lg transition ${userData.status === 'suspended'
                            ? 'bg-green-500/80 hover:bg-green-500 text-white border border-green-500/50'
                            : 'bg-red-500/80 hover:bg-red-500 text-white border border-red-500/50'
                          }`}
                      >
                        {userData.status === 'suspended' ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Activate User
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend User
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Send Email Notification Card */}
          <Card className="p-6 mb-6 bg-black/50 backdrop-blur-xl border-orange-500/30 shadow-lg shadow-orange-500/10">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-orange-400" />
              <h2 className="text-orange-300 text-xl">Send Email Notification</h2>
            </div>
            <p className="text-purple-400/70 text-sm mb-4">Send important announcements, policy updates, or notifications to this user.</p>

            <div className="space-y-4">
              <div>
                <Label className="text-purple-300 text-sm mb-2 block">Email Subject</Label>
                <Input
                  placeholder="e.g., Important: Policy Update on WorkHub"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-purple-300 text-sm mb-2 block">Message</Label>
                <Textarea
                  placeholder="Dear {userData.name},\n\nWe're writing to inform you about important updates to our platform policies..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl min-h-[120px] resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || !emailSubject.trim() || !emailMessage.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition border border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </Button>

                {(emailSubject || emailMessage) && (
                  <Button
                    onClick={() => {
                      setEmailSubject('');
                      setEmailMessage('');
                    }}
                    variant="outline"
                    className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-xl"
                  >
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">
                  <strong>Recipient:</strong> {userData.name} ({userData.email})
                </p>
              </div>

              <div className="mt-4">
                <Label className="text-purple-300 text-sm mb-2 block">Attachments (Optional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="email-attachments"
                  />
                  <label htmlFor="email-attachments">
                    <Button
                      type="button"
                      className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-xl flex items-center gap-2 cursor-pointer"
                      onClick={() => document.getElementById('email-attachments')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Add Files
                    </Button>
                  </label>
                </div>
                {emailAttachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-purple-400/70 mb-2">Attached Files:</p>
                    {emailAttachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <div>
                            <p className="text-sm text-purple-300">{file.name}</p>
                            <p className="text-xs text-purple-400/60">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeAttachment(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Education */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <h2 className="text-purple-300 text-xl">Education</h2>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-purple-300 text-sm">School/University</Label>
                      <Input
                        value={editedData.school}
                        onChange={(e) => setEditedData({ ...editedData, school: e.target.value })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 text-sm">Major/Field of Study</Label>
                      <Input
                        value={editedData.major}
                        onChange={(e) => setEditedData({ ...editedData, major: e.target.value })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 text-sm">Expected Graduation Year</Label>
                      <Input
                        value={editedData.graduationYear}
                        onChange={(e) => setEditedData({ ...editedData, graduationYear: e.target.value })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-purple-300">{userData.school}</h3>
                    <p className="text-sm text-purple-400/70">{userData.major}</p>
                    <p className="text-sm text-purple-400/60">Expected Graduation: {userData.graduationYear}</p>
                  </div>
                )}
              </Card>

              {/* Experience */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <h2 className="text-purple-300 text-xl">Experience</h2>
                </div>
                <div className="space-y-6">
                  {(isEditing ? editedData.experience : userData.experience).map((exp: any, index: number) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6 bg-purple-500/30" />}
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-purple-300 text-sm">Job Title</Label>
                            <Input
                              value={exp.title}
                              onChange={(e) => updateExperience(index, 'title', e.target.value)}
                              className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-purple-300 text-sm">Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-purple-300 text-sm">Period</Label>
                            <Input
                              value={exp.period}
                              onChange={(e) => updateExperience(index, 'period', e.target.value)}
                              className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-purple-300 text-sm">Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              className="bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl mt-1 min-h-[60px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-purple-300">{exp.title}</h3>
                          <p className="text-sm text-purple-400/70">{exp.company}</p>
                          <p className="text-sm text-purple-400/60 mb-2">{exp.period}</p>
                          <p className="text-sm text-purple-400/70">{exp.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Resume */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h2 className="text-purple-300 text-xl">Resume</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-300">{resumeFile.name}</p>
                      <p className="text-xs text-purple-400/60">{resumeFile.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-xl"
                      onClick={handleViewResume}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Resume
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Credibility */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-purple-300">User Credibility</h3>
                </div>

                {/* Trust Level Badge */}
                <div className="mb-4">
                  <span className="text-sm text-purple-400/60 block mb-2">Trust Level</span>
                  <Badge className={`text-sm px-3 py-1 ${userData.credibility.trustLevel === 'Verified' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                      userData.credibility.trustLevel === 'High' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' :
                        userData.credibility.trustLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                          'bg-orange-500/20 text-orange-400 border-orange-500/50'
                    }`}>
                    <Star className="w-3 h-3 mr-1 inline" />
                    {userData.credibility.trustLevel}
                  </Badge>
                </div>

                <Separator className="my-4 bg-purple-500/30" />

                {/* Verifications */}
                <div className="mb-4">
                  <h4 className="text-sm text-purple-300 mb-3">Verifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400/70 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email
                      </span>
                      {userData.credibility.verifications.email ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400/50" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400/70 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Phone
                      </span>
                      {userData.credibility.verifications.phone ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400/50" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400/70 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Identity
                      </span>
                      {userData.credibility.verifications.identity ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400/50" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400/70 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Background
                      </span>
                      {userData.credibility.verifications.backgroundCheck ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400/50" />
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-purple-500/30" />

                {/* Performance Metrics */}
                <div className="mb-4">
                  <h4 className="text-sm text-purple-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Performance
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-400/60">Response Rate</span>
                        <span className="text-purple-300 font-semibold">{userData.credibility.performance.responseRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          style={{ width: `${userData.credibility.performance.responseRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-400/60">Completion Rate</span>
                        <span className="text-purple-300 font-semibold">{userData.credibility.performance.completionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                          style={{ width: `${userData.credibility.performance.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-400/60">Reliability</span>
                        <span className="text-purple-300 font-semibold">{userData.credibility.performance.reliabilityScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                          style={{ width: `${userData.credibility.performance.reliabilityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-purple-500/30" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <p className="text-xs text-purple-400/60">Total Jobs</p>
                    <p className="text-lg font-bold text-purple-300">{userData.credibility.performance.totalJobs}</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <p className="text-xs text-purple-400/60">Rating</p>
                    {isEditing ? (
                      <div className="mt-1">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editedData.credibility.performance.rating}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0 && value <= 5) {
                              setEditedData({
                                ...editedData,
                                credibility: {
                                  ...editedData.credibility,
                                  performance: {
                                    ...editedData.credibility.performance,
                                    rating: value
                                  }
                                }
                              });
                            }
                          }}
                          className="h-8 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl text-sm"
                        />
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-yellow-400 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {userData.credibility.performance.rating}
                      </p>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {isEditing ? (
                  <div>
                    <Label className="text-purple-300 text-sm mb-2 block">Admin Notes</Label>
                    <Textarea
                      value={editedData.credibility?.adminNotes || ''}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        credibility: { ...editedData.credibility, adminNotes: e.target.value }
                      })}
                      placeholder="Add internal notes about this user..."
                      className="bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl min-h-[60px] text-xs"
                    />
                  </div>
                ) : userData.credibility.adminNotes && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-yellow-400/80 font-semibold mb-1">Admin Notes</p>
                        <p className="text-xs text-purple-300">{userData.credibility.adminNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Skills */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <h3 className="text-purple-300 mb-4">Skills</h3>
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editedData.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 rounded-xl cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition"
                          onClick={() => removeSkill(index)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Type a skill and press Enter"
                      className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill: string, index: number) => (
                        <Badge key={index} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 rounded-xl">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Card>

              {/* Availability */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <h3 className="text-purple-300 mb-4">Weekly Availability</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Monday</span>
                    <span className="text-purple-300">Afternoon, Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Tuesday</span>
                    <span className="text-purple-300">Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Wednesday</span>
                    <span className="text-purple-300">Afternoon, Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Thursday</span>
                    <span className="text-purple-300">Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Friday</span>
                    <span className="text-purple-300">Afternoon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Saturday</span>
                    <span className="text-purple-300">All day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400/60">Sunday</span>
                    <span className="text-purple-300">Morning, Afternoon</span>
                  </div>
                </div>
              </Card>

              {/* Job Preferences */}
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-md">
                <h3 className="text-purple-300 mb-4">Job Preferences</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-purple-300 text-sm mb-2 block">Preferred Job Types</Label>
                      <Input
                        placeholder="e.g., Part-time, Freelance (comma separated)"
                        value={editedData.jobTypes.join(', ')}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          jobTypes: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                        })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300 text-sm mb-2 block">Desired Hourly Rate</Label>
                      <Input
                        placeholder="e.g., $18 - $25/hr"
                        value={editedData.desiredRate}
                        onChange={(e) => setEditedData({ ...editedData, desiredRate: e.target.value })}
                        className="h-10 bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-purple-400/60 mb-1">Preferred Job Types</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.jobTypes.map((type: string, index: number) => (
                          <Badge key={index} className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 rounded-xl">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-purple-400/60 mb-1">Desired Hourly Rate</p>
                      <p className="text-purple-300">{userData.desiredRate}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}