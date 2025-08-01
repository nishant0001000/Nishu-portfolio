"use client";

import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePopupProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const ResumePopup: React.FC<ResumePopupProps> = ({ isOpen, onClose, pdfUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Nishant_Mogahaa_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Skipper UI Style */}
      <div className="relative w-[95vw] h-[95vh] max-w-6xl max-h-[95vh] flex flex-col rounded-[16px] border border-black/10 bg-gradient-to-b from-neutral-900/90 to-stone-800 dark:from-neutral-950/90 dark:to-neutral-800/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Nishant Mogahaa
            </h2>
            <p className="text-sm text-neutral-300 dark:text-zinc-400">
              Resume & Portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-400 to-brand-500 rounded-full hover:from-brand-500 hover:to-brand-600 transition-all duration-300 border border-brand-400/20"
            >
              <Download size={16} />
              Download CV
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white transition-colors duration-300 rounded-full hover:bg-neutral-800/50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
                <p className="text-neutral-300 text-sm">Loading resume...</p>
              </div>
            </div>
          )}
          <div className={cn(
            "w-full h-full rounded-2xl border border-neutral-100/10 dark:border-zinc-700 overflow-hidden",
            isLoading ? "hidden" : "block"
          )}>
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              title="Nishant Mogahaa Resume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePopup; 