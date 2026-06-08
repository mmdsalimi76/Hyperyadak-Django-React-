import React from 'react'

function Input({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  fullWidth = false,
  className = ''
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    />
  )
}

export default Input