import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ className, onClick }: LogoProps) => {
  return (
    <Link 
      to="/" 
      onClick={onClick} 
      className={cn("flex items-center gap-3 group select-none", className)}
    >
      <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-lg transform group-hover:scale-110 transition-transform">
        {/* Using the provided logo URL */}
        <img 
          src="https://sun9-34.userapi.com/s/v1/ig2/ex1iMwk0BwBqv7hkRFakueWt1E0LSL9B0ptCugd7c2Om44o4cPz_6G1E2KEs7sLQhZXDPBzPFdHZSdIx6x3GJbzE.jpg" 
          alt="Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black leading-none tracking-tighter text-white uppercase">
          S.A.D. <span className="text-[#00ff00]">food</span>
        </span>
        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-0.5">
          Delivery Service
        </span>
      </div>
    </Link>
  );
};
