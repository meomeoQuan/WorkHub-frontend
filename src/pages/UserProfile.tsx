import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Users,
  ArrowLeft,
  Edit,
  Save,
  X,
  Star,
  GraduationCap,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";
import { JobCard } from "../components/JobCard";
import { SkeletonCompanyProfile } from "../components/SkeletonCompanyProfile";
import { SkeletonCompanyStats } from "../components/SkeletonCompanyStats";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  ExperienceSection,
  WeeklyAvailabilitySection,
  ResumeSection,
} from "../components/ProfileEditSections";

export function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const profileUserId = searchParams.get("userId"); // Get userId from URL params

  // Determine if this is the logged-in user's own profile
  const isOwnProfile =
    !profileUserId || profileUserId === user?.id;

  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: user?.fullName || "TechCorp Inc.",
    email: user?.email || "contact@techcorp.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    industry: "Technology",
    website: "www.techcorp.com",
    employees: "50-200",
    founded: "2015",
    description: `TechCorp is a leading technology company specializing in innovative software solutions for businesses worldwide. We pride ourselves on creating a collaborative and inclusive work environment where creativity and innovation thrive.

Our mission is to empower businesses through technology while maintaining a commitment to excellence and employee development. We offer competitive compensation, flexible work arrangements, and opportunities for growth.`,
  });

  const [postedJobs, setPostedJobs] = useState([
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
      logo: user?.profileImage,
    },
    {
      id: "8",
      title: "Freelance Web Developer",
      company: "TechCorp",
      location: "Remote",
      type: "Freelance" as const,
      description:
        "Build responsive websites for small businesses. React experience preferred.",
      salary: "$50-80/hr",
      postedDate: "2 days ago",
      logo: user?.profileImage,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(companyData);
  const [industryFocus, setIndustryFocus] = useState([
    "Software Development",
    "Cloud Computing",
    "Data Analytics",
    "AI/ML",
  ]);
  const [editedIndustryFocus, setEditedIndustryFocus] =
    useState(industryFocus);
  const [credibilityRating] = useState(4.5); // Credibility rating out of 5

  // New profile sections
  const [education, setEducation] = useState([
    {
      id: "1",
      school: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startYear: "2015",
      endYear: "2019",
      description:
        "Focused on software engineering and artificial intelligence.",
    },
  ]);
  const [editedEducation, setEditedEducation] =
    useState(education);

  const [experience, setExperience] = useState([
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Software Developer",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Developing scalable web applications using React and Node.js. Led a team of 5 developers on multiple successful projects.",
    },
  ]);
  const [editedExperience, setEditedExperience] =
    useState(experience);

  const [weeklyAvailability, setWeeklyAvailability] = useState({
    monday: { available: true, hours: "9:00 AM - 5:00 PM" },
    tuesday: { available: true, hours: "9:00 AM - 5:00 PM" },
    wednesday: { available: true, hours: "9:00 AM - 5:00 PM" },
    thursday: { available: true, hours: "9:00 AM - 5:00 PM" },
    friday: { available: true, hours: "9:00 AM - 5:00 PM" },
    saturday: { available: false, hours: "" },
    sunday: { available: false, hours: "" },
  });
  const [
    editedWeeklyAvailability,
    setEditedWeeklyAvailability,
  ] = useState(weeklyAvailability);

  const [resume, setResume] = useState({
    fileName: "John_Doe_Resume.pdf",
    fileUrl: "#",
    uploadedDate: "Feb 1, 2025",
  });

  const [jobPreferences, setJobPreferences] = useState({
    jobTypes: ["Part-time", "Freelance"],
    expectedSalary: "$40-60/hr",
    preferredLocations: ["San Francisco, CA", "Remote"],
    willingToRelocate: false,
    startDate: "Immediately",
  });
  const [editedJobPreferences, setEditedJobPreferences] =
    useState(jobPreferences);

  // Contact Information (Optional)
  const [contactInfo, setContactInfo] = useState({
    companyAddress: "",
    addressDetails: "",
    showMap: false,
    mapEmbedUrl: "",
  });
  const [editedContactInfo, setEditedContactInfo] =
    useState(contactInfo);

  const handleEdit = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedEducation(education);
    setEditedExperience(experience);
    setEditedWeeklyAvailability(weeklyAvailability);
    setEditedJobPreferences(jobPreferences);
    setEditedContactInfo(contactInfo);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCompanyData(editedData);
    setIndustryFocus(editedIndustryFocus);
    setEducation(editedEducation);
    setExperience(editedExperience);
    setWeeklyAvailability(editedWeeklyAvailability);
    setJobPreferences(editedJobPreferences);
    setContactInfo(editedContactInfo);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedEducation(education);
    setEditedExperience(experience);
    setEditedWeeklyAvailability(weeklyAvailability);
    setEditedJobPreferences(jobPreferences);
    setEditedContactInfo(contactInfo);
    setIsEditing(false);
  };

  const addIndustryTag = (tag: string) => {
    if (tag && !editedIndustryFocus.includes(tag)) {
      setEditedIndustryFocus([...editedIndustryFocus, tag]);
    }
  };

  const removeIndustryTag = (index: number) => {
    setEditedIndustryFocus(
      editedIndustryFocus.filter((_, i) => i !== index),
    );
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`Following ${companyData.name}!`);
    } else {
      toast.success(`Unfollowed ${companyData.name}`);
    }
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
                  <span className="text-white text-5xl font-bold">
                    {companyData.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#263238] text-sm">
                        User Name
                      </Label>
                      <Input
                        value={editedData.name}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            name: e.target.value,
                          })
                        }
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">
                        Industry
                      </Label>
                      <Input
                        value={editedData.industry}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            industry: e.target.value,
                          })
                        }
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Email
                        </Label>
                        <Input
                          value={editedData.email}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              email: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Phone
                        </Label>
                        <Input
                          value={editedData.phone}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              phone: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Location
                        </Label>
                        <Input
                          value={editedData.location}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              location: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Website
                        </Label>
                        <Input
                          value={editedData.website}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              website: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Company Size
                        </Label>
                        <Input
                          value={editedData.employees}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              employees: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                          placeholder="e.g., 50-200"
                        />
                      </div>
                      <div>
                        <Label className="text-[#263238] text-sm">
                          Founded Year
                        </Label>
                        <Input
                          value={editedData.founded}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              founded: e.target.value,
                            })
                          }
                          className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h1 className="text-[#263238] mb-2">
                          {companyData.name}
                        </h1>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">
                            {companyData.industry}
                          </Badge>
                          {/* Credibility Rating */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-xl">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                const isFilled =
                                  starValue <=
                                  Math.floor(credibilityRating);
                                const isHalf =
                                  !isFilled &&
                                  starValue ===
                                    Math.ceil(
                                      credibilityRating,
                                    ) &&
                                  credibilityRating % 1 !== 0;

                                return (
                                  <div
                                    key={index}
                                    className="relative"
                                  >
                                    {isHalf ? (
                                      <>
                                        <Star className="w-4 h-4 text-[#FF9800]" />
                                        <Star
                                          className="w-4 h-4 text-[#FF9800] fill-[#FF9800] absolute top-0 left-0"
                                          style={{
                                            clipPath:
                                              "inset(0 50% 0 0)",
                                          }}
                                        />
                                      </>
                                    ) : (
                                      <Star
                                        className={`w-4 h-4 text-[#FF9800] ${isFilled ? "fill-[#FF9800]" : ""}`}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-sm font-semibold text-[#FF9800] ml-1">
                              {credibilityRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Follow Button */}
                      <Button
                        onClick={handleFollowToggle}
                        className={`${
                          isFollowing
                            ? "bg-white border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800]/5"
                            : "bg-[#FF9800] hover:bg-[#F57C00] text-white border-2 border-[#FF9800]"
                        } rounded-xl shadow-md hover:shadow-lg transition flex-shrink-0`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
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
                      {companyData.website && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <Globe className="w-4 h-4 text-[#FF9800]" />
                          <span>{companyData.website}</span>
                        </div>
                      )}
                      {companyData.employees && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <Users className="w-4 h-4 text-[#FF9800]" />
                          <span>
                            {companyData.employees} employees
                          </span>
                        </div>
                      )}
                      {companyData.founded && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <Building2 className="w-4 h-4 text-[#FF9800]" />
                          <span>
                            Founded {companyData.founded}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-xl shadow-md hover:shadow-lg transition"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-2 border-[#263238]/20 hover:border-[#FF9800] hover:text-[#FF9800] rounded-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Only show Edit Profile and View Applications for logged-in user's own profile */}
                      {user && isOwnProfile && (
                        <>
                          <Button
                            onClick={handleEdit}
                            className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl shadow-md hover:shadow-lg transition"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </>
                      )}
                      {/* Show User Posts and User Jobs for everyone (including anonymous users) */}
                      <Link to="/post-job">
                        <Button className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white rounded-xl shadow-md hover:shadow-lg transition">
                          User Posts
                        </Button>
                      </Link>
                      <Link to="/user-jobs">
                        <Button
                          variant="outline"
                          className="border-2 border-[#263238]/20 hover:border-[#4FC3F7] hover:text-[#4FC3F7] rounded-xl"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          User Jobs
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
              {/* Description */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h2 className="text-[#263238] mb-4">
                  Description
                </h2>
                {isEditing ? (
                  <div>
                    <Label className="text-[#263238] text-sm mb-2 block">
                      Profile Description
                    </Label>
                    <Textarea
                      value={editedData.description}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          description: e.target.value,
                        })
                      }
                      className="border-[#263238]/20 rounded-xl min-h-[200px]"
                      placeholder="Tell others about yourself, your experience, and what you're looking for..."
                    />
                  </div>
                ) : (
                  <p className="text-[#263238]/70 whitespace-pre-line">
                    {companyData.description}
                  </p>
                )}
              </Card>

              {/* Education - Only show if exists */}
              {(education.length > 0 || isEditing) && (
                <Card className="p-6 border-[#263238]/10 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#FF9800]" />
                      <h2 className="text-[#263238]">
                        Education
                      </h2>
                    </div>
                    {isEditing && (
                      <Button
                        onClick={() => {
                          const newEdu = {
                            id: Date.now().toString(),
                            school: "",
                            degree: "",
                            field: "",
                            startYear: "",
                            endYear: "",
                            description: "",
                          };
                          setEditedEducation([
                            ...editedEducation,
                            newEdu,
                          ]);
                        }}
                        size="sm"
                        className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-lg"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {isEditing ? (
                      editedEducation.length > 0 ? (
                        editedEducation.map((edu, index) => (
                          <div
                            key={edu.id}
                            className="p-4 border border-[#263238]/10 rounded-lg space-y-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-[#263238] font-semibold">
                                Education #{index + 1}
                              </Label>
                              <Button
                                onClick={() => {
                                  setEditedEducation(
                                    editedEducation.filter(
                                      (_, i) => i !== index,
                                    ),
                                  );
                                }}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[#263238] text-sm">
                                  School/University
                                </Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editedEducation,
                                    ];
                                    updated[index].school =
                                      e.target.value;
                                    setEditedEducation(updated);
                                  }}
                                  className="h-9 border-[#263238]/20 rounded-lg mt-1"
                                  placeholder="e.g., Stanford University"
                                />
                              </div>
                              <div>
                                <Label className="text-[#263238] text-sm">
                                  Degree
                                </Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editedEducation,
                                    ];
                                    updated[index].degree =
                                      e.target.value;
                                    setEditedEducation(updated);
                                  }}
                                  className="h-9 border-[#263238]/20 rounded-lg mt-1"
                                  placeholder="e.g., Bachelor of Science"
                                />
                              </div>
                              <div>
                                <Label className="text-[#263238] text-sm">
                                  Field of Study
                                </Label>
                                <Input
                                  value={edu.field}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editedEducation,
                                    ];
                                    updated[index].field =
                                      e.target.value;
                                    setEditedEducation(updated);
                                  }}
                                  className="h-9 border-[#263238]/20 rounded-lg mt-1"
                                  placeholder="e.g., Computer Science"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[#263238] text-sm">
                                    Start Year
                                  </Label>
                                  <Input
                                    value={edu.startYear}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editedEducation,
                                      ];
                                      updated[index].startYear =
                                        e.target.value;
                                      setEditedEducation(
                                        updated,
                                      );
                                    }}
                                    className="h-9 border-[#263238]/20 rounded-lg mt-1"
                                    placeholder="2015"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[#263238] text-sm">
                                    End Year
                                  </Label>
                                  <Input
                                    value={edu.endYear}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editedEducation,
                                      ];
                                      updated[index].endYear =
                                        e.target.value;
                                      setEditedEducation(
                                        updated,
                                      );
                                    }}
                                    className="h-9 border-[#263238]/20 rounded-lg mt-1"
                                    placeholder="2019"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-[#263238] text-sm">
                                Description (Optional)
                              </Label>
                              <Textarea
                                value={edu.description}
                                onChange={(e) => {
                                  const updated = [
                                    ...editedEducation,
                                  ];
                                  updated[index].description =
                                    e.target.value;
                                  setEditedEducation(updated);
                                }}
                                className="border-[#263238]/20 rounded-lg mt-1 min-h-[80px]"
                                placeholder="Describe your focus areas, achievements, etc."
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#263238]/50 text-sm text-center py-4">
                          No education added yet. Click "Add
                          Education" to add one.
                        </p>
                      )
                    ) : (
                      education.map((edu) => (
                        <div
                          key={edu.id}
                          className="pb-4 border-b border-[#263238]/10 last:border-0 last:pb-0"
                        >
                          <h3 className="font-semibold text-[#263238]">
                            {edu.school}
                          </h3>
                          <p className="text-[#263238]/80">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-sm text-[#263238]/60">
                            {edu.startYear} - {edu.endYear}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-[#263238]/70 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}

              {/* Experience - Only show if exists */}
              <ExperienceSection
                experience={experience}
                editedExperience={editedExperience}
                isEditing={isEditing}
                setEditedExperience={setEditedExperience}
              />

              {/* Weekly Availability - Only show if any day is available */}
              {(Object.values(weeklyAvailability).some(day => day.available) || isEditing) && (
                <WeeklyAvailabilitySection
                  weeklyAvailability={weeklyAvailability}
                  isEditing={isEditing}
                />
              )}

              {/* Resume - Only show if exists */}
              <ResumeSection
                resume={resume}
                isEditing={isEditing}
                setResume={setResume}
              />

              {/* Posted Jobs section removed */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information - Optional */}
              {(contactInfo.companyAddress || contactInfo.addressDetails || isEditing) && (
                <Card className="p-0 border-[#263238]/10 shadow-md overflow-hidden">
                  <div className="bg-[#FF9800] px-6 py-4">
                    <h3 className="text-white font-semibold">Contact Information</h3>
                  </div>
                  
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-[#263238] font-medium text-sm mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#FF9800]" />
                            Company Address (Optional)
                          </Label>
                          <Input
                            value={editedContactInfo.companyAddress}
                            onChange={(e) =>
                              setEditedContactInfo({
                                ...editedContactInfo,
                                companyAddress: e.target.value,
                              })
                            }
                            className="h-10 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:ring-[#FF9800]"
                            placeholder="e.g., 9th Floor, Technosoft Building"
                          />
                        </div>
                        <div>
                          <Label className="text-[#263238] font-medium text-sm mb-2 block">
                            Full Address Details (Optional)
                          </Label>
                          <Textarea
                            value={editedContactInfo.addressDetails}
                            onChange={(e) =>
                              setEditedContactInfo({
                                ...editedContactInfo,
                                addressDetails: e.target.value,
                              })
                            }
                            className="border-[#263238]/20 rounded-xl min-h-[80px] focus:border-[#FF9800] focus:ring-[#FF9800]"
                            placeholder="e.g., Alley 15 Duy Tan, Dich Vong Hau Ward, Cau Giay District, Hanoi"
                          />
                        </div>
                        <div>
                          <Label className="text-[#263238] font-medium text-sm mb-2 block">
                            Google Maps Embed URL (Optional)
                          </Label>
                          <Input
                            value={editedContactInfo.mapEmbedUrl}
                            onChange={(e) =>
                              setEditedContactInfo({
                                ...editedContactInfo,
                                mapEmbedUrl: e.target.value,
                              })
                            }
                            className="h-10 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:ring-[#FF9800]"
                            placeholder="Paste Google Maps embed URL here"
                          />
                          <p className="text-xs text-[#263238]/50 mt-1.5">
                            To get embed URL: Search location on Google Maps → Share → Embed a map → Copy HTML
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-1">
                          <input
                            type="checkbox"
                            id="showMap"
                            checked={editedContactInfo.showMap}
                            onChange={(e) =>
                              setEditedContactInfo({
                                ...editedContactInfo,
                                showMap: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-[#263238]/30 text-[#FF9800] focus:ring-[#FF9800] cursor-pointer"
                          />
                          <Label htmlFor="showMap" className="text-[#263238] text-sm cursor-pointer select-none">
                            Show map on profile
                          </Label>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Company Address */}
                        {contactInfo.companyAddress && (
                          <div className="mb-4 pb-4 border-b border-[#263238]/10">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#FF9800]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4 text-[#FF9800]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[#263238] font-semibold mb-1.5">Company Address</h4>
                                <p className="text-[#263238]/70 text-sm leading-relaxed">
                                  {contactInfo.companyAddress}
                                </p>
                                {contactInfo.addressDetails && (
                                  <p className="text-[#263238]/70 text-sm mt-1 leading-relaxed">
                                    {contactInfo.addressDetails}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* View Map */}
                        {contactInfo.showMap && contactInfo.mapEmbedUrl && (
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-[#FF9800]/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-[#FF9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                              </div>
                              <h4 className="text-[#263238] font-semibold">View Map</h4>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-[#263238]/10 shadow-sm">
                              <iframe
                                src={contactInfo.mapEmbedUrl}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              )}

              {/* Industry Focus */}
              <Card className="p-6 border-[#263238]/10 shadow-md">
                <h3 className="text-[#263238] mb-4">
                  Industry Focus
                </h3>
                {isEditing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editedIndustryFocus.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition"
                          onClick={() =>
                            removeIndustryTag(index)
                          }
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Type an industry tag and press Enter"
                      className="h-10 border-[#263238]/20 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = e.currentTarget;
                          addIndustryTag(input.value);
                          input.value = "";
                        }
                      }}
                    />
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {industryFocus.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl"
                      >
                        {tag}
                      </Badge>
                    ))}
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