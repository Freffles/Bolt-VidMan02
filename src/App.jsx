import { useState } from 'react'
import Sidebar from './components/Sidebar'
import VideoGrid from './components/VideoGrid'
import VideoModal from './components/VideoModal'
import { SearchProvider } from './contexts/SearchContext'

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null)

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Popular Movies</h2>
          </div>
          <VideoGrid onVideoSelect={setSelectedVideo} />
          {selectedVideo && (
            <VideoModal 
              video={selectedVideo} 
              onClose={() => setSelectedVideo(null)} 
            />
          )}
        </main>
      </div>
    </SearchProvider>
  )
}

export default App
