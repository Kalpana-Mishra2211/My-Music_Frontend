import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  Music,
  User,
  ArrowRight,
  Home,
  RefreshCw,
  Bell,
  Calendar,
  MessageCircle,
} from "lucide-react";

const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Get email from location state or user context
  const email = location.state?.email || user?.email || "";
  const role = location.state?.role || user?.role || "artist";

  // Calculate estimated approval time (1-2 business days from now)
  useEffect(() => {
    const calculateEstimatedTime = () => {
      const now = new Date();
      let businessDays = 0;
      let estimatedDate = new Date(now);
      
      // Add 1-2 business days
      while (businessDays < 2) {
        estimatedDate.setDate(estimatedDate.getDate() + 1);
        const dayOfWeek = estimatedDate.getDay();
        // Skip Saturday (6) and Sunday (0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        }
      }
      
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return estimatedDate.toLocaleDateString('en-US', options);
    };
    
    setTimeRemaining(calculateEstimatedTime());
  }, []);

  // Update time remaining every minute
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const timeLeft = endOfDay - now;
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage("");
    
    try {
      // Simulate API call to resend verification email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResendMessage("Verification email has been resent successfully!");
      setTimeout(() => setResendMessage(""), 5000);
    } catch (error) {
      setResendMessage("Failed to resend email. Please try again.");
      setTimeout(() => setResendMessage(""), 5000);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = () => {
    // Navigate to status check page or refresh
    window.location.reload();
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@musicapp.com?subject=Artist%20Approval%20Status";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MusicApp
              </span>
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Status Banner */}
          <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-yellow-800 font-semibold">Pending Admin Approval</h3>
                <p className="text-yellow-600 text-sm">
                  Your account is under review by our admin team
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-4 animate-pulse">
                <Clock className="w-12 h-12 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {role === "artist" 
                  ? "Artist Application Submitted!" 
                  : "Account Created Successfully!"}
              </h1>
              <p className="text-gray-500">
                {role === "artist"
                  ? "Your application is being reviewed by our admin team"
                  : "Please verify your email to get started"}
              </p>
            </div>

            {/* Status Information */}
            <div className="space-y-6">
              {/* Email Confirmation */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Confirmation Email Sent
                    </h4>
                    <p className="text-blue-600 text-sm">
                      We've sent a confirmation email to {" "}
                      <span className="font-mono font-semibold">{email}</span>
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      Please check your inbox and click the verification link to confirm your email address.
                    </p>
                    {!resendMessage && (
                      <button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            Resend verification email
                          </>
                        )}
                      </button>
                    )}
                    {resendMessage && (
                      <p className={`mt-2 text-sm ${resendMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {resendMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Artist Specific Information */}
              {role === "artist" && (
                <>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-1">
                          What happens next?
                        </h4>
                        <div className="space-y-3 text-purple-700 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>Our admin team will review your artist profile</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>You'll receive an email notification once approved</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>After approval, you can log in and start uploading music</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <h4 className="font-semibold text-gray-700">Estimated Timeline</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Application submitted</span>
                        <span className="text-green-600 text-sm font-semibold">✓ Complete</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full w-1/3"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Admin review</span>
                        <span className="text-yellow-600 text-sm font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          In progress
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Approval & access granted</span>
                        <span className="text-gray-400 text-sm">Estimated: {timeRemaining}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tips Section */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      While you wait
                    </h4>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• Check your email (including spam folder) for updates</li>
                      <li>• Prepare your music content for upload</li>
                      <li>• Fill out your artist profile completely for faster approval</li>
                      <li>• Follow us on social media for updates and tips</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleCheckStatus}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Check Status
              </button>
              
              <button
                onClick={handleContactSupport}
                className="w-full border-2 border-purple-500 text-purple-500 hover:bg-purple-50 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </button>
              
              <Link
                to="/"
                className="block w-full text-center text-gray-500 hover:text-gray-600 font-medium py-2 px-4 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-center text-gray-600 font-semibold mb-3">
                Frequently Asked Questions
              </h4>
              <div className="space-y-3 text-sm">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-gray-600 hover:text-purple-600">
                    How long does the approval process take?
                    <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-500 pl-4">
                    The approval process typically takes 1-2 business days. We'll notify you via email once your account is approved.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-gray-600 hover:text-purple-600">
                    Can I speed up the approval process?
                    <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-500 pl-4">
                    Ensure your artist profile is complete with accurate information and high-quality content. This helps our team process your application faster.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-gray-600 hover:text-purple-600">
                    What if I haven't received the verification email?
                    <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-500 pl-4">
                    Please check your spam folder. If you still can't find it, click the "Resend verification email" button above or contact our support team.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Trusted by 10,000+ artists worldwide</p>
          <div className="flex justify-center gap-4 text-gray-400">
            <span className="text-xs">✓ Fast approval</span>
            <span className="text-xs">✓ Dedicated support</span>
            <span className="text-xs">✓ Global distribution</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;