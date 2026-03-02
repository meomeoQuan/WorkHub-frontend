import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  FileText,
  Star,
  Heart,
  MessageCircle,
  Link as LinkIcon,
  MoreHorizontal,
  UserPlus,
  ArrowRight,
  Send,
  Building2
} from 'lucide-react';
import { SkeletonCommentModal } from '../components/SkeletonCommentModal';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { formatRelativeTime } from '../utils/dateUtils';
import type { ApiResponse } from '../types/ApiResponse';
import {
  UserCheck
} from 'lucide-react';
// Removed unused AlertDialog imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
// Removed unused Dialog, Button, and Textarea imports
import { Edit, Trash2, Loader2, X } from 'lucide-react';
import { RecruitmentSelectDTO } from '../types/DTOs/ModelDTOs/JobPostDTOs/RecruitmentSelectDTO';

interface JobPost {
  id: string;
  company: string;
  avatar: string;
  username: string;
  credibilityRating: number;
  timestamp: string;
  content: string;
  jobTitle: string;
  location: string;
  salary: string;
  type: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  image: string | null;
  postedDate: string;
  isLiked?: boolean;
  requirements?: string;
  workTime?: string;
  attachedJobs?: any[];
}

export function UserPosts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileUserId = searchParams.get("userId");
  const [userPosts, setUserPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSelectedJobIds, setEditSelectedJobIds] = useState<string[]>([]);
  const [availableJobs, setAvailableJobs] = useState<RecruitmentSelectDTO[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const [selectedPostForComment, setSelectedPostForComment] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [userComments, setUserComments] = useState<Record<string, any[]>>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isCommentModalLoading, setIsCommentModalLoading] = useState(false);
  const [followedUserIds, setFollowedUserIds] = useState<Set<number>>(new Set());
  const lastCommentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (deleteDialogOpen || selectedPostForComment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [deleteDialogOpen, selectedPostForComment]);

  const loadUserPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const endpoint = profileUserId
        ? `public-user-posts/${profileUserId}`
        : 'all-user-posts';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/UserProfile/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          // Map backend JobPostDTO to internal JobPost interface
          const mappedPosts = result.data.map((p: any) => ({
            id: p.postId.toString(),
            company: p.fullName,
            avatar: p.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.fullName}&backgroundColor=FF9800`,
            username: p.userName,
            userId: p.userId,
            credibilityRating: p.rating,
            timestamp: p.createdAt,
            content: p.content,
            jobTitle: p.jobs?.[0]?.jobName || p.header || null,
            location: p.jobs?.[0]?.location || null,
            salary: p.jobs?.[0]?.salary || null,
            type: p.jobs?.[0]?.jobType || null,
            likes: p.likeCount || 0,
            comments: p.commentCount || 0,
            reposts: 0,
            shares: 0,
            image: p.postImage,
            postedDate: p.createdAt,
            attachedJobs: p.jobs || []
          }));
          setUserPosts(mappedPosts);
        }
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
      toast.error('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableJobs = useCallback(async () => {
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

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/jobs?postId=${postId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const fetchComments = useCallback(async (postId: string) => {
    try {
      setIsCommentModalLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/all-comments-post?PostId=${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setUserComments(prev => ({
          ...prev,
          [postId]: data.data.comments || []
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsCommentModalLoading(false);
    }
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    return formatRelativeTime(timestamp);
  };

  const handleAddComment = async (postId: string, text: string, parentCommentId?: number) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
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
      const data = await response.json();
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

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
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
        setUserPosts(prev =>
          prev.map(p =>
            p.id === postId
              ? { ...p, isLiked: !p.isLiked, likes: (data.data as number) ?? p.likes }
              : p
          )
        );

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

  const handleFollowToggle = async (targetUserId: number) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/toggle-follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ FollowingId: targetUserId })
      });
      const data = await response.json();
      if (data.success) {
        setFollowedUserIds(prev => {
          const next = new Set(prev);
          if (next.has(targetUserId)) {
            next.delete(targetUserId);
            toast.success("Unfollowed user");
          } else {
            next.add(targetUserId);
            toast.success("Followed user");
          }
          return next;
        });
      } else {
        toast.error(data.message || "Failed to follow/unfollow");
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("An error occurred");
    }
  };

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/all-post-following`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data: ApiResponse<any[]> = await response.json();
      if (data.success && data.data) {
        const userIds = new Set(data.data.map(p => p.userId));
        setFollowedUserIds(userIds);
      }
    } catch (error) {
      console.error("Error fetching followed users:", error);
    }
  }, []);

  useEffect(() => {
    loadUserPosts();
    if (isLoggedIn) {
      fetchFollowedUsers();
    }
  }, [profileUserId, isLoggedIn, fetchFollowedUsers]);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/delete-post/${postToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          await loadUserPosts();
          toast.success('Post deleted successfully!');
        } else {
          const result = await res.json();
          toast.error(result.message || 'Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleEditClick = (post: JobPost) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditSelectedJobIds(post.attachedJobs?.map(j => j.id.toString()) || []);
    fetchAvailableJobs();
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent('');
    setEditSelectedJobIds([]);
  };

  const handleEditSave = async (postId: string) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/JobPost/update-post/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editContent,
          recruitmentIds: editSelectedJobIds.map(id => parseInt(id))
        })
      });

      if (res.ok) {
        await loadUserPosts();
        toast.success('Post updated successfully!');
        handleCancelEdit();
      } else {
        const result = await res.json();
        toast.error(result.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };







  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[#263238] text-3xl">User Posts</h1>
                    <p className="text-[#263238]/70">Manage all your job postings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && (
            <div className="mb-8">
              <Card className="p-4 border-[#263238]/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF9800]/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#FF9800]" />
                  </div>
                  <div>
                    <p className="text-2xl text-[#263238] font-bold">{userPosts.length}</p>
                    <p className="text-xs text-[#263238]/60">Total Posts</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 border-[#263238]/10 shadow-md animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-[#263238]/10 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-[#263238]/10 rounded w-2/3" />
                      <div className="h-4 bg-[#263238]/10 rounded w-1/2" />
                      <div className="h-4 bg-[#263238]/10 rounded w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-[#263238]/10 rounded w-20" />
                        <div className="h-8 bg-[#263238]/10 rounded w-20" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Posts List */}
          {!loading && userPosts.length === 0 && (
            <Card className="p-12 text-center border-2 border-dashed border-[#263238]/20">
              <div className="w-20 h-20 bg-[#263238]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-[#263238]/50" />
              </div>
              <h3 className="text-[#263238] mb-2">No Posts Yet</h3>
              <p className="text-[#263238]/70 max-w-md mx-auto">
                You haven't posted any jobs yet. Create your first job posting to start finding qualified candidates.
              </p>
            </Card>
          )}

          {!loading && userPosts.length > 0 && (
            <div className="divide-y divide-[#263238]/10 border border-[#263238]/10 rounded-xl overflow-hidden bg-white">
              {userPosts.map((post: any) => (
                <div
                  key={post.id}
                  id={`post-${post.id}`}
                  className="bg-white hover:bg-[#FAFAFA]/50 transition scroll-mt-24"
                >
                  <div className="px-4 py-6">
                    {/* Post Header */}
                    <div className="flex gap-3">
                      <Link to={`/profile/user?userId=${post.userId || profileUserId}`}>
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
                              <Link to={`/profile/user?userId=${post.userId || profileUserId}`}>
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
                                {formatTimeAgo(post.timestamp)}
                              </span>
                            </div>
                            <div className="text-[#263238]/60 text-sm">
                              @{post.username}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.userId !== Number(user?.id) && (
                              <button
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  handleFollowToggle(post.userId);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${followedUserIds.has(post.userId)
                                  ? "bg-[#263238]/5 text-[#263238]/60 hover:bg-[#263238]/10"
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

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button onClick={(e: any) => e.stopPropagation()} className="p-1.5 hover:bg-[#263238]/5 rounded-full transition outline-none">
                                  <MoreHorizontal className="w-5 h-5 text-[#263238]/50" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 z-[101]">
                                {(post.userId === Number(user?.id) || user?.userType === "admin") ? (
                                  <>
                                    <DropdownMenuItem
                                      onSelect={(e: any) => { e.stopPropagation(); handleEditClick(post); }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={(e: any) => { e.stopPropagation(); handleDeleteClick(post.id); }}
                                      className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Post
                                    </DropdownMenuItem>
                                  </>
                                ) : (
                                  <>
                                    <DropdownMenuItem
                                      onSelect={(e: any) => { e.stopPropagation(); toast.info("Report functionality coming soon!"); }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      Report
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={(e: any) => { e.stopPropagation(); toast.info("Hide functionality coming soon!"); }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      Hide
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Post Body - Description & Media */}
                        {editingPostId === post.id ? (
                          <div className="mb-4 space-y-4 p-4 bg-[#FAFAFA] rounded-2xl border border-[#263238]/10 animate-in fade-in zoom-in duration-200">
                            {/* Text Editor */}
                            <textarea
                              value={editContent}
                              onChange={(e: any) => setEditContent(e.target.value)}
                              placeholder="What's on your mind?"
                              className="w-full min-h-[120px] p-4 bg-white rounded-xl border border-[#263238]/10 focus:border-[#FF9800] focus:ring-2 focus:ring-[#FF9800]/20 resize-none outline-none transition text-[15px] leading-relaxed"
                              disabled={isSaving}
                              autoFocus
                            />

                            {/* Job Selector Inline */}
                            <div className="space-y-3">
                              <label className="flex items-center gap-2 text-sm font-semibold text-[#263238] opacity-70">
                                <Briefcase className="w-4 h-4" />
                                Manage Job Attachments
                              </label>
                              <div className="bg-white border border-[#263238]/10 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
                                {isJobsLoading ? (
                                  <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-5 h-5 text-[#FF9800] animate-spin" />
                                  </div>
                                ) : (availableJobs || []).length > 0 ? (
                                  (availableJobs || []).map((job) => (
                                    <label
                                      key={job.id}
                                      className="flex items-start gap-3 p-2 hover:bg-[#FAFAFA] rounded-lg transition cursor-pointer group"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editSelectedJobIds.includes(job.id.toString())}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setEditSelectedJobIds([...editSelectedJobIds, job.id.toString()]);
                                          } else {
                                            setEditSelectedJobIds(editSelectedJobIds.filter(id => id !== job.id.toString()));
                                          }
                                        }}
                                        className="mt-1 w-4 h-4 accent-[#FF9800] cursor-pointer"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-[#263238] truncate group-hover:text-[#FF9800] transition">
                                            {job.jobName}
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-[#263238]/50 truncate font-medium">
                                          {job.location} • {job.salary}
                                        </div>
                                      </div>
                                    </label>
                                  ))
                                ) : (
                                  <div className="text-center py-6 text-[#263238]/40 text-sm">
                                    No jobs found to attach
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 rounded-xl text-[#263238]/60 hover:bg-[#263238]/5 transition font-medium text-sm"
                                disabled={isSaving}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSave(post.id)}
                                disabled={isSaving || !editContent.trim()}
                                className="px-6 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl transition font-medium text-sm shadow-lg shadow-[#FF9800]/20 flex items-center gap-2 disabled:opacity-50"
                              >
                                {isSaving ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-3">
                              <p className="text-[#263238] text-[15px] leading-relaxed mb-4">
                                {post.content}
                              </p>

                              {/* Post Image (if exists) */}
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
                                            onClick={(e: any) => {
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

                              {/* Legacy Job Info Card Support */}
                              {!post.attachedJobs?.length && post.jobTitle && (post.location || post.salary) && (
                                <>
                                  <div className="h-px bg-gradient-to-r from-transparent via-[#263238]/20 to-transparent mb-4" />
                                  <Card className="border-2 border-[#263238]/10 overflow-hidden bg-white hover:border-[#FF9800]/30 transition">
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
                          </>
                        )}

                        {/* Interaction Buttons */}
                        <div className="flex items-center justify-between text-[#263238]/60 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post.id);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full transition group ${post.isLiked ? "text-red-500 bg-red-50" : "hover:bg-red-50"
                              }`}
                          >
                            <Heart className={`w-5 h-5 transition ${post.isLiked ? "fill-current text-red-500" : "group-hover:text-red-500"}`} />
                            <span className={`text-sm ${post.isLiked ? "text-red-500" : "group-hover:text-red-500"}`}>
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
                            onClick={() => handleCopyLink(post.id)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#FF9800]/10 rounded-full transition group"
                            title="Copy Link"
                          >
                            <LinkIcon className="w-5 h-5 group-hover:text-[#FF9800] transition" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Manual) */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#263238]/10 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#263238] mb-2">Delete Job Post</h3>
            <p className="text-[#263238]/70 mb-6">
              Are you sure you want to delete this job post? This action cannot be undone and all associated data will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 rounded-xl text-[#263238]/60 hover:bg-[#263238]/5 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl transition font-medium shadow-lg shadow-[#FF9800]/20 active:scale-95"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal containers removed */}

      {selectedPostForComment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
          onClick={() => setSelectedPostForComment(null)}
        >
          {isCommentModalLoading ? (
            <div onClick={(e: any) => e.stopPropagation()}>
              <SkeletonCommentModal />
            </div>
          ) : (
            <div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e: any) => e.stopPropagation()}
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
              <div className="flex-1 overflow-y-auto w-full">
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
                        <span className="text-[#263238]/50 text-sm">{formatTimeAgo(selectedPostForComment.timestamp)}</span>
                      </div>
                      <div className="text-[#263238]/60 text-sm mb-3">@{selectedPostForComment.username}</div>
                      <p className="text-[#263238] text-[15px] leading-relaxed">{selectedPostForComment.content}</p>
                    </div>
                  </div>

                  {selectedPostForComment.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-[#263238]/10">
                      <img
                        src={selectedPostForComment.image}
                        alt={selectedPostForComment.jobTitle}
                        className="w-full object-cover"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Job Card Section - Only show if there's a job attached */}
                {(selectedPostForComment.attachedJobs?.length > 0 || (selectedPostForComment.jobTitle && (selectedPostForComment.location || selectedPostForComment.salary))) && (
                  <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#263238]/10">
                    <div
                      className="bg-white border border-[#263238]/10 rounded-xl p-4 hover:border-[#FF9800]/30 transition cursor-pointer"
                      onClick={(e: any) => {
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
                )}

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
                        <div key={`comment-${node.id}`} className="space-y-2 mt-3" ref={lastCommentRef}>
                          <div className="flex gap-3">
                            <Avatar className={`${depth === 0 ? 'w-8 h-8' : 'w-7 h-7'} flex-shrink-0 relative z-10`}>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${node.userName || 'U'}&backgroundColor=4FC3F7`} />
                              <AvatarFallback className={`${depth === 0 ? 'bg-[#4FC3F7]' : 'bg-[#FF9800]'} text-white text-[10px]`}>
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
                                  {node.createdAt ? formatTimeAgo(node.createdAt) : ''}
                                </span>
                              </div>

                              {/* Inline Reply Input */}
                              {replyingTo === node.id && (
                                <div className="flex gap-2 mt-2 items-center">
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e: any) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${node.userName}...`}
                                    className="flex-1 px-3 py-1.5 bg-white border border-[#263238]/15 rounded-full text-[#263238] placeholder:text-[#263238]/40 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/30 transition text-sm"
                                    autoFocus
                                    onKeyDown={(e: any) => {
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

                          {/* Render nested replies */}
                          {node.replies && node.replies.length > 0 && (
                            <div className="ml-10 space-y-3 border-l-2 border-[#263238]/5 pl-4 pb-2">
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
                      onChange={(e: any) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 bg-[#FAFAFA] rounded-full text-[#263238] placeholder:text-[#263238]/50 focus:outline-none focus:ring-2 focus:ring-[#FF9800]/30 transition text-sm"
                      onKeyDown={(e: any) => {
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
      )}
    </div>
  );
}