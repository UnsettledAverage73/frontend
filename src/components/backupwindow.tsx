import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  backups: Array<{
    id: string
    timestamp: string
    description: string
  }>
  onViewBackup?: (id: string) => void
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  backups,
  onViewBackup 
}: NotificationPanelProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-80 bg-zinc-950 text-zinc-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Switch className="data-[state=checked]:bg-pink-400" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-64px)]">
        {backups.map((backup) => (
          <div
            key={backup.id}
            className="p-4 border-b border-zinc-800 relative group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Grimblast</span>
                  <span className="text-sm text-zinc-400">
                    {new Date(backup.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mt-1">
                  Your snapshot has been saved.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                    onClick={() => onViewBackup?.(backup.id)}
                  >
                    Directory
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                  >
                    View
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

