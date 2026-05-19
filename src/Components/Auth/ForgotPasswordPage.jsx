import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Send,
} from "lucide-react";

import {
  forgotPassword
} from "../../API/auth/auth";

const ForgotPasswordPage = () => {

  const dispatch = useDispatch();

  const {
    loading,
    forgotPasswordSuccess,
    forgotPasswordError
  } = useSelector(
    (state) => state.auth
  );


  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async () => {
    if (!validateForm()) return;
    await dispatch(
      forgotPassword({ email })
    );
  };



  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Forgot Password
          </h2>
          <p className="text-gray-500 mt-2">
           Enter your email to receive reset link
          </p>
        </div>

        {forgotPasswordSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4" />
            {forgotPasswordSuccess}
          </div>
        )}

        {forgotPasswordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            {forgotPasswordError}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email
                  ? "text-red-400"
                  : "text-gray-400"
                }`}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({
                    ...errors,
                    email: "",
                  });
                }
              }}

              onKeyDown={handleKeyPress}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                  ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                  : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                }`}
            />
          </div>


          {errors.email && (
            <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >

          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />

              <span>Send Reset Link</span>
            </>
          )}
        </button>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;