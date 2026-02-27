import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet = ({ isOpen, onClose, children, title }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-t-[2.5rem] shadow-2xl border-t border-gray-800 flex flex-col max-h-[95vh] overflow-hidden safe-bottom"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0" onClick={onClose}>
              <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-2 shrink-0">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 pb-[env(safe-area-inset-bottom,32px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
