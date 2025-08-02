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
  const [iframeError, setIframeError] = useState(false);

  // Reset states when popup opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIframeError(false);
    }
  }, [isOpen]);

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
    <div className="flex fixed inset-0 z-50 justify-center items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/70"
        onClick={onClose}
      />
      
             {/* Modal - Skipper UI Style */}
       <div className="relative w-[95vw] h-[95vh] max-w-6xl max-h-[95vh] flex flex-col rounded-[16px] sm:rounded-[16px] border border-black/20 dark:border-white/10 bg-gradient-to-b from-white to-white dark:from-neutral-950/90 dark:to-neutral-800/90 shadow-2xl">
         {/* Header */}
         <div className="flex flex-col gap-3 justify-between items-start p-4 border-b sm:flex-row sm:items-center sm:p-6 border-black/20 dark:border-white/10 sm:gap-0">
           <div className="flex flex-col gap-1">
             <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl dark:text-white">
               Nishant Mogahaa
             </h2>
             <p className="text-xs sm:text-sm text-black/70 dark:text-zinc-400">
               Resume & Portfolio
             </p>
           </div>
                     <div className="flex gap-2 items-center w-full sm:gap-3 sm:w-auto">
                            <button
                 onClick={handleDownload}
                 className="flex flex-1 gap-2 items-center px-3 py-2 text-xs font-medium text-black rounded-full border backdrop-blur-sm transition-all duration-300 sm:px-4 sm:text-sm dark:text-white bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border-black/20 dark:border-white/20 sm:flex-none"
               >
               <Download size={14} className="sm:w-4 sm:h-4" />
               <span className="hidden sm:inline">Download CV</span>
               <span className="sm:hidden">Download</span>
             </button>
             
                            <button
                 onClick={onClose}
                 className="p-2 rounded-full transition-colors duration-300 text-black/70 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-neutral-800/50"
               >
               <X size={18} className="sm:w-5 sm:h-5" />
             </button>
           </div>
        </div>

                {/* PDF Viewer */}
        <div className="flex-1 p-3 sm:p-6">
                     <div className="overflow-hidden w-full h-full rounded-xl border sm:rounded-2xl border-black/20 dark:border-zinc-700">
                         {/* Mobile: Show Open in Browser button directly */}
                         <div className="flex justify-center items-center h-full sm:hidden">
                           <button
                             onClick={() => window.open(pdfUrl, '_blank')}
                             className="flex gap-2 justify-center items-center px-6 py-3 text-sm font-medium text-black rounded-full border backdrop-blur-sm transition-all duration-300 dark:text-white bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border-black/20 dark:border-white/20"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                             Open in Browser
                           </button>
                         </div>
                         
                         {/* Desktop: Show iframe directly */}
                         <div className="hidden w-full h-full sm:block">
                           {iframeError ? (
                             <div className="flex flex-col justify-center items-center p-6 h-full text-center">
                               <div className="p-4 mb-4 rounded-full bg-black/10 dark:bg-neutral-800/50">
                                 <svg className="w-12 h-12 text-black/70 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                               </div>
                               <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Resume Preview Unavailable</h3>
                               <p className="mb-4 text-sm text-black/70 dark:text-neutral-300">The resume preview couldn&apos;t be loaded. Please open in browser to view.</p>
                               <button
                                 onClick={() => window.open(pdfUrl, '_blank')}
                                 className="flex gap-2 justify-center items-center px-6 py-3 text-sm font-medium text-black rounded-full border backdrop-blur-sm transition-all duration-300 dark:text-white bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border-black/20 dark:border-white/20"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                 </svg>
                                 Open in Browser
                               </button>
                             </div>
                           ) : (
                             <iframe
                               src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitV&page=1`}
                               className="w-full h-full bg-white border-0 dark:bg-neutral-900"
                               onError={() => setIframeError(true)}
                               title="Nishant Mogahaa Resume"
                               allowFullScreen
                             />
                           )}
                         </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePopup; 