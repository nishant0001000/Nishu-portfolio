'use client';

import React from 'react';

const EmailPreviewPage = () => {
  const handleCopyHTML = () => {
    const htmlContent = document.getElementById('email-template')?.innerHTML;
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent);
      alert('HTML copied to clipboard!');
    }
  };

  const handleDownloadHTML = () => {
    const htmlContent = document.getElementById('email-template')?.outerHTML;
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Email Template Preview
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '0'
          }}>
            Preview and customize your email template
          </p>
        </div>

        {/* Email Preview Container */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Email Template
          </h2>
          
          {/* Email Display Area */}
          <div style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f9fafb'
            }}>
              <div id="email-template">
                <EmailTemplate />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <button 
              style={{
                flex: '1',
                padding: '0.5rem 1rem',
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onClick={handleCopyHTML}
            >
              📋 Copy HTML
            </button>
            <button 
              style={{
                flex: '1',
                padding: '0.5rem 1rem',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onClick={handleDownloadHTML}
            >
              💾 Download HTML
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '0.5rem'
          }}>
            How to use this template:
          </h3>
          <ul style={{
            color: '#1e40af',
            margin: '0',
            paddingLeft: '1.5rem'
          }}>
            <li style={{
              marginBottom: '0.25rem',
              lineHeight: '1.5'
            }}>
              Preview the email template above
            </li>
            <li style={{
              marginBottom: '0.25rem',
              lineHeight: '1.5'
            }}>
              Copy the HTML code to use in your email service
            </li>
            <li style={{
              marginBottom: '0.25rem',
              lineHeight: '1.5'
            }}>
              Download the HTML file for backup
            </li>
            <li style={{
              marginBottom: '0.25rem',
              lineHeight: '1.5'
            }}>
              Customize colors, text, and images as needed
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Email Template Component - Updated with your current email template
const EmailTemplate = () => {
  // Sample data for preview
  const errorDetails = {
    errorType: "API Error",
    status: "429",
    message: "Rate limit exceeded. Please try again later.",
    modelName: "GPT-4"
  };
  const userMessage = "Hello, can you help me with a coding problem?";

  return (
    <div style={{
      margin: 0,
      padding: 0,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
             <div style={{
         maxWidth: '600px',
         width: '100%',
         margin: '0 auto',
         color: '#000000',
         padding: '0 10px',
         boxSizing: 'border-box'
       }}>
        
        {/* Header with Logo */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '30px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #333333',
          borderRadius: '30px 30px 0 0'
        }}>
                     {/* Centered Logo */}
           <div style={{
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             marginBottom: '25px',
             width: '100%'
           }}>
             {/* Logo Image */}
             <img 
               src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754273854/mail_grlmg4.gif" 
               alt="Nishant Mogahaa Logo" 
               style={{
                 width: '60px',
                 height: '60px',
                 borderRadius: '45px',
                 display: 'block',
                 margin: '0 auto'
               }}
             />
           </div>
                     {/* Centered Name and AI Portfolio */}
           <div style={{
             textAlign: 'center',
             marginBottom: '15px',
             width: '100%'
           }}>
                           <h1 style={{
                margin: 0,
                color: '#ffffff',
                fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: '700'
              }}>
                Nishant Mogahaa
              </h1>
             <div style={{
               margin: '1rem 0rem 1rem 0',
               fontSize: '14px',
               color: '#EEBDE0',
               border: '1px solid #EEBDE0',
               borderRadius: '16px',
               padding: '6px 12px',
               display: 'inline-block',
               backgroundColor: 'rgba(238, 189, 224, 0.1)'
             }}>
               AI Portfolio
             </div>
             {/* Image below AI Portfolio */}
             <div style={{
               marginTop: '15px',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%'
             }}>
                               <img 
                  src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754276405/Notification-_remix_3_hhrrcq.gif" 
                  alt="Portfolio Image" 
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
             </div>
           </div>
        </div>

        {/* Status Badge */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '15px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #333333'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            border: '1px solid #333333',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#ffffff',
            gap: '8px'
          }}>
            ⚡ System Alert
          </div>
        </div>

                 {/* Error Alert Section */}
         <div style={{
           backgroundColor: '#1a1a1a',
           margin: '10px',
           padding: '20px',
           borderRadius: '15px',
           border: '1px solid #333333'
         }}>
                     <div style={{
             display: 'flex',
             alignItems: 'center',
             marginBottom: '25px'
           }}>
             <div style={{
               width: '50px',
               height: '50px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: '15px'
             }}>
               <span style={{ fontSize: '24px' }}>⚠️</span>
             </div>
             <div>
               <h2 style={{
                 margin: 0,
                 color: '#ffffff',
                 fontSize: '24px',
                 fontWeight: '600'
               }}>
                 API Error Alert
               </h2>
               <p style={{
                 margin: '5px 0 0 0',
                 color: '#cccccc',
                 fontSize: '14px'
               }}>
                 Immediate attention required
               </p>
             </div>
           </div>

          {/* Error Details */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '1px solid #333333'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#ffffff',
              fontSize: '18px'
            }}>
              ⚠️ Error Details
            </h3>
                         <div style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
               gap: '15px'
             }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#cccccc',
                  fontSize: '14px'
                }}>
                  <strong>Error Type:</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {errorDetails.errorType}
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#cccccc',
                  fontSize: '14px'
                }}>
                  <strong>Status Code:</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>
                  {errorDetails.status}
                </p>
              </div>
              <div style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#cccccc',
                  fontSize: '14px'
                }}>
                  <strong>Error Message:</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #333333'
                }}>
                  {errorDetails.message}
                </p>
              </div>
              <div style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#cccccc',
                  fontSize: '14px'
                }}>
                  <strong>Timestamp:</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '14px'
                }}>
                  {new Date().toISOString()}
                </p>
              </div>
            </div>
          </div>

                     {/* User Context */}
           <div style={{
             backgroundColor: 'rgba(255, 255, 255, 0.05)',
             padding: '20px',
             borderRadius: '10px',
             marginBottom: '25px',
             border: '1px solid #333333'
           }}>
             <h3 style={{
               margin: '0 0 15px 0',
               color: '#ffffff',
               fontSize: '18px'
             }}>
               👤 User Context
             </h3>
             <div style={{
               display: 'grid',
               gap: '15px'
             }}>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.03)',
                 padding: '15px',
                 borderRadius: '8px',
                 border: '1px solid #333333'
               }}>
                 <p style={{
                   margin: '0 0 8px 0',
                   color: '#cccccc',
                   fontSize: '14px'
                 }}>
                   <strong>User Message:</strong>
                 </p>
                 <p style={{
                   margin: 0,
                   color: '#ffffff',
                   fontSize: '14px',
                   backgroundColor: 'rgba(0, 0, 0, 0.3)',
                   padding: '10px',
                   borderRadius: '5px',
                   border: '1px solid #333333'
                 }}>
                   {userMessage}
                 </p>
               </div>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.03)',
                 padding: '15px',
                 borderRadius: '8px',
                 border: '1px solid #333333'
               }}>
                 <p style={{
                   margin: '0 0 8px 0',
                   color: '#cccccc',
                   fontSize: '14px'
                 }}>
                   <strong>Model Requested:</strong>
                 </p>
                 <p style={{
                   margin: 0,
                   color: '#ffffff',
                   fontSize: '16px',
                   fontWeight: '600'
                 }}>
                   {errorDetails.modelName}
                 </p>
               </div>
             </div>
           </div>

                                               {/* Image after User Context */}
             <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               marginBottom: '25px',
               width: '100%'
             }}>
               <a 
                 href="https://instagram.com/nishant_mogahaa/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={{
                   textDecoration: 'none',
                   cursor: 'pointer',
                   display: 'flex',
                   justifyContent: 'center',
                   width: '100%'
                 }}
               >
                 <img 
                   src="https://res.cloudinary.com/dbtymafqf/image/upload/v1754277092/Social-handle_kmu9bw.gif" 
                   alt="Context Image" 
                   style={{
                     width: '100%',
                     maxWidth: '400px',
                     height: 'auto',
                     borderRadius: '12px',
                     transition: 'transform 0.2s ease',
                     cursor: 'pointer',
                     display: 'block',
                     margin: '0 auto'
                   }}
                                       onMouseOver={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                 />
               </a>
             </div>

          {/* Action Required */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '1px solid #333333'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#ffffff',
              fontSize: '18px'
            }}>
              ⚡ Immediate Action Required
            </h3>
            <div style={{
              display: 'grid',
              gap: '10px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px'
                }}>
                  🔑 Check if OpenRouter API key is expired
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px'
                }}>
                  💳 Add more credits to OpenRouter account
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px'
                }}>
                  ⚡ Check API rate limits
                </span>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #333333'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px'
                }}>
                  🔄 Verify model availability
                </span>
              </div>
            </div>
          </div>

          {/* Quick Fix Button */}
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <a 
              href="https://openrouter.ai/settings/credits" 
              style={{
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                border: '2px solid #ffffff'
              }}
            >
              🔧 Fix API Issues Now
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid #333333',
          borderRadius: '0 0 30px 30px'
        }}>
          <p style={{
            margin: '0 0 10px 0',
            color: '#cccccc',
            fontSize: '14px'
          }}>
                         This is an automated alert from Nishant&apos;s Portfolio AI System
          </p>
          <p style={{
            margin: 0,
            color: '#888888',
            fontSize: '12px'
          }}>
            © 2025 Nishant Portfolio AI. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default EmailPreviewPage; 