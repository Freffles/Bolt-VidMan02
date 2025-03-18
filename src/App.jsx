import VideoGrid from './components/VideoGrid'
import { SearchProvider } from './contexts/SearchContext'
import { GenreProvider } from './contexts/GenreContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LocalVideoProvider } from './contexts/LocalVideoContext'
import { Header } from './components/Header'
import UpdateNotification from './components/UpdateNotification'
import Sidebar from './components/Sidebar'
import LocalVideoSection from './components/LocalVideoSection'

function MainContent() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <LocalVideoSection />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">TMDB Movies</h2>
            <VideoGrid />
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <GenreProvider>
          <LocalVideoProvider>
            <MainContent />
            <UpdateNotification />
          </LocalVideoProvider>
        </GenreProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App
