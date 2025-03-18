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

/**
 * Sidebar component for navigation
 * Provides links to different sections of the application
 */
function Sidebar() {
  const { activeSection, setActiveSection } = useSearch()
  const { selectVideoFolder } = useLocalVideos()

  const menuItems = [
    { id: 'all', icon: Film, label: 'All Videos', ariaLabel: 'View all videos' },
    { id: 'favorites', icon: Heart, label: 'Favorites', ariaLabel: 'View favorite videos' },
    { id: 'watchlist', icon: Clock, label: 'Watch Later', ariaLabel: 'View watch later list' },
    { id: 'genres', icon: Tags, label: 'Genres', ariaLabel: 'Browse by genres' }
  ]

  return (
    <nav className="w-64 border-r bg-card p-4 flex flex-col gap-2" aria-label="Main navigation">
      <Button
        variant="secondary"
        className="w-full justify-start gap-2 mb-4"
        onClick={selectVideoFolder}
        aria-label="Select video folder"
      >
        <FolderOpen className="h-4 w-4" aria-hidden="true" />
        Select Folder
      </Button>

      <div className="space-y-1" role="list">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button 
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection(item.id)}
              aria-label={item.ariaLabel}
              aria-current={activeSection === item.id ? 'page' : undefined}
              role="listitem"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Button>
          )
        })}
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          aria-label="Open settings"
          disabled
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Settings
        </Button>
      </div>
    </nav>
  )
}

export default Sidebar
