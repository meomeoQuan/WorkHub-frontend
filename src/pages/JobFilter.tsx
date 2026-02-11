import { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Smile,
  Search,
  SlidersHorizontal,
  X,
  ArrowUp,
  Link2,
  Gift,
  BarChart3,
  MapPinIcon,
  ChevronDown,
  Building2,
  Calendar,
  TrendingUp,
  Filter,
  UserPlus,
  UserCheck,
  Users,
  Star,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { SkeletonFeedPostGrid } from "../components/SkeletonFeedPost";
import { SkeletonCommentModal } from "../components/SkeletonCommentModal";
import { SkeletonNewPostModal } from "../components/SkeletonNewPostModal";

// Mock job posts data
const jobPosts = [
  {
    id: "1",
    company: "Coffee & Co.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Coffee&backgroundColor=FF9800",
    username: "coffee_and_co",
    companyEmployees: "50-200 employees",
    companyRating: "4.8 rating",
    credibilityRating: 4.8,
    timestamp: "2h",
    content:
      "We're hiring! ☕ Looking for enthusiastic baristas to join our team. Flexible hours, great tips, and free coffee!",
    jobTitle: "Part-time Barista",
    location: "New York, NY",
    salary: "$15-18/hr",
    salaryMin: 15,
    salaryMax: 18,
    type: "Part-time",
    jobImage: "",
    likes: 124,
    comments: 18,
    reposts: 32,
    shares: 9,
    image: null,
    category: "Food & Beverage",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000) as unknown as string, // 2 hours ago
    attachedJobs: [] as string[],
  },
  {
    id: "2",
    company: "Design Studio",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Design&backgroundColor=4FC3F7",
    username: "design_studio",
    companyEmployees: "10-50 employees",
    companyRating: "4.6 rating",
    credibilityRating: 4.6,
    timestamp: "5h",
    content:
      "Remote opportunity! 🎨 Create stunning visuals for various client projects. We're looking for talented graphic designers. Portfolio required.",
    jobTitle: "Freelance Graphic Designer",
    location: "Remote",
    salary: "$40-60/hr",
    salaryMin: 40,
    salaryMax: 60,
    type: "Freelance",
    jobImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    likes: 287,
    comments: 43,
    reposts: 56,
    shares: 21,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    category: "Design",
    experienceLevel: "Mid Level",
    workSetting: "Remote",
    companySize: "Small",
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000) as unknown as string, // 5 hours ago
    attachedJobs: [] as string[],
  },
  {
    id: "3",
    company: "Fashion Boutique",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Fashion&backgroundColor=4ADE80",
    username: "fashion_boutique",
    companyEmployees: "50-200 employees",
    companyRating: "4.3 rating",
    credibilityRating: 4.3,
    timestamp: "1d",
    content:
      "Seasonal opportunity! 👗 Help customers find their perfect outfit during our busy season. Great employee discount and fun team environment!",
    jobTitle: "Seasonal Retail Associate",
    location: "Chicago, IL",
    salary: "$14-16/hr",
    salaryMin: 14,
    salaryMax: 16,
    type: "Seasonal",
    jobImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    likes: 156,
    comments: 24,
    reposts: 15,
    shares: 7,
    image: null,
    category: "Retail",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) as unknown as string, // 1 day ago
    attachedJobs: [] as string[],
  },
  {
    id: "4",
    company: "TechCorp",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Tech&backgroundColor=263238",
    username: "techcorp_jobs",
    companyEmployees: "500+ employees",
    companyRating: "4.5 rating",
    credibilityRating: 4.5,
    timestamp: "2d",
    content:
      "Work from anywhere! 💻 Accurate and detail-oriented data entry work. Remote options available with flexible scheduling.",
    jobTitle: "Part-time Data Entry Specialist",
    location: "San Francisco, CA",
    salary: "$18-22/hr",
    salaryMin: 18,
    salaryMax: 22,
    type: "Part-time",
    jobImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    likes: 198,
    comments: 31,
    reposts: 44,
    shares: 12,
    image: null,
    category: "Technology",
    experienceLevel: "Entry Level",
    workSetting: "Remote",
    companySize: "Large",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as unknown as string, // 2 days ago
    attachedJobs: [] as string[],
  },
  {
    id: "5",
    company: "Marketing Agency",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Marketing&backgroundColor=FF9800",
    username: "marketing_pro",
    companyEmployees: "50-200 employees",
    companyRating: "4.7 rating",
    credibilityRating: 4.7,
    timestamp: "3d",
    content:
      "Freelance writers wanted! ✍️ Write engaging blog posts and website content for various clients. Build your portfolio while earning!",
    jobTitle: "Freelance Content Writer",
    location: "Remote",
    salary: "$30-50/hr",
    salaryMin: 30,
    salaryMax: 50,
    type: "Freelance",
    jobImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    likes: 342,
    comments: 67,
    reposts: 89,
    shares: 28,
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    category: "Marketing",
    experienceLevel: "Mid Level",
    workSetting: "Remote",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) as unknown as string, // 3 days ago
    attachedJobs: [] as string[],
  },
  {
    id: "6",
    company: "Quick Delivery",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Quick&backgroundColor=4FC3F7",
    username: "quick_delivery",
    companyEmployees: "500+ employees",
    companyRating: "4.4 rating",
    credibilityRating: 4.4,
    timestamp: "4d",
    content:
      "Peak season hiring! 🚗 Deliver packages during our busy season. Own vehicle required. Great pay and flexible routes!",
    jobTitle: "Seasonal Delivery Driver",
    location: "Boston, MA",
    salary: "$16-20/hr",
    salaryMin: 16,
    salaryMax: 20,
    type: "Seasonal",
    jobImage:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80",
    likes: 213,
    comments: 39,
    reposts: 52,
    shares: 18,
    image: null,
    category: "Transportation",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Large",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) as unknown as string, // 4 days ago
    attachedJobs: [] as string[],
  },
  {
    id: "7",
    company: "HealthPlus Clinic",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Health&backgroundColor=4ADE80",
    username: "healthplus_clinic",
    companyEmployees: "50-200 employees",
    companyRating: "4.9 rating",
    credibilityRating: 4.9,
    timestamp: "12h",
    content:
      "Join our caring team! 🏥 We're looking for compassionate medical assistants to support our growing practice.",
    jobTitle: "Full-time Medical Assistant",
    location: "Los Angeles, CA",
    salary: "$20-25/hr",
    salaryMin: 20,
    salaryMax: 25,
    type: "Full-time",
    jobImage: "",
    likes: 89,
    comments: 15,
    reposts: 22,
    shares: 6,
    image: null,
    category: "Healthcare",
    experienceLevel: "Mid Level",
    workSetting: "On-site",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000) as unknown as string, // 12 hours ago
    attachedJobs: [] as string[],
  },
  {
    id: "8",
    company: "EduTech Solutions",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Edu&backgroundColor=FF9800",
    username: "edutech_sol",
    companyEmployees: "10-50 employees",
    companyRating: "4.2 rating",
    credibilityRating: 4.2,
    timestamp: "6h",
    content:
      "Remote tutoring opportunity! 📚 Help students excel in math and science. Flexible schedule, work from home.",
    jobTitle: "Part-time Online Tutor",
    location: "Remote",
    salary: "$25-35/hr",
    salaryMin: 25,
    salaryMax: 35,
    type: "Part-time",
    jobImage: "",
    likes: 156,
    comments: 28,
    reposts: 34,
    shares: 11,
    image: null,
    category: "Education",
    experienceLevel: "Mid Level",
    workSetting: "Remote",
    companySize: "Small",
    postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000) as unknown as string, // 6 hours ago
    attachedJobs: [] as string[],
  },
  {
    id: "9",
    company: "Build & Construct Inc",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Build&backgroundColor=263238",
    username: "build_construct",
    companyEmployees: "500+ employees",
    companyRating: "4.6 rating",
    credibilityRating: 4.6,
    timestamp: "5d",
    content:
      "Skilled carpenters needed! 🔨 Work on exciting residential projects. Competitive pay and benefits package included.",
    jobTitle: "Full-time Carpenter",
    location: "Austin, TX",
    salary: "$28-38/hr",
    salaryMin: 28,
    salaryMax: 38,
    type: "Full-time",
    jobImage: "",
    likes: 134,
    comments: 19,
    reposts: 27,
    shares: 8,
    image: null,
    category: "Construction",
    experienceLevel: "Senior Level",
    workSetting: "On-site",
    companySize: "Large",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) as unknown as string, // 5 days ago
    attachedJobs: [] as string[],
  },
  {
    id: "10",
    company: "Creative Web Agency",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Web&backgroundColor=4FC3F7",
    username: "creative_web",
    companyEmployees: "50-200 employees",
    companyRating: "4.1 rating",
    credibilityRating: 4.1,
    timestamp: "8h",
    content:
      "Contract web developer wanted! 💻 Build modern websites for exciting clients. 3-month contract with potential extension.",
    jobTitle: "Contract Web Developer",
    location: "Seattle, WA",
    salary: "$50-70/hr",
    salaryMin: 50,
    salaryMax: 70,
    type: "Contract",
    jobImage: "",
    likes: 267,
    comments: 42,
    reposts: 58,
    shares: 19,
    image: null,
    category: "Technology",
    experienceLevel: "Senior Level",
    workSetting: "Hybrid",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 8 * 60 * 60 * 1000) as unknown as string, // 8 hours ago
    attachedJobs: [] as string[],
  },
  {
    id: "11",
    company: "Digital Marketing Pro",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DMP&backgroundColor=4ADE80",
    username: "digital_marketing",
    companyEmployees: "10-50 employees",
    companyRating: "4.6 rating",
    credibilityRating: 4.6,
    timestamp: "1d",
    content: "Social media manager needed! 📱 Manage campaigns across platforms. Remote-friendly position.",
    jobTitle: "Social Media Manager",
    location: "Remote",
    salary: "$35-50/hr",
    salaryMin: 35,
    salaryMax: 50,
    type: "Full-time",
    jobImage: "",
    likes: 189,
    comments: 28,
    reposts: 41,
    shares: 15,
    image: null,
    category: "Marketing",
    experienceLevel: "Mid Level",
    workSetting: "Remote",
    companySize: "Small",
    postedDate: new Date(Date.now() - 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "12",
    company: "FitLife Gym",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FitLife&backgroundColor=FF9800",
    username: "fitlife_gym",
    companyEmployees: "50-200 employees",
    companyRating: "4.4 rating",
    credibilityRating: 4.4,
    timestamp: "1d",
    content: "Personal trainers wanted! 💪 Help members achieve their fitness goals. Certification required.",
    jobTitle: "Personal Trainer",
    location: "Austin, TX",
    salary: "$25-40/hr",
    salaryMin: 25,
    salaryMax: 40,
    type: "Part-time",
    jobImage: "",
    likes: 156,
    comments: 22,
    reposts: 18,
    shares: 9,
    image: null,
    category: "Health & Wellness",
    experienceLevel: "Mid Level",
    workSetting: "On-site",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 26 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "13",
    company: "BookWorm Library",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Book&backgroundColor=4FC3F7",
    username: "bookworm_lib",
    companyEmployees: "10-50 employees",
    companyRating: "4.7 rating",
    credibilityRating: 4.7,
    timestamp: "2d",
    content: "Library assistant position open! 📚 Help patrons, organize shelves, and manage checkouts.",
    jobTitle: "Library Assistant",
    location: "Boston, MA",
    salary: "$18-24/hr",
    salaryMin: 18,
    salaryMax: 24,
    type: "Part-time",
    jobImage: "",
    likes: 124,
    comments: 16,
    reposts: 12,
    shares: 5,
    image: null,
    category: "Education",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "14",
    company: "GreenThumb Landscaping",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Green&backgroundColor=4ADE80",
    username: "greenthumb_ls",
    companyEmployees: "10-50 employees",
    companyRating: "4.5 rating",
    credibilityRating: 4.5,
    timestamp: "2d",
    content: "Seasonal landscapers needed! 🌱 Mowing, planting, and outdoor maintenance work.",
    jobTitle: "Landscaper",
    location: "Seattle, WA",
    salary: "$20-28/hr",
    salaryMin: 20,
    salaryMax: 28,
    type: "Seasonal",
    jobImage: "",
    likes: 98,
    comments: 11,
    reposts: 8,
    shares: 3,
    image: null,
    category: "Outdoor & Labor",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "15",
    company: "TechStart Inc",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechStart&backgroundColor=FF9800",
    username: "techstart_inc",
    companyEmployees: "50-200 employees",
    companyRating: "4.9 rating",
    credibilityRating: 4.9,
    timestamp: "3d",
    content: "Junior developer needed! 💻 Great opportunity to learn and grow with mentorship from senior devs.",
    jobTitle: "Junior Software Developer",
    location: "San Francisco, CA",
    salary: "$40-60/hr",
    salaryMin: 40,
    salaryMax: 60,
    type: "Full-time",
    jobImage: "",
    likes: 312,
    comments: 54,
    reposts: 67,
    shares: 28,
    image: null,
    category: "Technology",
    experienceLevel: "Entry Level",
    workSetting: "Hybrid",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "16",
    company: "EventPro Management",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Event&backgroundColor=4FC3F7",
    username: "eventpro_mgmt",
    companyEmployees: "50-200 employees",
    companyRating: "4.3 rating",
    credibilityRating: 4.3,
    timestamp: "3d",
    content: "Event coordinators wanted! 🎉 Plan and execute amazing events for clients.",
    jobTitle: "Event Coordinator",
    location: "Los Angeles, CA",
    salary: "$28-42/hr",
    salaryMin: 28,
    salaryMax: 42,
    type: "Contract",
    jobImage: "",
    likes: 167,
    comments: 21,
    reposts: 19,
    shares: 11,
    image: null,
    category: "Events & Hospitality",
    experienceLevel: "Mid Level",
    workSetting: "On-site",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "17",
    company: "QuickServe Restaurant",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Quick&backgroundColor=FF9800",
    username: "quickserve_rest",
    companyEmployees: "10-50 employees",
    companyRating: "4.1 rating",
    credibilityRating: 4.1,
    timestamp: "4d",
    content: "Servers and hosts needed! 🍽️ Fast-paced environment with great team atmosphere.",
    jobTitle: "Server / Host",
    location: "Chicago, IL",
    salary: "$15-22/hr",
    salaryMin: 15,
    salaryMax: 22,
    type: "Part-time",
    jobImage: "",
    likes: 142,
    comments: 18,
    reposts: 14,
    shares: 7,
    image: null,
    category: "Food & Beverage",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "18",
    company: "Pet Paradise",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Pet&backgroundColor=4ADE80",
    username: "pet_paradise",
    companyEmployees: "10-50 employees",
    companyRating: "4.8 rating",
    credibilityRating: 4.8,
    timestamp: "5d",
    content: "Dog walkers and pet sitters needed! 🐕 Flexible schedule, work with adorable animals.",
    jobTitle: "Dog Walker / Pet Sitter",
    location: "Austin, TX",
    salary: "$18-25/hr",
    salaryMin: 18,
    salaryMax: 25,
    type: "Part-time",
    jobImage: "",
    likes: 234,
    comments: 31,
    reposts: 26,
    shares: 14,
    image: null,
    category: "Animal Care",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "19",
    company: "HomeHelp Services",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Home&backgroundColor=4FC3F7",
    username: "homehelp_svc",
    companyEmployees: "10-50 employees",
    companyRating: "4.6 rating",
    credibilityRating: 4.6,
    timestamp: "6d",
    content: "House cleaners wanted! 🧹 Flexible scheduling, competitive pay, and supportive team.",
    jobTitle: "House Cleaner",
    location: "Seattle, WA",
    salary: "$20-30/hr",
    salaryMin: 20,
    salaryMax: 30,
    type: "Part-time",
    jobImage: "",
    likes: 108,
    comments: 13,
    reposts: 9,
    shares: 4,
    image: null,
    category: "Services",
    experienceLevel: "Entry Level",
    workSetting: "On-site",
    companySize: "Small",
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
  {
    id: "20",
    company: "StreamTech Media",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Stream&backgroundColor=FF9800",
    username: "streamtech_media",
    companyEmployees: "50-200 employees",
    companyRating: "4.7 rating",
    credibilityRating: 4.7,
    timestamp: "1w",
    content: "Video editors wanted! 🎬 Edit content for social media and streaming platforms.",
    jobTitle: "Video Editor",
    location: "Remote",
    salary: "$35-55/hr",
    salaryMin: 35,
    salaryMax: 55,
    type: "Contract",
    jobImage: "",
    likes: 276,
    comments: 39,
    reposts: 48,
    shares: 22,
    image: null,
    category: "Design",
    experienceLevel: "Mid Level",
    workSetting: "Remote",
    companySize: "Medium",
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) as unknown as string,
    attachedJobs: [] as string[],
  },
];

// Map category names from home page to JobFilter categories
const mapCategoryName = (category: string): string => {
  const mapping: Record<string, string> = {
    "Tech & IT": "Technology",
    "Delivery & Driving": "Transportation",
    "Creative & Design": "Design",
    "Food & Beverage": "Food & Beverage",
  };
  return mapping[category] || category;
};

export function JobFilter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [postContent, setPostContent] = useState("");
  
  // Initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCommentModalLoading, setIsCommentModalLoading] = useState(false);
  const [isNewPostModalLoading, setIsNewPostModalLoading] = useState(false);
  
  // Load user-posted jobs from localStorage
  const [userPostedJobs, setUserPostedJobs] = useState<typeof jobPosts>([]);
  
  const [likedPosts, setLikedPosts] = useState<Set<string>>(
    new Set(),
  );
  const [repostedPosts, setRepostedPosts] = useState<
    Set<string>
  >(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Feed tab state
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  
  // Following state - Load from localStorage with seed data
  const [followedCompanies, setFollowedCompanies] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("followedCompanies");
      if (saved) {
        return new Set(JSON.parse(saved));
      } else {
        // Seed data: Pre-follow some companies for demo purposes
        const seedCompanies = [
          "Design Studio",
          "TechCorp",
          "Marketing Agency",
          "Creative Web Agency"
        ];
        return new Set(seedCompanies);
      }
    } catch {
      // Fallback seed data if localStorage fails
      return new Set([
        "Design Studio",
        "TechCorp",
        "Marketing Agency",
        "Creative Web Agency"
      ]);
    }
  });
  
  // Filter states - Initialize from URL params
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(() => {
    const locationParam = searchParams.get("location");
    if (!locationParam) return null;
    
    // Map location codes from home page to actual location names
    const locationMap: Record<string, string> = {
      "new-york": "New York",
      "san-francisco": "San Francisco",
      "chicago": "Chicago",
      "boston": "Boston",
      "los-angeles": "Los Angeles",
      "seattle": "Seattle",
      "austin": "Austin",
      "remote": "Remote",
    };
    
    return locationMap[locationParam] || null;
  });
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedPostedDate, setSelectedPostedDate] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam ? mapCategoryName(categoryParam) : null;
  });
  const [selectedWorkSetting, setSelectedWorkSetting] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  
  const [selectedJob, setSelectedJob] = useState<
    (typeof jobPosts)[0] | null
  >(null);
  const [selectedPostForComment, setSelectedPostForComment] =
    useState<(typeof jobPosts)[0] | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showNewPostModal, setShowNewPostModal] =
    useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState("");
  const [selectedJobForPost, setSelectedJobForPost] = useState<
    string[]
  >([]);
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    content: string;
    topic: string;
    image: string | null;
  } | null>(null);
  
  // Comments storage - maps post ID to array of comments
  const [userComments, setUserComments] = useState<Record<string, Array<{
    author: string;
    text: string;
    timestamp: string;
    avatar: string;
    likes?: number;
    image?: string;
    replies?: Array<{
      author: string;
      text: string;
      timestamp: string;
      avatar: string;
      likes?: number;
      image?: string;
    }>;
  }>>>({});
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  
  // Mock comment replies state
  const [mockCommentReplies, setMockCommentReplies] = useState<{
    [commentId: string]: Array<{
      author: string;
      text: string;
      timestamp: string;
      avatar: string;
      image?: string;
    }>;
  }>({});
  
  // Like state - tracks which comments/replies the current user has liked
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  
  // Ref for auto-scrolling to new comments/replies
  const lastCommentRef = useRef<HTMLDivElement>(null);

  // Infinite scroll states
  const [displayedItemsCount, setDisplayedItemsCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load user-posted jobs and social posts from localStorage
  useEffect(() => {
    const loadUserContent = () => {
      // Load job postings
      const storedJobs = localStorage.getItem('userPostedJobs');
      const storedSocialPosts = localStorage.getItem('userSocialPosts');
      
      const allUserContent: typeof jobPosts = [];
      
      if (storedJobs) {
        try {
          const parsedJobs = JSON.parse(storedJobs);
          allUserContent.push(...parsedJobs);
        } catch (error) {
          console.error('Error parsing user jobs:', error);
        }
      }
      
      if (storedSocialPosts) {
        try {
          const parsedPosts = JSON.parse(storedSocialPosts);
          allUserContent.push(...parsedPosts);
        } catch (error) {
          console.error('Error parsing user social posts:', error);
        }
      }
      
      setUserPostedJobs(allUserContent);
    };
    
    loadUserContent();
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Block body scroll when modals are open
  useEffect(() => {
    if (selectedPostForComment || showNewPostModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPostForComment, showNewPostModal]);

  // Handle comment modal loading
  useEffect(() => {
    if (selectedPostForComment) {
      setIsCommentModalLoading(true);
      const timer = setTimeout(() => {
        setIsCommentModalLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [selectedPostForComment]);

  // Handle new post modal loading
  useEffect(() => {
    if (showNewPostModal) {
      setIsNewPostModalLoading(true);
      const timer = setTimeout(() => {
        setIsNewPostModalLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [showNewPostModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.post-menu-dropdown')) {
        setOpenMenuPostId(null);
      }
    };

    if (openMenuPostId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuPostId]);
  
  // Save followed companies to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("followedCompanies", JSON.stringify(Array.from(followedCompanies)));
    } catch (error) {
      console.error("Failed to save followed companies:", error);
    }
  }, [followedCompanies]);
  
  // Auto-open filters when category is selected from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setShowFilters(true);
      // Clear the URL parameter after applying
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("category");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, []);
  
  // Initialize search query and location filter from URL params on mount
  useEffect(() => {
    const queryParam = searchParams.get("q");
    const locationParam = searchParams.get("location");
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    
    if (locationParam) {
      const locationMap: Record<string, string> = {
        "new-york": "New York",
        "san-francisco": "San Francisco",
        "chicago": "Chicago",
        "boston": "Boston",
        "los-angeles": "Los Angeles",
        "seattle": "Seattle",
        "austin": "Austin",
        "remote": "Remote",
      };
      const mappedLocation = locationMap[locationParam];
      if (mappedLocation) {
        setSelectedLocation(mappedLocation);
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleRepost = (postId: string) => {
    setRepostedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };
  
  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    
    const now = new Date();
    const timeAgo = "Just now";
    
    const newComment = {
      author: user?.fullName || "Anonymous User",
      text: commentText,
      timestamp: timeAgo,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`,
    };
    
    setUserComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    
    // Scroll to new comment after a short delay to ensure DOM update
    setTimeout(() => {
      lastCommentRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  };
  
  const handleAddReply = (postId: string, commentIndex: string, replyText: string) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      author: user?.fullName || "Anonymous User",
      text: replyText,
      timestamp: "Just now",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`,
      ...(replyImage && { image: replyImage }),
    };
    
    // Handle mock comment replies
    if (commentIndex.startsWith('mock-')) {
      setMockCommentReplies((prev) => ({
        ...prev,
        [commentIndex]: [...(prev[commentIndex] || []), newReply],
      }));
    } else {
      // Handle regular user comment replies
      setUserComments((prev) => {
        const postComments = [...(prev[postId] || [])];
        const commentIdx = parseInt(commentIndex.replace('user-comment-', ''));
        
        if (postComments[commentIdx]) {
          postComments[commentIdx] = {
            ...postComments[commentIdx],
            replies: [...(postComments[commentIdx].replies || []), newReply],
          };
        }
        
        return {
          ...prev,
          [postId]: postComments,
        };
      });
    }
    
    setReplyingTo(null);
    setReplyText("");
    setReplyImage(null);
    
    // Scroll to new reply after a short delay to ensure DOM update
    setTimeout(() => {
      lastCommentRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  };
  
  const handleReplyImageSelect = () => {
    // Simulate image selection - in real app would use file input
    const sampleImages = [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    ];
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setReplyImage(randomImage);
  };
  
  const handleReplyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLikeToggle = (postId: string, commentIndex: string, replyIndex?: number) => {
    const likeKey = replyIndex !== undefined 
      ? `${postId}-${commentIndex}-reply-${replyIndex}`
      : `${postId}-${commentIndex}`;
    
    // Toggle like state
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(likeKey)) {
        newSet.delete(likeKey);
      } else {
        newSet.add(likeKey);
      }
      return newSet;
    });
    
    // Update like count
    setUserComments((prev) => {
      const postComments = [...(prev[postId] || [])];
      const commentIdx = parseInt(commentIndex.replace('user-comment-', ''));
      
      if (replyIndex !== undefined) {
        // Liking a reply
        if (postComments[commentIdx]?.replies?.[replyIndex]) {
          const reply = postComments[commentIdx].replies![replyIndex];
          const currentLikes = reply.likes || 0;
          const isLiked = likedComments.has(likeKey);
          
          postComments[commentIdx] = {
            ...postComments[commentIdx],
            replies: postComments[commentIdx].replies!.map((r, idx) => 
              idx === replyIndex 
                ? { ...r, likes: isLiked ? currentLikes - 1 : currentLikes + 1 }
                : r
            ),
          };
        }
      } else {
        // Liking a main comment
        if (postComments[commentIdx]) {
          const currentLikes = postComments[commentIdx].likes || 0;
          const isLiked = likedComments.has(likeKey);
          
          postComments[commentIdx] = {
            ...postComments[commentIdx],
            likes: isLiked ? currentLikes - 1 : currentLikes + 1,
          };
        }
      }
      
      return {
        ...prev,
        [postId]: postComments,
      };
    });
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    // TODO: Handle post submission
    alert("Post submitted: " + postContent);
    setPostContent("");
  };
  
  const handleFollowToggle = (companyName: string) => {
    setFollowedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(companyName)) {
        newSet.delete(companyName);
      } else {
        newSet.add(companyName);
      }
      return newSet;
    });
  };

  const handleDeletePost = (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    // Remove from localStorage
    const existingPosts = localStorage.getItem('userSocialPosts');
    if (existingPosts) {
      const posts = JSON.parse(existingPosts);
      const updatedPosts = posts.filter((p: any) => p.id !== postId);
      localStorage.setItem('userSocialPosts', JSON.stringify(updatedPosts));
    }

    // Also check userPostedJobs
    const existingJobs = localStorage.getItem('userPostedJobs');
    if (existingJobs) {
      const jobs = JSON.parse(existingJobs);
      const updatedJobs = jobs.filter((j: any) => j.id !== postId);
      localStorage.setItem('userPostedJobs', JSON.stringify(updatedJobs));
    }

    // Update state
    setUserPostedJobs((prev) => prev.filter((p) => p.id !== postId));
    setOpenMenuPostId(null);
  };

  const handleEditPost = (post: typeof jobPosts[0]) => {
    setEditingPost({
      id: post.id,
      content: post.content,
      topic: post.jobTitle || '',
      image: post.image || null,
    });
    setNewPostContent(post.content);
    setNewPostTopic(post.jobTitle || '');
    setNewPostImage(post.image || null);
    // Preserve attached jobs
    setSelectedJobForPost(post.attachedJobs || []);
    setShowNewPostModal(true);
    setOpenMenuPostId(null);
  };

  // Combine user-posted jobs with mock jobs
  const allJobPosts = [...userPostedJobs, ...jobPosts];

  // Filter jobs based on all selected filters
  const filteredJobs = allJobPosts.filter((post) => {
    // Tab filter - Following tab only shows jobs from followed companies
    if (activeTab === "following") {
      if (!followedCompanies.has(post.company)) return false;
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        post.jobTitle.toLowerCase().includes(query) ||
        post.company.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Job type filter
    if (selectedJobType && post.type !== selectedJobType) return false;

    // Location filter
    if (selectedLocation) {
      if (selectedLocation === "Remote") {
        if (post.location !== "Remote") return false;
      } else {
        if (!post.location.includes(selectedLocation)) return false;
      }
    }

    // Salary range filter
    if (selectedSalaryRange) {
      if (selectedSalaryRange === "$10-20/hr") {
        if (post.salaryMin < 10 || post.salaryMax > 20) return false;
      } else if (selectedSalaryRange === "$20-40/hr") {
        if (post.salaryMin < 20 || post.salaryMax > 40) return false;
      } else if (selectedSalaryRange === "$40-60/hr") {
        if (post.salaryMin < 40 || post.salaryMax > 60) return false;
      } else if (selectedSalaryRange === "$60+/hr") {
        if (post.salaryMin < 60) return false;
      }
    }

    // Posted date filter
    if (selectedPostedDate) {
      const postDate = new Date(post.postedDate);
      const now = new Date();
      const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
      
      if (selectedPostedDate === "24h") {
        if (hoursDiff > 24) return false;
      } else if (selectedPostedDate === "7d") {
        if (hoursDiff > 24 * 7) return false;
      } else if (selectedPostedDate === "30d") {
        if (hoursDiff > 24 * 30) return false;
      }
    }

    // Experience level filter
    if (selectedExperience && post.experienceLevel !== selectedExperience) return false;

    // Category filter
    if (selectedCategory && post.category !== selectedCategory) return false;

    // Work setting filter
    if (selectedWorkSetting && post.workSetting !== selectedWorkSetting) return false;

    // Company size filter
    if (selectedCompanySize && post.companySize !== selectedCompanySize) return false;

    return true;
  });

  // Count active filters
  const activeFiltersCount = [
    selectedJobType,
    selectedLocation,
    selectedSalaryRange,
    selectedPostedDate,
    selectedExperience,
    selectedCategory,
    selectedWorkSetting,
    selectedCompanySize,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedJobType(null);
    setSelectedLocation(null);
    setSelectedSalaryRange(null);
    setSelectedPostedDate(null);
    setSelectedExperience(null);
    setSelectedCategory(null);
    setSelectedWorkSetting(null);
    setSelectedCompanySize(null);
    setSearchQuery("");
  };

  // Get displayed jobs based on pagination
  const displayedJobs = filteredJobs.slice(0, displayedItemsCount);

  // Update hasMore when filters change
  useEffect(() => {
    setHasMore(displayedItemsCount < filteredJobs.length);
  }, [displayedItemsCount, filteredJobs.length]);

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItemsCount(5);
    setHasMore(filteredJobs.length > 5);
  }, [
    searchQuery,
    selectedJobType,
    selectedLocation,
    selectedSalaryRange,
    selectedPostedDate,
    selectedExperience,
    selectedCategory,
    selectedWorkSetting,
    selectedCompanySize,
    activeTab,
    filteredJobs.length
  ]);

  // Load more function
  const loadMoreJobs = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayedItemsCount(prev => {
        const newCount = prev + 5;
        return newCount > filteredJobs.length ? filteredJobs.length : newCount;
      });
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, filteredJobs.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreJobs();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreJobs]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#263238]/10 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                </button>
                <h1 className="text-xl font-semibold text-[#263238]">
                  Jobs Feed
                </h1>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-[#FAFAFA] rounded-xl p-1">
                <button 
                  onClick={() => setActiveTab("foryou")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === "foryou"
                      ? "bg-white text-[#263238] shadow-sm"
                      : "text-[#263238]/60 hover:text-[#263238]"
                  }`}
                >
                  For you
                </button>
                <button 
                  onClick={() => setActiveTab("following")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    activeTab === "following"
                      ? "bg-white text-[#263238] shadow-sm"
                      : "text-[#263238]/60 hover:text-[#263238]"
                  }`}
                >
                  Following
                  {followedCompanies.size > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === "following"
                        ? "bg-[#FF9800] text-white"
                        : "bg-[#263238]/10 text-[#263238]/60"
                    }`}>
                      {followedCompanies.size}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What's New Post Box */}
        <div className="bg-white border-b border-[#263238]/10">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                <AvatarFallback className="bg-[#FF9800] text-white">
                  U
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex-1 text-left px-4 py-3 text-[#263238]/50 bg-[#FAFAFA] rounded-full hover:bg-[#263238]/5 transition"
              >
                What's new?
              </button>
              <Button
                onClick={() => setShowNewPostModal(true)}
                className="bg-white hover:bg-[#FAFAFA] text-[#263238] border border-[#263238]/20 hover:border-[#263238]/40 rounded-lg px-6 h-10 text-sm font-medium shadow-sm"
              >
                Post
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border-b border-[#263238]/10">
          <div className="px-4 py-3">
            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search"
                  className="w-full h-10 pl-10 pr-4 bg-[#FAFAFA] border border-[#263238]/10 rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:border-[#FF9800] transition text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#263238]/5 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-[#263238]/50" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition ${
                  showFilters
                    ? "bg-[#FF9800] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#263238]/5"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedJobType(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === null
                    ? "bg-[#263238] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#263238]/5"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedJobType("Full-time")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === "Full-time"
                    ? "bg-[#263238] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#263238]/5"
                }`}
              >
                Full-time
              </button>
              <button
                onClick={() => setSelectedJobType("Part-time")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === "Part-time"
                    ? "bg-[#FF9800] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#FF9800]/10"
                }`}
              >
                Part-time
              </button>
              <button
                onClick={() => setSelectedJobType("Contract")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === "Contract"
                    ? "bg-[#4FC3F7] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#4FC3F7]/10"
                }`}
              >
                Contract
              </button>
              <button
                onClick={() => setSelectedJobType("Freelance")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === "Freelance"
                    ? "bg-[#4ADE80] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#4ADE80]/10"
                }`}
              >
                Freelance
              </button>
              <button
                onClick={() => setSelectedJobType("Seasonal")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedJobType === "Seasonal"
                    ? "bg-[#FF9800] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#FF9800]/10"
                }`}
              >
                Seasonal
              </button>
              <button
                onClick={() => setSelectedWorkSetting("Remote")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedWorkSetting === "Remote"
                    ? "bg-[#4FC3F7] text-white"
                    : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#4FC3F7]/5"
                }`}
              >
                🌐 Remote
              </button>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#263238]/50 font-medium">Active:</span>
                {selectedSalaryRange && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] rounded-full text-xs">
                    <DollarSign className="w-3 h-3" />
                    <span>{selectedSalaryRange}</span>
                    <button
                      onClick={() => setSelectedSalaryRange(null)}
                      className="ml-1 hover:bg-[#4ADE80]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedPostedDate && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-[#4FC3F7] rounded-full text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {selectedPostedDate === "24h" && "Last 24 hours"}
                      {selectedPostedDate === "7d" && "Last 7 days"}
                      {selectedPostedDate === "30d" && "Last 30 days"}
                    </span>
                    <button
                      onClick={() => setSelectedPostedDate(null)}
                      className="ml-1 hover:bg-[#4FC3F7]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedExperience && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#FF9800] rounded-full text-xs">
                    <TrendingUp className="w-3 h-3" />
                    <span>{selectedExperience}</span>
                    <button
                      onClick={() => setSelectedExperience(null)}
                      className="ml-1 hover:bg-[#FF9800]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#263238]/10 border border-[#263238]/30 text-[#263238] rounded-full text-xs">
                    <Briefcase className="w-3 h-3" />
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-1 hover:bg-[#263238]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedCompanySize && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] rounded-full text-xs">
                    <Building2 className="w-3 h-3" />
                    <span>{selectedCompanySize}</span>
                    <button
                      onClick={() => setSelectedCompanySize(null)}
                      className="ml-1 hover:bg-[#4ADE80]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Advanced Filters (when filter button clicked) */}
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-[#263238]/10 space-y-4">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#263238]/60" />
                    <span className="text-sm font-medium text-[#263238]">
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#FF9800] text-white text-xs rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </span>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-[#FF9800] hover:text-[#F57C00] font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Row 1: Location & Salary */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Location
                    </label>
                    <select
                      value={selectedLocation || ""}
                      onChange={(e) =>
                        setSelectedLocation(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Locations</option>
                      <option value="New York">New York</option>
                      <option value="San Francisco">
                        San Francisco
                      </option>
                      <option value="Chicago">Chicago</option>
                      <option value="Boston">Boston</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Austin">Austin</option>
                      <option value="Seattle">Seattle</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" />
                      Salary Range
                    </label>
                    <select
                      value={selectedSalaryRange || ""}
                      onChange={(e) =>
                        setSelectedSalaryRange(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Salaries</option>
                      <option value="$10-20/hr">$10-20/hr</option>
                      <option value="$20-40/hr">$20-40/hr</option>
                      <option value="$40-60/hr">$40-60/hr</option>
                      <option value="$60+/hr">$60+/hr</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Posted Date & Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      Posted
                    </label>
                    <select
                      value={selectedPostedDate || ""}
                      onChange={(e) =>
                        setSelectedPostedDate(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">Anytime</option>
                      <option value="24h">Last 24 hours</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      Experience
                    </label>
                    <select
                      value={selectedExperience || ""}
                      onChange={(e) =>
                        setSelectedExperience(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Levels</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Category & Work Setting */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" />
                      Category
                    </label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Categories</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Retail">Retail</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Construction">Construction</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <MapPinIcon className="w-3 h-3" />
                      Work Setting
                    </label>
                    <select
                      value={selectedWorkSetting || ""}
                      onChange={(e) =>
                        setSelectedWorkSetting(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Settings</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Company Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#263238]/60 mb-1.5 block flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Company Size
                    </label>
                    <select
                      value={selectedCompanySize || ""}
                      onChange={(e) =>
                        setSelectedCompanySize(
                          e.target.value || null,
                        )
                      }
                      className="w-full h-9 px-3 bg-[#FAFAFA] border border-[#263238]/10 rounded-lg text-sm text-[#263238] focus:outline-none focus:border-[#FF9800]"
                    >
                      <option value="">All Sizes</option>
                      <option value="Startup">Startup (1-50)</option>
                      <option value="Small">Small (51-200)</option>
                      <option value="Medium">Medium (201-1000)</option>
                      <option value="Large">Large (1000+)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || activeFiltersCount > 0) && (
          <div className="bg-white border-b border-[#263238]/10 px-4 py-2">
            <p className="text-sm text-[#263238]/60">
              {filteredJobs.length === 0 ? (
                <span>
                  No jobs found. Try adjusting your filters.
                </span>
              ) : (
                <span>
                  Showing <span className="font-medium text-[#263238]">{displayedItemsCount}</span> of <span className="font-medium text-[#263238]">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'}
                  {searchQuery && ` for "${searchQuery}"`}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Job Posts Feed */}
        <div className="divide-y divide-[#263238]/10">
          {isInitialLoading ? (
            <SkeletonFeedPostGrid count={5} />
          ) : filteredJobs.length === 0 && !searchQuery && activeFiltersCount === 0 && activeTab === "following" ? (
            <div className="bg-white py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-[#263238]/30" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#263238] mb-1">No followed companies yet</h3>
                  <p className="text-sm text-[#263238]/60 mb-3">Start following companies to see their job posts here</p>
                  <button
                    onClick={() => setActiveTab("foryou")}
                    className="px-4 py-2 bg-[#FF9800] text-white rounded-full text-sm font-medium hover:bg-[#F57C00] transition"
                  >
                    Browse All Jobs
                  </button>
                </div>
              </div>
            </div>
          ) : filteredJobs.length === 0 && !searchQuery && activeFiltersCount === 0 ? (
            <div className="bg-white py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-[#263238]/30" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#263238] mb-1">No jobs yet</h3>
                  <p className="text-sm text-[#263238]/60">Check back later for new opportunities</p>
                </div>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#263238]/30" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#263238] mb-1">No matching jobs</h3>
                  <p className="text-sm text-[#263238]/60 mb-3">
                    {activeTab === "following" 
                      ? "No jobs from followed companies match your filters"
                      : "Try adjusting your search or filters"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-[#FF9800] hover:text-[#F57C00] font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          
          {displayedJobs.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isReposted = repostedPosts.has(post.id);
            const likeCount = isLiked
              ? post.likes + 1
              : post.likes;
            const repostCount = isReposted
              ? post.reposts + 1
              : post.reposts;

            return (
              <div
                key={post.id}
                className="bg-white hover:bg-[#FAFAFA]/50 transition"
              >
                <div className="px-4 py-6">
                  {/* Post Header */}
                  <div className="flex gap-3">
                    <Link to="/profile/employer">
                      <Avatar className="w-10 h-10 flex-shrink-0 cursor-pointer">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-[#FF9800] text-white">
                          {post.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Company Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link to="/profile/employer">
                              <span className="font-semibold text-[#263238] hover:underline cursor-pointer">
                                {post.company}
                              </span>
                            </Link>
                            {/* Credibility Rating */}
                            {post.credibilityRating && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-lg">
                                <Star className="w-3 h-3 text-[#FF9800] fill-[#FF9800]" />
                                <span className="text-xs font-semibold text-[#FF9800]">{post.credibilityRating.toFixed(1)}</span>
                              </div>
                            )}
                            <span className="text-[#263238]/50 text-sm">
                              ·
                            </span>
                            <span className="text-[#263238]/50 text-sm">
                              {post.timestamp}
                            </span>
                          </div>
                          <div className="text-[#263238]/60 text-sm">
                            @{post.username}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFollowToggle(post.company)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                              followedCompanies.has(post.company)
                                ? "bg-[#263238] text-white hover:bg-[#263238]/90"
                                : "bg-[#FF9800] text-white hover:bg-[#F57C00]"
                            }`}
                          >
                            {followedCompanies.has(post.company) ? (
                              <>
                                <UserCheck className="w-4 h-4" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4" />
                                Follow
                              </>
                            )}
                          </button>
                          <div className="relative post-menu-dropdown">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuPostId(openMenuPostId === post.id ? null : post.id);
                              }}
                              className="p-1.5 hover:bg-[#263238]/5 rounded-full transition"
                            >
                              <MoreHorizontal className="w-5 h-5 text-[#263238]/50" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openMenuPostId === post.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#263238]/10 py-1 min-w-[160px] z-50">
                                {/* Check if this is the user's post */}
                                {post.username === (user?.email?.split('@')[0] || 'user') && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPost(post);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-[#263238] hover:bg-[#4FC3F7]/10 flex items-center gap-2 transition"
                                    >
                                      <Edit className="w-4 h-4 text-[#4FC3F7]" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(post.id);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </>
                                )}
                                
                                {/* Show default options for other users' posts */}
                                {post.username !== (user?.email?.split('@')[0] || 'user') && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert('Report functionality coming soon!');
                                        setOpenMenuPostId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-[#263238] hover:bg-[#FAFAFA] flex items-center gap-2 transition"
                                    >
                                      Report
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert('Hide functionality coming soon!');
                                        setOpenMenuPostId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-[#263238] hover:bg-[#FAFAFA] flex items-center gap-2 transition"
                                    >
                                      Hide
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <p className="text-[#263238] text-[15px] leading-relaxed mb-4">
                          {post.content}
                        </p>

                        {/* Post Image (if exists) - Moved above job card */}
                        {post.image && (
                          <div className="rounded-xl overflow-hidden border border-[#263238]/10 mb-4">
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full object-cover"
                              style={{ maxHeight: "400px" }}
                            />
                          </div>
                        )}

                        {/* Job Info Card - Only show if there's job information */}
                        {post.jobTitle && post.location && post.salary && (
                          <>
                            {/* Separator Line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#263238]/20 to-transparent mb-4" />

                            <Card className="border-2 border-[#263238]/10 overflow-hidden bg-white hover:border-[#FF9800]/30 transition">
                          {/* Job Details */}
                          <div className="p-4 space-y-2">
                            <h3 className="font-semibold text-[#263238] mb-2">
                              {post.jobTitle}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#263238]/70">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                                <span>{post.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                                <span>{post.salary}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#FF9800]" />
                                <span>{post.type}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Badge className="bg-[#FF9800]/20 text-[#FF9800] border-0 hover:bg-[#FF9800]/30">
                                {post.type}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/job/${post.id}`);
                                }}
                                className="text-xs text-[#4FC3F7] hover:underline font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        </Card>
                          </>
                        )}
                      </div>

                      {/* Interaction Buttons */}
                      <div className="flex items-center justify-between text-[#263238]/60 pt-1">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-full transition group ${
                            isLiked ? "text-red-500" : ""
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 group-hover:text-red-500 transition ${
                              isLiked ? "fill-red-500" : ""
                            }`}
                          />
                          <span
                            className={`text-sm ${isLiked ? "text-red-500 font-medium" : "group-hover:text-red-500"}`}
                          >
                            {likeCount}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            setSelectedPostForComment(post)
                          }
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#4FC3F7]/10 rounded-full transition group"
                        >
                          <MessageCircle className="w-5 h-5 group-hover:text-[#4FC3F7] transition" />
                          <span className="text-sm group-hover:text-[#4FC3F7]">
                            {post.comments}
                          </span>
                        </button>

                        <button
                          onClick={() => handleRepost(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-[#4ADE80]/10 rounded-full transition group ${
                            isReposted ? "text-[#4ADE80]" : ""
                          }`}
                        >
                          <Repeat2
                            className={`w-5 h-5 group-hover:text-[#4ADE80] transition`}
                          />
                          <span
                            className={`text-sm ${isReposted ? "text-[#4ADE80] font-medium" : "group-hover:text-[#4ADE80]"}`}
                          >
                            {repostCount}
                          </span>
                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#FF9800]/10 rounded-full transition group">
                          <Send className="w-5 h-5 group-hover:text-[#FF9800] transition" />
                          <span className="text-sm group-hover:text-[#FF9800]">
                            {post.shares}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {filteredJobs.length > 0 && (
          <div ref={loadMoreRef} className="bg-white border-t border-[#263238]/10 py-8 text-center">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2 text-[#FF9800]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading more jobs...</span>
              </div>
            ) : hasMore ? (
              <div className="flex items-center justify-center gap-2 text-[#263238]/40">
                <span className="text-sm">Scroll down to load more</span>
              </div>
            ) : (
              <div className="text-sm text-[#263238]/40">
                You've reached the end! 🎉
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {selectedPostForComment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPostForComment(null)}
        >
          {isCommentModalLoading ? (
            <div onClick={(e) => e.stopPropagation()}>
              <SkeletonCommentModal />
            </div>
          ) : (
            <div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#263238]/10">
              <h2 className="font-semibold text-[#263238]">
                {selectedPostForComment.company}'s Post
              </h2>
              <button
                onClick={() => setSelectedPostForComment(null)}
                className="p-2 hover:bg-[#263238]/5 rounded-full transition"
              >
                <X className="w-5 h-5 text-[#263238]/70" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Post Content */}
              <div className="p-4 border-b border-[#263238]/10">
                <div className="flex gap-3">
                  <Link to="/profile/employer" onClick={() => setSelectedPostForComment(null)}>
                    <Avatar className="w-10 h-10 flex-shrink-0 cursor-pointer">
                      <AvatarImage
                        src={selectedPostForComment.avatar}
                      />
                      <AvatarFallback className="bg-[#FF9800] text-white">
                        {selectedPostForComment.company.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        to="/profile/employer" 
                        onClick={() => setSelectedPostForComment(null)}
                        className="font-semibold text-[#263238] hover:underline cursor-pointer"
                      >
                        {selectedPostForComment.company}
                      </Link>
                      {/* Credibility Rating */}
                      {selectedPostForComment.credibilityRating && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-lg">
                          <Star className="w-3 h-3 text-[#FF9800] fill-[#FF9800]" />
                          <span className="text-xs font-semibold text-[#FF9800]">{selectedPostForComment.credibilityRating.toFixed(1)}</span>
                        </div>
                      )}
                      <span className="text-[#263238]/50 text-sm">
                        ·
                      </span>
                      <span className="text-[#263238]/50 text-sm">
                        {selectedPostForComment.timestamp}
                      </span>
                    </div>
                    <div className="text-[#263238]/60 text-sm mb-3">
                      @{selectedPostForComment.username}
                    </div>

                    <p className="text-[#263238] text-[15px] leading-relaxed">
                      {selectedPostForComment.content}
                    </p>
                  </div>
                </div>

                {/* Job Image */}
                {selectedPostForComment.jobImage && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#263238]/10">
                    <img
                      src={selectedPostForComment.jobImage}
                      alt={selectedPostForComment.jobTitle}
                      className="w-full object-cover"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>

              {/* Job Card Section - Always Display */}
              <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#263238]/10">
                <div
                  className="bg-white border border-[#263238]/10 rounded-xl p-4 hover:border-[#FF9800]/30 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/job/${selectedPostForComment.id}`);
                  }}
                >
                  <h4 className="font-semibold text-[#263238] text-base mb-3">
                    {selectedPostForComment.jobTitle || selectedPostForComment.company}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#263238]/70 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                      {selectedPostForComment.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                      {selectedPostForComment.salary || '$40-60/hour'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#FF9800]" />
                      {selectedPostForComment.type || 'Part-time'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#FF9800]/20 text-[#FF9800] border-0 text-xs px-2 py-1">
                      {selectedPostForComment.type || 'Part-time'}
                    </Badge>
                    <span className="text-sm text-[#4FC3F7] hover:text-[#0288D1] font-medium transition">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>

              {/* Attached Job Card Section */}
              {selectedPostForComment.attachedJobs && selectedPostForComment.attachedJobs.length > 0 && (
                <div className="px-4 py-3 bg-white border-b border-[#263238]/10">
                  {selectedPostForComment.attachedJobs.map((jobId: string) => {
                    const job = allJobPosts.find((j) => j.id === jobId);
                    if (!job) return null;
                    
                    return (
                      <div
                        key={job.id}
                        className="bg-white border border-[#263238]/10 rounded-xl p-4 hover:border-[#FF9800]/30 transition cursor-pointer"
                        onClick={() => {
                          setSelectedJob(job);
                          setSelectedPostForComment(null);
                        }}
                      >
                        <h4 className="font-semibold text-[#263238] text-base mb-3">
                          {job.jobTitle || job.company}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#263238]/70 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#FF9800]" />
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-[#FF9800]/20 text-[#FF9800] border-0 text-xs px-2 py-1">
                            {job.type}
                          </Badge>
                          <span className="text-sm text-[#4FC3F7] hover:text-[#0288D1] font-medium transition">
                            View Details →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comments Section */}
              <div className="p-4">
                <div className="text-sm text-[#263238]/60 mb-4">
                  {selectedPostForComment.comments + (userComments[selectedPostForComment.id]?.length || 0)} comments
                </div>

                {/* All Comments */}
                <div className="space-y-4">
                  {/* User-added Comments (most recent first) */}
                  {userComments[selectedPostForComment.id]?.map((comment, index) => (
                    <div 
                      key={`user-comment-${index}`}
                      ref={index === userComments[selectedPostForComment.id].length - 1 ? lastCommentRef : null}
                    >
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback className="bg-[#FF9800] text-white">
                            {comment.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-[#FAFAFA] rounded-2xl px-4 py-2">
                            <div className="font-medium text-[#263238] text-sm">
                              {comment.author}
                            </div>
                            <p className="text-[#263238]/80 text-sm">
                              {comment.text}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 px-4">
                            <button 
                              onClick={() => selectedPostForComment && handleLikeToggle(selectedPostForComment.id, `user-comment-${index}`)}
                              className={`flex items-center gap-1 text-xs transition ${
                                likedComments.has(`${selectedPostForComment?.id}-user-comment-${index}`)
                                  ? 'text-[#FF9800] font-semibold'
                                  : 'text-[#263238]/50 hover:text-[#FF9800]'
                              }`}
                            >
                              <Heart 
                                className={`w-3 h-3 ${
                                  likedComments.has(`${selectedPostForComment?.id}-user-comment-${index}`)
                                    ? 'fill-[#FF9800]'
                                    : ''
                                }`}
                              />
                              {comment.likes ? comment.likes : 'Like'}
                            </button>
                            <button 
                              onClick={() => setReplyingTo(`user-comment-${index}`)}
                              className="text-xs text-[#263238]/50 hover:text-[#4FC3F7] transition"
                            >
                              Reply
                            </button>
                            <span className="text-xs text-[#263238]/40">
                              {comment.timestamp}
                            </span>
                          </div>
                          
                          {/* Reply Input */}
                          {replyingTo === `user-comment-${index}` && (
                            <div className="mt-3 pl-4">
                              <div className="flex gap-2">
                                <Avatar className="w-6 h-6 flex-shrink-0">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                                  <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                                    {user?.fullName?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                      <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="w-full px-3 py-1.5 pr-10 bg-white border border-[#263238]/20 rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/30 transition text-sm"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" && replyText.trim() && selectedPostForComment) {
                                            handleAddReply(selectedPostForComment.id, `user-comment-${index}`, replyText);
                                          } else if (e.key === "Escape") {
                                            setReplyingTo(null);
                                            setReplyText("");
                                            setReplyImage(null);
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={handleReplyImageSelect}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#4FC3F7] hover:text-[#0288D1] transition"
                                        title="Add image"
                                      >
                                        <ImageIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <button
                                      onClick={() => {
                                        if (replyText.trim() && selectedPostForComment) {
                                          handleAddReply(selectedPostForComment.id, `user-comment-${index}`, replyText);
                                        }
                                      }}
                                      disabled={!replyText.trim()}
                                      className="px-4 py-1.5 bg-[#4FC3F7] hover:bg-[#0288D1] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-xs font-medium"
                                    >
                                      Reply
                                    </button>
                                    <button
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                        setReplyImage(null);
                                      }}
                                      className="px-3 py-1.5 text-[#263238]/50 hover:text-[#263238] rounded-full transition text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                  
                                  {/* Image Preview */}
                                  {replyImage && (
                                    <div className="mt-2 relative inline-block">
                                      <img 
                                        src={replyImage} 
                                        alt="Reply attachment" 
                                        className="w-32 h-24 object-cover rounded-lg border border-[#263238]/10"
                                      />
                                      <button
                                        onClick={() => setReplyImage(null)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center transition"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 pl-8 space-y-3">
                              {comment.replies.map((reply, replyIndex) => (
                                <div 
                                  key={`reply-${index}-${replyIndex}`} 
                                  className="flex gap-2"
                                  ref={replyIndex === comment.replies!.length - 1 ? lastCommentRef : null}
                                >
                                  <Avatar className="w-6 h-6 flex-shrink-0">
                                    <AvatarImage src={reply.avatar} />
                                    <AvatarFallback className="bg-[#4FC3F7] text-white text-xs">
                                      {reply.author.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-white border border-[#263238]/10 rounded-xl px-3 py-2">
                                      <div className="font-medium text-[#263238] text-xs">
                                        {reply.author}
                                      </div>
                                      <p className="text-[#263238]/80 text-xs">
                                        {reply.text}
                                      </p>
                                      {reply.image && (
                                        <img 
                                          src={reply.image} 
                                          alt="Reply attachment" 
                                          className="mt-2 w-40 h-28 object-cover rounded-lg"
                                        />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 px-3">
                                      <button 
                                        onClick={() => selectedPostForComment && handleLikeToggle(selectedPostForComment.id, `user-comment-${index}`, replyIndex)}
                                        className={`flex items-center gap-1 text-xs transition ${
                                          likedComments.has(`${selectedPostForComment?.id}-user-comment-${index}-reply-${replyIndex}`)
                                            ? 'text-[#FF9800] font-semibold'
                                            : 'text-[#263238]/50 hover:text-[#FF9800]'
                                        }`}
                                      >
                                        <Heart 
                                          className={`w-3 h-3 ${
                                            likedComments.has(`${selectedPostForComment?.id}-user-comment-${index}-reply-${replyIndex}`)
                                              ? 'fill-[#FF9800]'
                                              : ''
                                          }`}
                                        />
                                        {reply.likes ? reply.likes : 'Like'}
                                      </button>
                                      <button 
                                        onClick={() => setReplyingTo(`user-comment-${index}-reply-${replyIndex}`)}
                                        className="text-xs text-[#263238]/50 hover:text-[#4FC3F7] transition"
                                      >
                                        Reply
                                      </button>
                                      <span className="text-xs text-[#263238]/40">
                                        {reply.timestamp}
                                      </span>
                                    </div>
                                    
                                    {/* Reply to Reply Input */}
                                    {replyingTo === `user-comment-${index}-reply-${replyIndex}` && (
                                      <div className="mt-2">
                                        <div className="flex gap-2">
                                          <Avatar className="w-6 h-6 flex-shrink-0">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                                            <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                                              {user?.fullName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex gap-2">
                                              <div className="flex-1 relative">
                                                <input
                                                  type="text"
                                                  value={replyText}
                                                  onChange={(e) => setReplyText(e.target.value)}
                                                  placeholder="Write a reply..."
                                                  className="w-full px-3 py-1.5 pr-10 bg-white border border-[#263238]/20 rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/30 transition text-xs"
                                                  autoFocus
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter" && replyText.trim() && selectedPostForComment) {
                                                      handleAddReply(selectedPostForComment.id, `user-comment-${index}`, replyText);
                                                    } else if (e.key === "Escape") {
                                                      setReplyingTo(null);
                                                      setReplyText("");
                                                      setReplyImage(null);
                                                    }
                                                  }}
                                                />
                                                <button
                                                  onClick={handleReplyImageSelect}
                                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#4FC3F7] hover:text-[#0288D1] transition"
                                                  title="Add image"
                                                >
                                                  <ImageIcon className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  if (replyText.trim() && selectedPostForComment) {
                                                    handleAddReply(selectedPostForComment.id, `user-comment-${index}`, replyText);
                                                  }
                                                }}
                                                disabled={!replyText.trim()}
                                                className="px-3 py-1.5 bg-[#4FC3F7] hover:bg-[#0288D1] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-xs font-medium"
                                              >
                                                Reply
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setReplyingTo(null);
                                                  setReplyText("");
                                                  setReplyImage(null);
                                                }}
                                                className="px-2 py-1.5 text-[#263238]/50 hover:text-[#263238] rounded-full transition text-xs"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                            
                                            {/* Image Preview */}
                                            {replyImage && (
                                              <div className="mt-2 relative inline-block">
                                                <img 
                                                  src={replyImage} 
                                                  alt="Reply attachment" 
                                                  className="w-32 h-24 object-cover rounded-lg border border-[#263238]/10"
                                                />
                                                <button
                                                  onClick={() => setReplyImage(null)}
                                                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center transition"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mock Comments */}
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1" />
                      <AvatarFallback className="bg-[#4FC3F7] text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-[#FAFAFA] rounded-2xl px-4 py-2">
                        <div className="font-medium text-[#263238] text-sm">
                          Sarah Johnson
                        </div>
                        <p className="text-[#263238]/80 text-sm">
                          This looks like a great opportunity!
                          Is this position still available?
                        </p>
                        <img 
                          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop" 
                          alt="Comment attachment" 
                          className="mt-2 w-48 h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-4">
                        <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                          <Heart className="w-3 h-3" />
                          Like
                        </button>
                        <button 
                          onClick={() => setReplyingTo("mock-comment-1")}
                          className="text-xs text-[#263238]/50 hover:text-[#4FC3F7] transition"
                        >
                          Reply
                        </button>
                        <span className="text-xs text-[#263238]/40">
                          1h
                        </span>
                      </div>
                      
                      {/* Reply Input for Mock Comment 1 */}
                      {replyingTo === "mock-comment-1" && (
                        <div className="mt-3 pl-8">
                          <div className="flex gap-2">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                              <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                                {user?.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-white border border-[#4FC3F7]/30 rounded-xl px-3 py-2">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter" && replyText.trim()) {
                                      handleAddReply(selectedPostForComment.id, "mock-comment-1", replyText);
                                    }
                                  }}
                                  className="w-full text-xs bg-transparent outline-none text-[#263238] placeholder:text-[#263238]/40"
                                  autoFocus
                                />
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex gap-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleReplyImageUpload}
                                      className="hidden"
                                      id="mock-reply-image-1"
                                    />
                                    <label
                                      htmlFor="mock-reply-image-1"
                                      className="p-1.5 hover:bg-[#4FC3F7]/10 rounded-full transition cursor-pointer"
                                    >
                                      <ImageIcon className="w-4 h-4 text-[#4FC3F7]" />
                                    </label>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        if (replyText.trim()) {
                                          handleAddReply(selectedPostForComment.id, "mock-comment-1", replyText);
                                        }
                                      }}
                                      disabled={!replyText.trim()}
                                      className="px-3 py-1.5 bg-[#FF9800] hover:bg-[#F57C00] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-xs font-medium"
                                    >
                                      Post
                                    </button>
                                    <button
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                        setReplyImage(null);
                                      }}
                                      className="px-2 py-1.5 text-[#263238]/50 hover:text-[#263238] rounded-full transition text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Image Preview */}
                                {replyImage && (
                                  <div className="mt-2 relative inline-block">
                                    <img 
                                      src={replyImage} 
                                      alt="Reply attachment" 
                                      className="w-32 h-24 object-cover rounded-lg border border-[#263238]/10"
                                    />
                                    <button
                                      onClick={() => setReplyImage(null)}
                                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center transition"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Mock Reply with Image */}
                      <div className="mt-3 pl-8">
                        <div className="flex gap-2">
                          <Avatar className="w-6 h-6 flex-shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=CompanyRep" />
                            <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                              C
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white border border-[#263238]/10 rounded-xl px-3 py-2">
                              <div className="font-medium text-[#263238] text-xs">
                                Company Representative
                              </div>
                              <p className="text-[#263238]/80 text-xs">
                                Yes! We're actively hiring. Here's what our team looks like!
                              </p>
                              <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" 
                                alt="Reply attachment" 
                                className="mt-2 w-40 h-28 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex items-center gap-3 mt-1 px-3">
                              <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                                <Heart className="w-3 h-3" />
                                Like
                              </button>
                              <button 
                                onClick={() => setReplyingTo("mock-reply-1")}
                                className="text-xs text-[#263238]/50 hover:text-[#4FC3F7] transition"
                              >
                                Reply
                              </button>
                              <span className="text-xs text-[#263238]/40">
                                45m
                              </span>
                            </div>
                            
                            {/* Reply to Reply Input */}
                            {replyingTo === "mock-reply-1" && (
                              <div className="mt-3">
                                <div className="flex gap-2">
                                  <Avatar className="w-6 h-6 flex-shrink-0">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                                    <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                                      {user?.fullName?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-white border border-[#4FC3F7]/30 rounded-xl px-3 py-2">
                                      <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter" && replyText.trim()) {
                                            handleAddReply(selectedPostForComment.id, "mock-comment-1", replyText);
                                          }
                                        }}
                                        className="w-full text-xs bg-transparent outline-none text-[#263238] placeholder:text-[#263238]/40"
                                        autoFocus
                                      />
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex gap-1">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleReplyImageUpload}
                                            className="hidden"
                                            id="mock-reply-to-reply-image"
                                          />
                                          <label
                                            htmlFor="mock-reply-to-reply-image"
                                            className="p-1.5 hover:bg-[#4FC3F7]/10 rounded-full transition cursor-pointer"
                                          >
                                            <ImageIcon className="w-4 h-4 text-[#4FC3F7]" />
                                          </label>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              if (replyText.trim()) {
                                                handleAddReply(selectedPostForComment.id, "mock-comment-1", replyText);
                                              }
                                            }}
                                            disabled={!replyText.trim()}
                                            className="px-3 py-1.5 bg-[#FF9800] hover:bg-[#F57C00] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-xs font-medium"
                                          >
                                            Post
                                          </button>
                                          <button
                                            onClick={() => {
                                              setReplyingTo(null);
                                              setReplyText("");
                                              setReplyImage(null);
                                            }}
                                            className="px-2 py-1.5 text-[#263238]/50 hover:text-[#263238] rounded-full transition text-xs"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                      
                                      {/* Image Preview */}
                                      {replyImage && (
                                        <div className="mt-2 relative inline-block">
                                          <img 
                                            src={replyImage} 
                                            alt="Reply attachment" 
                                            className="w-32 h-24 object-cover rounded-lg border border-[#263238]/10"
                                          />
                                          <button
                                            onClick={() => setReplyImage(null)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center transition"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* User Replies to Mock Reply */}
                            {mockCommentReplies["mock-reply-1"] && mockCommentReplies["mock-reply-1"].length > 0 && (
                              <div className="mt-3 space-y-3">
                                {mockCommentReplies["mock-reply-1"].map((reply, replyIndex) => (
                                  <div 
                                    key={`mock-reply-1-user-reply-${replyIndex}`}
                                    className="flex gap-2"
                                    ref={replyIndex === mockCommentReplies["mock-reply-1"].length - 1 ? lastCommentRef : null}
                                  >
                                    <Avatar className="w-6 h-6 flex-shrink-0">
                                      <AvatarImage src={reply.avatar} />
                                      <AvatarFallback className="bg-[#4FC3F7] text-white text-xs">
                                        {reply.author.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="bg-white border border-[#263238]/10 rounded-xl px-3 py-2">
                                        <div className="font-medium text-[#263238] text-xs">
                                          {reply.author}
                                        </div>
                                        <p className="text-[#263238]/80 text-xs mt-0.5">
                                          {reply.text}
                                        </p>
                                        {reply.image && (
                                          <img 
                                            src={reply.image} 
                                            alt="Reply attachment" 
                                            className="mt-2 w-40 h-28 object-cover rounded-lg"
                                          />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 mt-1 px-3">
                                        <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                                          <Heart className="w-3 h-3" />
                                          Like
                                        </button>
                                        <span className="text-xs text-[#263238]/40">
                                          {reply.timestamp}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* User Replies to Mock Comment 1 */}
                      {mockCommentReplies["mock-comment-1"] && mockCommentReplies["mock-comment-1"].length > 0 && (
                        <div className="mt-3 pl-8 space-y-3">
                          {mockCommentReplies["mock-comment-1"].map((reply, replyIndex) => (
                            <div 
                              key={`mock-comment-1-user-reply-${replyIndex}`}
                              className="flex gap-2"
                              ref={replyIndex === mockCommentReplies["mock-comment-1"].length - 1 ? lastCommentRef : null}
                            >
                              <Avatar className="w-6 h-6 flex-shrink-0">
                                <AvatarImage src={reply.avatar} />
                                <AvatarFallback className="bg-[#4FC3F7] text-white text-xs">
                                  {reply.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-white border border-[#263238]/10 rounded-xl px-3 py-2">
                                  <div className="font-medium text-[#263238] text-xs">
                                    {reply.author}
                                  </div>
                                  <p className="text-[#263238]/80 text-xs mt-0.5">
                                    {reply.text}
                                  </p>
                                  {reply.image && (
                                    <img 
                                      src={reply.image} 
                                      alt="Reply attachment" 
                                      className="mt-2 w-40 h-28 object-cover rounded-lg"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 px-3">
                                  <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                                    <Heart className="w-3 h-3" />
                                    Like
                                  </button>
                                  <span className="text-xs text-[#263238]/40">
                                    {reply.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2" />
                      <AvatarFallback className="bg-[#4ADE80] text-white">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-[#FAFAFA] rounded-2xl px-4 py-2">
                        <div className="font-medium text-[#263238] text-sm">
                          Mike Chen
                        </div>
                        <p className="text-[#263238]/80 text-sm">
                          I'd love to apply! What are the
                          working hours?
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-4">
                        <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                          <Heart className="w-3 h-3" />
                          Like
                        </button>
                        <button 
                          onClick={() => setReplyingTo("mock-comment-2")}
                          className="text-xs text-[#263238]/50 hover:text-[#4FC3F7] transition"
                        >
                          Reply
                        </button>
                        <span className="text-xs text-[#263238]/40">
                          3h
                        </span>
                      </div>
                      
                      {/* Reply Input for Mock Comment 2 */}
                      {replyingTo === "mock-comment-2" && (
                        <div className="mt-3 pl-8">
                          <div className="flex gap-2">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                              <AvatarFallback className="bg-[#FF9800] text-white text-xs">
                                {user?.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-white border border-[#4FC3F7]/30 rounded-xl px-3 py-2">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter" && replyText.trim()) {
                                      handleAddReply(selectedPostForComment.id, "mock-comment-2", replyText);
                                    }
                                  }}
                                  className="w-full text-xs bg-transparent outline-none text-[#263238] placeholder:text-[#263238]/40"
                                  autoFocus
                                />
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex gap-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleReplyImageUpload}
                                      className="hidden"
                                      id="mock-reply-image-2"
                                    />
                                    <label
                                      htmlFor="mock-reply-image-2"
                                      className="p-1.5 hover:bg-[#4FC3F7]/10 rounded-full transition cursor-pointer"
                                    >
                                      <ImageIcon className="w-4 h-4 text-[#4FC3F7]" />
                                    </label>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        if (replyText.trim()) {
                                          handleAddReply(selectedPostForComment.id, "mock-comment-2", replyText);
                                        }
                                      }}
                                      disabled={!replyText.trim()}
                                      className="px-3 py-1.5 bg-[#FF9800] hover:bg-[#F57C00] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-xs font-medium"
                                    >
                                      Post
                                    </button>
                                    <button
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                        setReplyImage(null);
                                      }}
                                      className="px-2 py-1.5 text-[#263238]/50 hover:text-[#263238] rounded-full transition text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Image Preview */}
                                {replyImage && (
                                  <div className="mt-2 relative inline-block">
                                    <img 
                                      src={replyImage} 
                                      alt="Reply attachment" 
                                      className="w-32 h-24 object-cover rounded-lg border border-[#263238]/10"
                                    />
                                    <button
                                      onClick={() => setReplyImage(null)}
                                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full flex items-center justify-center transition"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* User Replies to Mock Comment 2 */}
                      {mockCommentReplies["mock-comment-2"] && mockCommentReplies["mock-comment-2"].length > 0 && (
                        <div className="mt-3 pl-8 space-y-3">
                          {mockCommentReplies["mock-comment-2"].map((reply, replyIndex) => (
                            <div 
                              key={`mock-comment-2-user-reply-${replyIndex}`}
                              className="flex gap-2"
                              ref={replyIndex === mockCommentReplies["mock-comment-2"].length - 1 ? lastCommentRef : null}
                            >
                              <Avatar className="w-6 h-6 flex-shrink-0">
                                <AvatarImage src={reply.avatar} />
                                <AvatarFallback className="bg-[#4FC3F7] text-white text-xs">
                                  {reply.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-white border border-[#263238]/10 rounded-xl px-3 py-2">
                                  <div className="font-medium text-[#263238] text-xs">
                                    {reply.author}
                                  </div>
                                  <p className="text-[#263238]/80 text-xs mt-0.5">
                                    {reply.text}
                                  </p>
                                  {reply.image && (
                                    <img 
                                      src={reply.image} 
                                      alt="Reply attachment" 
                                      className="mt-2 w-40 h-28 object-cover rounded-lg"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 px-3">
                                  <button className="flex items-center gap-1 text-xs text-[#263238]/50 hover:text-[#FF9800] transition">
                                    <Heart className="w-3 h-3" />
                                    Like
                                  </button>
                                  <span className="text-xs text-[#263238]/40">
                                    {reply.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Input - Fixed at Bottom */}
            <div className="border-t border-[#263238]/10 p-4 bg-white">
              <div className="flex gap-3 items-start">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                  <AvatarFallback className="bg-[#FF9800] text-white">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) =>
                      setCommentText(e.target.value)
                    }
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 bg-[#FAFAFA] rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:ring-2 focus:ring-[#FF9800]/30 transition text-sm"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        commentText.trim() &&
                        selectedPostForComment
                      ) {
                        handleAddComment(selectedPostForComment.id, commentText);
                        setCommentText("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (commentText.trim() && selectedPostForComment) {
                        handleAddComment(selectedPostForComment.id, commentText);
                        setCommentText("");
                      }
                    }}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 bg-[#FF9800] hover:bg-[#F57C00] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-sm font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Icon Actions */}
              <div className="flex items-center gap-2 mt-3 ml-[52px]">
                <button className="p-1.5 hover:bg-[#4FC3F7]/10 rounded-lg transition">
                  <ImageIcon className="w-5 h-5 text-[#4FC3F7]" />
                </button>
                <button className="p-1.5 hover:bg-[#FF9800]/10 rounded-lg transition">
                  <Smile className="w-5 h-5 text-[#FF9800]" />
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 p-3 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full shadow-md shadow-[#FF9800]/30 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewPostModal(false)}
        >
          {isNewPostModalLoading ? (
            <div onClick={(e) => e.stopPropagation()}>
              <SkeletonNewPostModal />
            </div>
          ) : (
            <div
              className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#263238]/10">
              <button
                onClick={() => {
                  setShowNewPostModal(false);
                  setEditingPost(null);
                  setNewPostContent("");
                  setNewPostTopic("");
                  setNewPostImage(null);
                }}
                className="text-[#263238] hover:text-[#263238]/70 transition font-medium"
              >
                Cancel
              </button>
              <h2 className="font-semibold text-[#263238]">
                {editingPost ? 'Edit post' : 'New thread'}
              </h2>
              <div className="w-16"></div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                  <AvatarFallback className="bg-[#FF9800] text-white">
                    U
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-medium text-[#263238] mb-2">
                    Your Username
                  </div>

                  {/* Topic Input */}
                  <input
                    type="text"
                    value={newPostTopic}
                    onChange={(e) =>
                      setNewPostTopic(e.target.value)
                    }
                    placeholder="Add a topic (optional)"
                    className="w-full text-[#263238] placeholder:text-[#263238]/40 outline-none text-sm mb-3"
                  />

                  {/* Content Textarea */}
                  <textarea
                    value={newPostContent}
                    onChange={(e) =>
                      setNewPostContent(e.target.value)
                    }
                    placeholder="What's new?"
                    className="w-full text-[#263238] placeholder:text-[#263238]/50 resize-none outline-none text-base mb-3"
                    rows={4}
                  />

                  {/* Toolbar Icons */}
                  <div className="flex items-center gap-1 mb-4">
                    <input
                      type="file"
                      id="new-post-image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewPostImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="new-post-image"
                      className="p-2 hover:bg-[#4FC3F7]/10 rounded-lg transition group cursor-pointer"
                      title="Add image"
                    >
                      <ImageIcon className="w-5 h-5 text-[#263238]/50 group-hover:text-[#4FC3F7]" />
                    </label>
                    <button
                      className="p-2 hover:bg-[#FF9800]/10 rounded-lg transition group"
                      title="Attach job posting"
                      onClick={() => {
                        const jobSection =
                          document.getElementById(
                            "job-selector-section",
                          );
                        if (jobSection) {
                          jobSection.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                        }
                      }}
                    >
                      <Briefcase className="w-5 h-5 text-[#263238]/50 group-hover:text-[#FF9800]" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  {newPostImage && (
                    <div className="mb-4 relative group">
                      <img
                        src={newPostImage}
                        alt="Post attachment"
                        className="w-full h-64 object-cover rounded-xl border-2 border-[#263238]/10"
                      />
                      <button
                        onClick={() => setNewPostImage(null)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white h-8 w-8 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Job Selector - Optional Section */}
                  <div
                    id="job-selector-section"
                    className="mb-3"
                  >
                    <label className="block text-sm text-[#263238]/60 mb-2">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Attach job posting (optional)
                        {selectedJobForPost.length > 0 && (
                          <span className="text-[#FF9800] font-medium">
                            {selectedJobForPost.length} selected
                          </span>
                        )}
                      </span>
                    </label>
                    <div className="bg-[#FAFAFA] border border-[#263238]/10 rounded-xl p-3 max-h-64 overflow-y-auto">
                      {jobPosts.map((job) => (
                        <label
                          key={job.id}
                          className="flex items-start gap-3 p-2 hover:bg-white rounded-lg transition cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedJobForPost.includes(
                              job.id,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedJobForPost([
                                  ...selectedJobForPost,
                                  job.id,
                                ]);
                              } else {
                                setSelectedJobForPost(
                                  selectedJobForPost.filter(
                                    (id) => id !== job.id,
                                  ),
                                );
                              }
                            }}
                            className="mt-1 w-4 h-4 accent-[#FF9800] cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-3 h-3 text-[#FF9800]" />
                              <span className="text-sm font-medium text-[#263238] group-hover:text-[#FF9800] transition">
                                {job.jobTitle}
                              </span>
                            </div>
                            <div className="text-xs text-[#263238]/60 mt-0.5">
                              {job.company} • {job.location} •{" "}
                              {job.salary}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Selected Jobs Preview */}
                  {selectedJobForPost.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <div className="text-xs text-[#263238]/60 mb-2">
                        Selected Jobs:
                      </div>
                      {selectedJobForPost.map((jobId) => {
                        const selectedJob = jobPosts.find(
                          (j) => j.id === jobId,
                        );
                        if (!selectedJob) return null;

                        return (
                          <div
                            key={jobId}
                            className="p-3 bg-gradient-to-r from-[#FF9800]/10 to-[#4FC3F7]/10 rounded-xl border border-[#FF9800]/20 relative group"
                          >
                            <button
                              onClick={() =>
                                setSelectedJobForPost(
                                  selectedJobForPost.filter(
                                    (id) => id !== jobId,
                                  ),
                                )
                              }
                              className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 rounded-full shadow-sm transition opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3 text-[#263238]/70 hover:text-red-500" />
                            </button>
                            <div className="flex items-center gap-2 mb-2">
                              <Briefcase className="w-4 h-4 text-[#FF9800]" />
                              <span className="text-sm font-medium text-[#263238]">
                                {selectedJob.jobTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#263238]/60">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {selectedJob.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {selectedJob.salary}
                              </span>
                              <Badge className="bg-[#FF9800]/20 text-[#FF9800] border-0 text-[10px] px-1.5 py-0">
                                {selectedJob.type}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#263238]/10 px-4 py-3 flex items-center justify-between bg-white">
              <div className="text-xs text-[#263238]/50">
                {selectedJobForPost.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {selectedJobForPost.length} job
                    {selectedJobForPost.length > 1 ? "s" : ""}{" "}
                    attached
                  </span>
                )}
              </div>
              <Button
                onClick={() => {
                  if (newPostContent.trim()) {
                    if (editingPost) {
                      // Update existing post
                      const existingPost = userPostedJobs.find(p => p.id === editingPost.id);
                      if (!existingPost) return;
                      
                      const updatedPost = {
                        ...existingPost,
                        content: newPostContent,
                        jobTitle: newPostTopic || '',
                        image: newPostImage,
                        attachedJobs: selectedJobForPost,
                      };

                      // Update in localStorage
                      const existingPosts = localStorage.getItem('userSocialPosts');
                      if (existingPosts) {
                        const posts = JSON.parse(existingPosts);
                        const updatedPosts = posts.map((p: any) => 
                          p.id === editingPost.id ? updatedPost : p
                        );
                        localStorage.setItem('userSocialPosts', JSON.stringify(updatedPosts));
                      }

                      // Update state
                      setUserPostedJobs((prev) => 
                        prev.map((p) => p.id === editingPost.id ? updatedPost : p)
                      );

                      setEditingPost(null);
                    } else {
                      // Create new post object
                      const newPost = {
                        id: `user-post-${Date.now()}`,
                        company: user?.email?.split('@')[0] || 'User',
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'User'}&backgroundColor=FF9800`,
                        username: user?.email?.split('@')[0] || 'user',
                        companyEmployees: '10-50 employees',
                        companyRating: '4.5 rating',
                        credibilityRating: 4.5,
                        timestamp: 'Just now',
                        content: newPostContent,
                        jobTitle: newPostTopic || '',
                        location: '',
                        salary: '',
                        salaryMin: 0,
                        salaryMax: 0,
                        type: '',
                        jobImage: newPostImage || '',
                        likes: 0,
                        comments: 0,
                        reposts: 0,
                        shares: 0,
                        image: newPostImage,
                        category: '',
                        experienceLevel: '',
                        workSetting: '',
                        companySize: 'Small',
                        postedDate: new Date().toISOString(),
                        attachedJobs: selectedJobForPost,
                      };
                      
                      // Save to localStorage
                      const existingPosts = localStorage.getItem('userSocialPosts');
                      const posts = existingPosts ? JSON.parse(existingPosts) : [];
                      posts.unshift(newPost);
                      localStorage.setItem('userSocialPosts', JSON.stringify(posts));
                      
                      // Update state to show immediately
                      setUserPostedJobs((prev) => [newPost, ...prev]);
                    }
                    
                    // Reset form
                    setNewPostContent("");
                    setNewPostTopic("");
                    setSelectedJobForPost([]);
                    setNewPostImage(null);
                    setShowNewPostModal(false);
                  }
                }}
                disabled={!newPostContent.trim()}
                className="bg-[#263238] hover:bg-[#263238]/90 text-white rounded-full px-6 h-9 text-sm font-medium disabled:bg-[#263238]/20 disabled:text-[#263238]/40 transition-colors"
              >
                {editingPost ? 'Update' : 'Post'}
              </Button>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}