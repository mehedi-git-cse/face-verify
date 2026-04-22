import { useState, useEffect } from 'react';
import {
  Shield,
  Upload,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Fingerprint,
  Sparkles,
  Zap,
  ScanFace,
  Moon,
  Sun,
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import WebcamCapture from './components/WebcamCapture';
import ResultDisplay from './components/ResultCard';
import { getToken, verifyFace, dataUrlToFile, hasToken } from './services/api';

function App() {
  const [inputMode, setInputMode] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('fv-theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('fv-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    async function authenticate() {
      try {
        await getToken();
        setIsAuthenticating(false);
      } catch (err) {
        setAuthError('Failed to authenticate. Please check if the API server is running.');
        setIsAuthenticating(false);
      }
    }
    authenticate();
  }, []);

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setResult(null);
    setError(null);
  };

  const handleWebcamCapture = (dataUrl) => {
    if (dataUrl) {
      const file = dataUrlToFile(dataUrl);
      setSelectedImage(file);
      setImagePreview(dataUrl);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!selectedImage) {
      setError('Please select or capture an image first.');
      return;
    }

    if (!hasToken()) {
      setError('Not authenticated. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verificationResult = await verifyFace(selectedImage);
      setResult(verificationResult);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  if (isAuthenticating) {
    return (
      <div className={`min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-light opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/50 dark:bg-violet-900/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/45 dark:bg-purple-900/35 rounded-full blur-[120px]" />
        
        <div className="relative text-center animate-fade-in-scale">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-violet-500/25 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 mx-auto bg-violet-600 rounded-2xl flex items-center justify-center rotate-3 shadow-glow-violet">
              <Fingerprint className="w-10 h-10 text-white" />
            </div>
          </div>
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold">Authenticating</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className={`min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="absolute inset-0 bg-grid-light opacity-70" />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-rose-200/50 dark:bg-rose-900/30 rounded-full blur-[100px]" />
        
        <div className="relative glass-light rounded-3xl p-10 max-w-md text-center shadow-professional animate-fade-in-scale">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Connection Failed</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-violet-600 text-white rounded-xl font-semibold 
                       hover:bg-violet-500 transition-all duration-300 flex items-center gap-2.5 mx-auto
                       shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const uploadBtnClass = inputMode === 'upload'
    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-b-2 border-violet-500'
    : 'text-slate-500 dark:text-slate-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/20';

  const webcamBtnClass = inputMode === 'webcam'
    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-b-2 border-violet-500'
    : 'text-slate-500 dark:text-slate-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/20';

  const verifyBtnClass = !selectedImage || isLoading
    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
    : 'bg-violet-600 text-white hover:bg-violet-500 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]';

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-900 relative transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-light opacity-70 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/40 dark:bg-violet-900/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/35 dark:bg-purple-900/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/30 dark:bg-indigo-900/20 rounded-full blur-[200px] pointer-events-none" />
      
      <header className="relative glass-light border-b border-violet-100/60 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-violet-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-2.5 bg-violet-600 rounded-xl shadow-lg">
                <ScanFace className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Face Verify
                <Sparkles className="w-4 h-4 text-violet-400" />
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Face Verification Systems</p>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700/50 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold">Connected</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                           hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-200 dark:hover:border-violet-700
                           transition-all duration-300 text-slate-600 dark:text-slate-300"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero text */}
            <div className="text-center mb-8 animate-fade-in-down">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Verify Your <span className="text-violet-600 dark:text-violet-400 font-extrabold">Identity</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Upload a photo or capture one using your webcam for instant AI-powered face verification
              </p>
            </div>
            
            <div className="glass-light rounded-3xl shadow-professional overflow-hidden animate-fade-in-scale">
              {/* Tab buttons */}
              <div className="flex border-b border-violet-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    setInputMode('upload');
                    handleReset();
                  }}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 ${uploadBtnClass}`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </button>
                <button
                  onClick={() => {
                    setInputMode('webcam');
                    handleReset();
                  }}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 ${webcamBtnClass}`}
                >
                  <Camera className="w-5 h-5" />
                  Use Webcam
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {inputMode === 'upload' ? (
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    disabled={isLoading}
                  />
                ) : (
                  <WebcamCapture
                    onImageCapture={handleWebcamCapture}
                    disabled={isLoading}
                  />
                )}

                {error && (
                  <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={!selectedImage || isLoading}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all duration-300 ${verifyBtnClass}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Face...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Verify Face
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in-up delay-200">
              {[  
                { icon: ScanFace, label: 'Face Detection', desc: '13 checks' },
                { icon: Zap, label: 'Instant Results', desc: 'Real-time' },
                { icon: Shield, label: 'Secure', desc: 'Encrypted' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-violet-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-200">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 text-sm font-semibold">{label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-scale">
            <button
              onClick={handleReset}
              className="group flex items-center gap-2.5 px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300
                         bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl border border-slate-200 dark:border-slate-700
                         hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Verify Another Image
            </button>

            <ResultDisplay result={result} imagePreview={imagePreview} />
          </div>
        )}
      </main>

      <footer className="relative py-8 text-center border-t border-violet-100/60 dark:border-slate-700/60">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Face Verification System</p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Powered by Atik • Secure & Private</p>
      </footer>
    </div>
  );
}

export default App;
