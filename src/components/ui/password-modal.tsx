"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from './admin-context'
import { CustomSlideButton } from './custom-slide-button'
import { Eye, EyeOff } from 'lucide-react'
import Toast from './toast'

const PasswordModal = () => {
  const { isPasswordModalOpen, closePasswordModal, checkPassword } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (checkPassword(password)) {
      setPassword('')
      setError('')
    } else {
      setError('Incorrect password. Try again.')
      setPassword('')
      throw new Error('Incorrect password')
    }
    
    setIsLoading(false)
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    closePasswordModal()
  }

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('/api/forgot-admin-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'rajputvashu429@gmail.com'
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setToast({
          message: 'Password has been sent to your email!',
          type: 'success',
          isVisible: true
        })
      } else {
        setToast({
          message: 'Failed to send password. Please try again.',
          type: 'error',
          isVisible: true
        })
      }
    } catch (error) {
      console.error('Error sending password:', error)
      setToast({
        message: 'Failed to send password. Please try again.',
        type: 'error',
        isVisible: true
      })
    }
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      <AnimatePresence>
        {isPasswordModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
                     <motion.div
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className="relative bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-8 w-full max-w-md mx-4 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]"
             onClick={(e) => e.stopPropagation()}
           >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

                         {/* Header */}
             <div className="mb-6 text-center">
               <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center mx-auto mb-4 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]">
                 <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
               </div>
               <h2 className="mb-2 text-2xl font-bold text-foreground">
                 Admin Access
               </h2>
               <p className="text-muted-foreground">
                 Enter password to access admin panel
               </p>
             </div>

                                         {/* Form */}
                <div className="space-y-4">
                                     <div>
                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-foreground">
                       Password
                     </label>
                     <div className="relative">
                       <input
                         type={showPassword ? "text" : "password"}
                         id="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full px-4 py-3 pr-12 border border-input bg-background text-foreground rounded-[16px] focus:ring-2 focus:ring-ring focus:border-transparent transition-colors placeholder:text-muted-foreground"
                         placeholder="Enter password..."
                         autoFocus
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         {showPassword ? (
                           <EyeOff className="w-4 h-4" />
                         ) : (
                           <Eye className="w-4 h-4" />
                         )}
                       </button>
                     </div>
                   </div>

                                     {error && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-[16px] border border-destructive/20"
                     >
                       {error}
                     </motion.div>
                   )}

                   <div className="flex justify-center">
                     <CustomSlideButton
                       onSubmit={handleSubmit}
                       isSubmitting={isLoading}
                       disabled={!password}
                       className="bg-gradient-to-r from-[#EEBDE0] to-[#D4A5C7] text-black w-full max-w-xs"
                     />
                   </div>

                   {/* Forgot Password Button */}
                   <div className="text-center">
                     <button
                       type="button"
                       onClick={handleForgotPassword}
                       className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                     >
                       Forgot Password?
                     </button>
                   </div>
                </div>

                         {/* Footer */}
             <div className="mt-6 text-center">
               <p className="text-xs text-muted-foreground">
                 Click logo 8 times to access this panel
               </p>
             </div>
                     </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
     </>
   )
 }

export default PasswordModal
