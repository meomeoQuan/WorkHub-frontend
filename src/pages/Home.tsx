import { Link } from "react-router";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  Search,
  Zap,
  DollarSign,
  Users,
  Briefcase,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { JobCard } from "../components/JobCard";
import { SkeletonCardGrid } from "../components/SkeletonCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router";
import howItWorksImg from "figma:asset/35710fa8a2ad22f1bc7ef5e3899f7b6a4daf97c0.png";
import type { RecruitmentOverviewInfoDTO } from "../types/DTOs/ModelDTOs/RecruitmentOverviewInfoDTO";
import type { UserFeatureDTO } from "../types/DTOs/ModelDTOs/HomeDTOs/UserFeatureDTO";
import type { ApiResponse } from "../types/ApiResponse";
import { formatRelativeTime } from "../utils/dateUtils";

const API_URL = import.meta.env.VITE_API_URL;

const quickJobs = [
  {
    icon: "☕",
    title: "Food & Beverage",
    count: "234 jobs",
    color: "bg-orange-100",
  },
  {
    icon: "💻",
    title: "Tech & IT",
    count: "189 jobs",
    color: "bg-blue-100",
  },
  {
    icon: "🚗",
    title: "Delivery & Driving",
    count: "156 jobs",
    color: "bg-green-100",
  },
  {
    icon: "✏️",
    title: "Creative & Design",
    count: "142 jobs",
    color: "bg-purple-100",
  },
];

// Advertisement data
const advertisements = [
  {
    id: 1,
    title: "Need Quick Cash?",
    description: "Get paid daily with instant job opportunities in your area",
    bgGradient: "from-[#FF9800] to-[#F57C00]",
    buttonText: "Find Jobs Now",
    buttonLink: "/jobs",
    image: "https://images.unsplash.com/photo-1669012520437-5102e3fd4589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3b3JraW5nJTIwbGFwdG9wJTIwY29mZmVlfGVufDF8fHx8fDE3NzA3MTc0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Get Hired in 3 Simple Steps",
    description: "Search, apply, and start earning with our streamlined process",
    bgGradient: "from-[#4FC3F7] to-[#0288D1]",
    buttonText: "See How It Works",
    buttonLink: "/jobs",
    image: howItWorksImg,
  },
  {
    id: 3,
    title: "Seasonal Hiring Now",
    description: "Top companies are hiring for seasonal positions. Apply today!",
    bgGradient: "from-[#4ADE80] to-[#22C55E]",
    buttonText: "See Seasonal Jobs",
    buttonLink: "/jobs?type=seasonal",
    image: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwaGlyaW5nJTIwcmVjcnVpdG1lbnQlMjBvZmZpY2V8ZW58MXx8fHwxNzcwNzE3NDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

// Custom arrow components for carousel
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
    >
      <ChevronRight className="w-5 h-5 text-[#263238]" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
    >
      <ChevronLeft className="w-5 h-5 text-[#263238]" />
    </button>
  );
};

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all-cities");

  const [latestJobs, setLatestJobs] = useState<RecruitmentOverviewInfoDTO[]>([]);
  const [featuredUsers, setFeaturedUsers] = useState<UserFeatureDTO[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch top 4 jobs
        const jobsRes = await fetch(`${API_URL}/api/Home/top4`);
        if (jobsRes.ok) {
          const jobsData: ApiResponse<RecruitmentOverviewInfoDTO[]> = await jobsRes.json();
          if (jobsData.success && jobsData.data) {
            setLatestJobs(jobsData.data);
          }
        }

        // Fetch top credibility users
        const usersRes = await fetch(`${API_URL}/api/Home/top-credibility-user`);
        if (usersRes.ok) {
          const usersData: ApiResponse<UserFeatureDTO[]> = await usersRes.json();
          if (usersData.success && usersData.data) {
            setFeaturedUsers(usersData.data);
          }
        }

        // Fetch cities
        const citiesRes = await fetch(`${API_URL}/api/JobPost/cities-filter`);
        if (citiesRes.ok) {
          const citiesData: ApiResponse<string[]> = await citiesRes.json();
          if (citiesData.success && citiesData.data) {
            setCities(citiesData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (selectedLocation && selectedLocation !== "all-cities") {
      params.set("location", selectedLocation);
    }
    const queryString = params.toString();
    navigate(`/jobs${queryString ? `?${queryString}` : ""}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
    cssEase: "ease-in-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots !bottom-4",
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF9800] via-[#FF9800] to-[#FFC107] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm">
                  Find jobs in minutes, not hours
                </span>
              </div>

              <h1 className="text-white mb-4 text-4xl md:text-5xl lg:text-6xl leading-tight">
                Quick jobs.
                <br />
                Fast cash.
                <br />
                Your schedule.
              </h1>

              <p className="text-xl mb-8 text-white/95">
                Join thousands finding part-time, freelance, and
                seasonal work that fits their lifestyle.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex flex-col md:flex-row gap-2 items-stretch">
                  <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/60 z-10" />
                    <Input
                      placeholder="What job are you looking for?"
                      className="pl-12 border-0 focus-visible:ring-0 h-14 text-[#263238] bg-transparent w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/60 z-10 pointer-events-none" />
                    <Select
                      defaultValue="all-cities"
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger className="border-0 h-14 text-[#263238] focus:ring-0 pl-12 pr-3 py-0 bg-transparent w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-cities">
                          All Cities
                        </SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase().replace(/ /g, '-')}>
                            {city}
                          </SelectItem>
                        ))}
                        <SelectItem value="remote">
                          Remote
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 px-8 rounded-xl w-full md:w-auto shadow-lg shadow-[#FF9800]/30"
                  >
                    Find Jobs
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div>
                  <div className="text-3xl mb-1">5K+</div>
                  <div className="text-sm text-white/80">
                    Active Jobs
                  </div>
                </div>
                <div>
                  <div className="text-3xl mb-1">2K+</div>
                  <div className="text-sm text-white/80">
                    Companies
                  </div>
                </div>
                <div>
                  <div className="text-3xl mb-1">10K+</div>
                  <div className="text-sm text-white/80">
                    Hired
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block relative">
              <div className="relative z-10">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#4FC3F7] rounded-2xl opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#FFC107] rounded-full opacity-80 animate-pulse"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1653754056000-bcc6c5a402ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB3b3JraW5nJTIwbGFwdG9wJTIwY29mZmVlfGVufDF8fHx8MTc2MjcwMjE4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="People working flexibly"
                  className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Carousel */}
      <section className="py-12 bg-[#FAFAFA]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <style>{`
              .slick-slider {
                position: relative;
                display: block;
                box-sizing: border-box;
                user-select: none;
                touch-action: pan-y;
              }
              .slick-list {
                position: relative;
                display: block;
                overflow: hidden;
                margin: 0;
                padding: 0;
              }
              .slick-track {
                position: relative;
                top: 0;
                left: 0;
                display: block;
                margin-left: auto;
                margin-right: auto;
              }
              .slick-track:before,
              .slick-track:after {
                display: table;
                content: '';
              }
              .slick-track:after {
                clear: both;
              }
              .slick-loading .slick-track {
                visibility: hidden;
              }
              .slick-slide {
                display: none;
                float: left;
                height: 100%;
                min-height: 1px;
              }
              [dir='rtl'] .slick-slide {
                float: right;
              }
              .slick-slide img {
                display: block;
              }
              .slick-slide.slick-loading img {
                display: none;
              }
              .slick-slide.dragging img {
                pointer-events: none;
              }
              .slick-initialized .slick-slide {
                display: block;
              }
              .slick-loading .slick-slide {
                visibility: hidden;
              }
              .slick-vertical .slick-slide {
                display: block;
                height: auto;
                border: 1px solid transparent;
              }
              .slick-arrow.slick-hidden {
                display: none;
              }
              .slick-dots {
                position: absolute;
                bottom: 1rem;
                display: flex !important;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0;
                margin: 0;
                list-style: none;
                z-index: 20;
              }
              .slick-dots li {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin: 0;
                padding: 0;
                cursor: pointer;
              }
              .slick-dots li button {
                display: block;
                width: 8px;
                height: 8px;
                padding: 0;
                border: none;
                border-radius: 100%;
                background-color: rgba(255, 255, 255, 0.5);
                text-indent: -9999px;
                cursor: pointer;
                transition: all 0.3s ease;
              }
              .slick-dots li button:hover {
                background-color: rgba(255, 255, 255, 0.8);
              }
              .slick-dots li.slick-active button {
                background-color: white;
                width: 24px;
                border-radius: 4px;
              }
            `}</style>
            <Slider {...carouselSettings}>
              {advertisements.map((ad) => (
                <div key={ad.id} className="px-2">
                  <div
                    className={`relative bg-gradient-to-r ${ad.bgGradient} rounded-3xl overflow-hidden shadow-2xl`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8 md:p-12">
                      {/* Left Content */}
                      <div className="text-white z-10 relative">
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs mb-4">
                          Featured
                        </div>
                        <h2 className="text-white mb-4 text-3xl md:text-4xl">
                          {ad.title}
                        </h2>
                        <p className="text-white/95 text-lg mb-6">
                          {ad.description}
                        </p>
                        <Link to={ad.buttonLink}>
                          <Button className="bg-white text-[#263238] hover:bg-white/90 h-12 px-6 rounded-xl shadow-lg">
                            {ad.buttonText}
                          </Button>
                        </Link>
                      </div>

                      {/* Right Image */}
                      <div className="hidden md:block relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                          <ImageWithFallback
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Quick Job Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[#263238] mb-2">
              Browse by category
            </h2>
            <p className="text-[#263238]/70">
              Find the perfect job in your field
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickJobs.map((category, index) => (
              <Link key={index} to={`/jobs?category=${encodeURIComponent(category.title)}`}>
                <Card className="p-6 hover:shadow-lg transition cursor-pointer border-2 hover:border-[#FF9800] group">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-[#263238] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#263238]/60">
                    {category.count}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Listings */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#263238] mb-1">
                    Latest Jobs
                  </h2>
                  <p className="text-sm text-[#263238]/70">
                    Fresh opportunities posted today
                  </p>
                </div>
                <Link to="/jobs">
                  <Button
                    variant="ghost"
                    className="text-[#FF9800] hover:text-[#F57C00] hover:bg-[#FF9800]/10"
                  >
                    View All →
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <SkeletonCardGrid />
                ) : (
                  latestJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id.toString()}
                      title={job.jobName}
                      company={job.userName} // Placeholder
                      location={job.location || "Remote"}
                      type={(job.jobType as "Part-time" | "Freelance" | "Seasonal") || "Part-time"}
                      description={job.description || "No description available"}
                      salary={job.salary}
                      postedDate={formatRelativeTime(job.createdAt)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Apply Tips */}
              <Card className="p-6 bg-gradient-to-br from-[#4FC3F7] to-[#4ADE80] text-white border-0">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-white">Quick Apply</h3>
                </div>
                <p className="text-sm text-white/95 mb-4">
                  Apply to most jobs with just one tap. Build
                  your profile once, apply everywhere.
                </p>
                <Link to="/register">
                  <Button className="w-full bg-white text-[#263238] hover:bg-white/90">
                    Get Started Free
                  </Button>
                </Link>
              </Card>

              {/* Featured Companies */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-[#FF9800]" />
                  <h3 className="text-[#263238]">
                    Top Rated User
                  </h3>
                </div>
                <div className="space-y-4">
                  {featuredUsers.slice(0, 4).map((user, index) => (
                    <Link
                      key={index}
                      to="/jobs"
                      className="block p-3 rounded-xl hover:bg-[#FAFAFA] transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm text-[#263238] mb-1 group-hover:text-[#FF9800] transition">
                            {user.fullName}
                          </h4>
                          <p className="text-xs text-[#263238]/60">
                            {user.activeJob} open jobs
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                          <span className="text-sm text-[#263238]">
                            {user.ratingCount || "N/A"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {featuredUsers.length === 0 && !loading && (
                    <p className="text-sm text-[#263238]/60">No featured users found.</p>
                  )}
                </div>
              </Card>

              {/* For Employers */}
              <Card className="p-6 bg-[#263238] text-white border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9800]/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <Briefcase className="w-8 h-8 mb-4 text-[#4FC3F7]" />
                  <h3 className="text-white mb-2">Hiring?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Post jobs and find talent in minutes
                  </p>
                  <Link to="/register">
                    <Button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white">
                      Post a Job
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[#263238]">Featured Companies</h2>
            <Link to="/jobs">
              <Button
                variant="ghost"
                className="text-[#FF9800] hover:text-[#F57C00] hover:bg-[#FF9800]/10 flex items-center gap-2"
              >
                See All Companies
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Companies Carousel */}
          <div className="max-w-6xl mx-auto">
            {featuredUsers.length > 0 ? (
              <Slider
                {...{
                  dots: false,
                  infinite: featuredUsers.length > 4, // Only infinite if enough items
                  speed: 500,
                  slidesToShow: Math.min(5, featuredUsers.length), // Adjust slides to show
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 3000,
                  pauseOnHover: true,
                  arrows: false,
                  responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: Math.min(4, featuredUsers.length),
                      },
                    },
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: Math.min(3, featuredUsers.length),
                      },
                    },
                    {
                      breakpoint: 640,
                      settings: {
                        slidesToShow: Math.min(2, featuredUsers.length),
                      },
                    },
                  ],
                }}
              >
                {featuredUsers.map((user, index) => (
                  <div key={index} className="px-3">
                    <div className="bg-[#FAFAFA] rounded-2xl p-8 h-32 flex items-center justify-center hover:shadow-lg transition group cursor-pointer">
                      <div className="text-center">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition">🏢</div>
                        <p className="text-sm font-semibold text-[#263238]">{user.fullName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center text-[#263238]/60 py-8">Loading featured companies...</div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#263238] mb-2">
              How it works
            </h2>
            <p className="text-[#263238]/70">
              Get hired in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1: Search Jobs */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF9800] to-[#FFC107] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF9800]/30">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="bg-[#FF9800] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm">
                1
              </div>
              <h3 className="text-[#263238] mb-2">
                Search Jobs
              </h3>
              <p className="text-sm text-[#263238]/70">
                Browse thousands of flexible opportunities
              </p>
            </div>

            {/* Step 2: Quick Apply */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4FC3F7] to-[#4ADE80] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4FC3F7]/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="bg-[#4FC3F7] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm">
                2
              </div>
              <h3 className="text-[#263238] mb-2">
                Quick Apply
              </h3>
              <p className="text-sm text-[#263238]/70">
                One-tap application with your profile
              </p>
            </div>

            {/* Step 3: Start Earning */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ADE80] to-[#FFC107] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4ADE80]/30">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <div className="bg-[#4ADE80] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm">
                3
              </div>
              <h3 className="text-[#263238] mb-2">
                Start Earning
              </h3>
              <p className="text-sm text-[#263238]/70">
                Get hired and start making money
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#263238] via-[#1E293B] to-[#263238]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#FF9800]/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-[#FF9800]" />
              <span className="text-sm text-white">
                Join 10,000+ job seekers
              </span>
            </div>

            <h2 className="text-white mb-4 text-3xl md:text-4xl">
              Ready to start your job journey?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Create your free profile and start applying to
              jobs in minutes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 px-8 text-lg shadow-lg shadow-[#FF9800]/30">
                  Sign Up - It's Free
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white hover:text-[#263238]"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>

            <p className="text-sm text-white/60 mt-6">
              No credit card required • Start in 2 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}