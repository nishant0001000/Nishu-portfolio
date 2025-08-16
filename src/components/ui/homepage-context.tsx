"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for homepage content
export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    founderText: string;
    resumeButtonText: string;
    resumePdfUrl: string;
    roleText: string;
    roleHighlight: string;
  };
  images: {
    lionImage: string;
    memogiImage: string;
    nishantImage: string;
    mogahaaImage: string;
    nishantLightImage: string;
    mogahaaLightImage: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    canonicalUrl: string;
  };
}

// Default content
const defaultContent: HomepageContent = {
  hero: {
    title: "Welcome to My Portfolio",
    subtitle: "Nishant Mogahaa",
    description: "Your Full Stack Developer, Graphic Designer, AI Developer, UI/UX Designer and ML Engineer",
    founderText: "Founder Of Cybershoora",
    resumeButtonText: "View Resume",
    resumePdfUrl: "/pdfs/Nishant_Mogahaa_CV.pdf",
    roleText: "Your",
    roleHighlight: "Full Stack Developer, Graphic Designer, AI Developer, UI/UX Designer and ML Engineer"
  },
  images: {
    lionImage: "/images/Lion-img.png",
    memogiImage: "/images/memogi2.png",
    nishantImage: "/images/NISHANT.svg",
    mogahaaImage: "/images/MOGAHAA.svg",
    nishantLightImage: "/images/NISHANT-black.svg",
    mogahaaLightImage: "/images/MOGAHAA-black.svg"
  },
  seo: {
    title: "Nishant Mogahaa (NMM) - Full Stack Developer | AI Portfolio | Best Developer in India",
    description: "Nishant Mogahaa (NMM) - Expert Full Stack Developer, AI Engineer, and IT Consultant. Also known as Nishant Moghaa or NMM. Specializing in React, Next.js, Node.js, AI/ML, and modern web technologies. Best developer for hire in India. Cybershoora IT Solutions.",
    keywords: [
      "Nishant Mogahaa",
      "Nishant Mogha",
      "NMM",
      "Full Stack Developer",
      "React Developer",
      "Next.js Developer",
      "AI Engineer",
      "Machine Learning",
      "Web Development",
      "Mobile App Development",
      "IT Consultant",
      "Cybershoora",
      "Best Developer India"
    ],
    author: "Nishant Mogahaa (NMM)",
    ogTitle: "Nishant Mogahaa (NMM) - Full Stack Developer | AI Portfolio | Best Developer in India",
    ogDescription: "Expert Full Stack Developer, AI Engineer, and IT Consultant. Also known as Nishant Moghaa or NMM. Specializing in React, Next.js, Node.js, AI/ML, and modern web technologies. Best developer for hire in India.",
    twitterTitle: "Nishant Mogahaa (NMM) - Full Stack Developer | AI Portfolio",
    twitterDescription: "Expert Full Stack Developer, AI Engineer, and IT Consultant. Also known as Nishant Moghaa or NMM. Best developer for hire in India.",
    canonicalUrl: "https://nishantportfolio.space"
  }
};

interface HomepageContextType {
  content: HomepageContent;
  updateHero: (updates: Partial<HomepageContent['hero']>) => void;
  updateImages: (updates: Partial<HomepageContent['images']>) => void;
  updateSEO: (updates: Partial<HomepageContent['seo']>) => void;
  resetToDefault: () => void;
  saveChanges: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export const useHomepage = () => {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error('useHomepage must be used within a HomepageProvider');
  }
  return context;
};

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [originalContent, setOriginalContent] = useState<HomepageContent>(defaultContent);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load content from database and localStorage on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load from database first
        const response = await fetch('/api/save-homepage');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.content) {
            setContent(result.data.content);
            setOriginalContent(result.data.content);
            localStorage.setItem('homepage-content', JSON.stringify(result.data.content));
            return;
          }
        }
        
        // Fallback to localStorage
        const savedContent = localStorage.getItem('homepage-content');
        if (savedContent) {
          try {
            const parsed = JSON.parse(savedContent);
            setContent(parsed);
            setOriginalContent(parsed);
          } catch (error) {
            console.error('Error loading saved homepage content:', error);
          }
        }
      } catch (error) {
        console.error('Error loading content from database:', error);
        
        // Fallback to localStorage
        const savedContent = localStorage.getItem('homepage-content');
        if (savedContent) {
          try {
            const parsed = JSON.parse(savedContent);
            setContent(parsed);
            setOriginalContent(parsed);
          } catch (error) {
            console.error('Error loading saved homepage content:', error);
          }
        }
      }
    };
    
    loadContent();
  }, []);

  // Check for changes
  useEffect(() => {
    const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);
    setHasUnsavedChanges(hasChanges);
  }, [content, originalContent]);

  const updateHero = (updates: Partial<HomepageContent['hero']>) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, ...updates }
    }));
  };

  const updateImages = (updates: Partial<HomepageContent['images']>) => {
    setContent(prev => ({
      ...prev,
      images: { ...prev.images, ...updates }
    }));
  };

  const updateSEO = (updates: Partial<HomepageContent['seo']>) => {
    setContent(prev => ({
      ...prev,
      seo: { ...prev.seo, ...updates }
    }));
  };

  const resetToDefault = () => {
    setContent(defaultContent);
    setOriginalContent(defaultContent);
    localStorage.removeItem('homepage-content');
  };

  const saveChanges = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('homepage-content', JSON.stringify(content));
      
      // Save to database via API
      const response = await fetch('/api/save-homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to database');
      }
      
      setOriginalContent(content);
      setHasUnsavedChanges(false);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving homepage content:', error);
      return Promise.reject(error);
    }
  };

  const value: HomepageContextType = {
    content,
    updateHero,
    updateImages,
    updateSEO,
    resetToDefault,
    saveChanges,
    hasUnsavedChanges
  };

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  );
}; 