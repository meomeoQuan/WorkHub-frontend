import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import {
  DollarSign,
  Users,
  Briefcase,
  Crown,
  Shield,
  FileText,
  BarChart3,
  LogOut,
  Home,
  Activity,
  ShoppingCart,
  FolderOpen,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  AlertTriangle,
  Mail,
  Star,
  Phone,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { useAuth, type PaymentPlan } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
const API = import.meta.env.VITE_API_URL;

// ─── Interfaces ──────────────────────────────────────────────
interface UserRow {
  id: number;
  email: string;
  fullName: string;
  userType: 'user' | 'admin';
  paymentPlan: PaymentPlan;
  status: 'active' | 'suspended';
  revenue: number;
  joinDate: string;
  isVerified: boolean;
  totalJobs?: number;
  totalPosts?: number;
  rating?: number;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  school?: string;
}

interface Order {
  id: number;
  userId: number;
  userName: string;
  plan: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

interface Post {
  id: number;
  userId: number;
  userName: string;
  title: string;
  category: string;
  status: 'Published' | 'Pending' | 'Rejected';
  date: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface JobType {
  id: number;
  name: string;
  count: number;
}

interface ReportProblem {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  category: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  resolvedAt?: string;
}

const mockReportProblems: ReportProblem[] = [];

type MenuKey = 'analytics' | 'users' | 'orders' | 'posts' | 'categories' | 'jobtypes' | 'reports';

// ─── Badge helpers (return HTML strings for DataTables) ──────
function planBadgeHtml(plan: string) {
  const map: Record<string, string> = {
    free: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    diamond: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };
  const cls = map[plan] || map.free;
  return `<span class="px-2 py-1 rounded-full text-xs font-bold border ${cls}">${plan.toUpperCase()}</span>`;
}

function statusBadgeHtml(status: string) {
  const s = status.toLowerCase();
  let cls = 'bg-purple-500/20 text-purple-400';
  if (['active', 'completed', 'published', 'resolved'].includes(s)) cls = 'bg-green-500/20 text-green-400';
  else if (['pending', 'in progress'].includes(s)) cls = 'bg-blue-500/20 text-blue-400';
  else if (['suspended', 'failed', 'rejected', 'open'].includes(s)) cls = 'bg-red-500/20 text-red-400';
  else if (s === 'closed') cls = 'bg-gray-500/20 text-gray-400';
  return `<span class="px-2 py-1 rounded-full text-xs font-bold ${cls}">${status}</span>`;
}

function verifiedBadgeHtml(isVerified: boolean) {
  if (isVerified) {
    return `<span class="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">Đã xác minh</span>`;
  }
  return `<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400">Chưa xác minh</span>`;
}

function priorityBadgeHtml(priority: string) {
  const map: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-300 border-green-500/30',
  };
  const cls = map[priority] || 'bg-gray-500/20 text-gray-300';
  return `<span class="px-2 py-1 rounded text-xs font-medium border ${cls}">${priority}</span>`;
}

function actionBtnsHtml(id: number, status?: string) {
  const isSuspended = status === 'suspended';
  const toggleIcon = isSuspended ? 
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unlock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>` :
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`;
  
  const toggleTitle = isSuspended ? "Mở khóa" : "Khóa người dùng";
  const toggleAction = "toggle-ban";
  const toggleCls = isSuspended ? "text-green-400 hover:bg-green-500/20" : "text-red-400 hover:bg-red-500/20";

  return `<div class="flex gap-2">
    <button data-action="view" data-id="${id}" class="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20 transition-all active:scale-95" title="Xem chi tiết">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
    </button>
    <button data-action="edit" data-id="${id}" class="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20 transition-all active:scale-95" title="Chỉnh sửa">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
    </button>
    <button data-action="${toggleAction}" data-id="${id}" class="p-2 bg-purple-500/10 ${toggleCls} rounded-xl border border-purple-500/20 transition-all active:scale-95" title="${toggleTitle}">${toggleIcon}</button>
  </div>`;
}

function editOnlyBtnHtml(id: number) {
  return `<div class="flex gap-2">
    <button data-action="edit" data-id="${id}" class="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20 transition-all active:scale-95" title="Chỉnh sửa">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
    </button>
  </div>`;
}

// ─── Component ───────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthLoading } = useAuth();

  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [reports, setReports] = useState<ReportProblem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartTimeRange, setChartTimeRange] = useState('7d');

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetchData = async () => {
      try {
        if (selectedMenu === 'analytics') {
          const res = await fetch(`${API}/api/Admin/stats?timeRange=${chartTimeRange}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setStats(result.data);
        } else if (selectedMenu === 'users') {
          const res = await fetch(`${API}/api/Admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success && result.data) {
            setUsers(result.data.map((u: any) => ({
              id: u.id,
              email: u.email,
              fullName: u.fullName || 'N/A',
              userType: u.role === 0 ? 'admin' : 'user',
              paymentPlan: u.paymentPlan || 'free',
              status: u.status === 'suspended' ? 'suspended' : 'active',
              revenue: u.revenue || 0,
              joinDate: u.joinDate || new Date().toISOString().split('T')[0],
              isVerified: u.isVerified || false,
              totalJobs: u.totalJobs || 0,
              totalPosts: u.totalPosts || 0,
              rating: u.rating || 0,
              phoneNumber: u.phone || u.phoneNumber || '',
              bio: u.bio || '',
              location: u.location || '',
              school: u.school || ''
            })));
          }
        } else if (selectedMenu === 'orders') {
          const res = await fetch(`${API}/api/Admin/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setOrders(result.data);
        } else if (selectedMenu === 'posts') {
          const res = await fetch(`${API}/api/Admin/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setPosts(result.data);
        } else if (selectedMenu === 'categories') {
          const res = await fetch(`${API}/api/Admin/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setCategories(result.data);
        } else if (selectedMenu === 'jobtypes') {
          const res = await fetch(`${API}/api/Admin/jobtypes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setJobTypes(result.data);
        } else if (selectedMenu === 'reports') {
          const res = await fetch(`${API}/api/Admin/reports`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setReports(result.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${selectedMenu}:`, error);
        toast.error(`Không thể tải dữ liệu ${selectedMenu}`);
      }
    };

    fetchData();
  }, [selectedMenu, chartTimeRange]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // This ref holds a plain container div. We will imperatively create/destroy
  // the <table> inside it so React never reconciles DataTables' DOM mutations.
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const dtInstance = useRef<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Keep latest data in refs so event handlers always read fresh state
  const usersRef = useRef(users); usersRef.current = users;
  const ordersRef = useRef(orders); ordersRef.current = orders;
  const postsRef = useRef(posts); postsRef.current = posts;
  const reportsRef = useRef(reports); reportsRef.current = reports;
  const categoriesRef = useRef(categories); categoriesRef.current = categories;
  const jobTypesRef = useRef(jobTypes); jobTypesRef.current = jobTypes;
  const selectedMenuRef = useRef(selectedMenu); selectedMenuRef.current = selectedMenu;

  // Redirect non-admins
  useEffect(() => {
    if (!isAuthLoading && user?.userType !== 'admin') {
      navigate('/');
    }
  }, [user, navigate, isAuthLoading]);

  // ─── Find item by id across current menu ─────────────────
  const findItem = useCallback((id: number) => {
    const sid = String(id);
    switch (selectedMenuRef.current) {
      case 'users': return usersRef.current.find(u => String(u.id) === sid);
      case 'orders': return ordersRef.current.find(o => String(o.id) === sid);
      case 'posts': return postsRef.current.find(p => String(p.id) === sid);
      case 'reports': return reportsRef.current.find(r => String(r.id) === sid);
      case 'categories': return categoriesRef.current.find(c => String(c.id) === sid);
      case 'jobtypes': return jobTypesRef.current.find(j => String(j.id) === sid);
      default: return null;
    }
  }, []);

  // ─── CRUD Handlers ───────────────────────────────────────
  const handleEdit = useCallback(async (item: any) => { 
    if (selectedMenuRef.current === 'users') {
      navigate(`/admin/user-profile?userId=${item.id}&mode=edit`);
      return;
    }

    setDialogMode('edit'); 
    setSelectedItem(item); 
    setFormData({ ...item });
    setIsDialogOpen(true); 
  }, [navigate]);
  const handleView = useCallback((item: any) => { 
    if (selectedMenuRef.current === 'users') {
      navigate(`/admin/user-profile?userId=${item.id}`);
    } else {
      setDialogMode('view'); setSelectedItem(item); setFormData({ ...item }); setIsDialogOpen(true); 
    }
  }, [navigate]);
  const handleCreate = useCallback(() => { setDialogMode('create'); setSelectedItem(null); setFormData({}); setIsDialogOpen(true); }, []);
  const handleDeletePrompt = useCallback((id: number) => { setItemToDelete(id); setIsDeleteDialogOpen(true); }, []);

  const handleToggleBan = useCallback(async (userId: number) => {
    const userToToggle = usersRef.current.find(u => u.id === userId);
    if (!userToToggle) return;

    const newStatus = userToToggle.status === 'active' ? 'suspended' : 'active';

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API}/api/Admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setUsers(prevUsers =>
          prevUsers.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        console.error("Failed to toggle user status:", res.status, await res.text());
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      // Optionally, show an error message to the user
    }
  }, []);

  const confirmDelete = () => {
    switch (selectedMenu) {
      case 'users': setUsers(prev => prev.filter(u => u.id !== itemToDelete)); break;
      case 'orders': setOrders(prev => prev.filter(o => o.id !== itemToDelete)); break;
      case 'posts': setPosts(prev => prev.filter(p => p.id !== itemToDelete)); break;
      case 'reports': setReports(prev => prev.filter(r => r.id !== itemToDelete)); break;
      case 'categories': setCategories(prev => prev.filter(c => c.id !== itemToDelete)); break;
      case 'jobtypes': setJobTypes(prev => prev.filter(j => j.id !== itemToDelete)); break;
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    
    if (selectedMenu === 'users') {
      try {
        if (dialogMode === 'create') {
          const createData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.userType === 'admin' ? 0 : 1
          };

          const res = await fetch(`${API}/api/Admin/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(createData)
          });

          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              const u = result.data;
              const mappedUser = {
                id: u.id,
                email: u.email,
                fullName: u.fullName || 'N/A',
                userType: (u.role === 0 ? 'admin' : 'user') as 'user' | 'admin',
                paymentPlan: (u.paymentPlan || 'free') as PaymentPlan,
                status: (u.status === 'suspended' ? 'suspended' : 'active') as 'active' | 'suspended',
                revenue: u.revenue || 0,
                joinDate: u.joinDate || new Date().toISOString().split('T')[0],
                isVerified: u.isVerified || false
              };
              setUsers(prev => [...prev, mappedUser]);
              setIsDialogOpen(false);
              toast.success('User created successfully');
            }
          } else {
            const errorText = await res.text();
            console.error("Failed to create user:", errorText);
            toast.error('Failed to create user: ' + errorText);
          }
        } else {
          const updateData = {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.userType === 'admin' ? 0 : 1,
            status: formData.status || 'active',
            phoneNumber: formData.phoneNumber,
            bio: formData.bio,
            location: formData.location,
            school: formData.school,
            totalJobs: formData.totalJobs,
            totalPosts: formData.totalPosts,
            rating: formData.rating
          };

          const res = await fetch(`${API}/api/Admin/users/${selectedItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });

          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              const u = result.data;
              const mappedUser = {
                id: u.id,
                email: u.email,
                fullName: u.fullName || 'N/A',
                userType: (u.role === 0 ? 'admin' : 'user') as 'user' | 'admin',
                paymentPlan: (u.paymentPlan || 'free') as PaymentPlan,
                status: (u.status === 'suspended' ? 'suspended' : 'active') as 'active' | 'suspended',
                revenue: u.revenue || 0,
                joinDate: u.joinDate || new Date().toISOString().split('T')[0],
                isVerified: u.isVerified || false
              };
              setUsers(prev => prev.map(user => user.id === selectedItem.id ? { ...user, ...mappedUser } : user));
              setIsDialogOpen(false);
              toast.success('User updated successfully');
            }
          } else {
            console.error("Failed to update user:", await res.text());
            toast.error('Failed to update user');
          }
        }
      } catch (error) {
        console.error("Error saving user:", error);
        toast.error('An error occurred while saving user');
      }
      return;
    }

    if (selectedMenu === 'categories' || selectedMenu === 'jobtypes') {
      try {
        const endpoint = selectedMenu === 'categories' ? 'categories' : 'jobtypes';
        if (dialogMode === 'create') {
          const res = await fetch(`${API}/api/Admin/${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: formData.name })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              const mappedItem = {
                id: result.data.id,
                name: result.data.name,
                count: result.data.count || 0
              };
              if (selectedMenu === 'categories') {
                setCategories(prev => [...prev, mappedItem]);
              } else {
                setJobTypes(prev => [...prev, mappedItem]);
              }
              setIsDialogOpen(false);
              toast.success(`${selectedMenu === 'categories' ? 'Danh mục' : 'Loại công việc'} đã được tạo`);
            }
          } else {
            console.error(`Failed to create ${endpoint}:`, await res.text());
            toast.error(`Không thể tạo ${selectedMenu === 'categories' ? 'danh mục' : 'loại công việc'}`);
          }
        } else {
          // Update
          const res = await fetch(`${API}/api/Admin/${endpoint}/${selectedItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: formData.name })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              if (selectedMenu === 'categories') {
                setCategories(prev => prev.map(c => c.id === selectedItem.id ? { ...c, name: result.data.name } : c));
              } else {
                setJobTypes(prev => prev.map(j => j.id === selectedItem.id ? { ...j, name: result.data.name } : j));
              }
              setIsDialogOpen(false);
              toast.success(`${selectedMenu === 'categories' ? 'Danh mục' : 'Loại công việc'} đã được cập nhật`);
            }
          } else {
            console.error(`Failed to update ${endpoint}:`, await res.text());
            toast.error(`Không thể cập nhật ${selectedMenu === 'categories' ? 'danh mục' : 'loại công việc'}`);
          }
        }
      } catch (error) {
        console.error(`Error saving ${selectedMenu}:`, error);
        toast.error('Có lỗi xảy ra khi lưu');
      }
      return;
    }

    // Default mock behavior for other menus
    const newId = Date.now();
    if (dialogMode === 'create') {
      const newItem = { ...formData, id: newId };
      switch (selectedMenu) {
        case 'orders': setOrders(prev => [...prev, newItem]); break;
        case 'posts': setPosts(prev => [...prev, newItem]); break;
        case 'reports': setReports(prev => [...prev, newItem]); break;
      }
      setIsDialogOpen(false);
    } else {
      switch (selectedMenu) {
        case 'orders': setOrders(prev => prev.map(o => o.id === selectedItem.id ? { ...o, ...formData } : o)); break;
        case 'posts': setPosts(prev => prev.map(p => p.id === selectedItem.id ? { ...p, ...formData } : p)); break;
        case 'reports': setReports(prev => prev.map(r => r.id === selectedItem.id ? { ...r, ...formData } : r)); break;
      }
      setIsDialogOpen(false);
    }
  };

  // ─── DataTables: fully imperative ────────────────────────
  // We build the table with DataTables' `columns` + `data` API so React
  // never renders <tr>/<td> elements that DataTables then wraps/moves.
  useEffect(() => {
    if (selectedMenu === 'analytics') return;
    const container = tableContainerRef.current;
    if (!container) return;

    // Build columns + data based on menu
    let columns: { title: string; data?: string; render?: any; orderable?: boolean }[] = [];
    let data: any[] = [];

    switch (selectedMenu) {
      case 'users':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Tên', data: 'fullName' },
          { title: 'Email', data: 'email' },
          { title: 'Đã xác minh', data: 'isVerified', render: (d: boolean) => verifiedBadgeHtml(d) },
          { title: 'Gói', data: 'paymentPlan', render: (d: string) => planBadgeHtml(d) },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Hành động', data: 'id', orderable: false, render: (_d: number, _t: any, row: any) => actionBtnsHtml(row.id, row.status) },
        ];
        data = users;
        break;
      case 'orders':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Khách hàng', data: 'userName' },
          { title: 'Gói', data: 'plan' },
          { title: 'Số tiền', data: 'amount', render: (d: number) => `${d.toLocaleString('en-US')} VNĐ` },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Ngày', data: 'date' },
        ];
        data = orders;
        break;
      case 'posts':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Tiêu đề', data: 'title' },
          { title: 'Tác giả', data: 'userName' },
          { title: 'Danh mục', data: 'category', render: (d: string) => `<span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">${d}</span>` },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Ngày', data: 'date' },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
        ];
        data = posts;
        break;
      case 'categories':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Tên danh mục', data: 'name' },
          { title: 'Số bài viết', data: 'count' },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => editOnlyBtnHtml(d) },
        ];
        data = categories;
        break;
      case 'jobtypes':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Loại công việc', data: 'name' },
          { title: 'Số lượng', data: 'count' },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => editOnlyBtnHtml(d) },
        ];
        data = jobTypes;
        break;
      case 'reports':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Người báo cáo', data: 'userName', render: (_d: string, _t: any, row: any) => `<div>${row.userName || ''}</div><div class="text-xs opacity-60">${row.userEmail || ''}</div>` },
          { title: 'Tiêu đề', data: 'subject' },
          { title: 'Loại', data: 'category', render: (d: string) => `<span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">${d}</span>` },
          { title: 'Mức độ', data: 'priority', render: (d: string) => priorityBadgeHtml(d) },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
        ];
        data = reports;
        break;
    }

    // Create a fresh <table> element imperatively
    const tableEl = document.createElement('table');
    tableEl.className = 'display w-full';
    container.innerHTML = '';
    container.appendChild(tableEl);

    dtInstance.current = $(tableEl).DataTable({
      columns,
      data,
      pageLength: 10,
      order: [[0, 'asc']],
      language: {
        search: 'Tìm kiếm:',
        lengthMenu: 'Hiển thị _MENU_ mục',
        info: 'Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ mục',
        infoEmpty: 'Không có dữ liệu',
        zeroRecords: 'Không tìm thấy kết quả phù hợp',
        paginate: { first: 'Đầu', last: 'Cuối', next: 'Tiếp', previous: 'Trước' },
      },
    });

    // Delegate click events on the container for action buttons
    const handleClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-action');
      const id = parseInt(target.getAttribute('data-id') || '0', 10);
      const item = findItem(id);
      if (!item) return;
      if (action === 'view') handleView(item);
      else if (action === 'edit') handleEdit(item);
      else if (action === 'delete') handleDeletePrompt(id);
      else if (action === 'toggle-ban') handleToggleBan(id);
    };
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
      if (dtInstance.current) {
        dtInstance.current.destroy();
        dtInstance.current = null;
      }
      container.innerHTML = '';
    };
  }, [selectedMenu, users, orders, posts, reports, categories, jobTypes, findItem, handleView, handleEdit,      handleDeletePrompt,
    handleToggleBan,
  ]);

  // ─── Chart Init ──────────────────────────────────────────
  useEffect(() => {
    if (selectedMenu !== 'analytics' || !chartRef.current || !stats?.revenueChartData) return;
    const loadChart = async () => {
      const Chart = (await import('chart.js/auto')).default;
      const existing = Chart.getChart(chartRef.current as HTMLCanvasElement);
      if (existing) existing.destroy();
      new Chart(chartRef.current as HTMLCanvasElement, {
        type: 'line',
        data: {
          labels: stats.revenueChartData.map((d: any) => d.day),
          datasets: [{
            label: 'Doanh thu',
            data: stats.revenueChartData.map((d: any) => d.revenue),
            borderColor: '#A855F7',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    };
    loadChart();
  }, [selectedMenu, stats]);

  // ─── Menu Items ──────────────────────────────────────────
  const menuItems = [
    { key: 'analytics' as const, label: 'Thống kê', icon: BarChart3 },
    { key: 'users' as const, label: 'Người dùng', icon: Users },
    { key: 'orders' as const, label: 'Đơn hàng', icon: ShoppingCart },
    { key: 'posts' as const, label: 'Bài viết', icon: FileText },
    { key: 'categories' as const, label: 'Danh mục', icon: FolderOpen },
    { key: 'jobtypes' as const, label: 'Loại công việc', icon: Briefcase },
    { key: 'reports' as const, label: 'Báo cáo sự cố', icon: AlertTriangle },
  ];

  // ─── Dialog Fields ───────────────────────────────────────
  const renderDialogFields = () => {
    const disabled = dialogMode === 'view';
    const inputCls = 'bg-purple-900/20 border-purple-500/30 rounded-xl';
    const disabledCls = 'bg-purple-900/10 border-purple-500/10 opacity-60';

    switch (selectedMenu) {
      case 'users':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-purple-300 mb-2 block font-medium">Họ và tên *</Label>
                <div className="relative">
                  <Input value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} disabled={disabled} className={`${inputCls} pl-10`} />
                  <Users className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-purple-300 mb-2 block font-medium">Email *</Label>
                <div className="relative">
                  <Input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={disabled} className={`${inputCls} pl-10`} />
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-purple-300 mb-2 block font-medium">Số điện thoại</Label>
                <div className="relative">
                  <Input value={formData.phoneNumber || ''} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} disabled={disabled} className={`${inputCls} pl-10`} />
                  <Phone className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-purple-300 mb-2 block font-medium">Bio / Mô tả</Label>
                <Textarea value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })} disabled={disabled} className={`${inputCls} min-h-[80px]`} />
              </div>
              <div>
                <Label className="text-purple-300 mb-2 block font-medium">Địa điểm</Label>
                <div className="relative">
                  <Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} disabled={disabled} className={`${inputCls} pl-10`} />
                  <MapPin className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>
              <div>
                <Label className="text-purple-300 mb-2 block font-medium">Trường học</Label>
                <div className="relative">
                  <Input value={formData.school || ''} onChange={e => setFormData({ ...formData, school: e.target.value })} disabled={disabled} className={`${inputCls} pl-10`} />
                  <GraduationCap className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                </div>
              </div>
              <div>
                <Label className="text-purple-300 mb-2 block font-medium">Loại tài khoản</Label>
                <Select value={formData.userType || 'user'} onValueChange={(v: string) => setFormData({ ...formData, userType: v })} disabled={disabled}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {dialogMode !== 'create' && (
                <div>
                  <Label className="text-purple-300 mb-2 block font-medium">Trạng thái</Label>
                  <Select value={formData.status || 'active'} onValueChange={(v: string) => setFormData({ ...formData, status: v })} disabled={disabled}>
                    <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="suspended">Tạm khóa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <h4 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> CHỈ SỐ HỆ THỐNG
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-purple-300/60 mb-2 block text-[10px] uppercase tracking-wider font-bold">Total Jobs</Label>
                  <div className="relative">
                    <Input type="number" value={formData.totalJobs || 0} onChange={e => setFormData({ ...formData, totalJobs: parseInt(e.target.value) || 0 })} disabled={disabled} className={`${inputCls} pl-9`} />
                    <Briefcase className="w-3.5 h-3.5 text-purple-400/50 absolute left-3 top-3" />
                  </div>
                </div>
                <div>
                  <Label className="text-purple-300/60 mb-2 block text-[10px] uppercase tracking-wider font-bold">Total Posts</Label>
                  <div className="relative">
                    <Input type="number" value={formData.totalPosts || 0} onChange={e => setFormData({ ...formData, totalPosts: parseInt(e.target.value) || 0 })} disabled={disabled} className={`${inputCls} pl-9`} />
                    <FileText className="w-3.5 h-3.5 text-purple-400/50 absolute left-3 top-3" />
                  </div>
                </div>
                <div>
                  <Label className="text-purple-300/60 mb-2 block text-[10px] uppercase tracking-wider font-bold">Rating (0-5)</Label>
                  <div className="relative">
                    <Input type="number" step="0.1" max="5" min="0" value={formData.rating || 0} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} disabled={disabled} className={`${inputCls} pl-9`} />
                    <Star className="w-3.5 h-3.5 text-purple-400/50 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-purple-300 mb-2 block">Tên khách hàng</Label>
              <Input value={formData.userName || ''} onChange={e => setFormData({ ...formData, userName: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Gói</Label>
              <Input value={formData.plan || ''} onChange={e => setFormData({ ...formData, plan: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Số tiền ($)</Label>
              <Input type="number" value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Trạng thái</Label>
              <Select value={formData.status || 'Pending'} onValueChange={(v: string) => setFormData({ ...formData, status: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Hoàn tất</SelectItem>
                  <SelectItem value="Pending">Chờ xử lý</SelectItem>
                  <SelectItem value="Failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Ngày</Label>
              <Input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
          </div>
        );
      case 'posts':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-purple-300 mb-2 block">Tiêu đề *</Label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Tác giả</Label>
              <Input value={formData.userName || ''} onChange={e => setFormData({ ...formData, userName: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Danh mục</Label>
              <Input value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Trạng thái</Label>
              <Select value={formData.status || 'Pending'} onValueChange={(v: string) => setFormData({ ...formData, status: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Đã xuất bản</SelectItem>
                  <SelectItem value="Pending">Chờ duyệt</SelectItem>
                  <SelectItem value="Rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Ngày</Label>
              <Input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-purple-300 mb-2 block">Tên danh mục *</Label>
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Số bài viết</Label>
              <Input type="number" value={formData.count || 0} onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })} disabled={disabled} className={inputCls} />
            </div>
          </div>
        );
      case 'jobtypes':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-purple-300 mb-2 block">Loại công việc *</Label>
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Số lượng</Label>
              <Input type="number" value={formData.count || 0} onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })} disabled={disabled} className={inputCls} />
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-300 mb-2 block">Họ tên người báo cáo</Label>
                <Input value={formData.userName || ''} disabled className={disabledCls} />
              </div>
              <div>
                <Label className="text-purple-300 mb-2 block">Email liên hệ</Label>
                <Input value={formData.userEmail || ''} disabled className={disabledCls} />
              </div>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Tiêu đề *</Label>
              <Input value={formData.subject || ''} onChange={e => setFormData({ ...formData, subject: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-300 mb-2 block">Loại sự cố</Label>
                <Select value={formData.category || 'Technical'} onValueChange={(v: string) => setFormData({ ...formData, category: v })} disabled={disabled}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Lỗi kỹ thuật</SelectItem>
                    <SelectItem value="Account">Vấn đề tài khoản</SelectItem>
                    <SelectItem value="Payment">Thanh toán</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-purple-300 mb-2 block">Mức độ ưu tiên</Label>
                <Select value={formData.priority || 'Medium'} onValueChange={(v: string) => setFormData({ ...formData, priority: v })} disabled={disabled}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Thấp</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="High">Cao</SelectItem>
                    <SelectItem value="Critical">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Chi tiết sự cố *</Label>
              <Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} disabled={disabled} className={`${inputCls} min-h-[120px]`} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Trạng thái xử lý</Label>
              <Select value={formData.status || 'Open'} onValueChange={(v: string) => setFormData({ ...formData, status: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Chưa xử lý</SelectItem>
                  <SelectItem value="In Progress">Đang xử lý</SelectItem>
                  <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                  <SelectItem value="Closed">Đã đóng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        console.warn("renderDialogFields: unknown menu", selectedMenu);
        return <div className="p-4 text-purple-400">Không có dữ liệu hiển thị cho menu này.</div>;
    }
  };

  const dialogTitle = () => {
    const prefix = dialogMode === 'view' ? 'Chi tiết' : dialogMode === 'edit' ? 'Cập nhật' : 'Thêm mới';
    const entityMap: Record<MenuKey, string> = {
      analytics: '', users: 'Người dùng', orders: 'Đơn hàng', posts: 'Bài viết',
      categories: 'Danh mục', jobtypes: 'Loại công việc', reports: 'Báo cáo sự cố',
    };
    return `${prefix} ${entityMap[selectedMenu]}`;
  };

  if (isAuthLoading) return null;
  if (!user || user.userType !== 'admin') return null;

  return (
    <div className="min-h-screen bg-black flex text-white overflow-hidden">
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-black/50 backdrop-blur-xl border-r border-purple-500/30 transition-all duration-300 relative z-20`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-purple-500/30 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-500" />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">ADMIN</span>
              </div>
            )}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-purple-500/10 rounded-lg">
              {isSidebarCollapsed ? <Activity className="w-6 h-6 text-purple-400" /> : <ChevronLeft className="w-6 h-6 text-purple-400" />}
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button key={item.key} onClick={() => setSelectedMenu(item.key)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${selectedMenu === item.key
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg'
                  : 'text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-purple-500/30 space-y-2">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 p-3 rounded-lg text-purple-400/60 hover:bg-purple-500/10 hover:text-purple-300 transition-all">
              <Home className="w-5 h-5" />{!isSidebarCollapsed && <span>Trang chủ</span>}
            </button>
            <button onClick={logout} className="w-full flex items-center gap-4 p-3 rounded-lg text-red-400/60 hover:bg-red-500/10 hover:text-red-300 transition-all">
              <LogOut className="w-5 h-5" />{!isSidebarCollapsed && <span>Đăng xuất</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ───────────────────────────────── */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
                {menuItems.find(m => m.key === selectedMenu)?.label}
              </h2>
              <p className="text-purple-400/60 mt-1">Hệ thống quản trị và giám sát WorkHub</p>
            </div>
            {selectedMenu !== 'analytics' && (
              <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg border border-purple-500/50">
                <Plus className="w-4 h-4 mr-2" />Thêm mới
              </Button>
            )}
          </div>

          {/* ── Analytics View ─────────────────────────── */}
          {selectedMenu === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Doanh thu', val: stats ? `${stats.totalRevenue.toLocaleString('en-US')} VNĐ` : '0 VNĐ', icon: DollarSign, trend: stats ? `${stats.revenueGrowthPercentage > 0 ? '+' : ''}${stats.revenueGrowthPercentage}%` : '0%' },
                  { label: 'Người dùng', val: stats ? stats.totalUsers.toLocaleString('en-US') : '0', icon: Users, trend: stats ? `${stats.userGrowthCount > 0 ? '+' : ''}${stats.userGrowthCount}` : '+0' },
                  { label: 'Công việc', val: stats ? stats.totalJobs.toLocaleString('en-US') : '0', icon: Briefcase, trend: stats ? `${stats.jobGrowthCount > 0 ? '+' : ''}${stats.jobGrowthCount}` : '+0' },
                  { label: 'Premium', val: stats ? stats.totalPremiumUsers.toLocaleString('en-US') : '0', icon: Crown, trend: stats ? `${stats.premiumGrowthPercentage > 0 ? '+' : ''}${stats.premiumGrowthPercentage}%` : '0%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30"><stat.icon className="w-6 h-6 text-purple-400" /></div>
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">{stat.trend}</span>
                    </div>
                    <p className="text-purple-400/60 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-purple-100">{stat.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6 h-96 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl text-purple-200">Biểu đồ doanh thu</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setChartTimeRange('7d')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${chartTimeRange === '7d' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>7 ngày</button>
                    <button onClick={() => setChartTimeRange('30d')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${chartTimeRange === '30d' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>30 ngày</button>
                    <button onClick={() => setChartTimeRange('12m')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${chartTimeRange === '12m' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>12 tháng</button>
                    <button onClick={() => setChartTimeRange('5y')} className={`px-3 py-1 rounded-lg text-xs transition-colors ${chartTimeRange === '5y' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>5 năm</button>
                  </div>
                </div>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          )}

          {/* ── DataTable Container (imperative) ───────── */}
          {selectedMenu !== 'analytics' && (
            <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl admin-dt-wrapper">
              <div ref={tableContainerRef} />
            </div>
          )}
        </div>
      </main>

      {/* ─── CRUD Dialog ─────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-black border border-purple-500/30 text-white shadow-2xl shadow-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
              {dialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-purple-400/60 font-mono text-xs">
              ID: {selectedItem?.id || 'MỚI'} | Menu: {selectedMenu}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {renderDialogFields()}
          </div>
          <DialogFooter className="mt-8 border-t border-purple-500/20 pt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 rounded-xl">Đóng</Button>
            {dialogMode !== 'view' && (
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg border border-purple-500/50">
                <Save className="w-4 h-4 mr-2" />Lưu thay đổi
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black border border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-500">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-purple-400/60 mt-2">
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa mục này khỏi hệ thống?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-purple-500/10 border-purple-500/30 text-purple-300 rounded-xl">Hủy</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg border border-red-500/50">
              <Trash2 className="w-4 h-4 mr-2" />Xóa vĩnh viễn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── DataTables Dark Theme Override ──────────────── */}
      <style>{`
        .admin-dt-wrapper table.dataTable { color: #d8b4fe !important; border-collapse: collapse !important; }
        .admin-dt-wrapper table.dataTable thead th { color: #c084fc !important; border-bottom: 1px solid rgba(168,85,247,0.3) !important; padding: 12px 18px !important; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; background: transparent !important; }
        .admin-dt-wrapper table.dataTable tbody td { border-bottom: 1px solid rgba(168,85,247,0.1) !important; padding: 12px 18px !important; vertical-align: middle; }
        .admin-dt-wrapper table.dataTable tbody tr:hover { background: rgba(168,85,247,0.05) !important; }
        .admin-dt-wrapper table.dataTable tbody tr { background: transparent !important; }
        .admin-dt-wrapper .dataTables_wrapper .dataTables_length,
        .admin-dt-wrapper .dataTables_wrapper .dataTables_filter,
        .admin-dt-wrapper .dataTables_wrapper .dataTables_info,
        .admin-dt-wrapper .dataTables_wrapper .dataTables_paginate { color: #a78bfa !important; margin: 12px 0 !important; }
        .admin-dt-wrapper .dataTables_wrapper .dataTables_filter input {
          background: rgba(168,85,247,0.1) !important; border: 1px solid rgba(168,85,247,0.3) !important;
          border-radius: 8px !important; color: #fff !important; padding: 6px 12px !important; margin-left: 8px !important;
        }
        .admin-dt-wrapper .dataTables_wrapper .dataTables_length select {
          background: rgba(168,85,247,0.1) !important; border: 1px solid rgba(168,85,247,0.3) !important;
          border-radius: 6px !important; color: #fff !important; padding: 4px 8px !important;
        }
        .admin-dt-wrapper .paginate_button { color: #a78bfa !important; padding: 5px 12px !important; margin: 0 2px !important; border-radius: 6px !important; cursor: pointer !important; border: 1px solid transparent !important; background: transparent !important; }
        .admin-dt-wrapper .paginate_button:hover { background: rgba(168,85,247,0.15) !important; color: #c084fc !important; }
        .admin-dt-wrapper .paginate_button.current { background: rgba(168,85,247,0.3) !important; border-color: rgba(168,85,247,0.5) !important; color: #e9d5ff !important; }
        .admin-dt-wrapper .paginate_button.disabled { opacity: 0.3 !important; cursor: default !important; }
        .admin-dt-wrapper table.dataTable thead .sorting::after,
        .admin-dt-wrapper table.dataTable thead .sorting_asc::after,
        .admin-dt-wrapper table.dataTable thead .sorting_desc::after { opacity: 0.5 !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.4); }
      `}</style>
    </div>
  );
}