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

// API Response Interfaces
interface Application {
  id: string;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar: string | null;
  jobTitle: string;
  status: string;
  applicantLocation: string | null;
  applicantSchool: string | null;
  appliedDate: string;
}

interface ApplicationSummary {
  totalApplications: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
}

interface JobName {
  id: number;
  jobName: string;
}

const statusColors: Record<string, string> = {
  New: 'bg-[#4FC3F7]/20 text-[#4FC3F7] border border-[#4FC3F7]/30',
  Reviewing: 'bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30',
  Shortlisted: 'bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30',
  Interviewed: 'bg-[#263238]/20 text-[#263238] border border-[#263238]/30',
  Rejected: 'bg-red-100/50 text-red-700 border border-red-200',
  Accepted: 'bg-green-100/50 text-green-700 border border-green-200',
};

export function Applications() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('0'); // 0 means 'all'
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [tabValue, setTabValue] = useState('all');

  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<ApplicationSummary | null>(null);
  const [jobs, setJobs] = useState<JobName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSummary();
      fetchJobs();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchApplications();
    }
  }, [isLoggedIn, jobFilter, statusFilter, searchQuery, tabValue]);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Application/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Application/get-jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // Map tabValue to status filter if tab is not 'all'
      const effectiveStatus = tabValue === 'all' ? statusFilter :
        tabValue === 'new' ? 'New' :
          tabValue === 'reviewing' ? 'Reviewing' :
            tabValue === 'shortlisted' ? 'Shortlisted' : statusFilter;

      const queryParams = new URLSearchParams();
      if (effectiveStatus !== 'All Status') queryParams.append('Status', effectiveStatus);
      if (jobFilter !== '0') queryParams.append('JobId', jobFilter);
      if (searchQuery) queryParams.append('SearchTerm', searchQuery);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Application?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <p className="text-3xl text-[#263238] mb-1">{summary?.totalApplications || 0}</p>
              <p className="text-sm text-[#263238]/60">Total Applications</p>
            </Card>
            <Card className="p-6 border-2 border-[#4FC3F7]/30 bg-[#4FC3F7]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#4FC3F7] mb-1">{summary?.new || 0}</p>
              <p className="text-sm text-[#263238]/60">New</p>
            </Card>
            <Card className="p-6 border-2 border-[#FF9800]/30 bg-[#FF9800]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#FF9800] mb-1">{summary?.reviewing || 0}</p>
              <p className="text-sm text-[#263238]/60">Reviewing</p>
            </Card>
            <Card className="p-6 border-2 border-[#4ADE80]/30 bg-[#4ADE80]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#4ADE80] mb-1">{summary?.shortlisted || 0}</p>
              <p className="text-sm text-[#263238]/60">Shortlisted</p>
            </Card>
            <Card className="p-6 border-2 border-[#263238]/20 bg-[#263238]/5 hover:shadow-lg transition">
              <p className="text-3xl text-[#263238] mb-1">
                {summary?.interviewed || 0}
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
                  <SelectItem value="0">All Jobs</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id.toString()}>{job.jobName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-[#263238]/20 rounded-xl focus:ring-[#FF9800]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Applications List */}
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">
                All ({summary?.totalApplications || 0})
              </TabsTrigger>
              <TabsTrigger value="new">
                New ({summary?.new || 0})
              </TabsTrigger>
              <TabsTrigger value="reviewing">
                Reviewing ({summary?.reviewing || 0})
              </TabsTrigger>
              <TabsTrigger value="shortlisted">
                Shortlisted ({summary?.shortlisted || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={tabValue} className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-[#FF9800] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#263238]/60 font-medium italic">Loading applications...</p>
                </div>
              ) : applications.length > 0 ? (
                applications.map((app) => (
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  return (
    <Card className="p-6 hover:shadow-lg transition border-2 border-[#263238]/10 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Candidate Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-[#FF9800]/10 overflow-hidden flex-shrink-0">
          {application.applicantAvatar ? (
            <img src={application.applicantAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FF9800] to-[#FFC107] flex items-center justify-center">
              <span className="text-white text-xl">{application.applicantName.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#263238] font-semibold">{application.applicantName}</h3>
                <Badge className={`${statusColors[application.status]} px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                  {application.status}
                </Badge>
              </div>
              <p className="text-sm text-[#263238]/70 mb-2 font-medium">
                Applied for: <span className="text-[#FF9800]">{application.jobTitle}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/application/${application.id}`}>
                <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md border-0" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-[#263238]/60">
              <User className="w-3.5 h-3.5" />
              <span>{application.applicantEmail}</span>
            </div>
            {application.applicantLocation && (
              <div className="flex items-center gap-2 text-[#263238]/60">
                <MapPin className="w-3.5 h-3.5" />
                <span>{application.applicantLocation}</span>
              </div>
            )}
            {application.applicantSchool && (
              <div className="flex items-center gap-2 text-[#263238]/60">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{application.applicantSchool}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[#263238]/60">
              <Calendar className="w-3.5 h-3.5" />
              <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}