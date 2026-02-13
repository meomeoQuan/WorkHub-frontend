import { Link } from 'react-router';
import { Facebook, Twitter, Linkedin, Instagram, Zap, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-[#263238] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#FF9800]/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Mail className="w-4 h-4 text-[#FF9800]" />
              <span className="text-sm">Stay Updated</span>
            </div>
            <h3 className="text-white mb-2 text-2xl">Get the latest jobs in your inbox</h3>
            <p className="text-white/70 mb-6">
              Subscribe to receive new job alerts matching your preferences
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12"
              />
              <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl px-6 h-12 shadow-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white block">WorkHub</span>
                <span className="text-xs text-white/60">Quick Jobs, Fast Cash</span>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-6">
              The fastest way to find part-time, freelance, and seasonal jobs. Join thousands of workers earning on their own terms.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF9800] transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF9800] transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF9800] transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF9800] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-white mb-4 text-sm">For Job Seekers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/jobs" className="text-white/70 hover:text-[#FF9800] transition">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/70 hover:text-[#FF9800] transition">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-white/70 hover:text-[#FF9800] transition">
                  Set Availability
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FF9800] transition">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white mb-4 text-sm">For Employers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/post-job" className="text-white/70 hover:text-[#FF9800] transition">
                  User Posts
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/70 hover:text-[#FF9800] transition">
                  Employer Signup
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/70 hover:text-[#FF9800] transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FF9800] transition">
                  Hire Talent
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4 text-sm">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/help" className="text-white/70 hover:text-[#FF9800] transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white/70 hover:text-[#FF9800] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-white/70 hover:text-[#FF9800] transition">
                  Terms & Policies
                </Link>
              </li>
              <li>
                <Link to="/policy#privacy" className="text-white/70 hover:text-[#FF9800] transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>&copy; 2025 WorkHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF9800] transition">Sitemap</a>
            <a href="#" className="hover:text-[#FF9800] transition">Accessibility</a>
            <a href="#" className="hover:text-[#FF9800] transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}