# Testing the Unauthorized Page - Quick Guide

## 🎯 How to Test the Unauthorized Page

There are **3 easy ways** to see the Unauthorized page in action:

---

### **Method 1: Direct URL Access** ⚡ (Fastest)
Simply type this URL in your browser:
```
http://localhost:5173/unauthorized
```

---

### **Method 2: Test Role-Based Access Control** 🔐

We've implemented protection on these pages:

#### **Employer-Only Pages** (Protected)
These pages will redirect to `/unauthorized` if accessed by job seekers or anonymous users:
- **Post Job** - `/post-job`
- **Applications** - `/applications`

#### **Job Seeker-Only Pages** (Protected)  
These pages will redirect to `/unauthorized` if accessed by employers or anonymous users:
- **Schedule** - `/schedule`

#### **Employer Profile Button Visibility** 👁️
On the Employer Profile page (`/profile/employer`), certain buttons are hidden based on user role:

**Hidden from Anonymous Users & Job Seekers:**
- ❌ "Edit Profile" button
- ❌ "View Applications" button  
- ❌ "Post a Job" button (in header)
- ❌ "Post New Job" button (in Posted Jobs section)

**Visible Only to Employers:**
- ✅ All action buttons appear when logged in as employer

---

### **Method 3: Step-by-Step Testing** 📝

#### **Test 1: Anonymous User → Protected Page**
1. Make sure you're logged out
2. Navigate to: `http://localhost:5173/post-job`
3. ✅ Should redirect to Unauthorized page
4. Shows message: "Please log in with the appropriate account"
5. Shows "Login" button

#### **Test 2: Job Seeker → Employer Page**
1. Login as Job Seeker:
   - Email: `jobseeker@gmail.com`
   - Password: `123`
2. Navigate to: `http://localhost:5173/post-job` or `/applications`
3. ✅ Should redirect to Unauthorized page
4. Shows message: "Your current account type (Job Seeker) doesn't have access"

#### **Test 3: Employer → Job Seeker Page**
1. Login as Employer:
   - Email: `employer@gmail.com`
   - Password: `123`
2. Navigate to: `http://localhost:5173/schedule`
3. ✅ Should redirect to Unauthorized page
4. Shows message: "Your current account type (Employer) doesn't have access"

---

## 🎨 Features on the Unauthorized Page

When you see the Unauthorized page, you'll notice:

✅ **Large Shield Icon** - Orange gradient with prohibition symbol  
✅ **Clear Message** - Explains why access is denied  
✅ **Custom SVG Illustration** - Locked padlock with prohibition symbol  
✅ **Contextual Buttons**:
   - "Go Back" - Returns to previous page
   - "Go to Home" - Navigates to homepage
   - "Login" - Only shown to anonymous users  
✅ **Help Section** - Support information  
✅ **Error Code** - Shows "403 - Forbidden"

---

## 🔄 Quick Test Commands

### Login as Job Seeker
```
Email: jobseeker@gmail.com
Password: 123
```

### Login as Employer
```
Email: employer@gmail.com
Password: 123
```

---

## 📋 Protected Pages Summary

| Page | Path | Allowed Role | Blocked Users See |
|------|------|--------------|-------------------|
| Post Job | `/post-job` | Employer Only | Unauthorized Page |
| Applications | `/applications` | Employer Only | Unauthorized Page |
| Schedule | `/schedule` | Job Seeker Only | Unauthorized Page |

---

## 💡 Tips

- The system automatically detects your role based on email
- No need to select a role during login anymore
- Protection is applied using React Router guards
- Redirects happen automatically on page load

---

Happy Testing! 🚀