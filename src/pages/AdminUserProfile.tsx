import { useState, useEffect } from 'react';
import { Mail, Phone, FileText, ArrowLeft, Edit, Save, X, Upload, Crown, Star, Send, Ban, Unlock, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth, type PaymentPlan } from '../contexts/AuthContext';
import type { UserRole } from '../types/User';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
const API = import.meta.env.VITE_API_URL;


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
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '1';
  const { user, isAuthLoading, updateUser } = useAuth();
  const initialData = mockUserData[userId] || mockUserData['1'];
  const [userData, setUserData] = useState<any>(initialData);
  const [isEditing, setIsEditing] = useState(searchParams.get('mode') === 'edit');
  const [editedData, setEditedData] = useState<any>(userData);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthLoading && user?.userType !== 'admin') {
      navigate('/');
    }
  }, [user, navigate, isAuthLoading]);

  const handleActivateVerified = () => {
    toast.success('Account has been verified and activated successfully!');
  };



  // Fetch real user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API}/api/Admin/users/${userId}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.data) {
          const data = result.data;
          
          setUserData({
            id: data.id.toString(),
            name: data.fullName || 'N/A',
            email: data.email,
            phone: data.phone || 'N/A',
            location: data.location || 'N/A',
            paymentPlan: (data.paymentPlan || 'free') as PaymentPlan,
            status: data.status === 'suspended' ? 'suspended' : 'active',
            role: data.role !== undefined && data.role !== null ? data.role : 1,
            userType: (data.role === 0 ? 'admin' : 'user'),
            revenue: data.revenue || 0,
            industryFocus: data.industry,
            website: data.website,
            companySize: data.companySize,
            foundedYear: data.foundedYear,
            googleMapsEmbedUrl: data.googleMapsEmbedUrl,
            totalJobs: data.totalJobs || 0,
            totalPosts: data.totalPosts || 0,
            rating: data.rating || 0,
            school: data.educations && data.educations.length > 0 ? data.educations[0].school : 'N/A',
            major: data.educations && data.educations.length > 0 ? data.educations[0].fieldOfStudy : 'N/A',
            graduationYear: data.educations && data.educations.length > 0 ? data.educations[0].endYear : 'N/A',
            skills: data.skills || [],
            experience: (data.experiences || []).map((e: any) => ({
              title: e.title,
              company: e.company,
              period: `${new Date(e.startDate).getFullYear()} - ${e.endDate ? new Date(e.endDate).getFullYear() : 'Present'}`,
              description: e.description || ''
            })),
            jobTypes: data.jobTypes || [],
            desiredRate: data.desiredRate || 'N/A',
            credibility: {
              score: (data.rating || 0) * 20, // Example mapping
              trustLevel: data.rating >= 4.5 ? 'Verified' : data.rating >= 4 ? 'High' : 'Medium',
              verifications: {
                email: true,
                phone: !!data.phone,
                identity: false,
                backgroundCheck: false,
              },
              performance: {
                responseRate: 90,
                completionRate: 95,
                reliabilityScore: 88,
                totalJobs: data.totalJobs || 0,
                rating: data.rating || 0,
              },
              adminNotes: '',
              flags: [],
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Email notification state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
        const payload = {
          fullName: editedData.fullName || editedData.name,
          email: editedData.email,
          phoneNumber: editedData.phone || editedData.phoneNumber,
          role: editedData.role,
          status: editedData.status === 'suspended' ? 'suspended' : 'active',
          bio: editedData.bio,
          location: editedData.location,
          school: editedData.school,
          totalJobs: editedData.totalJobs,
          totalPosts: editedData.totalPosts,
          rating: editedData.rating,
          industryFocus: editedData.industryFocus,
          website: editedData.website,
          companySize: editedData.companySize,
          foundedYear: editedData.foundedYear,
          googleMapsEmbedUrl: editedData.googleMapsEmbedUrl,
        };

      const res = await fetch(`${API}/api/Admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setUserData({
          ...editedData,
          name: editedData.fullName || editedData.name
        });
        
        // CRITICAL: Update local auth state if we just edited ourselves
        if (user?.id?.toString() === userId) {
           const updatedAuthUser = { 
             ...user, 
             fullName: editedData.fullName || editedData.name,
             email: editedData.email,
             role: editedData.role,
             userType: (editedData.role === 0 ? 'admin' : 'user') as UserRole
           };
           updateUser(updatedAuthUser);
        }

        toast.success('User profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Failed to update user profile');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error('An error occurred while updating user profile');
    }
  };

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSuspendUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API}/api/Admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const newStatus = userData.status === 'suspended' ? 'active' : 'suspended';
        setUserData({ ...userData, status: newStatus });
        toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully!`);
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error('An error occurred while updating user status');
    }
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in both subject and message fields');
      return;
    }

    setIsSendingEmail(true);

    const attachmentInfo = emailAttachments.length > 0
      ? ` with ${emailAttachments.length} attachment${emailAttachments.length > 1 ? 's' : ''}`
      : '';
    toast.success(`Email sent to ${userData.name} (${userData.email})${attachmentInfo}`);
    setEmailSubject('');
    setEmailMessage('');
    setEmailAttachments([]);
    setIsSendingEmail(false);
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
    const styles = {
      diamond: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
      gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      silver: 'bg-gray-400/20 text-gray-300 border-gray-400',
      free: 'bg-slate-500/20 text-slate-300 border-slate-500',
    };
    return styles[plan] || styles.free;
  };

  const getPlanIcon = (plan: PaymentPlan) => {
    if (plan === 'diamond' || plan === 'gold') {
      return <Crown className="w-4 h-4" />;
    }
    return null;
  };
  if (isAuthLoading) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-500 animate-pulse text-xl font-bold">LOADING SYSTEM DATA...</div>
      </div>
    );
  }

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

          {isEditing ? (
            /* REDESIGNED EDIT FORM (On-page) - DARK THEME */
            <Card className="p-8 mb-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-lg shadow-purple-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="mb-8 pb-4 border-b border-purple-500/30 flex justify-between items-center">
                 <div>
                   <h2 className="text-2xl font-bold text-purple-100">Edit Admin User Profile</h2>
                   <p className="text-purple-400/60 text-sm">Modify user information and platform metrics.</p>
                 </div>
                 <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-8 h-12 flex items-center gap-2 font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                    >
                      <Save className="w-5 h-5" /> Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="bg-transparent border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white rounded-xl px-8 h-12 flex items-center gap-2 font-bold transition-all"
                    >
                      <X className="w-5 h-5" /> Cancel
                    </Button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-purple-300 text-sm font-semibold">User Name</Label>
                    <Input
                      value={editedData.fullName || editedData.name || ''}
                      onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                      className="bg-purple-900/20 border-purple-500/30 rounded-lg h-12 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300 text-sm font-semibold">User Role</Label>
                    <Select 
                      value={editedData.userType || 'user'} 
                      onValueChange={(val) => setEditedData({ ...editedData, userType: val, role: val === 'admin' ? 0 : 1 })}
                    >
                      <SelectTrigger className="bg-purple-900/20 border-purple-500/30 rounded-lg h-12 text-white focus:ring-2 focus:ring-purple-500">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-purple-500/30 text-black">
                        <SelectItem value="user" className="focus:bg-purple-100 hover:bg-purple-100 cursor-pointer">User</SelectItem>
                        <SelectItem value="admin" className="focus:bg-purple-100 hover:bg-purple-100 cursor-pointer">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300 text-sm font-semibold">Email Address</Label>
                    <Input
                      value={editedData.email || ''}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="bg-purple-900/20 border-purple-500/30 rounded-lg h-12 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300 text-sm font-semibold">Phone Number</Label>
                    <Input
                      value={editedData.phone || editedData.phoneNumber || ''}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      className="bg-purple-900/20 border-purple-500/30 rounded-lg h-12 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-300 text-sm font-semibold">Rating</Label>
                    <Input type="number" step="0.1" value={editedData.rating || 0} onChange={e => setEditedData({...editedData, rating: parseFloat(e.target.value) || 0})} className="h-12 bg-purple-900/20 border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500 rounded-lg" />
                  </div>

               </div>
            </Card>
          ) : (
            <>
              {/* Profile Header (View Mode) */}
              <Card className="p-8 mb-6 bg-black/50 backdrop-blur-xl border-purple-500/30 shadow-lg shadow-purple-500/20">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-md relative">
                    <span className="text-white text-5xl font-bold">{userData.name.charAt(0)}</span>
                    <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
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
                            <span className="font-semibold">{userData.rating}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-purple-400/70 mb-4">{userData.bio}</p>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400/70">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span>{userData.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button onClick={handleEdit} className="bg-cyan-500/80 hover:bg-cyan-500 text-white rounded-xl shadow-md hover:shadow-lg transition border border-cyan-500/50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      
                      <Button 
                        onClick={handleActivateVerified}
                        className="bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition border border-emerald-500/50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate Verified Account
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
                      placeholder="Dear {userData.name},..."
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}