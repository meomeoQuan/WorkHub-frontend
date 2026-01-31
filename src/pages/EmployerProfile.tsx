import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building2, Globe, Users, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router';
import { JobCard } from '../components/JobCard';
import { SkeletonCompanyProfile } from '../components/SkeletonCompanyProfile';
import { SkeletonCompanyStats } from '../components/SkeletonCompanyStats';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function EmployerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    name: user?.fullName || 'TechCorp Inc.',
    email: user?.email || 'contact@techcorp.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    industry: 'Technology',
    website: 'www.techcorp.com',
    employees: '50-200',
    founded: '2015',
    description: `TechCorp is a leading technology company specializing in innovative software solutions for businesses worldwide. We pride ourselves on creating a collaborative and inclusive work environment where creativity and innovation thrive.

Our mission is to empower businesses through technology while maintaining a commitment to excellence and employee development. We offer competitive compensation, flexible work arrangements, and opportunities for growth.`,
  });

  const [postedJobs, setPostedJobs] = useState([
    {
      id: '4',
      title: 'Part-time Data Entry Specialist',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Part-time' as const,
      description: 'Accurate and detail-oriented data entry work. Remote options available.',
      salary: '$18-22/hr',
      postedDate: '1 week ago',
    },
    {
      id: '8',
      title: 'Freelance Web Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Freelance' as const,
      description: 'Build responsive websites for small businesses. React experience preferred.',
      salary: '$50-80/hr',
      postedDate: '2 days ago',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(companyData);
  const [industryFocus, setIndustryFocus] = useState(['Software Development', 'Cloud Computing', 'Data Analytics', 'AI/ML']);
  const [editedIndustryFocus, setEditedIndustryFocus] = useState(industryFocus);
  const [cultureBenefits, setCultureBenefits] = useState([
    'Flexible work arrangements',
    'Professional development opportunities',
    'Collaborative team environment',
    'Competitive compensation'
  ]);
  const [editedCultureBenefits, setEditedCultureBenefits] = useState(cultureBenefits);

  const handleEdit = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedCultureBenefits(cultureBenefits);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCompanyData(editedData);
    setIndustryFocus(editedIndustryFocus);
    setCultureBenefits(editedCultureBenefits);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedCultureBenefits(cultureBenefits);
    setIsEditing(false);
  };

  const addIndustryTag = (tag: string) => {
    if (tag && !editedIndustryFocus.includes(tag)) {
      setEditedIndustryFocus([...editedIndustryFocus, tag]);
    }
  };

  const removeIndustryTag = (index: number) => {
    setEditedIndustryFocus(editedIndustryFocus.filter((_, i) => i !== index));
  };

  const addCultureBenefit = (benefit: string) => {
    if (benefit && !editedCultureBenefits.includes(benefit)) {
      setEditedCultureBenefits([...editedCultureBenefits, benefit]);
    }
  };

  const removeCultureBenefit = (index: number) => {
    setEditedCultureBenefits(editedCultureBenefits.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonCompanyProfile />;
  }

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

          {/* Profile Header */}
          <Card className="p-8 mb-6 border-[#263238]/10 shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Company Logo */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center flex-shrink-0 shadow-md">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={companyData.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-white text-5xl font-bold">{companyData.name.charAt(0)}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#263238] text-sm">Company Name</Label>
                      <Input
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Industry</Label>
                      <Input
                        value={editedData.industry}
                        onChange={(e) => setEditedData({ ...editedData, industry: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#263238] text-sm">Email</Label>
                        <Input
                          value={editedData.email}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">Phone</Label>
                        <Input
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">Location</Label>
                        <Input
                          value={editedData.location}
                          onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">Website</Label>
                        <Input
                          value={editedData.website}
                          onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">Company Size</Label>
                        <Input
                          value={editedData.employees}
                          onChange={(e) => setEditedData({ ...editedData, employees: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                          placeholder="e.g., 50-200"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">Founded Year</Label>
                        <Input
                          value={editedData.founded}
                          onChange={(e) => setEditedData({ ...editedData, founded: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-[#263238] mb-2">{companyData.name}</h1>
                        <Badge className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">{companyData.industry}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Mail className="w-4 h-4 text-[#FF9800]" />
                        <span>{companyData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Phone className="w-4 h-4 text-[#FF9800]" />
                        <span>{companyData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <MapPin className="w-4 h-4 text-[#FF9800]" />
                        <span>{companyData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Globe className="w-4 h-4 text-[#FF9800]" />
                        <span>{companyData.website}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Users className="w-4 h-4 text-[#FF9800]" />
                        <span>{companyData.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Building2 className="w-4 h-4 text-[#FF9800]" />
                        <span>Founded {companyData.founded}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-xl shadow-md hover:shadow-lg transition">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {user?.userType === 'employer' && (
                        <Button onClick={handleEdit} className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                      {user?.userType === 'employer' && (
                        <>
                          <Link to="/applications">
                            <Button variant="outline" className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                              View Applications
                            </Button>
                          </Link>
                          <Link to="/post-job">
                            <Button variant="outline" className="border-2 border-[#263238]/20 hover:border-[#4ADE80] hover:text-[#4ADE80] rounded-xl">
                              Post a Job
                            </Button>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Company */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h2 className="text-[#263238] mb-4">About Company</h2>
                {isEditing ? (
                  <div>
                    <Label className="text-[#263238] text-sm mb-2 block">Company Description</Label>
                    <Textarea
                      value={editedData.description}
                      onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                      className="border-[#263238]/20 rounded-xl min-h-[200px]"
                      placeholder="Tell job seekers about your company, mission, and values..."
                    />
                  </div>
                ) : (
                  <p className="text-[#263238]/70 whitespace-pre-line">{companyData.description}</p>
                )}
              </Card>

              {/* Posted Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#263238]">Posted Jobs ({postedJobs.length})</h2>
                  {user?.userType === 'employer' && (
                    <Link to="/post-job">
                      <Button className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white rounded-xl shadow-md hover:shadow-lg transition">
                        Post New Job
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {postedJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Stats */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Company Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl text-[#FF9800] font-bold">12</p>
                    <p className="text-sm text-[#263238]/60">Total Jobs Posted</p>
                  </div>
                  <Separator className="bg-[#263238]/10" />
                  <div>
                    <p className="text-2xl text-[#4ADE80] font-bold">2</p>
                    <p className="text-sm text-[#263238]/60">Active Jobs</p>
                  </div>
                  <Separator className="bg-[#263238]/10" />
                  <div>
                    <p className="text-2xl text-[#4FC3F7] font-bold">48</p>
                    <p className="text-sm text-[#263238]/60">Applications Received</p>
                  </div>
                  <Separator className="bg-[#263238]/10" />
                  <div>
                    <p className="text-2xl text-[#263238] font-bold">8</p>
                    <p className="text-sm text-[#263238]/60">Hires Made</p>
                  </div>
                </div>
              </Card>

              {/* Industry Focus */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Industry Focus</h3>
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editedIndustryFocus.map((tag, index) => (
                        <Badge 
                          key={index}
                          className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition"
                          onClick={() => removeIndustryTag(index)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Type an industry tag and press Enter"
                      className="h-10 border-[#263238]/20 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addIndustryTag(input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {industryFocus.map((tag, index) => (
                      <Badge key={index} className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">{tag}</Badge>
                    ))}
                  </div>
                )}
              </Card>

              {/* Company Culture */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Company Culture</h3>
                {isEditing ? (
                  <>
                    <div className="space-y-3 text-sm mb-4">
                      {editedCultureBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800] mt-2"></div>
                          <span className="text-[#263238]/70 flex-1">{benefit}</span>
                          <button
                            onClick={() => removeCultureBenefit(index)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Type a benefit and press Enter"
                      className="h-10 border-[#263238]/20 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addCultureBenefit(input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className="space-y-3 text-sm">
                    {cultureBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800] mt-2"></div>
                        <span className="text-[#263238]/70">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Contact */}
              <Card className="p-6 bg-[#FAFAFA] border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Get in Touch</h3>
                <p className="text-sm text-[#263238]/70 mb-4">
                  Interested in working with us? We'd love to hear from you!
                </p>
                <Button className="w-full bg-[#4FC3F7] hover:bg-[#4FC3F7]/90 text-white rounded-xl shadow-md hover:shadow-lg transition">
                  Contact Us
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}