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
import { Search, Briefcase, MapPin, Calendar, Clock, Building2, ArrowLeft, FileText } from 'lucide-react';

// Mock user's submitted applications data
const myApplications = [
  {
    id: '1',
    jobTitle: 'Part-time Barista',
    company: 'Coffee & Co.',
    location: 'New York, NY',
    jobType: 'Part-time',
    salary: '$15-18/hr',
    appliedDate: '2024-01-20',
    status: 'under-review',
    jobId: '1',
    coverLetter: 'I am passionate about coffee and customer service...',
  },
  {
    id: '2',
    jobTitle: 'Weekend Retail Associate',
    company: 'Urban Fashion',
    location: 'Brooklyn, NY',
    jobType: 'Part-time',
    salary: '$16-20/hr',
    appliedDate: '2024-01-18',
    status: 'accepted',
    jobId: '2',
    coverLetter: 'My experience in retail makes me a perfect fit...',
  },
  {
    id: '3',
    jobTitle: 'Freelance Graphic Designer',
    company: 'Creative Agency',
    location: 'Remote',
    jobType: 'Freelance',
    salary: '$30-50/hr',
    appliedDate: '2024-01-15',
    status: 'rejected',
    jobId: '3',
    coverLetter: 'I have 3 years of experience in graphic design...',
  },
  {
    id: '4',
    jobTitle: 'Delivery Driver',
    company: 'FastFood Co.',
    location: 'Manhattan, NY',
    jobType: 'Part-time',
    salary: '$18-22/hr + tips',
    appliedDate: '2024-01-22',
    status: 'pending',
    jobId: '5',
    coverLetter: 'I am reliable and have a clean driving record...',
  },
];

const statusColors = {
  pending: 'bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30',
  'under-review': 'bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/30',
  accepted: 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30',
  rejected: 'bg-[#263238]/20 text-[#263238] border-[#263238]/30',
};

const statusLabels = {
  pending: 'Pending',
  'under-review': 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export function MyApplications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter applications
  const filteredApplications = myApplications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by status for tabs
  const pendingApplications = myApplications.filter((app) => app.status === 'pending');
  const underReviewApplications = myApplications.filter((app) => app.status === 'under-review');
  const acceptedApplications = myApplications.filter((app) => app.status === 'accepted');
  const rejectedApplications = myApplications.filter((app) => app.status === 'rejected');

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-[#263238] mb-2 text-3xl">My Applications</h1>
            <p className="text-[#263238]/70">
              Track and manage all your job applications in one place
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-[#263238]/10 shadow-md">
              <p className="text-3xl text-[#263238] font-bold">{myApplications.length}</p>
              <p className="text-sm text-[#263238]/60 mt-1">Total Applications</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#FF9800]/5 to-[#FF9800]/10">
              <p className="text-3xl text-[#FF9800] font-bold">{underReviewApplications.length}</p>
              <p className="text-sm text-[#263238]/60 mt-1">Under Review</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#4ADE80]/5 to-[#4ADE80]/10">
              <p className="text-3xl text-[#4ADE80] font-bold">{acceptedApplications.length}</p>
              <p className="text-sm text-[#263238]/60 mt-1">Accepted</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#4FC3F7]/5 to-[#4FC3F7]/10">
              <p className="text-3xl text-[#4FC3F7] font-bold">{pendingApplications.length}</p>
              <p className="text-sm text-[#263238]/60 mt-1">Pending</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6 border-[#263238]/10 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#263238]/40" />
                <Input
                  placeholder="Search by job title or company..."
                  className="pl-10 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-[#263238]/20 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Applications List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-[#FAFAFA] p-1 rounded-xl">
              <TabsTrigger 
                value="all"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#FF9800] data-[state=active]:shadow-sm"
              >
                All ({filteredApplications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4FC3F7] data-[state=active]:shadow-sm"
              >
                Pending ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="under-review"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#FF9800] data-[state=active]:shadow-sm"
              >
                Review ({underReviewApplications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="accepted"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4ADE80] data-[state=active]:shadow-sm"
              >
                Accepted ({acceptedApplications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="rejected"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#263238] data-[state=active]:shadow-sm"
              >
                Rejected ({rejectedApplications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <FileText className="w-16 h-16 text-[#263238]/20 mx-auto mb-4" />
                  <p className="text-[#263238]/60 mb-4">No applications found</p>
                  <Link to="/jobs">
                    <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl">
                      Browse Jobs
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingApplications.length > 0 ? (
                pendingApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <p className="text-[#263238]/60">No pending applications</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="under-review" className="space-y-4">
              {underReviewApplications.length > 0 ? (
                underReviewApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <p className="text-[#263238]/60">No applications under review</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedApplications.length > 0 ? (
                acceptedApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <p className="text-[#263238]/60">No accepted applications yet</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedApplications.length > 0 ? (
                rejectedApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <p className="text-[#263238]/60">No rejected applications</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: typeof myApplications[0] }) {
  return (
    <Card className="p-6 hover:shadow-xl transition-all border-[#263238]/10 shadow-md hover:border-[#FF9800]/20">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center flex-shrink-0 shadow-md">
          <Building2 className="w-8 h-8 text-white" />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#263238] text-lg">{application.jobTitle}</h3>
                <Badge className={`${statusColors[application.status as keyof typeof statusColors]} rounded-lg`}>
                  {statusLabels[application.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              <p className="text-sm text-[#263238]/70 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {application.company}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/job/${application.jobId}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                >
                  View Job
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
            <div className="flex items-center gap-2 text-[#263238]/70">
              <MapPin className="w-4 h-4 text-[#FF9800]" />
              <span>{application.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263238]/70">
              <Briefcase className="w-4 h-4 text-[#FF9800]" />
              <span>{application.jobType}</span>
            </div>
            <div className="flex items-center gap-2 text-[#263238]/70">
              <Clock className="w-4 h-4 text-[#FF9800]" />
              <span>{application.salary}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#263238]/10">
            <div className="flex items-center gap-2 text-sm text-[#263238]/60">
              <Calendar className="w-4 h-4" />
              <span>Applied {getTimeAgo(application.appliedDate)}</span>
            </div>
            {application.status === 'accepted' && (
              <Badge className="bg-[#4ADE80] text-white rounded-xl">
                🎉 Congratulations!
              </Badge>
            )}
            {application.status === 'under-review' && (
              <span className="text-sm text-[#FF9800]">⏳ In progress...</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}