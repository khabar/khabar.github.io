import React from 'react'

const Logo = ({ width=24, height=24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 86.77 86.77"
  >
    <path d="M20.09 30.42l-6.1 3.53v18.87l58.8 33.95V60.85z" fill="#ef8769" />
    <path d="M72.79 0l-58.8 33.95v18.87l6.1 3.53 52.7-30.43z" fill="#f4b691" />
  </svg>
)

export default React.memo(Logo)
