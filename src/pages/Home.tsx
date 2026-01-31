import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  DollarSign,
  Users,
  Briefcase,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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

// Mock job data
const jobs = [
  {
    id: "1",
    title: "Part-time Barista",
    company: "Coffee & Co.",
    location: "New York, NY",
    type: "Part-time" as const,
    description:
      "Looking for enthusiastic barista to join our team. Flexible hours, great tips, and free coffee!",
    salary: "$15-18/hr",
    postedDate: "2 days ago",
  },
  {
    id: "2",
    title: "Freelance Graphic Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Freelance" as const,
    description:
      "Create stunning visuals for various client projects. Portfolio required.",
    salary: "$40-60/hr",
    postedDate: "1 day ago",
  },
  {
    id: "3",
    title: "Seasonal Retail Associate",
    company: "Fashion Boutique",
    location: "Chicago, IL",
    type: "Seasonal" as const,
    description:
      "Help customers find their perfect outfit during our busy season. Great employee discount!",
    salary: "$14-16/hr",
    postedDate: "3 days ago",
  },
  {
    id: "4",
    title: "Part-time Data Entry Specialist",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Part-time" as const,
    description:
      "Accurate and detail-oriented data entry work. Remote options available.",
    salary: "$18-22/hr",
    postedDate: "1 week ago",
  },
  {
    id: "5",
    title: "Freelance Content Writer",
    company: "Marketing Agency",
    location: "Remote",
    type: "Freelance" as const,
    description:
      "Write engaging blog posts and website content for various clients.",
    salary: "$30-50/hr",
    postedDate: "4 days ago",
  },
  {
    id: "6",
    title: "Seasonal Delivery Driver",
    company: "Quick Delivery",
    location: "Boston, MA",
    type: "Seasonal" as const,
    description:
      "Deliver packages during our peak season. Own vehicle required.",
    salary: "$16-20/hr",
    postedDate: "5 days ago",
  },
];

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

const featuredCompanies = [
  { name: "Coffee & Co.", jobs: 5, rating: 4.8 },
  { name: "TechCorp", jobs: 12, rating: 4.9 },
  { name: "Design Studio", jobs: 8, rating: 4.7 },
  { name: "Quick Delivery", jobs: 15, rating: 4.6 },
];

export function Home() {
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
                    />
                  </div>
                  <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/60 z-10 pointer-events-none" />
                    <Select defaultValue="all-cities">
                      <SelectTrigger className="border-0 h-14 text-[#263238] focus:ring-0 pl-12 pr-3 py-0 bg-transparent w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-cities">
                          All Cities
                        </SelectItem>
                        <SelectItem value="new-york">
                          New York, NY
                        </SelectItem>
                        <SelectItem value="san-francisco">
                          San Francisco, CA
                        </SelectItem>
                        <SelectItem value="chicago">
                          Chicago, IL
                        </SelectItem>
                        <SelectItem value="boston">
                          Boston, MA
                        </SelectItem>
                        <SelectItem value="los-angeles">
                          Los Angeles, CA
                        </SelectItem>
                        <SelectItem value="seattle">
                          Seattle, WA
                        </SelectItem>
                        <SelectItem value="austin">
                          Austin, TX
                        </SelectItem>
                        <SelectItem value="remote">
                          Remote
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Link
                    to="/jobs"
                    className="md:w-auto flex items-center"
                  >
                    <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 px-8 rounded-xl w-full md:w-auto shadow-lg shadow-[#FF9800]/30">
                      Find Jobs
                    </Button>
                  </Link>
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
              <Link key={index} to="/jobs">
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
                {jobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
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
                    Top Rated Companies
                  </h3>
                </div>
                <div className="space-y-4">
                  {featuredCompanies.map((company, index) => (
                    <Link
                      key={index}
                      to="/jobs"
                      className="block p-3 rounded-xl hover:bg-[#FAFAFA] transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm text-[#263238] mb-1 group-hover:text-[#FF9800] transition">
                            {company.name}
                          </h4>
                          <p className="text-xs text-[#263238]/60">
                            {company.jobs} open jobs
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                          <span className="text-sm text-[#263238]">
                            {company.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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