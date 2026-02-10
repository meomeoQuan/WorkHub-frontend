import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Calendar, ArrowLeft, Zap, Building2, Users, Star, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { SkeletonJobDetail } from '../components/SkeletonJobDetail';
import { SkeletonJobSidebar } from '../components/SkeletonJobSidebar';

// Mock job data
const jobsData: Record<string, any> = {
  '1': {
    title: 'Part-time Barista',
    company: 'Coffee & Co.',
    companyUsername: '@coffee_and_co',
    companyEmployees: '50-200 employees',
    companyRating: '4.8 rating',
    location: 'New York, NY',
    type: 'Part-time',
    salary: '$15-18/hr',
    postedDate: '2 days ago',
    description: `We are looking for an enthusiastic and friendly barista to join our team at Coffee & Co. 
    
    As a barista, you will be responsible for preparing and serving a variety of coffee drinks, tea, and other beverages to our customers. You'll work in a fast-paced environment where customer satisfaction is our top priority.
    
    This is a great opportunity for students or anyone looking for flexible part-time work with a supportive team.`,
    requirements: [
      'Previous barista or customer service experience preferred',
      'Ability to work in a fast-paced environment',
      'Excellent communication and interpersonal skills',
      'Availability to work early mornings and weekends',
      'Food handler certification (or willing to obtain)',
    ],
    benefits: [
      'Flexible scheduling',
      'Free coffee and staff discounts',
      'Tips in addition to hourly wage',
      'Training provided',
    ],
    schedule: 'Monday-Sunday, 6:00 AM - 2:00 PM shifts available',
  },
  '2': {
    title: 'Freelance Graphic Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'Freelance',
    salary: '$40-60/hr',
    postedDate: '1 day ago',
    description: `Design Studio is seeking a talented freelance graphic designer to work on various client projects.
    
    You'll be creating visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, and captivate consumers. You'll work on projects ranging from brand identity to marketing materials.
    
    This is a remote position with flexible hours, perfect for experienced designers looking for project-based work.`,
    requirements: [
      'Bachelor\'s degree in Graphic Design or related field',
      'Minimum 2 years of professional design experience',
      'Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      'Strong portfolio demonstrating creative and technical skills',
      'Excellent time management and communication skills',
    ],
    benefits: [
      'Fully remote work',
      'Flexible hours',
      'Diverse project portfolio',
      'Competitive hourly rate',
    ],
    schedule: 'Flexible, project-based',
  },
};

export function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    const timer = setTimeout(() => {
      const jobData = jobsData[id || '1'] || jobsData['1'];
      setJob(jobData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const typeColors = {
    'Part-time': 'bg-[#4FC3F7]/20 text-[#1E293B] border border-[#4FC3F7]/30',
    'Freelance': 'bg-[#FF9800]/20 text-[#1E293B] border border-[#FF9800]/30',
    'Seasonal': 'bg-[#4ADE80]/20 text-[#1E293B] border border-[#4ADE80]/30',
  };

  const typeIcons = {
    'Part-time': '⏰',
    'Freelance': '💼',
    'Seasonal': '🌟',
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
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-[#263238] text-3xl">{job.company.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-[#263238] mb-2 text-2xl md:text-3xl">{job.title}</h1>
                        <p className="text-[#263238]/70 text-lg">{job.company}</p>
                      </div>
                    </div>
                    <Badge className={`${typeColors[job.type as keyof typeof typeColors]} mt-2`}>
                      <span className="mr-1">{typeIcons[job.type as keyof typeof typeIcons]}</span>
                      {job.type}
                    </Badge>
                  </div>
                </div>

                {/* Job Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-xl border border-[#263238]/10">
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
                <div className="mb-8">
                  <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                    <div className="w-6 h-1 bg-[#4FC3F7] rounded"></div>
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-[#263238]/80">
                        <div className="w-2 h-2 rounded-full bg-[#4FC3F7] mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                    <div className="w-6 h-1 bg-[#4ADE80] rounded"></div>
                    Benefits & Perks
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#4ADE80]/10 rounded-xl border border-[#4ADE80]/20">
                        <div className="w-2 h-2 rounded-full bg-[#4ADE80] mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-[#263238]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
                      {job.company} is committed to providing excellent service and a great work environment for all employees.
                    </p>
                  </div>

                  <div className="space-y-3 p-4 bg-white rounded-xl border border-[#263238]/10">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-[#FF9800]" />
                      <span className="text-[#263238]/80">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-4 h-4 text-[#4FC3F7]" />
                      <span className="text-[#263238]/80">{job.companyEmployees}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                      <span className="text-[#263238]/80">{job.companyRating}</span>
                    </div>
                  </div>

                  <Link to="/profile/employer">
                    <Button variant="link" className="p-0 h-auto text-[#FF9800] hover:text-[#F57C00]">
                      View company profile →
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
    </div>
  );
}