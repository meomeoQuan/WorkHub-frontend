# Employer Profile - Button Visibility Testing Guide

## 🎯 Testing Button Visibility on Employer Profile Page

This guide helps you test the role-based button visibility on the **Employer Profile** page (`/profile/employer`).

---

## 📍 Buttons to Test

### **Header Section Buttons**
Located in the profile card header:
1. ✏️ **Edit Profile** (orange)
2. 📋 **View Applications** (outlined, orange hover)
3. 💼 **Post a Job** (outlined, green hover)

### **Posted Jobs Section Button**
Located above the job listings:
4. ➕ **Post New Job** (green)

---

## 🧪 Test Scenarios

### **Scenario 1: Anonymous User (Not Logged In)**

**Steps:**
1. Log out (if logged in)
2. Navigate to: `http://localhost:5173/profile/employer`

**Expected Result:**
- ❌ "Edit Profile" button - **HIDDEN**
- ❌ "View Applications" button - **HIDDEN**
- ❌ "Post a Job" button - **HIDDEN**
- ❌ "Post New Job" button - **HIDDEN**

**What You Should See:**
- Only the company information is visible
- No action buttons in the header section
- No "Post New Job" button above job listings
- Profile is in "read-only" mode

---

### **Scenario 2: Job Seeker Account**

**Steps:**
1. Login as Job Seeker:
   ```
   Email: jobseeker@gmail.com
   Password: 123
   ```
2. Navigate to: `http://localhost:5173/profile/employer`

**Expected Result:**
- ❌ "Edit Profile" button - **HIDDEN**
- ❌ "View Applications" button - **HIDDEN**
- ❌ "Post a Job" button - **HIDDEN**
- ❌ "Post New Job" button - **HIDDEN**

**What You Should See:**
- Only the company information is visible
- No action buttons appear
- Job seekers can view but cannot edit or manage
- Profile is in "view-only" mode

---

### **Scenario 3: Employer Account** ✅

**Steps:**
1. Login as Employer:
   ```
   Email: employer@gmail.com
   Password: 123
   ```
2. Navigate to: `http://localhost:5173/profile/employer`

**Expected Result:**
- ✅ "Edit Profile" button - **VISIBLE**
- ✅ "View Applications" button - **VISIBLE**
- ✅ "Post a Job" button - **VISIBLE**
- ✅ "Post New Job" button - **VISIBLE**

**What You Should See:**
- All 4 action buttons are visible
- Edit Profile button (orange background)
- View Applications button (outlined)
- Post a Job button (outlined)
- Post New Job button (green background)
- Full management capabilities

---

## ✅ Quick Checklist

Use this checklist to verify all scenarios:

### Anonymous User
- [ ] No Edit Profile button
- [ ] No View Applications button
- [ ] No Post a Job button
- [ ] No Post New Job button

### Job Seeker
- [ ] No Edit Profile button
- [ ] No View Applications button
- [ ] No Post a Job button
- [ ] No Post New Job button

### Employer
- [x] Edit Profile button visible
- [x] View Applications button visible
- [x] Post a Job button visible
- [x] Post New Job button visible

---

## 🎨 Visual Reference

### Anonymous/Job Seeker View:
```
┌─────────────────────────────────────┐
│  [Company Logo]  TechCorp Inc.      │
│                  Technology         │
│                                     │
│  📧 contact@techcorp.com            │
│  📱 +1 (555) 987-6543              │
│  📍 San Francisco, CA               │
│                                     │
│  [NO BUTTONS VISIBLE]               │
└─────────────────────────────────────┘
```

### Employer View:
```
┌─────────────────────────────────────┐
│  [Company Logo]  TechCorp Inc.      │
│                  Technology         │
│                                     │
│  📧 contact@techcorp.com            │
│  📱 +1 (555) 987-6543              │
│  📍 San Francisco, CA               │
│                                     │
│  [Edit Profile] [View Applications] │
│  [Post a Job]                       │
└─────────────────────────────────────┘
```

---

## 🔗 Related Pages

After testing button visibility, you can also test these related features:

1. **Click "View Applications"** (employer only)
   - Should navigate to `/applications`
   - Job seekers/anonymous redirected to `/unauthorized`

2. **Click "Post a Job"** (employer only)
   - Should navigate to `/post-job`
   - Job seekers/anonymous redirected to `/unauthorized`

3. **Click "Edit Profile"** (employer only)
   - Should enable edit mode on the profile page
   - Only visible to employers

---

## 💡 Additional Notes

- **Conditional Rendering**: All buttons use `{user?.userType === 'employer' && (...)}`
- **No Error Messages**: Buttons simply don't render (hidden) instead of showing disabled states
- **Clean UI**: Non-employers see a clean, read-only profile
- **Consistent Behavior**: Same logic applies throughout the platform

---

## 🐛 Common Issues

**Issue**: Buttons still visible after logout
- **Solution**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Buttons not appearing for employer
- **Solution**: Verify you're logged in with `employer@gmail.com`

**Issue**: Changes not reflecting
- **Solution**: Check browser console for errors, clear cache

---

Happy Testing! 🚀
