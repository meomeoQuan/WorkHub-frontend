import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Part-time' | 'Freelance' | 'Seasonal';
  description: string;
  salary: string;
  postedDate: string;
  logo?: string;
}

export function UserJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [postedJobs, setPostedJobs] = useState<Job[]>([
    {
      id: '4',
      title: 'Part-time Data Entry Specialist',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Part-time',
      description: 'Accurate and detail-oriented data entry work. Remote options available.',
      salary: '$18-22/hr',
      postedDate: '1 week ago',
      logo: user?.profileImage,
    },
    {
      id: '8',
      title: 'Freelance Web Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Freelance',
      description: 'Build responsive websites for small businesses. React experience preferred.',
      salary: '$50-80/hr',
      postedDate: '2 days ago',
      logo: user?.profileImage,
    },
  ]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Part-time':
        return 'bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30';
      case 'Freelance':
        return 'bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/30';
      case 'Seasonal':
        return 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30';
      default:
        return 'bg-[#263238]/20 text-[#263238] border-[#263238]/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-[#263238]/10 rounded animate-pulse mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-48 bg-[#263238]/10 rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-[#263238]/10 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="p-6 border-[#263238]/10 shadow-md">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#263238]/10 rounded-xl animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-3/4 bg-[#263238]/10 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-[#263238]/10 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-[#263238]/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[#263238]">Posted Jobs ({postedJobs.length})</h1>
            <Link to="/post-job/create">
              <Button className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white rounded-xl shadow-md hover:shadow-lg transition">
                Post New Job
              </Button>
            </Link>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {postedJobs.length > 0 ? (
              postedJobs.map((job) => (
                <Card key={job.id} className="p-6 border-[#263238]/10 shadow-md hover:shadow-lg transition">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center flex-shrink-0 shadow-sm">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">{job.company.charAt(0)}</span>
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-[#263238] mb-1">{job.title}</h3>
                          <p className="text-[#263238]/70">{job.company}</p>
                        </div>
                        <Badge className={`rounded-xl ${getTypeColor(job.type)}`}>
                          <Briefcase className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#263238]/60 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#263238]/40" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#263238]/40" />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>

                      <p className="text-[#263238]/70 mb-4">{job.description}</p>

                      <div className="flex items-center gap-3">
                        <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                          <Zap className="w-4 h-4 mr-2" />
                          Quick Apply
                        </Button>
                        <Link to={`/jobs/${job.id}`}>
                          <Button variant="outline" className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 border-[#263238]/10 shadow-md text-center">
                <Briefcase className="w-16 h-16 text-[#263238]/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#263238] mb-2">No Jobs Posted Yet</h3>
                <p className="text-[#263238]/60 mb-6">Start posting jobs to attract talented candidates.</p>
                <Link to="/post-job/create">
                  <Button className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white rounded-xl shadow-md hover:shadow-lg transition">
                    Post Your First Job
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
