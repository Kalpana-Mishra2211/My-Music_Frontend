import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music } from 'lucide-react';

const MusicalBackButton = ({ to, onClick, label = "Back" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="group relative flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


            <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:text-white transition-all relative z-10 group-hover:-translate-x-1" />

            <span className="text-sm text-gray-700 group-hover:text-white font-medium relative z-10">
                {label}
            </span>

            <span className="relative z-10 text-base group-hover:opacity-0 transition-opacity">
                🎵
            </span>

            <span className="absolute right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1">
                🎶
            </span>


        </button>
    );
};

export default MusicalBackButton;