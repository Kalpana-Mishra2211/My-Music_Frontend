import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../API/auth/auth";
import {
  User,
  Mail,
  Lock,
  Mic,
  UserCircle,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  UserPlus,
  X,
  Music,
  Phone,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { BsSpotify, BsTwitter, BsTwitterX, BsYoutube } from "react-icons/bs";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signupError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [artistProfile, setArtistProfile] = useState({
    stageName: "",
    bio: "",
    genre: [],
    phoneNumber: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      spotify: "",
      twitter: "",
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [artistErrors, setArtistErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const genresList = [
    "Pop", "Rock", "Hip Hop", "R&B", "Electronic", "Jazz", "Classical",
    "Country", "Folk", "Metal", "Punk", "Indie", "Alternative", "Blues",
    "Reggae", "Latin", "K-Pop", "Afrobeat", "Ambient", "Experimental"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (form.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    } else if (form.userName.length > 20) {
      newErrors.userName = "Username must be less than 30 characters";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    } else if (form.email.length > 255) {
      newErrors.email = "Email must be less than 20 characters";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    } else if (form.password.length > 128) {
      newErrors.password = "Password must be less than 20 characters";
    }

    if (form.role && !["user", "artist"].includes(form.role)) {
      newErrors.role = "Invalid role selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateArtistProfile = () => {
    const newErrors = {};
    if (!artistProfile.stageName.trim()) {
      newErrors.stageName = "Stage name is required";
    } else if (artistProfile.stageName.length < 2) {
      newErrors.stageName = "Stage name must be at least 2 characters";
    }

    if (!artistProfile.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (artistProfile.bio.length < 20) {
      newErrors.bio = "Bio must be at least 20 characters";
    } else if (artistProfile.bio.length > 1000) {
      newErrors.bio = "Bio must be less than 1000 characters";
    }

    if (artistProfile.genre.length === 0) {
      newErrors.genre = "Please select at least one genre";
    }

    if (!artistProfile.phoneNumber.trim()) {
      newErrors.phoneNumber = "phoneNumber is required";
    }
    else if (artistProfile.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(artistProfile.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (artistProfile.socialLinks.instagram &&
      !/^@?[\w.-]+$/.test(artistProfile.socialLinks.instagram.replace('@', ''))) {
      newErrors.instagram = "Please enter a valid Instagram username";
    }

    if (artistProfile.socialLinks.youtube &&
      !/^@?[\w.-]+$/.test(artistProfile.socialLinks.youtube.replace('@', ''))) {
      newErrors.youtube = "Please enter a valid YouTube channel name";
    }

    if (artistProfile.socialLinks.twitter &&
      !/^@?[\w]+$/.test(artistProfile.socialLinks.twitter.replace('@', ''))) {
      newErrors.twitter = "Please enter a valid Twitter username";
    }

    setArtistErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleArtistProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setArtistProfile({
        ...artistProfile,
        [parent]: {
          ...artistProfile[parent],
          [child]: value
        }
      });
    } else {
      setArtistProfile({ ...artistProfile, [field]: value });
    }
    if (artistErrors[field]) {
      setArtistErrors({ ...artistErrors, [field]: "" });
    }
  };

  const handleGenreToggle = (genre) => {
    const updatedGenres = artistProfile.genre.includes(genre)
      ? artistProfile.genre.filter(g => g !== genre)
      : [...artistProfile.genre, genre];

    setArtistProfile({ ...artistProfile, genre: updatedGenres });
    if (artistErrors.genre) {
      setArtistErrors({ ...artistErrors, genre: "" });
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleArtistBlur = (field) => {
    setArtistTouched({ ...artistTouched, [field]: true });
  };

  const handleRoleChange = (role) => {
    handleInputChange("role", role);
    if (role === "artist") {
      setShowArtistModal(true);
    }
  };

  const handleArtistSubmit = () => {


    if (validateArtistProfile()) {
      setShowArtistModal(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    if (form.role === "artist") {
      if (!validateArtistProfile()) {
        setShowArtistModal(true);
        return;
      }
    }

    try {
      let registrationPayload;

      if (form.role === "artist") {
        const formData = new FormData();
        formData.append("userName", form.userName);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("role", form.role);
        formData.append("artistProfile[stageName]", artistProfile.stageName);
        formData.append("artistProfile[bio]", artistProfile.bio);
        artistProfile.genre.forEach((g) => {
          formData.append("artistProfile[genre][]", g);
        });
        formData.append("artistProfile[phoneNumber]", artistProfile.phoneNumber);
        formData.append("artistProfile[socialLinks][instagram]", artistProfile.socialLinks.instagram);
        formData.append("artistProfile[socialLinks][youtube]", artistProfile.socialLinks.youtube);
        formData.append("artistProfile[socialLinks][spotify]", artistProfile.socialLinks.spotify);
        formData.append("artistProfile[socialLinks][twitter]", artistProfile.socialLinks.twitter);

        if (profileImage) {
          formData.append("profileImage", profileImage);
        }

        registrationPayload = formData;
      } else {
        registrationPayload = {
          userName: form.userName,
          email: form.email,
          password: form.password,
          role: form.role
        };
      }

      const res = await dispatch(registerUser(registrationPayload));

      if (res.meta.requestStatus === "fulfilled") {
        if (form.role === "artist") {
          setRegistrationData({
            email: form.email,
            role: form.role,
            message: "Your artist registration has been submitted for admin approval. You will receive an email once approved."
          });
          setRegistrationSuccess(true);

          setTimeout(() => {
            navigate("/pending-approval", {
              state: {
                email: form.email,
                role: form.role,
                message: "Your artist account is pending admin approval"
              }
            });
          }, 5000);
        } else {
          setRegistrationData({
            email: form.email,
            role: form.role,
            message: "Account created successfully! Redirecting to login..."
          });
          setRegistrationSuccess(true);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: error.response?.data?.message || "Registration failed. Please try again." });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !registrationSuccess) {
      handleRegister();
    }
  };

  const SuccessModal = () => {
    if (!registrationSuccess) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {form.role === "artist" ? "Registration Submitted!" : "Registration Successful!"}
            </h3>
            <p className="text-gray-600 mb-4">{registrationData?.message}</p>

            {form.role === "artist" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm text-yellow-800">
                  <strong>What's next?</strong><br />
                  1. Our admin team will review your application<br />
                  2. You'll receive an email notification once approved<br />
                  3. You can then login and start uploading your music<br /><br />
                  <strong>Email:</strong> {registrationData?.email}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (form.role === "artist") {
                  navigate("/pending-approval", {
                    state: {
                      email: form.email,
                      role: form.role
                    }
                  });
                } else {
                  navigate("/");
                }
              }}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              {form.role === "artist" ? "Go to Status Page" : "Go to Login"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SuccessModal />

      {!registrationSuccess && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-purple-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-2xl mb-4 shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-500 mt-2">Join our music community</p>
            </div>

            {signupError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {signupError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Username *
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${errors.userName ? "text-red-400" : "text-gray-400"
                    }`} />
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={form.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    onBlur={() => handleBlur("userName")}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.userName
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                      }`}
                  />
                </div>
                {errors.userName && (
                  <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                    <AlertCircle className="w-3 h-3" />
                    {errors.userName}
                  </p>
                )}

              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? "text-red-400" : "text-gray-400"
                    }`} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
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

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? "text-red-400" : "text-gray-400"
                    }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}


              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("user")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${form.role === "user"
                      ? "bg-purple-500 border-purple-500 text-white shadow-md"
                      : "border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">Regular User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("artist")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${form.role === "artist"
                      ? "bg-purple-500 border-purple-500 text-white shadow-md"
                      : "border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span className="font-medium">Artist</span>
                  </button>
                </div>
                {form.role === "artist" && (
                  <p className="text-xs text-gray-500 mt-2">
                    🎵 As an artist, you'll need admin approval before you can start uploading music
                  </p>
                )}
                {form.role === "user" && (
                  <p className="text-xs text-gray-500 mt-2">
                    👤 As a regular user, you can listen to music and create playlists
                  </p>
                )}
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 mt-6">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {showArtistModal && !registrationSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mic className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-800">Complete Artist Profile</h2>
              </div>
              <button
                onClick={() => setShowArtistModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Please provide your artist information. This will be reviewed by our admin team for approval.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-purple-200">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Optional. Recommended size: 500x500px</p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Stage Name *
                </label>
                <input
                  type="text"
                  placeholder="Your artist/stage name"
                  value={artistProfile.stageName}
                  onChange={(e) => handleArtistProfileChange("stageName", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${artistErrors?.stageName
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                    }`}
                />
                {artistErrors?.stageName && (
                  <p className="text-red-500 text-xs mt-1">
                    {artistErrors.stageName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Bio * (Minimum 50 characters)
                </label>
                <textarea
                  placeholder="Tell us about yourself, your music journey, style, influences, etc."
                  value={artistProfile.bio}
                  onChange={(e) => handleArtistProfileChange("bio", e.target.value)}
                  onBlur={() => handleArtistBlur("bio")}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${artistErrors?.stageName
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                    }`}
                />
                <div className="flex justify-between mt-1">
                  {artistErrors?.bio && (
                    <p className="text-red-500 text-xs">{artistErrors.bio}</p>
                  )}
                  <p className={`text-xs ${artistProfile.bio.length >= 50 ? 'text-green-500' : 'text-gray-400'} ml-auto`}>
                    {artistProfile.bio.length}/1000 characters {artistProfile.bio.length < 50 && `(${50 - artistProfile.bio.length} more needed)`}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Genres * (Select at least one)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {genresList.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${artistProfile.genre.includes(genre)
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                        }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {artistErrors?.genre && (
                  <p className="text-red-500 text-xs mt-1">{artistErrors.genre}</p>
                )}
                {artistProfile?.genre?.length > 0 && (
                  <p className="text-green-500 text-xs mt-1">✓ {artistProfile.genre.length} genre(s) selected</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="tel"
                    placeholder="Contact number (for business inquiries)"
                    value={artistProfile.phoneNumber}
                    onChange={(e) => handleArtistProfileChange("phoneNumber", e.target.value)}
                    onBlur={() => handleArtistBlur("phoneNumber")}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>
                {artistErrors?.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{artistErrors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Social Media Links (Optional)
                </label>
                <div>

                  <div className="relative">
                    <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
                    <input
                      type="text"
                      placeholder="Instagram username (e.g., @artistname)"
                      value={artistProfile.socialLinks.instagram}
                      onChange={(e) => handleArtistProfileChange("socialLinks.instagram", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                    {artistErrors?.instagram && (
                      <p className="text-red-500 text-xs mt-1">{artistErrors.instagram}</p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <BsYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                    <input
                      type="text"
                      placeholder="YouTube channel name or URL"
                      value={artistProfile.socialLinks.youtube}
                      onChange={(e) => handleArtistProfileChange("socialLinks.youtube", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {artistErrors?.youtube && (
                    <p className="text-red-500 text-xs mt-1">{artistErrors.youtube}</p>
                  )}
                </div>

                <div>

                  <div className="relative">
                    <BsTwitterX className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="text"
                      placeholder="Twitter/X username (e.g., @artistname)"
                      value={artistProfile.socialLinks.twitter}
                      onChange={(e) => handleArtistProfileChange("socialLinks.twitter", e.target.value)}
                      onBlur={() => handleArtistBlur("twitter")}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {artistErrors?.twitter && (
                    <p className="text-red-500 text-xs mt-1">{artistErrors.twitter}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <BsSpotify className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Spotify artist URL or ID"
                      value={artistProfile.socialLinks.spotify}
                      onChange={(e) => handleArtistProfileChange("socialLinks.spotify", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {artistErrors?.spotify && (
                    <p className="text-red-500 text-xs mt-1">{artistErrors.spotify}</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Important: Your artist profile will be reviewed by our admin team before approval.
                  This process typically takes 1-2 business days. You will receive an email notification once approved.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowArtistModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArtistSubmit}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;