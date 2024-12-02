import { Home, Heart, Clock, Menu } from 'lucide-react'
import { Button } from './ui/button'
import SearchInput from './SearchInput'
import { useSearch } from '../contexts/SearchContext'
import { useState } from 'react'
import { Input } from './ui/input'

function Sidebar() {
  const { 
    selectedGenre, 
    setSelectedGenre, 
    availableGenres,
    addGenre,
    activeSection,
    setActiveSection
  } = useSearch()
  
  const [newGenre, setNewGenre] = useState('')
  const [showAddGenre, setShowAddGenre] = useState(false)

  const handleAddGenre = () => {
    if (newGenre.trim()) {
      addGenre(newGenre.trim())
      setNewGenre('')
      setShowAddGenre(false)
    }
  }

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'watchlist', icon: Clock, label: 'Watchlist' }
  ]

  return (
    <aside className="w-64 bg-card border-r border-border p-4 h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Video Collection</h1>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="mb-6">
        <SearchInput />
      </div>

      <nav className="space-y-2">
        {navigationItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeSection === id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection(id)}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span>{label}</span>
          </Button>
        ))}
      </nav>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Genres</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setShowAddGenre(!showAddGenre)}
          >
            <span className="text-lg">+</span>
          </Button>
        </div>

        {showAddGenre && (
          <div className="mb-2 flex space-x-2">
            <Input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="New genre"
              className="h-8"
            />
            <Button 
              size="sm" 
              className="h-8"
              onClick={handleAddGenre}
            >
              Add
            </Button>
          </div>
        )}

        <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto">
          {Array.from(availableGenres).sort().map((genre) => (
            <Button 
              key={genre} 
              variant={selectedGenre === genre ? "secondary" : "ghost"}
              className="w-full justify-start text-sm h-8"
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
