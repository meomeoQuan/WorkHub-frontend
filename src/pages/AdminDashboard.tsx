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
  Edit,
} from 'lucide-react';
import { useAuth, type PaymentPlan } from '../contexts/AuthContext';
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

// ─── Mock Data ───────────────────────────────────────────────
const mockUsers: UserRow[] = [
  { id: 1, email: 'john@example.com', fullName: 'John Doe', userType: 'user', paymentPlan: 'free', status: 'active', revenue: 0, joinDate: '2024-01-15' },
  { id: 2, email: 'jane@example.com', fullName: 'Jane Smith', userType: 'user', paymentPlan: 'gold', status: 'active', revenue: 199.9, joinDate: '2024-02-10' },
  { id: 3, email: 'admin@workhub.com', fullName: 'System Admin', userType: 'admin', paymentPlan: 'gold', status: 'active', revenue: 0, joinDate: '2023-12-01' },
  { id: 4, email: 'bob@example.com', fullName: 'Bob Wilson', userType: 'user', paymentPlan: 'silver', status: 'active', revenue: 49.9, joinDate: '2024-01-20' },
  { id: 5, email: 'alice@example.com', fullName: 'Alice Brown', userType: 'user', paymentPlan: 'diamond', status: 'suspended', revenue: 399.9, joinDate: '2024-03-01' },
];

const mockOrders: Order[] = [
  { id: 101, userId: 2, userName: 'Jane Smith', plan: 'Gold Plan', amount: 19.99, status: 'Completed', date: '2024-03-01' },
  { id: 102, userId: 1, userName: 'John Doe', plan: 'Silver Plan', amount: 9.99, status: 'Pending', date: '2024-03-05' },
  { id: 103, userId: 4, userName: 'Bob Wilson', plan: 'Silver Plan', amount: 9.99, status: 'Completed', date: '2024-03-06' },
  { id: 104, userId: 5, userName: 'Alice Brown', plan: 'Diamond Plan', amount: 49.99, status: 'Failed', date: '2024-03-07' },
];

const mockPosts: Post[] = [
  { id: 201, userId: 2, userName: 'Jane Smith', title: 'Senior Developer Needed', category: 'Technology', status: 'Published', date: '2024-03-02' },
  { id: 202, userId: 1, userName: 'John Doe', title: 'Logo Design Project', category: 'Design', status: 'Pending', date: '2024-03-04' },
  { id: 203, userId: 4, userName: 'Bob Wilson', title: 'Marketing Campaign Manager', category: 'Marketing', status: 'Published', date: '2024-03-05' },
];

const mockCategories: Category[] = [
  { id: 1, name: 'Technology', count: 124 },
  { id: 2, name: 'Design', count: 85 },
  { id: 3, name: 'Marketing', count: 67 },
  { id: 4, name: 'Finance', count: 42 },
];

const mockJobTypes: JobType[] = [
  { id: 1, name: 'Full-time', count: 450 },
  { id: 2, name: 'Part-time', count: 210 },
  { id: 3, name: 'Freelance', count: 180 },
  { id: 4, name: 'Internship', count: 95 },
];

const mockReportProblems: ReportProblem[] = [
  { id: 1, userId: 1, userName: 'John Doe', userEmail: 'john@example.com', category: 'Technical', subject: 'Không thể tải ảnh đại diện', description: 'Khi tôi tải ảnh JPG, trang bị chuyển hướng đến màn hình lỗi.', status: 'Open', priority: 'Medium', createdAt: '2024-03-05' },
  { id: 2, userId: 2, userName: 'Jane Smith', userEmail: 'jane@example.com', category: 'Account', subject: 'Liên kết đặt lại mật khẩu không hoạt động', description: 'Tôi đã yêu cầu đặt lại mật khẩu nhưng liên kết dẫn đến trang 404.', status: 'In Progress', priority: 'High', createdAt: '2024-03-04' },
  { id: 3, userId: 4, userName: 'Bob Wilson', userEmail: 'bob@example.com', category: 'Payment', subject: 'Thanh toán không thành công', description: 'Thẻ tín dụng bị từ chối mặc dù có đủ số dư.', status: 'Open', priority: 'Critical', createdAt: '2024-03-06' },
];

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

function actionBtnsHtml(id: number) {
  return `<div class="flex gap-1">
    <button data-action="view" data-id="${id}" class="p-2 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-all" title="Xem chi tiết"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg></button>
    <button data-action="edit" data-id="${id}" class="p-2 hover:bg-purple-500/20 rounded-lg text-purple-400 transition-all" title="Chỉnh sửa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg></button>
    <button data-action="delete" data-id="${id}" class="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all" title="Xóa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
  </div>`;
}

// ─── Component ───────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [users, setUsers] = useState<UserRow[]>(mockUsers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [reports, setReports] = useState<ReportProblem[]>(mockReportProblems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [jobTypes, setJobTypes] = useState<JobType[]>(mockJobTypes);

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
    if (user?.userType !== 'admin') navigate('/');
  }, [user, navigate]);

  // ─── Find item by id across current menu ─────────────────
  const findItem = useCallback((id: number) => {
    switch (selectedMenuRef.current) {
      case 'users': return usersRef.current.find(u => u.id === id);
      case 'orders': return ordersRef.current.find(o => o.id === id);
      case 'posts': return postsRef.current.find(p => p.id === id);
      case 'reports': return reportsRef.current.find(r => r.id === id);
      case 'categories': return categoriesRef.current.find(c => c.id === id);
      case 'jobtypes': return jobTypesRef.current.find(j => j.id === id);
      default: return null;
    }
  }, []);

  // ─── CRUD Handlers ───────────────────────────────────────
  const handleEdit = useCallback((item: any) => { setDialogMode('edit'); setSelectedItem(item); setFormData({ ...item }); setIsDialogOpen(true); }, []);
  const handleView = useCallback((item: any) => { setDialogMode('view'); setSelectedItem(item); setFormData({ ...item }); setIsDialogOpen(true); }, []);
  const handleCreate = useCallback(() => { setDialogMode('create'); setSelectedItem(null); setFormData({}); setIsDialogOpen(true); }, []);
  const handleDeletePrompt = useCallback((id: number) => { setItemToDelete(id); setIsDeleteDialogOpen(true); }, []);

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

  const handleSave = () => {
    const newId = Date.now();
    if (dialogMode === 'create') {
      const newItem = { ...formData, id: newId };
      switch (selectedMenu) {
        case 'users': setUsers(prev => [...prev, newItem]); break;
        case 'orders': setOrders(prev => [...prev, newItem]); break;
        case 'posts': setPosts(prev => [...prev, newItem]); break;
        case 'reports': setReports(prev => [...prev, newItem]); break;
        case 'categories': setCategories(prev => [...prev, newItem]); break;
        case 'jobtypes': setJobTypes(prev => [...prev, newItem]); break;
      }
    } else {
      switch (selectedMenu) {
        case 'users': setUsers(prev => prev.map(u => u.id === selectedItem.id ? { ...u, ...formData } : u)); break;
        case 'orders': setOrders(prev => prev.map(o => o.id === selectedItem.id ? { ...o, ...formData } : o)); break;
        case 'posts': setPosts(prev => prev.map(p => p.id === selectedItem.id ? { ...p, ...formData } : p)); break;
        case 'reports': setReports(prev => prev.map(r => r.id === selectedItem.id ? { ...r, ...formData } : r)); break;
        case 'categories': setCategories(prev => prev.map(c => c.id === selectedItem.id ? { ...c, ...formData } : c)); break;
        case 'jobtypes': setJobTypes(prev => prev.map(j => j.id === selectedItem.id ? { ...j, ...formData } : j)); break;
      }
    }
    setIsDialogOpen(false);
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
          { title: 'Gói', data: 'paymentPlan', render: (d: string) => planBadgeHtml(d) },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
        ];
        data = users;
        break;
      case 'orders':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Khách hàng', data: 'userName' },
          { title: 'Gói', data: 'plan' },
          { title: 'Số tiền', data: 'amount', render: (d: number) => `$${d}` },
          { title: 'Trạng thái', data: 'status', render: (d: string) => statusBadgeHtml(d) },
          { title: 'Ngày', data: 'date' },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
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
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
        ];
        data = categories;
        break;
      case 'jobtypes':
        columns = [
          { title: 'ID', data: 'id' },
          { title: 'Loại công việc', data: 'name' },
          { title: 'Số lượng', data: 'count' },
          { title: 'Hành động', data: 'id', orderable: false, render: (d: number) => actionBtnsHtml(d) },
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
  }, [selectedMenu, users, orders, posts, reports, categories, jobTypes, findItem, handleView, handleEdit, handleDeletePrompt]);

  // ─── Chart Init ──────────────────────────────────────────
  useEffect(() => {
    if (selectedMenu !== 'analytics' || !chartRef.current) return;
    const loadChart = async () => {
      const Chart = (await import('chart.js/auto')).default;
      const existing = Chart.getChart(chartRef.current as HTMLCanvasElement);
      if (existing) existing.destroy();
      new Chart(chartRef.current as HTMLCanvasElement, {
        type: 'line',
        data: {
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [{
            label: 'Doanh thu',
            data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
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
  }, [selectedMenu]);

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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-purple-300 mb-2 block">Họ và tên *</Label>
              <Input value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Email *</Label>
              <Input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={disabled} className={inputCls} />
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Gói đăng ký</Label>
              <Select value={formData.paymentPlan || 'free'} onValueChange={(v: string) => setFormData({ ...formData, paymentPlan: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Loại tài khoản</Label>
              <Select value={formData.userType || 'user'} onValueChange={(v: string) => setFormData({ ...formData, userType: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Người dùng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-purple-300 mb-2 block">Trạng thái</Label>
              <Select value={formData.status || 'active'} onValueChange={(v: string) => setFormData({ ...formData, status: v })} disabled={disabled}>
                <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                </SelectContent>
              </Select>
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
        return null;
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
                  { label: 'Doanh thu', val: '$45,678', icon: DollarSign, trend: '+23%' },
                  { label: 'Người dùng', val: '2,456', icon: Users, trend: '+145' },
                  { label: 'Công việc', val: '1,234', icon: Briefcase, trend: '+12' },
                  { label: 'Premium', val: '423', icon: Crown, trend: '17%' },
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
                    <button className="px-3 py-1 bg-purple-500/20 rounded-lg text-xs text-purple-300">7 ngày</button>
                    <button className="px-3 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-400">30 ngày</button>
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
              ID: {selectedItem?.id || 'MỚI'}
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