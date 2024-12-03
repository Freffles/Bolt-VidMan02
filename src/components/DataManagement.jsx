import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Upload, Download, RefreshCw } from 'lucide-react'
import { exportUserData, importUserData } from '../lib/storage'
import { useSearch } from '../contexts/SearchContext'

export default function DataManagement() {
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)
  const { refreshData } = useSearch()

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const success = await importUserData(file)
      if (success) {
        refreshData() // Refresh context data after import
      } else {
        alert('Failed to import data. Please check the file format.')
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('An error occurred while importing data.')
    } finally {
      setImporting(false)
      event.target.value = '' // Reset file input
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
      >
        {importing ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        Import
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportUserData}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )
}
