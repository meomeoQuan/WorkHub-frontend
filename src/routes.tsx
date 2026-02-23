import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import JobFilter from './pages/JobFilter';
import { JobDetail } from './pages/JobDetail';
import { UserProfile } from './pages/UserProfile';
import { PostJob } from './pages/PostJob';
import { UserPosts } from './pages/UserPosts';
import { UserJobs } from './pages/UserJobs';
import { Schedule } from './pages/Schedule';
import { Applications } from './pages/Applications';
import { MyApplications } from './pages/MyApplications';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { ApplyJob } from './pages/ApplyJob';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { EmailConfirmation } from './pages/EmailConfirmation';
import { ResendEmailConfirmation } from './pages/ResendEmailConfirmation';
import { Unauthorized } from './pages/Unauthorized';
import { Pricing } from './pages/Pricing';
import { PaymentResult } from './pages/PaymentResult';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUserProfile } from './pages/AdminUserProfile';
import { Policy } from './pages/Policy';
import { Help } from './pages/Help';
import { RootLayout } from './components/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'jobs',
        children: [
          {
            index: true,
            element: <JobFilter />,
          },
          {
            path: ':id',
            element: <JobDetail />,
          },
          {
            path: ':id/apply',
            element: <ApplyJob />,
          },
        ],
      },
      {
        path: 'job/:id',
        element: <JobDetail />,
      },
      {
        path: 'job/:id/apply',
        element: <ApplyJob />,
      },
      {
        path: 'profile/user',
        element: <UserProfile />,
      },
      {
        path: 'profile/:userId',
        element: <UserProfile />,
      },
      {
        path: 'profile/candidate',
        element: <Navigate to="/profile/user" replace />,
      },
      {
        path: 'profile/employer',
        element: <Navigate to="/profile/user" replace />,
      },
      {
        path: 'post-job',
        children: [
          {
            index: true,
            element: <UserPosts />,
          },
          {
            path: 'create',
            element: <PostJob />,
          },
        ],
      },
      {
        path: 'user-jobs',
        element: <UserJobs />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'payment/success',
        element: <PaymentResult />,
      },
      {
        path: 'payment/cancel',
        element: <PaymentResult />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'my-applications',
        element: <MyApplications />,
      },
      {
        path: 'application/:id',
        element: <ApplicationDetail />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'email-confirmation',
        element: <EmailConfirmation />,
      },
      {
        path: 'resend-confirmation',
        element: <ResendEmailConfirmation />,
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'admin/user-profile',
        element: <AdminUserProfile />,
      },
      {
        path: 'policy',
        element: <Policy />,
      },
      {
        path: 'help',
        element: <Help />,
      },
    ],
  },
]);