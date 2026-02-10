import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Paperclip, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Help() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields', {
        style: {
          background: '#263238',
          color: '#ffffff',
          border: '2px solid #FF9800',
          borderRadius: '12px',
          padding: '16px',
        },
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! We\'ll get back to you soon.', {
      style: {
        background: '#4ADE80',
        color: '#ffffff',
        border: '2px solid #22C55E',
        borderRadius: '12px',
        padding: '16px',
      },
    });

    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      email: user?.email || '',
      subject: '',
      message: '',
    });
    setAttachments([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <p className="text-white/90 mt-1">We're here to help! Send us a message and we'll respond shortly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Contact Info */}
          <div className="bg-[#FAFAFA] p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#263238] mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4FC3F7] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#263238]">Email Support</p>
                  <p className="text-sm text-gray-600">support@workhub.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4ADE80] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">?</span>
                </div>
                <div>
                  <p className="font-medium text-[#263238]">Response Time</p>
                  <p className="text-sm text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#263238] mb-2">
                Your Email <span className="text-[#FF9800]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#263238] mb-2">
                Subject <span className="text-[#FF9800]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition-all"
                placeholder="What do you need help with?"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#263238] mb-2">
                Message <span className="text-[#FF9800]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition-all resize-none"
                placeholder="Please describe your issue or question in detail..."
                required
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">
                Attachments <span className="text-gray-500">(Optional)</span>
              </label>
              
              {/* File Upload Button */}
              <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#4FC3F7] hover:bg-[#4FC3F7]/5 cursor-pointer transition-all">
                <Paperclip className="w-5 h-5 text-[#4FC3F7]" />
                <span className="text-sm text-gray-600">Attach files</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                You can attach images, PDFs, or documents (max 10MB per file)
              </p>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 text-[#4FC3F7] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#263238] truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="ml-2 p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-[#4FC3F7]/10 rounded-2xl p-6 border border-[#4FC3F7]/20">
          <h3 className="font-semibold text-[#263238] mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be as specific as possible when describing your issue</li>
            <li>• Include screenshots if they help explain the problem</li>
            <li>• Check your spam folder for our response email</li>
            <li>• For urgent matters, include "URGENT" in the subject line</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
