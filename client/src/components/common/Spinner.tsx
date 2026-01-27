import { Loader2 } from 'lucide-react'

const Spinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-muted-foreground">Loading events...</span>
    </div>
  )
}

export default Spinner