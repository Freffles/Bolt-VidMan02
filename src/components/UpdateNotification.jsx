import { useState, useEffect } from 'react';
import { AlertCircle, Download, RefreshCw, Check } from 'lucide-react';

// Helper to check if we're in Electron environment
const isElectronAvailable = () => {
  return window.api && typeof window.api.onUpdateStatus === 'function';
};

const UpdateNotification = () => {
  const [updateStatus, setUpdateStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Only run in Electron environment
    if (isElectronAvailable()) {
      console.log('Electron environment detected, setting up update listeners');
      
      // Register listener for update events from the main process
      const removeListener = window.api.onUpdateStatus((data) => {
        console.log('Update status:', data);
        setUpdateStatus(data);
        
        // Show notification for certain events
        if (
          data.status === 'Update available.' || 
          data.status === 'Update downloaded' ||
          data.status === 'Error in auto-updater.'
        ) {
          setShowNotification(true);
        }
        
        // Update progress if available
        if (data.status === 'Download progress' && data.data && data.data.progressObj) {
          setProgress(data.data.progressObj.percent || 0);
        }
      });

      // Check for updates when component mounts
      window.api.checkForUpdates();

      // Clean up listener on unmount
      return () => {
        if (removeListener) removeListener();
      };
    } else {
      console.log('Not in Electron environment, update functionality disabled');
    }
  }, []);

  // Hide notification after 5 seconds for non-critical statuses
  useEffect(() => {
    if (
      showNotification && 
      updateStatus && 
      updateStatus.status !== 'Update downloaded' &&
      updateStatus.status !== 'Error in auto-updater.'
    ) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification, updateStatus]);

  const handleInstallUpdate = () => {
    if (isElectronAvailable()) {
      window.api.quitAndInstall();
    }
  };

  const handleDownloadUpdate = () => {
    if (isElectronAvailable()) {
      window.api.downloadUpdate();
    }
  };

  const handleCheckForUpdates = () => {
    if (isElectronAvailable()) {
      setShowNotification(true);
      window.api.checkForUpdates();
    }
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  if (!showNotification || !updateStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ease-in-out">
      <div className="flex items-start">
        {updateStatus.status === 'Error in auto-updater.' ? (
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
        ) : updateStatus.status === 'Update downloaded' ? (
          <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
        ) : (
          <RefreshCw className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
        )}
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {updateStatus.status === 'Update available.' ? 'Update Available' : 
             updateStatus.status === 'Update downloaded' ? 'Update Ready to Install' :
             updateStatus.status === 'Error in auto-updater.' ? 'Update Error' :
             updateStatus.status === 'Download progress' ? 'Downloading Update' :
             updateStatus.status === 'Update not available.' ? 'No Updates Available' :
             'Checking for Updates'}
          </h3>
          
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {updateStatus.status === 'Update available.' ? (
              <p>A new version is available. Would you like to download it now?</p>
            ) : updateStatus.status === 'Update downloaded' ? (
              <p>Update has been downloaded and is ready to install.</p>
            ) : updateStatus.status === 'Error in auto-updater.' ? (
              <p>Error checking for updates: {updateStatus.data?.message || updateStatus.data}</p>
            ) : updateStatus.status === 'Download progress' ? (
              <div>
                <p>Downloading update...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : updateStatus.status === 'Update not available.' ? (
              <p>You're running the latest version.</p>
            ) : (
              <p>Checking for updates...</p>
            )}
          </div>
          
          <div className="mt-3 flex space-x-2">
            {updateStatus.status === 'Update available.' && (
              <button
                onClick={handleDownloadUpdate}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            )}
            
            {updateStatus.status === 'Update downloaded' && (
              <button
                onClick={handleInstallUpdate}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Restart & Install
              </button>
            )}
            
            {(updateStatus.status === 'Error in auto-updater.' || updateStatus.status === 'Update not available.') && (
              <button
                onClick={handleCheckForUpdates}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Check Again
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;