import React from 'react'

interface ErrorProps {
    title?: string;
    error?: any;
}
const ErrorComponents = ({title, error}: ErrorProps) => {
  return (
    <div className="text-center py-16">
    <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2 text-red-500">{ title ? title : " N/A" }</h3>
    <p className="text-muted-foreground">{error ? error : "No Error"}</p>
  </div>
  )
}

export default ErrorComponents