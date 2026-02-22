import { useState, useEffect, useCallback } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Briefcase, MapPin, Calendar, Clock, Building2, ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// API Interfaces
interface MyApplicationSummary {
  totalApplications: number;
  pending: number;
  underReview: number;
  accepted: number;
  rejected: number;
}

interface Application {
  id: number;
  jobId: number;
  jobName: string;
  company: string;
  companyLogo: string | null;
  location: string;
  jobType: string;
  salary: string;
  appliedDate: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

const statusColors = {
  'pending': 'bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30',
  'under review': 'bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/30',
  'accepted': 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30',
  'rejected': 'bg-[#263238]/20 text-[#263238] border-[#263238]/30',
};

const statusLabels = {
  'pending': 'Pending',
  'under review': 'Under Review',
  'accepted': 'Accepted',
  'rejected': 'Rejected',
};

// Map backend statuses to frontend keys if needed, but the MappingProfile seems to already return "Pending", "Under Review", etc.
// Let's normalize to lowercase to match our statusColors keys
const normalizeStatus = (status: string) => status.toLowerCase();

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<MyApplicationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/MyApplication/my-application-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: ApiResponse<MyApplicationSummary> = await response.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async (search: string, status: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      const params = new URLSearchParams();
      if (search) params.append('SearchTerm', search);
      // Status in backend expects "Pending", "Under Review", etc.
      if (status !== 'all') {
        const backendStatus = status === 'under-review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1);
        params.append('Status', backendStatus);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/MyApplication?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: ApiResponse<Application[]> = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(searchQuery, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, fetchApplications]);

  // Tab counts are already in the summary or can be derived
  const pendingCount = summary?.pending || 0;
  const underReviewCount = summary?.underReview || 0;
  const acceptedCount = summary?.accepted || 0;
  const rejectedCount = summary?.rejected || 0;
  const totalCount = summary?.totalApplications || 0;

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
            <h1 className="text-[#263238] mb-2 text-3xl font-bold">My Applications</h1>
            <p className="text-[#263238]/70">
              Track and manage all your job applications in one place
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-[#263238]/10 shadow-md">
              {isSummaryLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#263238]/20" />
              ) : (
                <p className="text-3xl text-[#263238] font-bold">{totalCount}</p>
              )}
              <p className="text-sm text-[#263238]/60 mt-1">Total Applications</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#FF9800]/5 to-[#FF9800]/10">
              {isSummaryLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#FF9800]/20" />
              ) : (
                <p className="text-3xl text-[#FF9800] font-bold">{underReviewCount}</p>
              )}
              <p className="text-sm text-[#263238]/60 mt-1">Under Review</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#4ADE80]/5 to-[#4ADE80]/10">
              {isSummaryLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#4ADE80]/20" />
              ) : (
                <p className="text-3xl text-[#4ADE80] font-bold">{acceptedCount}</p>
              )}
              <p className="text-sm text-[#263238]/60 mt-1">Accepted</p>
            </Card>
            <Card className="p-6 border-[#263238]/10 shadow-md bg-gradient-to-br from-[#4FC3F7]/5 to-[#4FC3F7]/10">
              {isSummaryLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#4FC3F7]/20" />
              ) : (
                <p className="text-3xl text-[#4FC3F7] font-bold">{pendingCount}</p>
              )}
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
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-[#FAFAFA] p-1 rounded-xl">
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#FF9800] data-[state=active]:shadow-sm"
              >
                All ({totalCount})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4FC3F7] data-[state=active]:shadow-sm"
              >
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger
                value="under-review"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#FF9800] data-[state=active]:shadow-sm"
              >
                Review ({underReviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="accepted"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4ADE80] data-[state=active]:shadow-sm"
              >
                Accepted ({acceptedCount})
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#263238] data-[state=active]:shadow-sm"
              >
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-[#FF9800]" />
                </div>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="p-12 text-center border-[#263238]/10">
                  <FileText className="w-16 h-16 text-[#263238]/20 mx-auto mb-4" />
                  <p className="text-[#263238]/60 mb-4">No applications found</p>
                  <Link to="/job-filter">
                    <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl">
                      Browse Jobs
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const normStatus = normalizeStatus(application.status);

  return (
    <Card className="p-6 hover:shadow-xl transition-all border-[#263238]/10 shadow-md hover:border-[#FF9800]/20">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#263238]/10 overflow-hidden">
          {application.companyLogo ? (
            <img src={application.companyLogo} alt={application.company} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#263238] text-lg font-bold">{application.jobName}</h3>
                <Badge className={`${statusColors[normStatus as keyof typeof statusColors] || statusColors.pending} rounded-lg border-0`}>
                  {statusLabels[normStatus as keyof typeof statusLabels] || application.status}
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
                  className="border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl font-medium"
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
            {normStatus === 'accepted' && (
              <Badge className="bg-[#4ADE80] text-white rounded-xl border-0">
                🎉 Congratulations!
              </Badge>
            )}
            {normStatus === 'under review' && (
              <span className="text-sm text-[#FF9800] font-medium">⏳ In progress...</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}