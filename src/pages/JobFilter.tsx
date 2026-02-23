import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUp,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Filter,
  Heart,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  ArrowRight,
  Send,
  SlidersHorizontal,
  Star,
  Trash2,
  UserCheck,
  UserPlus,
  X
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
import { useAuth } from "../contexts/AuthContext";
import { SkeletonFeedPostGrid } from "../components/SkeletonFeedPost";
import { SkeletonCommentModal } from "../components/SkeletonCommentModal";
import { SkeletonNewPostModal } from "../components/SkeletonNewPostModal";

import { JobPostDTO } from "../types/DTOs/ModelDTOs/JobsDTOs/JobPostDTO";
import { RecruitmentSelectDTO } from "../types/DTOs/ModelDTOs/JobPostDTOs/RecruitmentSelectDTO";
import type { ApiResponse } from "../types/ApiResponse";
import { formatRelativeTime } from "../utils/dateUtils";
import { toast } from "sonner";

// Mock job posts data - removed
const jobPosts: any[] = [];

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

export default function JobFilter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeColors: Record<string, string> = {
    "Part-time": "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
    "Part Time": "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
    Freelance: "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    Seasonal: "bg-[#4ADE80]/10 text-[#2E7D32] border border-[#4ADE80]/20",
    "Full-time": "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    "Full Time": "bg-[#FF9800]/10 text-[#F57C00] border border-[#FF9800]/20",
    Contract: "bg-[#4FC3F7]/10 text-[#03A9F4] border border-[#4FC3F7]/20",
  };

  const typeIcons: Record<string, string> = {
    "Part-time": "⏰",
    "Part Time": "⏰",
    Freelance: "💼",
    Seasonal: "🌟",
    "Full-time": "🏢",
    "Full Time": "🏢",
    Contract: "📑",
  };

  // Initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCommentModalLoading, setIsCommentModalLoading] = useState(false);
  const [isNewPostModalLoading, setIsNewPostModalLoading] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(false);

  // Load user-posted jobs from recruitment attachment
  const [availableJobs, setAvailableJobs] = useState<RecruitmentSelectDTO[]>([]);
  const [userPostedJobs, setUserPostedJobs] = useState<typeof jobPosts>([]);

  const [repostedPosts, setRepostedPosts] = useState<
    Set<string>
  >(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Feed tab state
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [followingCount, setFollowingCount] = useState<number>(0);

  // Following state - Load from backend (Set of User IDs)
  const [followedUserIds, setFollowedUserIds] = useState<Set<number>>(new Set());

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam ? mapCategoryName(categoryParam) : null;
  });
  const [selectedPostForComment, setSelectedPostForComment] =
    useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showNewPostModal, setShowNewPostModal] =
    useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedJobForPost, setSelectedJobForPost] = useState<
    string[]
  >([]);
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    content: string;
    image: string | null;
  } | null>(null);

  // Comments storage - maps post ID to tree of comments from API
  const [userComments, setUserComments] = useState<Record<string, any[]>>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Ref for auto-scrolling to new comments/replies
  const lastCommentRef = useRef<HTMLDivElement>(null);

  // Infinite scroll states
  const [apiPosts, setApiPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  const fetchPosts = useCallback(async (pageNum: number, query: string = "", filters: any = {}) => {
    try {
      if (pageNum === 1) setIsInitialLoading(true);
      else setIsLoadingMore(true);

      const params = new URLSearchParams();
      params.set("pageIndex", pageNum.toString());
      params.set("pageSize", pageSize.toString());
      if (query) params.set("searchQuery", query);

      // Add filters to params
      if (filters.jobType && filters.jobType !== 'all') params.set("jobType", filters.jobType);
      if (filters.location && filters.location !== 'all-cities') params.set("location", filters.location);
      if (filters.salaryRange && filters.salaryRange !== 'all') params.set("salaryRange", filters.salaryRange);
      if (filters.postedDate && filters.postedDate !== 'anytime') params.set("postedDate", filters.postedDate);
      if (filters.category && filters.category !== 'all') params.set("category", filters.category);

      const isSearching = query || Object.values(filters).some(v => v && v !== 'all' && v !== 'all-cities' && v !== 'anytime');

      const endpoint = isSearching
        ? `${import.meta.env.VITE_API_URL}/api/JobPost/search?${params.toString()}`
        : `${import.meta.env.VITE_API_URL}/api/JobPost/all-post?pageIndex=${pageNum}&pageSize=${pageSize}`;

      const response = await fetch(endpoint);
      const data: ApiResponse<JobPostDTO[]> = await response.json();

      if (data.success && data.data) {
        const mappedPosts = data.data.map(p => {
          const firstJob = p.jobs && p.jobs.length > 0 ? p.jobs[0] : null;
          return {
            id: p.postId.toString(),
            userId: p.userId,
            company: p.fullName,
            avatar: p.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.fullName}&backgroundColor=FF9800`,
            username: p.fullName.toLowerCase().replace(/\s/g, "_"),
            companyEmployees: "50-200 employees",
            companyRating: p.rating ? `${p.rating} rating` : null,
            credibilityRating: p.rating,
            timestamp: p.createdAt ? formatRelativeTime(p.createdAt) : "Just now",
            content: p.content,
            jobTitle: firstJob?.jobName || p.header || "No Title",
            location: firstJob?.location || "Remote",
            salary: firstJob?.salary || "Competitive",
            type: firstJob?.jobType || "Full-time",
            likes: p.likeCount,
            isLiked: p.isLiked,
            comments: p.commentCount,
            reposts: 0,
            shares: 0,
            image: p.postImage || null,
            category: firstJob?.category || "Other",
            postedDate: new Date(p.createdAt || Date.now()).toISOString(),
            attachedJobs: p.jobs || []
          };
        });

        if (pageNum === 1) {
          setApiPosts(mappedPosts);
        } else {
          setApiPosts(prev => [...prev, ...mappedPosts]);
        }

        // If we got fewer than pageSize, there are no more posts
        setHasMore(data.data.length === pageSize);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, [pageSize]);

  const fetchFollowingCount = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/following-count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data: ApiResponse<number> = await response.json();
      if (data.success && typeof data.data === 'number') {
        setFollowingCount(data.data);
      }
    } catch (error) {
      console.error("Error fetching following count:", error);
    }
  }, []);

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/all-post-following`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data: ApiResponse<any[]> = await response.json();
      if (data.success && data.data) {
        // Extract unique user IDs from followings posts
        const userIds = new Set(data.data.map(p => p.userId));
        setFollowedUserIds(userIds);
      }
    } catch (error) {
      console.error("Error fetching followed users:", error);
    }
  }, []);

  const fetchUserJobs = useCallback(async () => {
    try {
      setIsJobsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/loading-create-post`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data: ApiResponse<{ jobs: RecruitmentSelectDTO[] }> = await response.json();
      if (data.success && data.data) {
        setAvailableJobs(data.data.jobs);
      } else {
        toast.error(data.message || "Failed to load your jobs");
      }
    } catch (error) {
      console.error("Error fetching user jobs:", error);
      toast.error("An error occurred while loading your jobs");
    } finally {
      setIsJobsLoading(false);
    }
  }, []);

  const handleOpenNewPostModal = () => {
    setShowNewPostModal(true);
    fetchUserJobs();
  };

  // Handle search refetching with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPosts(1, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, fetchPosts]);

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
    fetchFollowingCount();
    fetchFollowedUsers();
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [fetchFollowingCount, fetchFollowedUsers]);

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

  // Handle comment modal loading and fetching
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPostForComment) return;

      setIsCommentModalLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/all-comments-post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ PostId: parseInt(selectedPostForComment.id) })
        });
        const json = await response.json();

        if (json.success && json.data?.comments) {
          // Map API comments to internal UI structure if needed, or use as is
          // The current UI seems to use a flat array if we just look at comments count
          // but the modal likely uses userComments state
          const apiComments = json.data.comments.map((c: any) => ({
            id: c.id,
            author: c.userName,
            text: c.content,
            timestamp: formatRelativeTime(c.createdAt),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${c.userName}&backgroundColor=FF9800`,
            replies: c.replies?.map((r: any) => ({
              author: r.userName,
              text: r.content,
              timestamp: formatRelativeTime(r.createdAt),
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${r.userName}&backgroundColor=4FC3F7`,
            })) || []
          }));

          setUserComments(prev => ({
            ...prev,
            [selectedPostForComment.id]: apiComments
          }));
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsCommentModalLoading(false);
      }
    };

    fetchComments();
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

  // Close dropdown when clicking outside

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
    const categoryParam = searchParams.get("category");

    if (queryParam) {
      setSearchQuery(queryParam);
    }

    if (locationParam) {
      const locationMap: Record<string, string> = {
        "new-york": "New York, NY",
        "san-francisco": "San Francisco, CA",
        "chicago": "Chicago, IL",
        "boston": "Boston, MA",
        "los-angeles": "Los Angeles, CA",
        "seattle": "Seattle, WA",
        "austin": "Austin, TX",
        "remote": "Remote",
      };
      const mappedLocation = locationMap[locationParam] || locationParam.replace(/-/g, ' ');
      setSelectedLocation(mappedLocation);
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Handle Search and Filters Trigger
  useEffect(() => {
    const filters = {
      jobType: selectedJobType,
      location: selectedLocation,
      salaryRange: selectedSalaryRange,
      postedDate: selectedPostedDate,
      category: selectedCategory,
    };

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPosts(1, searchQuery, filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedJobType,
    selectedLocation,
    selectedSalaryRange,
    selectedPostedDate,
    selectedCategory,
    fetchPosts
  ]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ PostId: parseInt(postId) })
      });
      const data: ApiResponse<number> = await response.json();

      if (data.success) {
        // Update both apiPosts and userPostedJobs if needed
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p.id === postId
              ? { ...p, isLiked: !p.isLiked, likes: data.data }
              : p
          );

        setApiPosts(prev => updatePosts(prev));
        setUserPostedJobs(prev => updatePosts(prev));

        if (data.message === "Liked") {
          toast.success("Liked post");
        } else {
          toast.success("Unliked post");
        }
      } else {
        toast.error(data.message || "Failed to update like status");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("An error occurred");
    }
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

  const fetchComments = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/all-comments-post?PostId=${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data: ApiResponse<any> = await response.json();
      if (data.success) {
        setUserComments(prev => ({ ...prev, [postId]: data.data.comments || [] }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  const handleAddComment = async (postId: string, text: string, parentCommentId?: number) => {
    if (!text.trim()) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          PostId: Number(postId),
          Content: text,
          ParentCommentId: parentCommentId ?? null
        })
      });
      const data: ApiResponse<any> = await response.json();
      if (data.success) {
        await fetchComments(postId);
        toast.success("Comment added");
        setTimeout(() => {
          lastCommentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred");
    }
  };

  const handleFollowToggle = async (targetUserId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/toggle-follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ FollowingId: targetUserId })
      });
      const data: ApiResponse<any> = await response.json();

      if (data.success) {
        setFollowedUserIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(targetUserId)) {
            newSet.delete(targetUserId);
            toast.success("Unfollowed user");
          } else {
            newSet.add(targetUserId);
            toast.success("Followed user");
          }
          return newSet;
        });
        // Update the count immediately
        fetchFollowingCount();
      } else {
        toast.error(data.message || "Failed to update follow status");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("An error occurred");
    }
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
      image: post.image || null,
    });
    setNewPostContent(post.content);
    setNewPostImage(post.image || null);
    // Preserve attached jobs
    setSelectedJobForPost(post.attachedJobs || []);
    setShowNewPostModal(true);
    setOpenMenuPostId(null);
  };

  // Combine user-posted jobs and API posts
  const allJobPosts = [...apiPosts, ...userPostedJobs];

  // Filter jobs based on all selected filters
  const filteredJobs = allJobPosts.filter((post) => {
    // Tab filter - Following tab only shows jobs from followed companies
    if (activeTab === "following") {
      if (!followedUserIds.has(post.userId)) return false;
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

    // Category filter
    if (selectedCategory && post.category !== selectedCategory) return false;

    return true;
  });

  // Count active filters
  const activeFiltersCount = [
    selectedJobType,
    selectedLocation,
    selectedSalaryRange,
    selectedPostedDate,
    selectedCategory,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedJobType(null);
    setSelectedLocation(null);
    setSelectedSalaryRange(null);
    setSelectedPostedDate(null);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Reset API posts when filters change (Optional, currently sticking to simple append)
  // However, we should at least ensure hasMore is initially true or handled by fetch

  // Load more function
  const loadMoreJobs = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPosts(nextPage, searchQuery);
  }, [isLoadingMore, hasMore, currentPage, fetchPosts, searchQuery]);

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
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === "foryou"
                    ? "bg-white text-[#263238] shadow-sm"
                    : "text-[#263238]/60 hover:text-[#263238]"
                    }`}
                >
                  For you
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${activeTab === "following"
                    ? "bg-white text-[#263238] shadow-sm"
                    : "text-[#263238]/60 hover:text-[#263238]"
                    }`}
                >
                  Following
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] min-w-[1.25rem] h-5 flex items-center justify-center font-semibold ${activeTab === "following"
                    ? "bg-[#FF9800] text-white"
                    : "bg-[#263238]/10 text-[#263238]/60"
                    }`}>
                    {followingCount}
                  </span>
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
                <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`} />
                <AvatarFallback className="bg-[#FF9800] text-white">
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleOpenNewPostModal}
                className="flex-1 text-left px-4 py-3 text-[#263238]/50 bg-[#FAFAFA] rounded-full hover:bg-[#263238]/5 transition"
              >
                What's new?
              </button>
              <Button
                onClick={handleOpenNewPostModal}
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
                className={`p-2 rounded-full transition ${showFilters
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedJobType === null
                  ? "bg-[#263238] text-white"
                  : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#263238]/5"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedJobType("Full-time")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedJobType === "Full-time"
                  ? "bg-[#263238] text-white"
                  : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#263238]/5"
                  }`}
              >
                Full-time
              </button>
              <button
                onClick={() => setSelectedJobType("Part-time")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedJobType === "Part-time"
                  ? "bg-[#FF9800] text-white"
                  : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#FF9800]/10"
                  }`}
              >
                Part-time
              </button>
              <button
                onClick={() => setSelectedJobType("Freelance")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedJobType === "Freelance"
                  ? "bg-[#4ADE80] text-white"
                  : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#4ADE80]/10"
                  }`}
              >
                Freelance
              </button>
              <button
                onClick={() => setSelectedJobType("Seasonal")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedJobType === "Seasonal"
                  ? "bg-[#FF9800] text-white"
                  : "bg-[#FAFAFA] text-[#263238]/70 hover:bg-[#FF9800]/10"
                  }`}
              >
                Seasonal
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
                  Showing <span className="font-medium text-[#263238]">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'}
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

          {filteredJobs.map((post) => {
            const isReposted = repostedPosts.has(post.id);
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
                    <Link to={`/profile/user?userId=${post.userId}`}>
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
                            <Link to={`/profile/user?userId=${post.userId}`}>
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
                          {post.userId !== Number(user?.id) && (
                            <button
                              onClick={() => handleFollowToggle(post.userId)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${followedUserIds.has(post.userId)
                                ? "bg-[#263238] text-white hover:bg-[#263238]/90"
                                : "bg-[#FF9800] text-white hover:bg-[#F57C00]"
                                }`}
                            >
                              {followedUserIds.has(post.userId) ? (
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
                          )}
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

                        {/* Job Info Cards - Show all attached jobs */}
                        {post.attachedJobs && post.attachedJobs.length > 0 && (
                          <div className="space-y-4">
                            {/* Separator Line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#263238]/20 to-transparent mb-4" />

                            {post.attachedJobs.map((job: any) => (
                              <Card key={job.id} className="border-2 border-[#263238]/10 overflow-hidden bg-white hover:border-[#FF9800]/30 transition group/job">
                                {/* Job Details */}
                                <div className="p-4 space-y-2">
                                  <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-semibold text-[#263238] group-hover/job:text-[#FF9800] transition-colors leading-tight">
                                      {job.jobName}
                                    </h3>
                                    <Badge className={`${typeColors[job.jobType as keyof typeof typeColors] || "bg-[#263238]/10 text-[#263238]"} rounded-xl px-2 py-0.5 flex items-center gap-1 text-[10px] whitespace-nowrap`}>
                                      {typeIcons[job.jobType as keyof typeof typeIcons] || "💼"}
                                      {job.jobType}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#263238]/70">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                                      <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                                      <span>{job.salary}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end mt-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/job/${job.id}`);
                                      }}
                                      className="text-xs text-[#4FC3F7] hover:underline font-medium flex items-center gap-1"
                                    >
                                      View Details <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Legacy Job Info Card Support (for posts that might not have attachedJobs yet) */}
                        {!post.attachedJobs?.length && post.jobTitle && post.location && post.salary && (
                          <>
                            <div className="h-px bg-gradient-to-r from-transparent via-[#263238]/20 to-transparent mb-4" />
                            <Card className="border-2 border-[#263238]/10 overflow-hidden bg-white hover:border-[#FF9800]/30 transition">
                              <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-[#263238] mb-2">
                                  {post.jobTitle}
                                </h3>
                                {/* ... existing card pins ... */}
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
                                  <Badge className={`${typeColors[post.type as keyof typeof typeColors] || "bg-[#263238]/10 text-[#263238]"} rounded-xl px-3 py-1 flex items-center gap-1`}>
                                    <span className="mr-1">
                                      {typeIcons[post.type as keyof typeof typeIcons] || "💼"}
                                    </span>
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
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-full transition group ${post.isLiked ? "text-red-500" : ""
                            }`}
                        >
                          <Heart
                            className={`w-5 h-5 group-hover:text-red-500 transition ${post.isLiked ? "fill-red-500" : ""
                              }`}
                          />
                          <span
                            className={`text-sm ${post.isLiked ? "text-red-500 font-medium" : "group-hover:text-red-500"}`}
                          >
                            {post.likes}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPostForComment(post);
                            fetchComments(post.id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#4FC3F7]/10 rounded-full transition group"
                        >
                          <MessageCircle className="w-5 h-5 group-hover:text-[#4FC3F7] transition" />
                          <span className="text-sm group-hover:text-[#4FC3F7]">
                            {post.comments}
                          </span>
                        </button>

                        <button
                          onClick={() => handleRepost(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-[#4ADE80]/10 rounded-full transition group ${isReposted ? "text-[#4ADE80]" : ""
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


      {
        selectedPostForComment && (
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
                      <Link to="/profile/user" onClick={() => setSelectedPostForComment(null)}>
                        <Avatar className="w-10 h-10 flex-shrink-0 cursor-pointer">
                          <AvatarImage src={selectedPostForComment.avatar} />
                          <AvatarFallback className="bg-[#FF9800] text-white">
                            {selectedPostForComment.company.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to="/profile/user"
                            onClick={() => setSelectedPostForComment(null)}
                            className="font-semibold text-[#263238] hover:underline cursor-pointer"
                          >
                            {selectedPostForComment.company}
                          </Link>
                          {selectedPostForComment.credibilityRating && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-lg">
                              <Star className="w-3 h-3 text-[#FF9800] fill-[#FF9800]" />
                              <span className="text-xs font-semibold text-[#FF9800]">
                                {selectedPostForComment.credibilityRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <span className="text-[#263238]/50 text-sm">·</span>
                          <span className="text-[#263238]/50 text-sm">{selectedPostForComment.timestamp}</span>
                        </div>
                        <div className="text-[#263238]/60 text-sm mb-3">@{selectedPostForComment.username}</div>
                        <p className="text-[#263238] text-[15px] leading-relaxed">{selectedPostForComment.content}</p>
                      </div>
                    </div>

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

                  {/* Job Card Section */}
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
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#263238]/60 mb-4">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-[#FF9800]" />
                          {selectedPostForComment.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#4FC3F7]" />
                          {selectedPostForComment.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                          {selectedPostForComment.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#FF9800]" />
                          {selectedPostForComment.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${typeColors[selectedPostForComment.type as keyof typeof typeColors] || 'bg-[#FF9800]/20 text-[#FF9800]'} border-0 text-xs px-2 py-1`}>
                          <span className="mr-1">{typeIcons[selectedPostForComment.type as keyof typeof typeIcons] || '💼'}</span>
                          {selectedPostForComment.type}
                        </Badge>
                        <span className="text-sm text-[#4FC3F7] hover:text-[#0288D1] font-medium transition">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="p-4">
                    <div className="text-sm text-[#263238]/60 mb-4">
                      {(() => {
                        const countComments = (comments: any[]): number =>
                          comments.reduce((acc: number, c: any) => acc + 1 + countComments(c.replies || []), 0);
                        return countComments(userComments[selectedPostForComment.id] || []);
                      })()} comments
                    </div>

                    <div className="space-y-3">
                      {(userComments[selectedPostForComment.id] || []).map((comment: any) => {
                        const renderComment = (node: any, depth: number = 0) => (
                          <div key={`comment-${node.id}`} className="space-y-2" ref={lastCommentRef}>
                            <div className={`flex gap-3 ${depth > 0 ? 'ml-' + Math.min(depth * 8, 24) : ''}`} style={depth > 0 ? { marginLeft: `${Math.min(depth * 2, 6)}rem` } : {}}>
                              <Avatar className={`${depth === 0 ? 'w-8 h-8' : 'w-7 h-7'} flex-shrink-0`}>
                                <AvatarFallback className={`${depth === 0 ? 'bg-[#4FC3F7]' : 'bg-[#FF9800]'} text-white text-xs`}>
                                  {node.userName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="bg-[#FAFAFA] border border-[#263238]/10 rounded-2xl px-4 py-2.5">
                                  <div className="font-semibold text-[#263238] text-sm">{node.userName}</div>
                                  <p className="text-[#263238]/90 text-sm leading-relaxed mt-0.5">{node.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 px-3 text-xs text-[#263238]/50">
                                  <button
                                    onClick={() => setReplyingTo(replyingTo === node.id ? null : node.id)}
                                    className="hover:text-[#4FC3F7] transition font-medium"
                                  >
                                    Reply
                                  </button>
                                  <span className="text-[#263238]/30">
                                    {node.createdAt ? formatRelativeTime(node.createdAt) : ''}
                                  </span>
                                </div>

                                {/* Inline Reply Input */}
                                {replyingTo === node.id && (
                                  <div className="flex gap-2 mt-2 items-center">
                                    <input
                                      type="text"
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder={`Reply to ${node.userName}...`}
                                      className="flex-1 px-3 py-1.5 bg-white border border-[#263238]/15 rounded-full text-[#263238] placeholder:text-[#263238]/40 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/30 transition text-sm"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && replyText.trim() && selectedPostForComment) {
                                          handleAddComment(selectedPostForComment.id, replyText, node.id);
                                          setReplyText('');
                                          setReplyingTo(null);
                                        }
                                        if (e.key === 'Escape') {
                                          setReplyingTo(null);
                                          setReplyText('');
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        if (replyText.trim() && selectedPostForComment) {
                                          handleAddComment(selectedPostForComment.id, replyText, node.id);
                                          setReplyText('');
                                          setReplyingTo(null);
                                        }
                                      }}
                                      disabled={!replyText.trim()}
                                      className="p-1.5 text-[#4FC3F7] hover:bg-[#4FC3F7]/10 disabled:text-[#263238]/20 rounded-full transition"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                      className="p-1.5 text-[#263238]/40 hover:bg-[#263238]/5 rounded-full transition"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Render nested replies recursively */}
                            {node.replies && node.replies.length > 0 && (
                              <div className="space-y-2">
                                {node.replies.map((reply: any) => renderComment(reply, depth + 1))}
                              </div>
                            )}
                          </div>
                        );
                        return renderComment(comment, 0);
                      })}
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="border-t border-[#263238]/10 p-4 bg-white">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-9 h-9 flex-shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || "User"}`} />
                      <AvatarFallback className="bg-[#FF9800] text-white">
                        {user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 bg-[#FAFAFA] rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:ring-2 focus:ring-[#FF9800]/30 transition text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && commentText.trim() && selectedPostForComment) {
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
                        className="px-5 py-2 bg-[#FF9800] hover:bg-[#F57C00] disabled:bg-[#263238]/10 disabled:text-[#263238]/30 text-white rounded-full transition text-sm font-medium"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }

      {/* Scroll to Top Button */}
      {
        showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 p-3 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-full shadow-md shadow-[#FF9800]/30 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )
      }

      {/* New Post Modal */}
      {
        showNewPostModal && (
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
                      setNewPostContent("");
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
                      <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`} />
                      <AvatarFallback className="bg-[#FF9800] text-white">
                        {user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium text-[#263238] mb-2">
                        {user?.fullName || "Your Username"}
                      </div>


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
                          {isJobsLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 text-[#FF9800] animate-spin" />
                            </div>
                          ) : availableJobs.length > 0 ? (
                            availableJobs.map((job) => (
                              <label
                                key={job.id}
                                className="flex items-start gap-3 p-2 hover:bg-white rounded-lg transition cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedJobForPost.includes(
                                    job.id.toString(),
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedJobForPost([
                                        ...selectedJobForPost,
                                        job.id.toString(),
                                      ]);
                                    } else {
                                      setSelectedJobForPost(
                                        selectedJobForPost.filter(
                                          (id) => id !== job.id.toString(),
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
                                      {job.jobName}
                                    </span>
                                  </div>
                                  <div className="text-xs text-[#263238]/60 mt-0.5">
                                    {job.location} •{" "}
                                    {job.salary}
                                  </div>
                                </div>
                              </label>
                            ))
                          ) : (
                            <div className="text-center py-8 text-[#263238]/40 text-sm">
                              No jobs found to attach
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Jobs Preview */}
                      {selectedJobForPost.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <div className="text-xs text-[#263238]/60 mb-2">
                            Selected Jobs:
                          </div>
                          {selectedJobForPost.map((jobId) => {
                            const selectedJob = availableJobs.find(
                              (j) => j.id.toString() === jobId,
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
                                    {selectedJob.jobName}
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
                                    {selectedJob.jobType}
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
                    onClick={async () => {
                      if (newPostContent.trim()) {
                        setIsSubmitting(true);
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/create-post`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                            },
                            body: JSON.stringify({
                              content: newPostContent,
                              postImageUrl: newPostImage,
                              recruitmentIds: selectedJobForPost.map(id => parseInt(id))
                            })
                          });

                          const data: ApiResponse<any> = await response.json();

                          if (data.success) {
                            toast.success("Post created successfully!");
                            // Reset form and close modal
                            setNewPostContent("");
                            setNewPostContent("");
                            setSelectedJobForPost([]);
                            setNewPostImage(null);
                            setShowNewPostModal(false);
                            // Refresh posts
                            fetchPosts(1, searchQuery, {
                              jobType: selectedJobType,
                              location: selectedLocation,
                              salaryRange: selectedSalaryRange,
                              postedDate: selectedPostedDate,
                              category: selectedCategory
                            });
                          } else {
                            toast.error(data.message || "Failed to create post");
                          }
                        } catch (error) {
                          console.error("Error creating post:", error);
                          toast.error("An error occurred while creating the post");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    }}
                    disabled={!newPostContent.trim() || isSubmitting}
                    className="bg-[#263238] hover:bg-[#263238]/90 text-white rounded-full px-6 h-9 text-sm font-medium disabled:bg-[#263238]/20 disabled:text-[#263238]/40 transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting...
                      </span>
                    ) : (
                      editingPost ? 'Update' : 'Post'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
}