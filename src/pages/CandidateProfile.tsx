import { useState } from 'react';
import { Mail, Phone, MapPin, GraduationCap, Briefcase, FileText, Calendar, ArrowLeft, Edit, Save, X, Upload, Eye } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function CandidateProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [userData, setUserData] = useState({
    name: user?.fullName || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    school: 'Columbia University',
    major: 'Computer Science',
    graduationYear: '2026',
    bio: 'Motivated college student seeking part-time opportunities in technology and customer service. Strong communication skills and quick learner.',
    skills: ['Customer Service', 'Data Entry', 'Microsoft Office', 'Social Media', 'Problem Solving'],
    experience: [
      {
        title: 'Sales Associate',
        company: 'Retail Store',
        period: 'Summer 2024',
        description: 'Assisted customers, managed inventory, and processed transactions.',
      },
      {
        title: 'Volunteer Tutor',
        company: 'Community Center',
        period: '2023 - Present',
        description: 'Help students with homework and test preparation.',
      },
    ],
    jobTypes: ['Part-time', 'Freelance'],
    desiredRate: '$18 - $25/hr',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [resumeFile, setResumeFile] = useState<{name: string, uploadDate: string}>({
    name: 'resume.pdf',
    uploadDate: 'Last updated 1 week ago'
  });

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editedData);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...editedData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setEditedData({ ...editedData, experience: newExperience });
  };

  const addSkill = (skill: string) => {
    if (skill && !editedData.skills.includes(skill)) {
      setEditedData({ ...editedData, skills: [...editedData.skills, skill] });
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = editedData.skills.filter((_, i) => i !== index);
    setEditedData({ ...editedData, skills: newSkills });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Update resume file state
      setResumeFile({
        name: file.name,
        uploadDate: 'Just now'
      });
      
      toast.success('Resume uploaded successfully!');
    }
  };

  const handleViewResume = () => {
    // In a real app, this would open the actual resume PDF URL
    // For demo purposes, we'll open a sample PDF in a new tab
    const resumeUrl = '/sample-resume.pdf'; // This would be the actual stored resume URL
    window.open(resumeUrl, '_blank');
    toast.info('Opening resume in new tab...');
  };

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

          {/* Profile Header */}
          <Card className="p-8 mb-6 border-[#263238]/10 shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center flex-shrink-0 shadow-md">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={userData.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-white text-5xl font-bold">{userData.name.charAt(0)}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#263238] text-sm">Full Name</Label>
                      <Input
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Bio</Label>
                      <Textarea
                        value={editedData.bio}
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        className="border-[#263238]/20 rounded-xl mt-1 min-h-[80px]"
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
                        <Label className="text-[#263238] text-sm">School</Label>
                        <Input
                          value={editedData.school}
                          onChange={(e) => setEditedData({ ...editedData, school: e.target.value })}
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-[#263238] mb-2">{userData.name}</h1>
                    <p className="text-[#263238]/70 mb-4">{userData.bio}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Mail className="w-4 h-4 text-[#FF9800]" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <Phone className="w-4 h-4 text-[#FF9800]" />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <MapPin className="w-4 h-4 text-[#FF9800]" />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#263238]/70">
                        <GraduationCap className="w-4 h-4 text-[#FF9800]" />
                        <span>{userData.school}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
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
                      <Button onClick={handleEdit} className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Link to="/schedule">
                        <Button variant="outline" className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl">
                          <Calendar className="w-4 h-4 mr-2" />
                          Manage Schedule
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Education */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#FF9800]" />
                  <h2 className="text-[#263238]">Education</h2>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[#263238] text-sm">School/University</Label>
                      <Input
                        value={editedData.school}
                        onChange={(e) => setEditedData({ ...editedData, school: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Major/Field of Study</Label>
                      <Input
                        value={editedData.major}
                        onChange={(e) => setEditedData({ ...editedData, major: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Expected Graduation Year</Label>
                      <Input
                        value={editedData.graduationYear}
                        onChange={(e) => setEditedData({ ...editedData, graduationYear: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-[#263238]">{userData.school}</h3>
                    <p className="text-sm text-[#263238]/70">{userData.major}</p>
                    <p className="text-sm text-[#263238]/60">Expected Graduation: {userData.graduationYear}</p>
                  </div>
                )}
              </Card>

              {/* Experience */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-[#FF9800]" />
                  <h2 className="text-[#263238]">Experience</h2>
                </div>
                <div className="space-y-6">
                  {(isEditing ? editedData.experience : userData.experience).map((exp, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-[#263238] text-sm">Job Title</Label>
                            <Input
                              value={exp.title}
                              onChange={(e) => updateExperience(index, 'title', e.target.value)}
                              className="h-10 border-[#263238]/20 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#263238] text-sm">Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              className="h-10 border-[#263238]/20 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#263238] text-sm">Period</Label>
                            <Input
                              value={exp.period}
                              onChange={(e) => updateExperience(index, 'period', e.target.value)}
                              className="h-10 border-[#263238]/20 rounded-xl mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#263238] text-sm">Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              className="border-[#263238]/20 rounded-xl mt-1 min-h-[60px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-[#263238]">{exp.title}</h3>
                          <p className="text-sm text-[#263238]/70">{exp.company}</p>
                          <p className="text-sm text-[#263238]/60 mb-2">{exp.period}</p>
                          <p className="text-sm text-[#263238]/70">{exp.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Resume */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#FF9800]" />
                  <h2 className="text-[#263238]">Resume</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl border border-[#263238]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF9800]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#263238]">{resumeFile.name}</p>
                      <p className="text-xs text-[#263238]/60">{resumeFile.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                        onClick={handleViewResume}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View My Resume
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Skills</h3>
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editedData.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30 rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition"
                          onClick={() => removeSkill(index)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Type a skill and press Enter"
                      className="h-10 border-[#263238]/20 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill, index) => (
                        <Badge key={index} className="bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30 rounded-xl">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Card>

              {/* Availability */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Weekly Availability</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Monday</span>
                    <span className="text-[#263238]">Afternoon, Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Tuesday</span>
                    <span className="text-[#263238]">Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Wednesday</span>
                    <span className="text-[#263238]">Afternoon, Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Thursday</span>
                    <span className="text-[#263238]">Evening</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Friday</span>
                    <span className="text-[#263238]">Afternoon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Saturday</span>
                    <span className="text-[#263238]">All day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#263238]/60">Sunday</span>
                    <span className="text-[#263238]">Morning, Afternoon</span>
                  </div>
                </div>
                <Link to="/schedule">
                  <Button variant="link" className="p-0 h-auto mt-4 text-[#FF9800] hover:text-[#F57C00]">
                    Edit schedule →
                  </Button>
                </Link>
              </Card>

              {/* Job Preferences */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">Job Preferences</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[#263238] text-sm mb-2 block">Preferred Job Types</Label>
                      <Input
                        placeholder="e.g., Part-time, Freelance (comma separated)"
                        value={editedData.jobTypes.join(', ')}
                        onChange={(e) => setEditedData({ 
                          ...editedData, 
                          jobTypes: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                        })}
                        className="h-10 border-[#263238]/20 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm mb-2 block">Desired Hourly Rate</Label>
                      <Input
                        placeholder="e.g., $18 - $25/hr"
                        value={editedData.desiredRate}
                        onChange={(e) => setEditedData({ ...editedData, desiredRate: e.target.value })}
                        className="h-10 border-[#263238]/20 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#263238]/60 mb-1">Preferred Job Types</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.jobTypes.map((type, index) => (
                          <Badge key={index} className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#263238]/60 mb-1">Desired Hourly Rate</p>
                      <p className="text-[#263238]">{userData.desiredRate}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}