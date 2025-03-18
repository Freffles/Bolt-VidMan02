import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Upload, Download, RefreshCw } from 'lucide-react'
import { exportUserData, importUserData } from '../lib/storage'
import { useSearch } from '../contexts/SearchContext'

/**
 * DataManagement component for importing and exporting user data
 * Provides buttons for data management operations
 */
export default function DataManagement() {
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)
  const fileInputRef = useRef(null)
  const { refreshData } = useSearch()

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportError(null)
    try {
      const success = await importUserData(file)
      if (success) {
        refreshData() // Refresh context data after import
      } else {
        setImportError('Failed to import data. Please check the file format.')
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportError('An error occurred while importing data.')
    } finally {
      setImporting(false)
      event.target.value = '' // Reset file input
    }
  }

  return (
    <div className="flex gap-2" role="group" aria-label="Data management controls">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
        id="import-data-input"
        aria-label="Import data file"
      />
      
      {importError && (
        <div className="sr-only" role="alert" aria-live="assertive">
          {importError}
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        aria-label="Import user data"
        aria-controls="import-data-input"
      >
        {importing ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
        )}
        Import
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportUserData}
        aria-label="Export user data"
      >
        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
        Export
      </Button>
    </div>
  )
}
