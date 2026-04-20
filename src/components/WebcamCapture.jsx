import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Video, VideoOff, RefreshCw, Check } from 'lucide-react';

export default function WebcamCapture({ onImageCapture, disabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    onImageCapture(dataUrl);
    stopCamera();
  }, [onImageCapture, stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    onImageCapture(null);
    startCamera();
  }, [onImageCapture, startCamera]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCamera]);

  useEffect(() => {
    if (facingMode && !capturedImage) {
      startCamera();
    }
  }, [facingMode, capturedImage, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (error) {
    return (
      <div className="w-full p-10 text-center bg-red-500/10 rounded-2xl border border-red-500/20">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <VideoOff className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-300 font-semibold mb-1">Camera Access Required</p>
        <p className="text-red-400/70 text-sm mb-5">{error}</p>
        <button
          onClick={() => {
            setError(null);
            startCamera();
          }}
          className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {!capturedImage ? (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-700/50 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-500 animate-pulse" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Initializing camera...</p>
                </div>
              </div>
            )}

            {/* Camera overlay guide */}
            {isStreaming && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-6 border-2 border-white/20 rounded-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-36 h-36 border-2 border-blue-400/50 rounded-full">
                    <div className="absolute inset-2 border border-blue-400/30 rounded-full" />
                  </div>
                </div>
                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400/50 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400/50 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400/50 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400/50 rounded-br-lg" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={switchCamera}
              disabled={disabled || !isStreaming}
              className={`
                p-3 bg-slate-700/50 text-slate-300 rounded-xl border border-slate-600/50
                hover:bg-slate-600/50 hover:text-white transition-all
                ${(disabled || !isStreaming) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Switch camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={captureImage}
              disabled={disabled || !isStreaming}
              className={`
                px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold
                flex items-center gap-2.5 hover:from-blue-500 hover:to-cyan-500 transition-all
                shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95
                ${(disabled || !isStreaming) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
              `}
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>

            <button
              onClick={stopCamera}
              disabled={disabled || !isStreaming}
              className={`
                p-3 bg-slate-700/50 text-slate-300 rounded-xl border border-slate-600/50
                hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all
                ${(disabled || !isStreaming) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Stop camera"
            >
              <VideoOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl bg-slate-900">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full aspect-video object-contain bg-slate-900/50"
            />
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-lg flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Captured
            </div>
          </div>

          <button
            onClick={retake}
            disabled={disabled}
            className={`
              w-full py-3.5 bg-slate-700/50 text-slate-300 rounded-xl font-semibold
              flex items-center justify-center gap-2.5 hover:bg-slate-600/50 hover:text-white 
              border border-slate-600/50 hover:border-slate-500/50 transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <RefreshCw className="w-5 h-5" />
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
}
