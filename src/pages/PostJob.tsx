import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Briefcase, MapPin, DollarSign, FileText, Zap, Lightbulb } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export function PostJob() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // Protect this page - only employers can access
  useEffect(() => {
    if (!isLoggedIn || user?.userType !== 'employer') {
      navigate('/unauthorized');
    }
  }, [isLoggedIn, user, navigate]);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: '',
    jobType: '',
    workTime: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock job posting - redirect to employer profile
    navigate('/profile/employer');
  };

  const handleCancel = () => {
    navigate('/profile/employer');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-[#263238] text-3xl">Post a New Job</h1>
                <p className="text-[#263238]/70">Fill in the details to find perfect candidates</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="p-8 border-2 border-[#263238]/10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="title" className="text-[#263238] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#FF9800]" />
                  Job Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Part-time Barista"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
              </div>

              {/* Location and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-[#263238] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-[#263238]">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category" className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Type and Work Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-type" className="text-[#263238]">Job Type *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                    required
                  >
                    <SelectTrigger id="job-type" className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part-time">⏰ Part-time</SelectItem>
                      <SelectItem value="freelance">💼 Freelance</SelectItem>
                      <SelectItem value="seasonal">🌟 Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="work-time" className="text-[#263238]">Work Time</Label>
                  <Input
                    id="work-time"
                    placeholder="e.g., Mon-Fri, 9AM-5PM"
                    value={formData.workTime}
                    onChange={(e) => setFormData({ ...formData, workTime: e.target.value })}
                    className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <Label htmlFor="salary" className="text-[#263238] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                  Salary Range *
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g., $15-20/hr or $500-800/week"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                  required
                />
              </div>

              {/* Job Description */}
              <div>
                <Label htmlFor="description" className="text-[#263238] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF9800]" />
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800] resize-none"
                  required
                />
                <p className="text-sm text-[#263238]/60 mt-2">
                  💡 Provide a detailed description to attract the right candidates
                </p>
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements" className="text-[#263238]">Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the qualifications, skills, and experience needed (one per line)"
                  rows={5}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="mt-2 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800] resize-none"
                  required
                />
                <p className="text-sm text-[#263238]/60 mt-2">
                  Enter each requirement on a new line
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 rounded-xl shadow-lg shadow-[#FF9800]/30"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-14 border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          {/* Tips */}
          <Card className="p-6 mt-6 bg-gradient-to-br from-[#4FC3F7]/10 to-[#4ADE80]/10 border-2 border-[#4FC3F7]/20">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#FF9800]" />
              <h3 className="text-[#263238]">Tips for a Great Job Posting</h3>
            </div>
            <ul className="space-y-3 text-sm text-[#263238]/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4FC3F7] mt-2 flex-shrink-0"></div>
                <span>Be specific about the role and responsibilities</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4ADE80] mt-2 flex-shrink-0"></div>
                <span>Clearly state the required skills and qualifications</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF9800] mt-2 flex-shrink-0"></div>
                <span>Include salary information to attract serious candidates</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD54F] mt-2 flex-shrink-0"></div>
                <span>Mention any benefits or perks of the position</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4FC3F7] mt-2 flex-shrink-0"></div>
                <span>Highlight what makes your company a great place to work</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}