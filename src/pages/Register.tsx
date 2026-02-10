import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Zap, User, Building2, Mail, Lock, Briefcase, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();

  // Candidate state
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [showCandidatePassword, setShowCandidatePassword] = useState(false);

  // Employer state
  const [companyName, setCompanyName] = useState('');
  const [fieldOfWork, setFieldOfWork] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [employerPassword, setEmployerPassword] = useState('');
  const [showEmployerPassword, setShowEmployerPassword] = useState(false);

  const handleCandidateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - redirect to email confirmation with email parameter
    navigate(`/email-confirmation?email=${encodeURIComponent(candidateEmail)}`);
  };

  const handleEmployerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - redirect to email confirmation with email parameter
    navigate(`/email-confirmation?email=${encodeURIComponent(employerEmail)}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="p-8 border-2 border-[#263238]/10 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#4FC3F7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#263238] mb-2">Join WorkHub</h1>
            <p className="text-[#263238]/70">Start earning with flexible jobs today</p>
          </div>

          <Tabs defaultValue="candidate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#263238]/5 p-1 rounded-xl h-12">
              <TabsTrigger 
                value="candidate" 
                className="rounded-lg data-[state=active]:bg-[#FF9800] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <User className="w-4 h-4 mr-2" />
                Job Seeker
              </TabsTrigger>
              <TabsTrigger 
                value="employer"
                className="rounded-lg data-[state=active]:bg-[#FF9800] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Employer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="candidate">
              <form onSubmit={handleCandidateRegister} className="space-y-5">
                <div>
                  <Label htmlFor="candidate-name" className="text-[#263238]">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="candidate-name"
                      placeholder="John Doe"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="candidate-email" className="text-[#263238]">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="candidate-email"
                      type="email"
                      placeholder="your@email.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="candidate-password" className="text-[#263238]">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="candidate-password"
                      type={showCandidatePassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={candidatePassword}
                      onChange={(e) => setCandidatePassword(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40"
                      onClick={() => setShowCandidatePassword(!showCandidatePassword)}
                    >
                      {showCandidatePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30">
                  <Zap className="w-4 h-4 mr-2" />
                  Create Free Account
                </Button>

                <p className="text-xs text-center text-[#263238]/60">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>

            <TabsContent value="employer">
              <form onSubmit={handleEmployerRegister} className="space-y-5">
                <div>
                  <Label htmlFor="company-name" className="text-[#263238]">Company Name</Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="company-name"
                      placeholder="Your Company Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="employer-email" className="text-[#263238]">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="employer-email"
                      type="email"
                      placeholder="company@email.com"
                      value={employerEmail}
                      onChange={(e) => setEmployerEmail(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="employer-password" className="text-[#263238]">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="employer-password"
                      type={showEmployerPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={employerPassword}
                      onChange={(e) => setEmployerPassword(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40"
                      onClick={() => setShowEmployerPassword(!showEmployerPassword)}
                    >
                      {showEmployerPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="field-of-work" className="text-[#263238]">Field of Work</Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#263238]/40" />
                    <Input
                      id="field-of-work"
                      placeholder="e.g., Technology, Retail, Food Service"
                      value={fieldOfWork}
                      onChange={(e) => setFieldOfWork(e.target.value)}
                      className="pl-10 h-12 border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company-description" className="text-[#263238]">Company Description</Label>
                  <Textarea
                    id="company-description"
                    placeholder="Tell us about your company..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={4}
                    className="border-[#263238]/20 rounded-xl focus-visible:ring-[#FF9800] resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30">
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Employer Account
                </Button>

                <p className="text-xs text-center text-[#263238]/60">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center mt-6 text-sm text-[#263238]/70">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF9800] hover:text-[#F57C00]">
              Sign in
            </Link>
          </p>
        </Card>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#263238]/60">
            ⚡ Free forever • Join 10,000+ job seekers
          </p>
        </div>
      </div>
    </div>
  );
}