import { useState, useEffect, useRef } from "react";
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
  Plus,
  Trash2,
  UserPlus,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";
import { SkeletonCompanyProfile } from "../components/SkeletonCompanyProfile";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar";
import {
  ExperienceSection,
  WeeklyAvailabilitySection,
  ResumeSection,
} from "../components/ProfileEditSections";
import { UserProfileDTO } from "../types/DTOs/ModelDTOs/UserProfileDTO";
import { ScheduleViewDTO } from "../types/DTOs/ModelDTOs/ScheduleDTOs";

const API_URL = import.meta.env.VITE_API_URL;

import { JobPostDTO } from "../types/DTOs/ModelDTOs/JobsDTOs/JobPostDTO";
import { JobDTO } from "../types/DTOs/ModelDTOs/JobsDTOs/JobDTO";
import { formatRelativeTime } from "../utils/dateUtils";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MessageCircle, Heart } from "lucide-react";
import { SkeletonCardGrid } from "../components/SkeletonCard";
import { JobCard } from "../components/JobCard";

export function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const profileUserId = searchParams.get("userId"); // Get userId from URL params

  // Determine if this is the logged-in user's own profile
  const isOwnProfile =
    !profileUserId || (user && Number(profileUserId) === user.id);

  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    location: "",
    industry: "",
    website: "",
    employees: "",
    founded: "",
    description: "",
    googleMapsEmbedUrl: "",
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

  // Gallery state
  const [galleryTab, setGalleryTab] = useState<'posts' | 'jobs' | 'none'>(isOwnProfile ? 'none' : 'posts');
  const [userJobs, setUserJobs] = useState<JobDTO[]>([]);
  const [userPosts, setUserPosts] = useState<JobPostDTO[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const fetchGalleryData = async (tab: 'posts' | 'jobs', targetUserId?: string) => {
    try {
      setLoadingGallery(true);
      const token = localStorage.getItem("access_token");

      let endpoint;
      if (isOwnProfile) {
        endpoint = tab === 'posts' ? 'all-user-posts' : 'all-user-jobs';
      } else {
        endpoint = tab === 'posts' ? `public-user-posts/${targetUserId}` : `public-user-jobs/${targetUserId}`;
      }

      const res = await fetch(`${API_URL}/api/UserProfile/${endpoint}`, {
        headers: {
          'Authorization': isOwnProfile ? `Bearer ${token}` : ''
        }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          if (tab === 'posts') setUserPosts(result.data);
          else setUserJobs(result.data);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${tab}`, err);
      toast.error(`Failed to load ${tab}`);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (galleryTab !== 'none') {
      fetchGalleryData(galleryTab as 'posts' | 'jobs', profileUserId || undefined);
    }
  }, [galleryTab, isOwnProfile, profileUserId]);

  // Posted jobs state removed as unused

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(companyData);
  const [industryFocus, setIndustryFocus] = useState<string[]>([]);
  const [editedIndustryFocus, setEditedIndustryFocus] =
    useState<string[]>([]);
  const [credibilityRating, setCredibilityRating] = useState(0);

  // New profile sections
  const [education, setEducation] = useState<any[]>([]);
  const [editedEducation, setEditedEducation] =
    useState<any[]>([]);

  const [experience, setExperience] = useState<any[]>([]);
  const [editedExperience, setEditedExperience] =
    useState<any[]>([]);

  const [scheduleSlots, setScheduleSlots] = useState<ScheduleViewDTO[]>([]);

  // Fetch schedule slots from API
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/Schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setScheduleSlots(result.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    }
  };

  useEffect(() => {
    if (isOwnProfile) {
      fetchSchedules();
    }
  }, [isOwnProfile]);

  const [resume, setResume] = useState<any>(null);

  const [jobPreferences, setJobPreferences] = useState({
    jobTypes: [],
    expectedSalary: "",
    preferredLocations: [],
    willingToRelocate: false,
    startDate: "",
  });
  const [editedJobPreferences, setEditedJobPreferences] =
    useState(jobPreferences);


  const handleEdit = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedEducation(education);
    setEditedExperience(experience);
    setEditedJobPreferences(jobPreferences);
    setIsEditing(true);
  };

  const handleSave = () => {
    saveProfile();
  };

  const handleCancel = () => {
    setEditedData(companyData);
    setEditedIndustryFocus(industryFocus);
    setEditedEducation(education);
    setEditedExperience(experience);
    setEditedJobPreferences(jobPreferences);
    setIsEditing(false);
  };

  const addIndustryTag = (tag: string) => {
    if (tag && !editedIndustryFocus.includes(tag)) {
      setEditedIndustryFocus([...editedIndustryFocus, tag]);
    }
  };

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/UserProfile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data.avatarUrl) {
          const newAvatarUrl = result.data.avatarUrl.startsWith('http')
            ? result.data.avatarUrl
            : `${API_URL}${result.data.avatarUrl}`;

          setAvatarUrl(newAvatarUrl);
          updateUser({ avatarUrl: newAvatarUrl });
          toast.success("Avatar updated successfully!");
        }
      } else {
        toast.error("Failed to upload avatar");
      }
    } catch (err) {
      console.error("Avatar upload error", err);
      toast.error("An error occurred during upload");
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
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const endpoint = isOwnProfile
          ? 'show-profile'
          : `public-profile/${profileUserId}`;

        const res = await fetch(`${API_URL}/api/UserProfile/${endpoint}`, {
          headers: {
            'Authorization': isOwnProfile ? `Bearer ${token}` : ''
          }
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const data: UserProfileDTO = result.data;

            // Map API data to component state
            setCompanyData({
              name: data.fullName || "",
              email: data.email || "",
              phone: data.phone || "",
              location: data.location || "",
              industry: data.industry || "",
              website: data.website || "",
              employees: data.companySize || "",
              founded: data.foundedYear?.toString() || "",
              description: data.description || data.bio || data.about || "",
              googleMapsEmbedUrl: data.googleMapsEmbedUrl || ""
            });
            setCredibilityRating(data.rating || 0);

            if (data.avatarUrl) {
              const fullAvatarUrl = data.avatarUrl.startsWith('http')
                ? data.avatarUrl
                : `${API_URL}${data.avatarUrl}`;
              setAvatarUrl(fullAvatarUrl);
            }

            setIndustryFocus(data.skills || []);

            // Education
            setEducation(data.educations.map(e => ({
              id: e.id.toString(),
              school: e.school,
              degree: e.degree,
              field: e.fieldOfStudy,
              startYear: e.startYear,
              endYear: e.endYear || "",
              description: e.description || ""
            })));

            // Experience
            setExperience(data.experiences.map(e => ({
              id: e.id.toString(),
              company: e.company,
              position: e.title,
              startDate: new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), // Format date
              endDate: e.endDate ? new Date(e.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present",
              description: e.description || ""
            })));

            // Schedule map (simplified)
            // Need to parse data.schedules to weeklyAvailability object
            // Assuming data.schedules contains entries for days
            // This part is complex because backend returns list, frontend wants object.
            // For now, keeping existing schedule to avoid breaking UI until backend returns compatible structure or we implement full parser
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOwnProfile, user]);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Utility to safely parse date to ISO string
      const toISO = (dateStr: string) => {
        if (!dateStr || dateStr === "Present") return undefined;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
      };

      // Utility to safely parse ID to Int32
      const safeId = (id: any) => {
        const parsed = parseInt(id);
        // If NaN or greater than Int32 MaxValue, treat as 0 (new item)
        return isNaN(parsed) || parsed > 2147483647 ? 0 : parsed;
      };

      // Map state to DTO
      const profileDTO: any = {
        id: user?.id || 0,
        fullName: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
        location: editedData.location,
        website: editedData.website,
        companySize: editedData.employees,
        foundedYear: parseInt(editedData.founded) || undefined,
        industry: editedData.industry,
        bio: editedData.description,
        description: editedData.description,
        skills: editedIndustryFocus,
        googleMapsEmbedUrl: editedData.googleMapsEmbedUrl,

        experiences: editedExperience.map(e => ({
          id: safeId(e.id),
          title: e.position,
          company: e.company,
          startDate: toISO(e.startDate) || new Date().toISOString(),
          endDate: toISO(e.endDate),
          description: e.description
        })),

        educations: editedEducation.map(e => ({
          id: safeId(e.id),
          school: e.school,
          degree: e.degree,
          fieldOfStudy: e.field,
          startYear: e.startYear,
          endYear: e.endYear,
          description: e.description
        })),

        schedules: []
      };

      const res = await fetch(`${API_URL}/api/UserProfile/edit-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileDTO)
      });

      if (res.ok) {
        let result;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          result = await res.json();
        }

        if (!result || result.success) {
          toast.success("Profile updated successfully!");

          // Update local state with edited data firmly
          setCompanyData(editedData);
          setIndustryFocus(editedIndustryFocus);
          setEducation(editedEducation);
          setExperience(editedExperience);
          setJobPreferences(editedJobPreferences);
          setJobPreferences(editedJobPreferences);
          setIsEditing(false);
        } else {
          toast.error(result.message || "Failed to update profile");
        }
      } else {
        const errorText = await res.text();
        console.error("Save failed", res.status, errorText);
        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Failed to update profile. Server error.");
        }
      }

    } catch (err) {
      console.error("Error saving profile", err);
      toast.error("An error occurred while saving");
    }
  };

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
              <div
                onClick={handleAvatarClick}
                className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center flex-shrink-0 shadow-md relative overflow-hidden group ${isOwnProfile ? 'cursor-pointer' : ''}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={companyData.name}
                    className="w-full h-full object-cover rounded-2xl transition group-hover:scale-105"
                  />
                ) : (
                  <span className="text-white text-5xl font-bold">
                    {companyData.name.charAt(0)}
                  </span>
                )}
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Edit className="w-8 h-8 text-white" />
                  </div>
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
                    <div>
                      <Label className="text-[#263238] text-sm">
                        Google Maps Embed URL (Optional)
                      </Label>
                      <Input
                        value={editedData.googleMapsEmbedUrl}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            googleMapsEmbedUrl: e.target.value,
                          })
                        }
                        className="h-10 border-[#263238]/20 rounded-xl mt-1"
                        placeholder="Paste the 'src' value from Google Maps embed code"
                      />
                      <p className="text-[10px] text-[#263238]/50 mt-1">
                        Go to Google Maps → Share → Embed a map → Copy the URL inside src="..."
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h1 className="text-[#263238] mb-2">
                          {companyData.name}
                        </h1>
                        {(companyData.industry || credibilityRating > 0) && (
                          <div className="flex items-center gap-3 mb-2">
                            {companyData.industry && (
                              <Badge className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">
                                {companyData.industry}
                              </Badge>
                            )}
                            {/* Credibility Rating */}
                            {credibilityRating > 0 && (
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
                            )}
                          </div>
                        )}
                      </div>

                      {/* Follow Button */}
                      {!isOwnProfile && (
                        <Button
                          onClick={handleFollowToggle}
                          className={`${isFollowing
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
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
                      {companyData.email && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <Mail className="w-4 h-4 text-[#FF9800]" />
                          <span>{companyData.email}</span>
                        </div>
                      )}
                      {companyData.phone && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <Phone className="w-4 h-4 text-[#FF9800]" />
                          <span>{companyData.phone}</span>
                        </div>
                      )}
                      {companyData.location && (
                        <div className="flex items-center gap-2 text-[#263238]/70">
                          <MapPin className="w-4 h-4 text-[#FF9800]" />
                          <span>{companyData.location}</span>
                        </div>
                      )}
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
                      {user && isOwnProfile ? (
                        <>
                          <Link to="/post-job" className="contents">
                            <Button
                              className={`${galleryTab === 'posts' ? 'bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white' : 'bg-white border-2 border-[#263238]/20 hover:border-[#4ADE80] hover:text-[#4ADE80] text-[#263238]/70'} rounded-xl shadow-md hover:shadow-lg transition`}
                            >
                              User Posts
                            </Button>
                          </Link>
                          <Link to="/user-jobs" className="contents">
                            <Button
                              variant="outline"
                              className={`${galleryTab === 'jobs' ? 'bg-[#4FC3F7] border-2 border-[#4FC3F7] text-white hover:bg-[#4FC3F7]/90' : 'border-2 border-[#263238]/20 hover:border-[#4FC3F7] hover:text-[#4FC3F7] text-[#263238]/70'} rounded-xl transition`}
                            >
                              <Briefcase className="w-4 h-4 mr-2" />
                              User Jobs
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setGalleryTab('posts')}
                            className={`${galleryTab === 'posts' ? 'bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-white' : 'bg-white border-2 border-[#263238]/20 hover:border-[#4ADE80] hover:text-[#4ADE80] text-[#263238]/70'} rounded-xl shadow-md hover:shadow-lg transition`}
                          >
                            User Posts
                          </Button>
                          <Button
                            onClick={() => setGalleryTab('jobs')}
                            variant="outline"
                            className={`${galleryTab === 'jobs' ? 'bg-[#4FC3F7] border-2 border-[#4FC3F7] text-white hover:bg-[#4FC3F7]/90' : 'border-2 border-[#263238]/20 hover:border-[#4FC3F7] hover:text-[#4FC3F7] text-[#263238]/70'} rounded-xl transition`}
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            User Jobs
                          </Button>
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
            <div className="lg:col-span-2 space-y-6 min-w-0 w-full">
              {/* Gallery View */}
              {galleryTab !== 'none' && (
                <div className="space-y-4">
                  {loadingGallery ? (
                    <SkeletonCardGrid />
                  ) : galleryTab === 'posts' ? (
                    userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <Card key={post.postId} className="p-4 border-[#263238]/10 shadow-md">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="w-10 h-10 border-2 border-[#FF9800]/20">
                              <AvatarImage src={post.avatarUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] text-white">
                                {post.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-semibold text-[#263238]">{post.fullName}</h4>
                              <p className="text-xs text-[#263238]/50">
                                {post.createdAt ? formatRelativeTime(post.createdAt) : "Recently"}
                              </p>
                            </div>
                          </div>

                          {post.content && (
                            <p className="text-[#263238]/80 text-sm mb-4 whitespace-pre-line leading-relaxed">
                              {post.content}
                            </p>
                          )}

                          {post.postImage && (
                            <div className="rounded-xl overflow-hidden mb-4 border border-[#263238]/5 shadow-sm">
                              <ImageWithFallback
                                src={post.postImage.startsWith('http') ? post.postImage : `${API_URL}${post.postImage}`}
                                alt="Post content"
                                className="w-full object-cover max-h-[400px]"
                              />
                            </div>
                          )}

                          {post.jobs && post.jobs.length > 0 && (
                            <div className="mb-4 space-y-2">
                              {post.jobs.map(job => (
                                <div key={job.id} className="p-3 bg-gradient-to-r from-[#FF9800]/5 to-transparent border-l-4 border-[#FF9800] rounded-r-xl">
                                  <h5 className="text-sm font-semibold text-[#263238]">{job.jobName}</h5>
                                  <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-[11px] text-[#263238]/60">
                                      <MapPin className="w-3 h-3" />
                                      {job.location}
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-[#263238]/60">
                                      <DollarSign className="w-3 h-3" />
                                      {job.salary}
                                    </div>
                                    {job.jobType && (
                                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-[#4FC3F7]/10 text-[#4FC3F7] border-0">
                                        {job.jobType}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-6 pt-2 border-t border-[#263238]/5">
                            <button className="flex items-center gap-1.5 text-[#263238]/50 hover:text-[#FF9800] transition">
                              <Heart className="w-4 h-4" />
                              <span className="text-xs font-medium">{post.likeCount}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-[#263238]/50 hover:text-[#4FC3F7] transition">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">{post.commentCount}</span>
                            </button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-12 text-center border-dashed border-2 border-[#263238]/10">
                        <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-[#263238]/20" />
                        </div>
                        <h4 className="text-[#263238] font-medium">No posts found</h4>
                        <p className="text-[#263238]/50 text-sm mt-1">You haven't shared any posts yet.</p>
                      </Card>
                    )
                  ) : (
                    userJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            id={job.id.toString()}
                            title={job.jobName}
                            company={companyData.name}
                            location={job.location}
                            type={job.jobType as any}
                            description="" // JobDTO doesn't have description in this context
                            salary={job.salary}
                            postedDate="Active"
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 text-center border-dashed border-2 border-[#263238]/10">
                        <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-8 h-8 text-[#263238]/20" />
                        </div>
                        <h4 className="text-[#263238] font-medium">No jobs found</h4>
                        <p className="text-[#263238]/50 text-sm mt-1">You haven't posted any jobs yet.</p>
                      </Card>
                    )
                  )}
                </div>
              )}

              {/* Description */}
              {(companyData.description || isEditing) && (
                <Card className="p-6 border-[#263238]/10 shadow-md overflow-hidden min-w-0">
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
                    <p className="text-[#263238]/70 whitespace-pre-line break-all [overflow-wrap:anywhere]">
                      {companyData.description}
                    </p>
                  )}
                </Card>
              )}

              {/* Education - Only show if exists */}
              {(education.length > 0 || isEditing) && (
                <Card className="p-6 border-[#263238]/10 shadow-md overflow-hidden min-w-0">
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
                            <p className="text-sm text-[#263238]/70 mt-2 break-all">
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

              {/* Weekly Availability - Show schedule slots from API */}
              <WeeklyAvailabilitySection
                scheduleSlots={scheduleSlots}
                isEditing={isEditing}
                isOwnProfile={isOwnProfile}
              />

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
              {(companyData.location || companyData.googleMapsEmbedUrl || isEditing) && (
                <Card className="p-0 border-[#263238]/10 shadow-md overflow-hidden">
                  <div className="bg-[#FF9800] px-6 py-4">
                    <h3 className="text-white font-semibold">Contact Information</h3>
                  </div>

                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-[#263238] font-medium text-sm mb-2 block">
                            Address Details (Optional)
                          </Label>
                          <Textarea
                            value={editedData.location}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                location: e.target.value,
                              })
                            }
                            className="border-[#263238]/20 rounded-xl min-h-[80px] focus:border-[#FF9800] focus:ring-[#FF9800]"
                            placeholder="e.g., 9th Floor, Technosoft Building, Alley 15 Duy Tan, Hanoi"
                          />
                        </div>
                        <div>
                          <Label className="text-[#263238] font-medium text-sm mb-2 block">
                            Google Maps Embed URL (Optional)
                          </Label>
                          <Input
                            value={editedData.googleMapsEmbedUrl}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                googleMapsEmbedUrl: e.target.value,
                              })
                            }
                            className="h-10 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:ring-[#FF9800]"
                            placeholder="Paste Google Maps embed URL here"
                          />
                          <p className="text-[10px] text-[#263238]/50 mt-1.5">
                            Search location on Google Maps → Share → Embed a map → Copy 'src' URL
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Address Details */}
                        {companyData.location && (
                          <div className="mb-4 pb-4 border-b border-[#263238]/10">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#FF9800]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4 text-[#FF9800]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[#263238] font-semibold mb-1.5">Address Details</h4>
                                <p className="text-[#263238]/70 text-sm leading-relaxed break-all">
                                  {companyData.location}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* View Map */}
                        {companyData.googleMapsEmbedUrl && (
                          <div className="mt-4 pt-4 border-t border-[#263238]/10">
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
                                src={companyData.googleMapsEmbedUrl}
                                width="100%"
                                height="250"
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
              {(industryFocus.length > 0 || isEditing) && (
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
              )}
            </div>
          </div>
        </div >
      </div >
    </div >
  );
}