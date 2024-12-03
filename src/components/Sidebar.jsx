import { useSearch } from '../contexts/SearchContext'
import { Button } from './ui/button'
import { 
  Heart, 
  Clock, 
  Film, 
  FolderOpen,
  Tags,
  Settings
} from 'lucide-react'
import { useLocalVideos } from '../contexts/LocalVideoContext'

function Sidebar() {
  const { activeSection, setActiveSection } = useSearch()
  const { selectVideoFolder } = useLocalVideos()

  const menuItems = [
    { id: 'all', icon: Film, label: 'All Videos' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'watchlist', icon: Clock, label: 'Watch Later' },
    { id: 'genres', icon: Tags, label: 'Genres' }
  ]

  return (
    <div className="w-64 border-r bg-card p-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        className="w-full justify-start gap-2 mb-4"
        onClick={selectVideoFolder}
      >
        <FolderOpen className="h-4 w-4" />
        Select Folder
      </Button>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
