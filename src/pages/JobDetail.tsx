import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Calendar, ArrowLeft, Zap, Building2, Users, Star, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { SkeletonJobDetail } from '../components/SkeletonJobDetail';
import { SkeletonJobSidebar } from '../components/SkeletonJobSidebar';
import { RecruitmentDetailInfoDTO } from '../types/DTOs/ModelDTOs/RecruitmentDetailInfoDTO';
import type { ApiResponse } from '../types/ApiResponse';
import { formatRelativeTime } from '../utils/dateUtils';

export function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Home/job-detail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data: ApiResponse<RecruitmentDetailInfoDTO> = await response.json();

        if (data.success && data.data) {
          const p = data.data;
          // Map DTO to component expected structure
          setJob({
            userId: p.userId,
            title: p.jobName,
            company: p.userName,
            avatar: p.avatar,
            location: p.location || 'Remote',
            type: p.jobType || 'Full-time',
            salary: p.salary || 'Negotiable',
            postedDate: formatRelativeTime(p.createdAt),
            description: p.description || 'No description provided.',
            requirements: p.requirements ? p.requirements.split('\n').filter(r => r.trim()) : [],
            benefits: p.benefits ? p.benefits.split('\n').filter(b => b.trim()) : [],
            schedule: p.schedule || 'Flexible schedule',
            experienceLevel: p.experienceLevel || 'Entry Level',
            workSetting: p.workSetting || 'On-site',
            category: p.category || 'General',
            companyBio: p.companyDescription || p.companyBio || `${p.userName} is committed to providing excellent service and a great work environment for all employees.`,
            companyLocation: p.companyLocation,
            companyEmployees: p.companySize,
            companyRating: p.companyRating,
            companyIndustry: p.companyIndustry || 'Technology',
          });
        }
      } catch (error) {
        console.error('Error fetching job detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const typeColors: Record<string, string> = {
    'Part-time': 'bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20',
    'Part Time': 'bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20',
    'Freelance': 'bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20',
    'Seasonal': 'bg-[#4ADE80]/10 text-[#2E7D32] border border-[#4ADE80]/20',
    'Full-time': 'bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20',
    'Full Time': 'bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20',
    'Contract': 'bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20',
  };

  const typeIcons: Record<string, string> = {
    'Part-time': '⏰',
    'Part Time': '⏰',
    'Freelance': '💼',
    'Seasonal': '🌟',
    'Full-time': '🏢',
    'Full Time': '🏢',
    'Contract': '📑',
  };

  if (loading || !job) {
    return (
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#FF9800] to-[#FFC107] py-8">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4 rounded-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 pb-12">
          <SkeletonJobDetail />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF9800] to-[#FFC107] py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <SkeletonJobDetail />
            ) : (
              <Card className="p-8 border-2 border-[#263238]/10 shadow-xl">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 flex items-center justify-center flex-shrink-0 shadow-md border border-[#263238]/10">
                    {job.avatar ? (
                      <img src={job.avatar} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#263238] text-3xl">{job.company.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-[#263238] mb-2 text-2xl md:text-3xl">{job.title}</h1>
                        <p className="text-[#263238]/70 text-lg">{job.company}</p>
                      </div>
                    </div>
                    <Badge className={`${typeColors[job.type as keyof typeof typeColors] || 'bg-[#263238]/10 text-[#263238]'} mt-2 rounded-xl px-3 py-1`}>
                      <span className="mr-1">{typeIcons[job.type as keyof typeof typeIcons] || '💼'}</span>
                      {job.type}
                    </Badge>
                  </div>
                </div>

                {/* Job Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-xl border border-[#263238]/10">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#FF9800]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Location</p>
                      <p className="text-sm text-[#263238]">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Salary</p>
                      <p className="text-sm text-[#263238]">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#4FC3F7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-[#4FC3F7]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Type</p>
                      <p className="text-sm text-[#263238]">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#FFD54F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-[#F57C00]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Posted</p>
                      <p className="text-sm text-[#263238]">{job.postedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#FF9800]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Experience</p>
                      <p className="text-sm text-[#263238]">{job.experienceLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#4FC3F7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-[#4FC3F7]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#263238]/60">Setting</p>
                      <p className="text-sm text-[#263238]">{job.workSetting}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-8 bg-[#263238]/10" />

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                    <div className="w-6 h-1 bg-[#FF9800] rounded"></div>
                    Job Description
                  </h2>
                  <p className="text-[#263238]/80 whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                      <div className="w-6 h-1 bg-[#4FC3F7] rounded"></div>
                      Requirements
                    </h2>
                    <p className="text-[#263238]/80 whitespace-pre-line leading-relaxed">
                      {job.requirements.join('\n')}
                    </p>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                      <div className="w-6 h-1 bg-[#4ADE80] rounded"></div>
                      Benefits & Perks
                    </h2>
                    <p className="text-[#263238]/80 whitespace-pre-line leading-relaxed">
                      {job.benefits.join('\n')}
                    </p>
                  </div>
                )}

                {/* Schedule */}
                <div className="p-4 bg-[#FF9800]/10 rounded-xl border border-[#FF9800]/20">
                  <h3 className="text-[#263238] mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FF9800]" />
                    Schedule
                  </h3>
                  <p className="text-[#263238]/80">{job.schedule}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {loading ? (
              <SkeletonJobSidebar />
            ) : (
              <Card className="p-6 sticky top-24 border-2 border-[#263238]/10 shadow-xl">
                <Link to={`/job/${id}/apply`}>
                  <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 rounded-xl shadow-lg shadow-[#FF9800]/30 mb-3">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Apply Now
                  </Button>
                </Link>
                <Button variant="outline" className="w-full mb-6 h-12 border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Job
                </Button>

                <Separator className="my-6 bg-[#263238]/10" />

                {/* Company Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-[#263238]">About {job.company}</h3>
                    </div>
                    <p className="text-sm text-[#263238]/70 mb-4">
                      {job.companyBio}
                    </p>
                  </div>

                  {(job.companyLocation || job.companyEmployees || job.companyRating) && (
                    <div className="space-y-3 p-4 bg-white rounded-xl border border-[#263238]/10">
                      {job.companyLocation && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-[#FF9800]" />
                          <span className="text-[#263238]/80">{job.companyLocation}</span>
                        </div>
                      )}
                      {job.companyEmployees && (
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-[#4FC3F7]" />
                          <span className="text-[#263238]/80">{job.companyEmployees}</span>
                        </div>
                      )}
                      {job.companyRating && (
                        <div className="flex items-center gap-3 text-sm">
                          <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                          <span className="text-[#263238]/80">{job.companyRating} rating</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Link to={`/profile/user?userId=${job.userId}`}>
                    <Button variant="link" className="p-0 h-auto text-[#FF9800] hover:text-[#F57C00]">
                      View User profile →
                    </Button>
                  </Link>
                </div>

                <Separator className="my-6 bg-[#263238]/10" />

                {/* Quick Stats */}
                <div className="p-4 bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 rounded-xl">
                  <p className="text-xs text-[#263238]/60 mb-2">Application Status</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#263238]/10 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#FF9800] h-full w-2/3 rounded-full"></div>
                    </div>
                    <span className="text-xs text-[#263238]">45 applied</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}