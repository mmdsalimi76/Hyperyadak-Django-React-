import React from 'react'

function Button({ 
  children, 
  type = 'button', 
  onClick, 
  isLoading = false, 
  fullWidth = false,
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button