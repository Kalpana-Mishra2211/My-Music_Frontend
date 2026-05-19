import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../API/auth/auth";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    loading,
    resetPasswordSuccess,
    resetPasswordError,
  } = useSelector((state) => state.auth);


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    const res = await dispatch(
      resetPassword({
        token,
        password,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
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
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Reset Password
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your new password
          </p>
        </div>

        {( resetPasswordSuccess) && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4" />
            {resetPasswordSuccess}
          </div>
        )}

        {resetPasswordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            {resetPasswordError}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            New Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({});
              }}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({});
              }}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-purple-500">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;