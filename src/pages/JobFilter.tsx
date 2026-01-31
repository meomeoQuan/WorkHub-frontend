import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Briefcase, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { JobCard } from '../components/JobCard';
import { SkeletonCardGrid } from '../components/SkeletonCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { useNavigate } from 'react-router';

// Mock job data
const allJobs = [
  {
    id: '1',
    title: 'Part-time Barista',
    company: 'Coffee & Co.',
    location: 'New York, NY',
    type: 'Part-time',
    description: 'Looking for enthusiastic barista to join our team. Flexible hours, great tips, and free coffee!',
    salary: '$15-18/hr',
    postedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Freelance Graphic Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'Freelance',
    description: 'Create stunning visuals for various client projects. Portfolio required.',
    salary: '$40-60/hr',
    postedDate: '1 day ago',
  },
  {
    id: '3',
    title: 'Seasonal Retail Associate',
    company: 'Fashion Boutique',
    location: 'Chicago, IL',
    type: 'Seasonal',
    description: 'Help customers find their perfect outfit during our busy season. Great employee discount!',
    salary: '$14-16/hr',
    postedDate: '3 days ago',
  },
  {
    id: '4',
    title: 'Part-time Data Entry Specialist',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Part-time',
    description: 'Accurate and detail-oriented data entry work. Remote options available.',
    salary: '$18-22/hr',
    postedDate: '1 week ago',
  },
  {
    id: '5',
    title: 'Freelance Content Writer',
    company: 'Marketing Agency',
    location: 'Remote',
    type: 'Freelance',
    description: 'Write engaging blog posts and website content for various clients.',
    salary: '$30-50/hr',
    postedDate: '4 days ago',
  },
  {
    id: '6',
    title: 'Seasonal Delivery Driver',
    company: 'Quick Delivery',
    location: 'Boston, MA',
    type: 'Seasonal',
    description: 'Deliver packages during our peak season. Own vehicle required.',
    salary: '$16-20/hr',
    postedDate: '5 days ago',
  },
  {
    id: '7',
    title: 'Part-time Tutor',
    company: 'Learning Center',
    location: 'Los Angeles, CA',
    type: 'Part-time',
    description: 'Help students excel in math and science. Evening hours available.',
    salary: '$25-35/hr',
    postedDate: '1 day ago',
  },
  {
    id: '8',
    title: 'Freelance Web Developer',
    company: 'Tech Solutions',
    location: 'Remote',
    type: 'Freelance',
    description: 'Build responsive websites for small businesses. React experience preferred.',
    salary: '$50-80/hr',
    postedDate: '2 days ago',
  },
  {
    id: '9',
    title: 'Seasonal Event Staff',
    company: 'Event Planners Inc.',
    location: 'Miami, FL',
    type: 'Seasonal',
    description: 'Assist with setup and coordination of events. Weekends required.',
    salary: '$15-20/hr',
    postedDate: '1 week ago',
  },
];

export function JobFilter() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 6;

  // Temporary filter states (before applying)
  const [tempLocation, setTempLocation] = useState('all');
  const [tempCategory, setTempCategory] = useState('all');
  const [tempJobType, setTempJobType] = useState('all');

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate loading when filters change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchKeyword, location, jobType, currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handler for search button click
  const handleSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handler for apply filters button click
  const handleApplyFilters = () => {
    setLocation(tempLocation);
    setCategory(tempCategory);
    setJobType(tempJobType);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter jobs
  const filteredJobs = allJobs.filter((job) => {
    const matchesKeyword = searchKeyword === '' || 
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesLocation = location === 'all' || job.location.includes(location);
    const matchesType = jobType === 'all' || job.type === jobType;
    return matchesKeyword && matchesLocation && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const hasActiveFilters = searchKeyword !== '' || location !== 'all' || category !== 'all' || jobType !== 'all';

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#FF9800] to-[#FFC107] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            <div className="text-center">
              <h1 className="text-white mb-3 text-3xl md:text-4xl">Find Your Perfect Job</h1>
              <p className="text-white/90 text-lg mb-8">
                Explore {allJobs.length} flexible opportunities waiting for you
              </p>
              
              {/* Quick Search */}
              <div className="bg-white rounded-2xl p-3 shadow-xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/60" />
                    <Input
                      placeholder="Search jobs by title or company..."
                      className="pl-12 border-0 focus-visible:ring-0 h-12 text-[#263238]"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                  <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 px-8 rounded-xl shadow-md" onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 border-2 border-[#263238]/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF9800] to-[#FFC107] rounded-lg flex items-center justify-center">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[#263238]">Filters</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-[#263238] mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF9800]" />
                    Location
                  </label>
                  <Select value={tempLocation} onValueChange={setTempLocation}>
                    <SelectTrigger className="border-[#263238]/20 rounded-xl h-11 focus:ring-[#FF9800]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="Chicago">Chicago</SelectItem>
                      <SelectItem value="Boston">Boston</SelectItem>
                      <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                      <SelectItem value="Miami">Miami</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#263238] mb-2 block flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#4FC3F7]" />
                    Job Type
                  </label>
                  <Select value={tempJobType} onValueChange={setTempJobType}>
                    <SelectTrigger className="border-[#263238]/20 rounded-xl h-11 focus:ring-[#FF9800]">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#263238] mb-2 block flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#4ADE80]" />
                    Category
                  </label>
                  <Select value={tempCategory} onValueChange={setTempCategory}>
                    <SelectTrigger className="border-[#263238]/20 rounded-xl h-11 focus:ring-[#FF9800]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply Filters Button */}
                <Button
                  className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl h-11 shadow-md"
                  onClick={handleApplyFilters}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                    onClick={() => {
                      setSearchKeyword('');
                      setLocation('all');
                      setCategory('all');
                      setJobType('all');
                      setTempLocation('all');
                      setTempCategory('all');
                      setTempJobType('all');
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-[#263238]/10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#263238]/70">Total Jobs</span>
                    <Badge className="bg-[#FF9800]/20 text-[#263238] border border-[#FF9800]/30">
                      {allJobs.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#263238]/70">Showing</span>
                    <Badge className="bg-[#4FC3F7]/20 text-[#263238] border border-[#4FC3F7]/30">
                      {filteredJobs.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[#263238] mb-1">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-sm text-[#263238]/70">
                  Showing page {currentPage} of {totalPages || 1}
                </p>
              </div>
              
              {hasActiveFilters && (
                <Badge className="bg-[#4ADE80]/20 text-[#263238] border border-[#4ADE80]/30">
                  Filtered
                </Badge>
              )}
            </div>

            {paginatedJobs.length > 0 ? (
              <>
                {loading ? (
                  <SkeletonCardGrid count={6} />
                ) : (
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {paginatedJobs.map((job) => (
                      <JobCard key={job.id} {...job} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#FF9800]/10 hover:text-[#FF9800]'}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer ${currentPage === page ? 'bg-[#FF9800] text-white hover:bg-[#F57C00]' : 'hover:bg-[#FF9800]/10 hover:text-[#FF9800]'}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#FF9800]/10 hover:text-[#FF9800]'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center border-2 border-[#263238]/10">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#FF9800]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[#FF9800]" />
                  </div>
                  <h3 className="text-[#263238] mb-2">No jobs found</h3>
                  <p className="text-[#263238]/70 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchKeyword('');
                      setLocation('all');
                      setCategory('all');
                      setJobType('all');
                      setTempLocation('all');
                      setTempCategory('all');
                      setTempJobType('all');
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl"
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}