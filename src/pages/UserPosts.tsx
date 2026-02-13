import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Edit,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  FileText,
  Star,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

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
  salaryMin: number;
  salaryMax: number;
  type: string;
  jobImage: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  image: string | null;
  category: string;
  experienceLevel: string;
  workSetting: string;
  companySize: string;
  postedDate: string;
  requirements: string;
  workTime: string;
  allImages: string[];
}

export function UserPosts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load user's posted jobs from localStorage
    const loadUserPosts = () => {
      setLoading(true);
      try {
        const storedPosts = localStorage.getItem('userPostedJobs');
        if (storedPosts) {
          const posts = JSON.parse(storedPosts);
          setUserPosts(posts);
        } else {
          // Add demo posts for visualization
          const demoPosts: JobPost[] = [
            {
              id: 'demo-1',
              company: 'TechStart Inc.',
              avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
              username: user?.email || 'employer@gmail.com',
              credibilityRating: 4.8,
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              content: 'We are looking for a talented frontend developer to join our dynamic team. You will work on exciting projects using React and modern web technologies.',
              jobTitle: 'Frontend Developer',
              location: 'San Francisco, CA',
              salary: '$45-65/hour',
              salaryMin: 45,
              salaryMax: 65,
              type: 'Part-Time',
              jobImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
              likes: 24,
              comments: 8,
              reposts: 5,
              shares: 12,
              image: null,
              category: 'Technology',
              experienceLevel: 'Intermediate',
              workSetting: 'Hybrid',
              companySize: '50-200',
              postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              requirements: 'React, TypeScript, CSS',
              workTime: 'Flexible Hours',
              allImages: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800']
            },
            {
              id: 'demo-2',
              company: 'Creative Studios',
              avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',
              username: user?.email || 'employer@gmail.com',
              credibilityRating: 4.5,
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              content: 'Join our creative team for the summer season! We need a graphic designer who can create stunning visuals for our marketing campaigns.',
              jobTitle: 'Graphic Designer',
              location: 'Los Angeles, CA',
              salary: '$35-50/hour',
              salaryMin: 35,
              salaryMax: 50,
              type: 'Seasonal',
              jobImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
              likes: 18,
              comments: 5,
              reposts: 3,
              shares: 8,
              image: null,
              category: 'Design',
              experienceLevel: 'Entry Level',
              workSetting: 'Remote',
              companySize: '10-50',
              postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              requirements: 'Adobe Creative Suite, Portfolio',
              workTime: 'Part-time',
              allImages: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800']
            },
            {
              id: 'demo-3',
              company: 'Marketing Pro',
              avatar: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=100',
              username: user?.email || 'employer@gmail.com',
              credibilityRating: 4.9,
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              content: 'Seeking an experienced content writer for ongoing freelance projects. You will create engaging blog posts, social media content, and marketing copy.',
              jobTitle: 'Content Writer',
              location: 'Remote',
              salary: '$30-45/hour',
              salaryMin: 30,
              salaryMax: 45,
              type: 'Freelance',
              jobImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
              likes: 32,
              comments: 12,
              reposts: 7,
              shares: 15,
              image: null,
              category: 'Writing',
              experienceLevel: 'Intermediate',
              workSetting: 'Remote',
              companySize: '10-50',
              postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              requirements: 'SEO knowledge, Portfolio',
              workTime: 'Flexible Hours',
              allImages: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800']
            }
          ];
          setUserPosts(demoPosts);
          localStorage.setItem('userPostedJobs', JSON.stringify(demoPosts));
        }
      } catch (error) {
        console.error('Error loading user posts:', error);
        toast.error('Failed to load your posts');
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadUserPosts();
  }, []);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      try {
        const updatedPosts = userPosts.filter(post => post.id !== postToDelete);
        setUserPosts(updatedPosts);
        localStorage.setItem('userPostedJobs', JSON.stringify(updatedPosts));
        toast.success('Job post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'part-time':
        return 'bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/30';
      case 'freelance':
        return 'bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30';
      case 'seasonal':
        return 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30';
      default:
        return 'bg-[#263238]/20 text-[#263238] border-[#263238]/30';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
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
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white hover:bg-[#FAFAFA]/50 transition"
                >
                  <div className="px-4 py-6">
                    {/* Post Header */}
                    <div className="flex gap-3">
                      <Link to="/profile/user">
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
                              <Link to="/profile/user">
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
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition bg-[#FF9800] text-white hover:bg-[#F57C00]"
                            >
                              <UserPlus className="w-4 h-4" />
                              Follow
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(post.id);
                              }}
                              className="p-1.5 hover:bg-[#263238]/5 rounded-full transition"
                            >
                              <MoreHorizontal className="w-5 h-5 text-[#263238]/50" />
                            </button>
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
                                    <Link
                                      to={`/jobs/${post.id}`}
                                      className="text-xs text-[#4FC3F7] hover:underline font-medium"
                                    >
                                      View Details →
                                    </Link>
                                  </div>
                                </div>
                              </Card>
                            </>
                          )}
                        </div>

                        {/* Interaction Buttons */}
                        <div className="flex items-center justify-between text-[#263238]/60 pt-1">
                          <button className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-full transition group">
                            <Heart className="w-5 h-5 group-hover:text-red-500 transition" />
                            <span className="text-sm group-hover:text-red-500">
                              {post.likes}
                            </span>
                          </button>

                          <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#4FC3F7]/10 rounded-full transition group">
                            <MessageCircle className="w-5 h-5 group-hover:text-[#4FC3F7] transition" />
                            <span className="text-sm group-hover:text-[#4FC3F7]">
                              {post.comments}
                            </span>
                          </button>

                          <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#4ADE80]/10 rounded-full transition group">
                            <Repeat2 className="w-5 h-5 group-hover:text-[#4ADE80] transition" />
                            <span className="text-sm group-hover:text-[#4ADE80]">
                              {post.reposts}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job post? This action cannot be undone and all associated data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}