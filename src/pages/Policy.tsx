import { Link } from "react-router";
import { Shield, AlertTriangle, FileText, Lock, Scale, UserX } from "lucide-react";
import { Card } from "../components/ui/card";

export function Policy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#263238] to-[#1E293B] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Legal & Safety</span>
            </div>
            <h1 className="text-white mb-4 text-4xl md:text-5xl">
              Policies & Guidelines
            </h1>
            <p className="text-xl text-white/80">
              Understanding our terms, privacy practices, and community standards
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-12 bg-[#FAFAFA]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="#terms" className="block group">
                <Card className="p-6 hover:shadow-lg transition h-full border-2 hover:border-[#FF9800]">
                  <FileText className="w-10 h-10 text-[#FF9800] mb-4" />
                  <h3 className="text-[#263238] mb-2">Terms of Service</h3>
                  <p className="text-sm text-[#263238]/70">
                    Our terms and conditions for using WorkHub
                  </p>
                </Card>
              </a>
              <a href="#privacy" className="block group">
                <Card className="p-6 hover:shadow-lg transition h-full border-2 hover:border-[#4FC3F7]">
                  <Lock className="w-10 h-10 text-[#4FC3F7] mb-4" />
                  <h3 className="text-[#263238] mb-2">Privacy Policy</h3>
                  <p className="text-sm text-[#263238]/70">
                    How we collect, use, and protect your data
                  </p>
                </Card>
              </a>
              <a href="#credibility" className="block group">
                <Card className="p-6 hover:shadow-lg transition h-full border-2 hover:border-[#4ADE80]">
                  <Scale className="w-10 h-10 text-[#4ADE80] mb-4" />
                  <h3 className="text-[#263238] mb-2">Credibility System</h3>
                  <p className="text-sm text-[#263238]/70">
                    Understanding our trust and safety measures
                  </p>
                </Card>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Terms of Service */}
            <div id="terms" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-[#FF9800]" />
                <h2 className="text-[#263238]">Terms of Service</h2>
              </div>
              
              <div className="space-y-6 text-[#263238]/80">
                <div>
                  <h3 className="text-[#263238] mb-3">1. Acceptance of Terms</h3>
                  <p className="mb-3">
                    By accessing and using WorkHub, you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to these terms, please do
                    not use our service.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">2. User Accounts</h3>
                  <p className="mb-3">
                    You are responsible for maintaining the confidentiality of your account and
                    password. You agree to accept responsibility for all activities that occur under
                    your account.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must be at least 18 years old to use WorkHub</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must not create multiple accounts</li>
                    <li>You must not share your account credentials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">3. Prohibited Activities</h3>
                  <p className="mb-3">Users are prohibited from:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting false, misleading, or fraudulent job listings</li>
                    <li>Harassing or discriminating against other users</li>
                    <li>Violating any applicable laws or regulations</li>
                    <li>Attempting to manipulate the credibility system</li>
                    <li>Using the platform for spam or commercial solicitation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">4. Content Ownership</h3>
                  <p className="mb-3">
                    You retain ownership of all content you submit to WorkHub. However, by
                    submitting content, you grant us a worldwide, non-exclusive, royalty-free
                    license to use, reproduce, and display your content in connection with the
                    service.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">5. Service Modifications</h3>
                  <p className="mb-3">
                    WorkHub reserves the right to modify or discontinue the service at any time
                    without notice. We are not liable to you or any third party for any
                    modification, suspension, or discontinuation of the service.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div id="privacy" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-[#4FC3F7]" />
                <h2 className="text-[#263238]">Privacy Policy</h2>
              </div>
              
              <div className="space-y-6 text-[#263238]/80">
                <div>
                  <h3 className="text-[#263238] mb-3">1. Information We Collect</h3>
                  <p className="mb-3">We collect information that you provide directly to us:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Account information (name, email, password)</li>
                    <li>Profile information (skills, experience, availability)</li>
                    <li>Job postings and applications</li>
                    <li>Communications with other users</li>
                    <li>Payment information (processed securely by third parties)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">2. How We Use Your Information</h3>
                  <p className="mb-3">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Connect job seekers with employers</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Prevent fraud and maintain platform security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">3. Information Sharing</h3>
                  <p className="mb-3">
                    We do not sell your personal information. We may share your information only in
                    the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With employers when you apply for jobs</li>
                    <li>With service providers who assist our operations</li>
                    <li>To comply with legal obligations</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">4. Data Security</h3>
                  <p className="mb-3">
                    We implement appropriate technical and organizational measures to protect your
                    personal information. However, no internet transmission is completely secure,
                    and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">5. Your Rights</h3>
                  <p className="mb-3">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Object to processing of your information</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">6. Important Notice</h3>
                  <p className="mb-3 text-[#FF9800]">
                    <strong>⚠️ WorkHub is not intended for collecting personally identifiable
                    information (PII) or securing sensitive data.</strong> Please do not share
                    sensitive personal information such as social security numbers, financial
                    account details, or medical information through our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Credibility & Account Suspension Policy */}
            <div id="credibility" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-8 h-8 text-[#4ADE80]" />
                <h2 className="text-[#263238]">Credibility & Account Suspension Policy</h2>
              </div>

              {/* Important Warning Box */}
              <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <UserX className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-red-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Critical Policy: Account Suspension
                    </h3>
                    <p className="text-red-800 mb-3">
                      <strong>If your credibility score drops below 2.0, your account will be
                      automatically suspended.</strong>
                    </p>
                    <p className="text-red-700 text-sm">
                      Suspended accounts cannot post jobs, apply for positions, or interact with
                      other users. To restore your account, you must contact support and
                      demonstrate improved behavior.
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="space-y-6 text-[#263238]/80">
                <div>
                  <h3 className="text-[#263238] mb-3">1. Credibility Score System</h3>
                  <p className="mb-3">
                    WorkHub uses a credibility scoring system (0-5 stars) to maintain trust and
                    quality on the platform. Your credibility score is based on:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ratings from employers or job seekers you've worked with</li>
                    <li>Application completion rate and response time</li>
                    <li>Job posting accuracy and fulfillment</li>
                    <li>Communication quality and professionalism</li>
                    <li>Platform policy compliance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">2. Credibility Thresholds</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-xl flex items-center justify-center">
                        <span className="text-2xl text-white">★</span>
                      </div>
                      <div>
                        <p className="text-[#263238] mb-1">
                          <strong>4.0 - 5.0:</strong> Excellent standing
                        </p>
                        <p className="text-sm">
                          Priority in search results, featured profile status, and premium benefits
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] rounded-xl flex items-center justify-center">
                        <span className="text-2xl text-white">★</span>
                      </div>
                      <div>
                        <p className="text-[#263238] mb-1">
                          <strong>3.0 - 3.9:</strong> Good standing
                        </p>
                        <p className="text-sm">
                          Full platform access with standard features
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#FFC107] to-[#FF9800] rounded-xl flex items-center justify-center">
                        <span className="text-2xl text-white">★</span>
                      </div>
                      <div>
                        <p className="text-[#263238] mb-1">
                          <strong>2.0 - 2.9:</strong> Warning status
                        </p>
                        <p className="text-sm">
                          Account under review, limited visibility in search results
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                        <UserX className="text-2xl text-white" />
                      </div>
                      <div>
                        <p className="text-red-600 mb-1">
                          <strong>Below 2.0:</strong> Account Suspended
                        </p>
                        <p className="text-sm text-red-600">
                          <strong>Immediate suspension</strong> - No access to platform features
                          until resolved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">3. What Happens When Suspended</h3>
                  <p className="mb-3">
                    When your credibility score falls below 2.0, the following restrictions apply
                    immediately:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Cannot apply to new job postings</li>
                    <li>Cannot post new jobs (for employers)</li>
                    <li>Profile hidden from search results</li>
                    <li>Limited access to messaging (existing conversations only)</li>
                    <li>Cannot leave reviews or ratings</li>
                    <li>Banner notification displayed on all pages</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">4. How to Restore Your Account</h3>
                  <p className="mb-3">
                    If your account has been suspended due to low credibility, you can request
                    restoration by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Contacting our support team at support@workhub.com</li>
                    <li>Providing explanation for low ratings</li>
                    <li>Demonstrating steps taken to improve behavior</li>
                    <li>Completing account verification if requested</li>
                    <li>Agreeing to enhanced monitoring during probation period</li>
                  </ul>
                  <p className="mt-3">
                    Account restoration decisions are made on a case-by-case basis and typically
                    take 3-5 business days to process.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">5. Preventing Suspension</h3>
                  <p className="mb-3">To maintain good credibility and avoid suspension:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Complete all accepted jobs or applications</li>
                    <li>Communicate professionally and promptly</li>
                    <li>Provide accurate information in job postings</li>
                    <li>Respond to messages within 24 hours</li>
                    <li>Follow through on commitments</li>
                    <li>Report any disputes or issues immediately</li>
                    <li>Request feedback to understand areas for improvement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">6. Appeals Process</h3>
                  <p className="mb-3">
                    If you believe your credibility score or suspension is unfair, you have the
                    right to appeal. Submit an appeal through your account settings or email
                    appeals@workhub.com with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your account details</li>
                    <li>Detailed explanation of the situation</li>
                    <li>Any supporting evidence or documentation</li>
                    <li>Specific ratings or reviews you wish to dispute</li>
                  </ul>
                  <p className="mt-3">
                    Appeals are reviewed by our Trust & Safety team and decisions are final.
                  </p>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div id="community" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-[#FF9800]" />
                <h2 className="text-[#263238]">Community Guidelines</h2>
              </div>
              
              <div className="space-y-6 text-[#263238]/80">
                <div>
                  <h3 className="text-[#263238] mb-3">Be Respectful</h3>
                  <p>
                    Treat all users with respect and professionalism. Harassment, discrimination,
                    hate speech, or abusive behavior will not be tolerated.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">Be Honest</h3>
                  <p>
                    Provide accurate information in your profile, job postings, and applications.
                    Misrepresentation or fraud will result in immediate suspension.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">Be Professional</h3>
                  <p>
                    Maintain professional communication standards. Use appropriate language and
                    respect boundaries.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#263238] mb-3">Be Responsive</h3>
                  <p>
                    Respond to messages, applications, and inquiries in a timely manner. Good
                    communication is essential for building trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-3xl p-8 text-center">
              <h3 className="text-white mb-3">Questions About Our Policies?</h3>
              <p className="text-white/90 mb-6">
                Our support team is here to help clarify any questions you may have
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="bg-white text-[#263238] hover:bg-white/90 px-6 py-3 rounded-xl transition">
                    Contact Support
                  </button>
                </Link>
                <Link to="/">
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl transition">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-[#263238]/50">
              <p>Last Updated: February 10, 2026</p>
              <p className="mt-2">
                WorkHub reserves the right to update these policies at any time. Users will be
                notified of significant changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
