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
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Zap,
  Lightbulb,
  Image as ImageIcon,
  X,
  Upload,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';
import demoImage from 'figma:asset/8bae24080ec08eff17f8f121670c17b493985d37.png';

export function PostJob() {
  const navigate = useNavigate();
  useAuth();

  // Removed role-based protection - all logged-in users can access

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: '',
    jobType: '',
    workTime: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
  });

  const [jobImages, setJobImages] = useState<string[]>([]);
  const [jobFiles, setJobFiles] = useState<File[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [jobTypes, setJobTypes] = useState<{ id: number, name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const typesRes = await fetch(`${API_URL}/api/Job/get-jobtypes`);
        const catsRes = await fetch(`${API_URL}/api/Job/get-categories`);

        if (typesRes.ok) {
          const result = await typesRes.json();
          if (result.success) setJobTypes(result.data);
        }
        if (catsRes.ok) {
          const result = await catsRes.json();
          if (result.success) setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const formDataToSend = new FormData();

      formDataToSend.append("JobTitle", formData.title);
      formDataToSend.append("Location", formData.location);
      formDataToSend.append("Category", formData.category);
      formDataToSend.append("JobType", formData.jobType);
      formDataToSend.append("WorkTime", formData.workTime);
      formDataToSend.append("SalaryRange", formData.salary);
      formDataToSend.append("JobDescription", formData.description);
      formDataToSend.append("Requirements", formData.requirements);
      formDataToSend.append("Benefits", formData.benefits);

      jobFiles.forEach((file) => {
        formDataToSend.append("JobImages", file);
      });

      const res = await fetch(`${API_URL}/api/Job/create-job`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            navigate('/user-jobs');
          }, 1500);
        } else {
          toast.error(result.message || "Failed to post job");
        }
      } else {
        toast.error("An error occurred while posting the job");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("Failed to submit job");
    }
  };

  const handleCancel = () => {
    navigate('/profile/user');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setJobFiles((prev) => [...prev, ...newFiles]);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          setJobImages((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setJobImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setJobFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white min-h-screen py-12">
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <Card className="max-w-md w-full p-8 text-center border-2 border-[#4ADE80]/30 shadow-xl bg-white">
            <div className="w-20 h-20 bg-[#4ADE80]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#4ADE80]" />
            </div>
            <h2 className="text-[#263238] mb-2 text-2xl">Job Posted Successfully!</h2>
            <p className="text-[#263238]/70 mb-6">
              Your job posting is now live and visible to job seekers.
            </p>
            <p className="text-sm text-[#263238]/60">
              Redirecting to Your Posts...
            </p>
          </Card>
        </div>
      )}

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
                <h1 className="text-[#263238] text-3xl">Add a New Job</h1>
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
                    onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category" className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
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
                    onValueChange={(value: string) => setFormData({ ...formData, jobType: value })}
                    required
                  >
                    <SelectTrigger id="job-type" className="mt-2 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
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

              {/* Benefits */}
              <div>
                <Label htmlFor="benefits" className="text-[#263238]">Benefits *</Label>
                <Textarea
                  id="benefits"
                  placeholder="List the perks and benefits (one per line)"
                  rows={5}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="mt-2 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800] resize-none"
                  required
                />
                <p className="text-sm text-[#263238]/60 mt-2">
                  Enter each benefit on a new line
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white h-14 rounded-xl shadow-lg shadow-[#FF9800]/30"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Job
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


        </div>
      </div>
    </div>
  );
}