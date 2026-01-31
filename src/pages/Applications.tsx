import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, User, MapPin, GraduationCap, Calendar, Eye, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock applications data
const applications = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    jobTitle: 'Part-time Data Entry Specialist',
    jobId: '4',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    school: 'San Francisco State University',
    appliedDate: '2 days ago',
    status: 'new',
    skills: ['Data Entry', 'Microsoft Excel', 'Attention to Detail'],
    experience: '1 year',
    coverLetter: 'I am very interested in this position and believe my skills align well...',
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    jobTitle: 'Freelance Web Developer',
    jobId: '8',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Remote',
    school: 'UC Berkeley',
    appliedDate: '1 day ago',
    status: 'reviewing',
    skills: ['React', 'JavaScript', 'Node.js', 'CSS'],
    experience: '3 years',
    coverLetter: 'I have extensive experience building responsive web applications...',
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    jobTitle: 'Part-time Data Entry Specialist',
    jobId: '4',
    email: 'emily.r@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Oakland, CA',
    school: 'Stanford University',
    appliedDate: '3 days ago',
    status: 'shortlisted',
    skills: ['Data Analysis', 'SQL', 'Excel'],
    experience: '2 years',
    coverLetter: 'As a detail-oriented professional with strong analytical skills...',
  },
  {
    id: '4',
    candidateName: 'James Wilson',
    jobTitle: 'Freelance Web Developer',
    jobId: '8',
    email: 'james.w@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Remote',
    school: 'MIT',
    appliedDate: '5 days ago',
    status: 'rejected',
    skills: ['Python', 'Django', 'React'],
    experience: '2 years',
    coverLetter: 'I am excited to apply for this freelance opportunity...',
  },
  {
    id: '5',
    candidateName: 'Lisa Anderson',
    jobTitle: 'Part-time Data Entry Specialist',
    jobId: '4',
    email: 'lisa.a@email.com',
    phone: '+1 (555) 678-9012',
    location: 'San Jose, CA',
    school: 'San Jose State University',
    appliedDate: '1 week ago',
    status: 'interviewed',
    skills: ['Data Entry', 'Database Management', 'Excel'],
    experience: '1 year',
    coverLetter: 'I would love to contribute to your team with my data entry expertise...',
  },
];

const statusColors = {
  new: 'bg-[#4FC3F7]/20 text-[#4FC3F7] border border-[#4FC3F7]/30',
  reviewing: 'bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30',
  shortlisted: 'bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30',
  interviewed: 'bg-[#263238]/20 text-[#263238] border border-[#263238]/30',
  rejected: 'bg-red-100/50 text-red-700 border border-red-200',
};

const statusLabels = {
  new: 'New',
  reviewing: 'Reviewing',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  rejected: 'Rejected',
};

export function Applications() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Protect this page - only employers can access
  useEffect(() => {
    if (!isLoggedIn || user?.userType !== 'employer') {
      navigate('/unauthorized');
    }
  }, [isLoggedIn, user, navigate]);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  // Group by status for tabs
  const newApplications = applications.filter((app) => app.status === 'new');
  const reviewingApplications = applications.filter((app) => app.status === 'reviewing');
  const shortlistedApplications = applications.filter((app) => app.status === 'shortlisted');

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#263238] mb-2 text-3xl">Job Applications</h1>
            <p className="text-[#263238]/70 text-lg">
              Manage and review applications for your job postings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-6 border-2 border-[#263238]/10 hover:shadow-lg transition">
              <p className="text-3xl text-[#263238] mb-1">{applications.length}</p>
              <p className="text-sm text-[#263238]/60">Total Applications</p>
            </Card>
            <Card className="p-6 border-2 border-[#4FC3F7]/30 bg-[#4FC3F7]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#4FC3F7] mb-1">{newApplications.length}</p>
              <p className="text-sm text-[#263238]/60">New</p>
            </Card>
            <Card className="p-6 border-2 border-[#FF9800]/30 bg-[#FF9800]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#FF9800] mb-1">{reviewingApplications.length}</p>
              <p className="text-sm text-[#263238]/60">Reviewing</p>
            </Card>
            <Card className="p-6 border-2 border-[#4ADE80]/30 bg-[#4ADE80]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#4ADE80] mb-1">{shortlistedApplications.length}</p>
              <p className="text-sm text-[#263238]/60">Shortlisted</p>
            </Card>
            <Card className="p-6 border-2 border-[#263238]/20 bg-[#263238]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#263238] mb-1">
                {applications.filter((app) => app.status === 'interviewed').length}
              </p>
              <p className="text-sm text-[#263238]/60">Interviewed</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6 border-2 border-[#263238]/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF9800] to-[#FFC107] rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#263238]">Search & Filter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#263238]/40" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 border-[#263238]/20 rounded-xl focus:ring-[#FF9800]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="border-[#263238]/20 rounded-xl focus:ring-[#FF9800]">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="4">Part-time Data Entry Specialist</SelectItem>
                  <SelectItem value="8">Freelance Web Developer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-[#263238]/20 rounded-xl focus:ring-[#FF9800]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Applications List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">
                All ({filteredApplications.length})
              </TabsTrigger>
              <TabsTrigger value="new">
                New ({newApplications.length})
              </TabsTrigger>
              <TabsTrigger value="reviewing">
                Reviewing ({reviewingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="shortlisted">
                Shortlisted ({shortlistedApplications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-2 border-[#263238]/10">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-[#FF9800]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-[#FF9800]" />
                    </div>
                    <h3 className="text-[#263238] mb-2">No applications found</h3>
                    <p className="text-[#263238]/70">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {newApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </TabsContent>

            <TabsContent value="reviewing" className="space-y-4">
              {reviewingApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {shortlistedApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: typeof applications[0] }) {
  return (
    <Card className="p-6 hover:shadow-lg transition border-2 border-[#263238]/10 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Candidate Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#FFC107] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl">{application.candidateName.charAt(0)}</span>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#263238]">{application.candidateName}</h3>
                <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                  {statusLabels[application.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              <p className="text-sm text-[#263238]/70 mb-2">
                Applied for: {application.jobTitle}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/application/${application.id}`}>
                <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center gap-2 text-[#263238]/70">
              <User className="w-4 h-4" />
              <span>{application.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263238]/70">
              <MapPin className="w-4 h-4" />
              <span>{application.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263238]/70">
              <GraduationCap className="w-4 h-4" />
              <span>{application.school}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263238]/70">
              <Calendar className="w-4 h-4" />
              <span>Applied {application.appliedDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {application.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} className="bg-[#263238]/10 text-[#263238] border-0">
                {skill}
              </Badge>
            ))}
            {application.skills.length > 4 && (
              <Badge className="bg-[#263238]/10 text-[#263238] border-0">+{application.skills.length - 4} more</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}