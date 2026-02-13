-- WorkHub Database Schema
-- Part-time, Freelance, and Seasonal Job Platform
-- Updated: February 10, 2026

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'jobseeker', -- 'jobseeker', 'employer', 'admin'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  credibility_rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- ============================================
-- JOB SEEKER PROFILES
-- ============================================

CREATE TABLE jobseeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  location VARCHAR(255),
  education TEXT,
  experience TEXT,
  skills TEXT[], -- Array of skills
  hourly_rate DECIMAL(10,2),
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'busy', 'unavailable'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- ============================================
-- EMPLOYER PROFILES
-- ============================================

CREATE TABLE employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  company_description TEXT,
  company_website VARCHAR(255),
  company_logo_url TEXT,
  industry VARCHAR(100),
  company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
  location VARCHAR(255),
  founded_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- ============================================
-- JOBS
-- ============================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100), -- 'hospitality', 'retail', 'tutoring', 'events', etc.
  job_type VARCHAR(50), -- 'part-time', 'freelance', 'seasonal', 'contract'
  location VARCHAR(255),
  location_type VARCHAR(50), -- 'on-site', 'remote', 'hybrid'
  salary_type VARCHAR(50), -- 'hourly', 'fixed', 'per-project'
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  requirements TEXT,
  responsibilities TEXT,
  benefits TEXT,
  start_date DATE,
  end_date DATE,
  hours_per_week INTEGER,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'closed', 'draft'
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- ============================================
-- JOB APPLICATIONS
-- ============================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  jobseeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'
  cover_letter TEXT,
  resume_url TEXT,
  additional_documents TEXT[], -- Array of document URLs
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_date TIMESTAMP,
  status_changed_date TIMESTAMP,
  notes TEXT, -- Internal notes from employer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, jobseeker_id)
);

-- ============================================
-- EMAIL NOTIFICATIONS (NEW FEATURE)
-- ============================================

CREATE TABLE email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[], -- Array of attachment URLs
  email_type VARCHAR(50) DEFAULT 'notification', -- 'notification', 'application_update', 'policy_update', 'announcement'
  status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'failed', 'pending'
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AVAILABILITY SCHEDULE
-- ============================================

CREATE TABLE availability_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ... 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RATINGS & REVIEWS
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_type VARCHAR(50), -- 'employer_to_jobseeker', 'jobseeker_to_employer'
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reviewer_id, reviewee_id, job_id)
);

-- ============================================
-- COMMENTS & REPLIES
-- ============================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For replies
  comment_text TEXT NOT NULL,
  image_url TEXT, -- Optional image attachment
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LIKES SYSTEM
-- ============================================

CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- PAYMENT PLANS
-- ============================================

CREATE TABLE payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  billing_period VARCHAR(50), -- 'monthly', 'yearly', 'one-time'
  features TEXT[], -- Array of features
  job_posts_limit INTEGER, -- Number of job posts allowed
  featured_posts_limit INTEGER, -- Number of featured posts allowed
  support_level VARCHAR(50), -- 'basic', 'priority', 'premium'
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER SUBSCRIPTIONS
-- ============================================

CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES payment_plans(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR(50), -- 'credit_card', 'paypal', 'stripe', etc.
  transaction_id VARCHAR(255),
  amount_paid DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENT TRANSACTIONS
-- ============================================

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50), -- 'subscription', 'job_post', 'featured_upgrade', 'refund'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50), -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50), -- 'stripe', 'paypal', etc.
  gateway_transaction_id VARCHAR(255),
  description TEXT,
  metadata JSONB, -- Additional transaction data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMIN AUDIT LOG
-- ============================================

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'user_updated', 'user_deleted', 'credibility_changed', etc.
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  details JSONB, -- Additional action details
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(100), -- 'application_received', 'status_changed', 'new_message', etc.
  title VARCHAR(255),
  message TEXT,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SAVED JOBS
-- ============================================

CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Jobs
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_featured ON jobs(featured);

-- Applications
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_jobseeker_id ON applications(jobseeker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_date ON applications(applied_date);

-- Email Notifications
CREATE INDEX idx_email_notifications_sender_id ON email_notifications(sender_id);
CREATE INDEX idx_email_notifications_recipient_id ON email_notifications(recipient_id);
CREATE INDEX idx_email_notifications_application_id ON email_notifications(application_id);
CREATE INDEX idx_email_notifications_sent_at ON email_notifications(sent_at);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);

-- Reviews
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_job_id ON reviews(job_id);

-- Comments
CREATE INDEX idx_comments_job_id ON comments(job_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Subscriptions
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Transactions
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- ============================================
-- SEED DATA (Test Accounts)
-- ============================================

-- Note: Password hash for '123' (use proper bcrypt in production)
-- This is just a placeholder - implement proper password hashing

INSERT INTO users (email, password_hash, role, first_name, last_name, is_email_verified, credibility_rating) VALUES
('jobseeker@gmail.com', '$2a$10$placeholder_hash_for_123', 'jobseeker', 'Sarah', 'Johnson', true, 4.50),
('employer@gmail.com', '$2a$10$placeholder_hash_for_123', 'employer', 'Michael', 'Chen', true, 4.80),
('admin@gmail.com', '$2a$10$placeholder_hash_for_123', 'admin', 'Admin', 'User', true, 5.00);

-- ============================================
-- SAMPLE PAYMENT PLANS
-- ============================================

INSERT INTO payment_plans (name, display_name, description, price, billing_period, features, job_posts_limit, featured_posts_limit, support_level, sort_order) VALUES
('free', 'Free', 'Perfect for getting started', 0.00, 'monthly', ARRAY['Post up to 3 jobs', 'Basic support', 'Standard visibility'], 3, 0, 'basic', 1),
('starter', 'Starter', 'Great for small businesses', 29.99, 'monthly', ARRAY['Post up to 10 jobs', 'Email support', '1 featured post', 'Priority in search results'], 10, 1, 'basic', 2),
('professional', 'Professional', 'For growing teams', 79.99, 'monthly', ARRAY['Post unlimited jobs', 'Priority support', '5 featured posts', 'Advanced analytics', 'Top search placement'], -1, 5, 'priority', 3),
('enterprise', 'Enterprise', 'Custom solution for large organizations', 199.99, 'monthly', ARRAY['Everything in Professional', 'Dedicated account manager', 'Unlimited featured posts', 'Custom branding', 'API access', 'White-label options'], -1, -1, 'premium', 4);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobseeker_profiles_updated_at BEFORE UPDATE ON jobseeker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment comment likes count
CREATE OR REPLACE FUNCTION increment_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_likes_trigger AFTER INSERT ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION increment_comment_likes();

-- Function to decrement comment likes count
CREATE OR REPLACE FUNCTION decrement_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER decrement_likes_trigger AFTER DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_comment_likes();

-- Function to update job applications count
CREATE OR REPLACE FUNCTION update_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_count_trigger 
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_job_applications_count();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active jobs with employer info
CREATE VIEW active_jobs_view AS
SELECT 
  j.*,
  u.email as employer_email,
  ep.company_name,
  ep.company_logo_url,
  ep.company_description,
  ep.industry,
  ep.company_size
FROM jobs j
JOIN users u ON j.employer_id = u.id
JOIN employer_profiles ep ON u.id = ep.user_id
WHERE j.status = 'active';

-- View for user statistics
CREATE VIEW user_statistics AS
SELECT 
  u.id,
  u.email,
  u.role,
  u.credibility_rating,
  COUNT(DISTINCT CASE WHEN u.role = 'employer' THEN j.id END) as total_jobs_posted,
  COUNT(DISTINCT CASE WHEN u.role = 'jobseeker' THEN a.id END) as total_applications,
  COUNT(DISTINCT r.id) as total_reviews,
  AVG(r.rating) as average_rating_received
FROM users u
LEFT JOIN jobs j ON u.id = j.employer_id
LEFT JOIN applications a ON u.id = a.jobseeker_id
LEFT JOIN reviews r ON u.id = r.reviewee_id
GROUP BY u.id, u.email, u.role, u.credibility_rating;

-- View for application details with all related info
CREATE VIEW application_details_view AS
SELECT 
  a.id as application_id,
  a.status,
  a.cover_letter,
  a.applied_date,
  a.reviewed_date,
  j.id as job_id,
  j.title as job_title,
  j.category as job_category,
  j.location as job_location,
  emp.id as employer_id,
  emp.email as employer_email,
  emp_prof.company_name,
  js.id as jobseeker_id,
  js.email as jobseeker_email,
  js.first_name as jobseeker_first_name,
  js.last_name as jobseeker_last_name,
  js_prof.bio as jobseeker_bio,
  js_prof.location as jobseeker_location,
  js_prof.education,
  js_prof.experience,
  js_prof.skills,
  js_prof.resume_url
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users emp ON j.employer_id = emp.id
JOIN employer_profiles emp_prof ON emp.id = emp_prof.user_id
JOIN users js ON a.jobseeker_id = js.id
LEFT JOIN jobseeker_profiles js_prof ON js.id = js_prof.user_id;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all email notifications sent for a specific application
-- SELECT * FROM email_notifications WHERE application_id = 'uuid-here' ORDER BY sent_at DESC;

-- Get user's subscription status
-- SELECT u.email, p.display_name, s.status, s.start_date, s.end_date 
-- FROM user_subscriptions s
-- JOIN users u ON s.user_id = u.id
-- JOIN payment_plans p ON s.plan_id = p.id
-- WHERE u.email = 'employer@gmail.com';

-- Get total revenue from transactions
-- SELECT SUM(amount) as total_revenue FROM payment_transactions WHERE status = 'completed';

-- Get user's credibility rating history from admin audit log
-- SELECT * FROM admin_audit_log 
-- WHERE action = 'credibility_changed' AND target_user_id = 'uuid-here'
-- ORDER BY created_at DESC;
