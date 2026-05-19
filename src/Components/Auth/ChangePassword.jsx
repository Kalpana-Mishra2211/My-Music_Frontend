import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Eye, EyeOff, X, Save } from "lucide-react";
import { changePassword, clearChangeMessage, logout } from "../../API/auth/auth";
import { useNavigate } from "react-router-dom";

function ChangePassword({ isOpen, onClose }) {
    const dispatch = useDispatch();

    const { loading, changePasswordSuccess, changePasswordError } =
        useSelector((state) => state.auth);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});


    useEffect(() => {
        dispatch(clearChangeMessage());

    }, [])

    const validate = () => {
        const newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 4) {
            newErrors.newPassword = "Password must be at least 4 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await dispatch(
                changePassword({
                    currentPassword,
                    newPassword,
                })
            ).unwrap();

            dispatch(logout());
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");
        } catch (err) {
            console.log("Password change failed:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <X />
                </button>
                <h2 className="text-xl font-bold text-center mb-5">
                    🔐 Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

                        <input
                            type={show ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border p-3 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.currentPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.currentPassword}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

                        <input
                            type={show ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border p-3 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.newPassword}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

                        <input
                            type={show ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border p-3 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Updating..." : "Change Password"}
                    </button>

                    {changePasswordSuccess && (
                        <p className="text-green-600 text-sm text-center">
                            {changePasswordSuccess}
                        </p>
                    )}

                    {changePasswordError && (
                        <p className="text-red-600 text-sm text-center">
                            {changePasswordError}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;