import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md', maxHeight = 'max-h-[90vh]' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className={`bg-bg-card rounded-[32px] w-full ${maxWidth} ${maxHeight} overflow-hidden border-2 border-border-main shadow-2xl animate-in zoom-in duration-200 flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-card">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default Modal;
