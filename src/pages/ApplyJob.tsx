import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Upload, CheckCircle, Briefcase, MapPin } from 'lucide-react';

export function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    coverLetter: '',
    resume: null as File | null,
    agreeToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // Scroll to top when submission is successful
  useEffect(() => {
    if (submitted) {
      window.scrollTo(0, 0);
    }
  }, [submitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      navigate('/my-applications');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-[#4ADE80]/30 shadow-xl">
          <div className="w-20 h-20 bg-[#4ADE80]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#4ADE80]" />
          </div>
          <h2 className="text-[#263238] mb-2 text-2xl">Application Submitted!</h2>
          <p className="text-[#263238]/70 mb-6">
            Thank you for applying! We'll review your application and get back to you soon.
          </p>
          <Button
            onClick={() => navigate('/my-applications')}
            className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl"
          >
            View My Applications
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
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
            <h1 className="text-[#263238] mb-3 text-3xl">Apply for Job</h1>
            <p className="text-[#263238]/70">Complete the form below to submit your application</p>
          </div>

          {/* Job Preview Card */}
          <Card className="p-6 mb-8 border-2 border-[#FF9800]/20 bg-gradient-to-br from-[#FF9800]/5 to-[#4FC3F7]/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF9800] to-[#FFC107] rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#263238] mb-1 text-lg">Part-time Barista</h3>
                <p className="text-[#263238]/70 text-sm mb-2">Coffee & Co.</p>
                <div className="flex items-center gap-2 text-sm text-[#263238]/60">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Application Form */}
          <Card className="p-8 border-2 border-[#263238]/10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#FF9800] rounded"></div>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-[#263238]">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#263238]">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="phone" className="text-[#263238]">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-2 border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="mt-6">
                  <Label htmlFor="education" className="text-[#263238]">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="mt-2 border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                    placeholder="Bachelor's Degree in Business Administration"
                  />
                </div>
              </div>

              <Separator className="bg-[#263238]/10" />

              {/* Resume Upload */}
              <div>
                <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#4FC3F7] rounded"></div>
                  Resume/CV
                </h2>
                <div className="border-2 border-dashed border-[#263238]/20 rounded-xl p-8 text-center hover:border-[#FF9800] transition">
                  <Upload className="w-12 h-12 text-[#263238]/40 mx-auto mb-4" />
                  <div className="text-center">
                    <label htmlFor="resume" className="cursor-pointer block">
                      <span className="text-[#FF9800] hover:text-[#F57C00]">Click to upload</span>
                      <span className="text-[#263238]/60"> or drag and drop</span>
                    </label>
                  </div>
                  <Input
                    id="resume"
                    name="resume"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <p className="text-sm text-[#263238]/60 mt-2">PDF, DOC, or DOCX (max 10MB)</p>
                  {formData.resume && (
                    <p className="text-sm text-[#4ADE80] mt-2">✓ {formData.resume.name}</p>
                  )}
                </div>
              </div>

              <Separator className="bg-[#263238]/10" />

              {/* Cover Letter */}
              <div>
                <h2 className="text-[#263238] mb-4 flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#4ADE80] rounded"></div>
                  Cover Letter
                </h2>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={6}
                  className="border-2 border-[#263238]/20 focus:border-[#FF9800] rounded-xl"
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>

              <Separator className="bg-[#263238]/10" />

              {/* Terms and Submit */}
              <div>
                <div className="flex items-start gap-3 mb-6 p-4 bg-[#263238]/5 rounded-xl">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-[#263238]/80 cursor-pointer">
                    I agree to the terms and conditions and confirm that all information provided is accurate.
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.agreeToTerms}
                    className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30 disabled:opacity-50"
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}