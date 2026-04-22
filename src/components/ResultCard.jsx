import { useState } from 'react';
import {
  Eye, Scan, Focus, Sun, Image, Square, Type, Hand, User,
  CheckCircle, XCircle, AlertTriangle, Box, Shield, Award,
  ChevronRight, ArrowLeft, Zap, BadgeCheck, CircleOff
} from 'lucide-react';

// Animated circular progress with glow effect
const CircularProgress = ({ value, max, size = 100, passed }) => {
  const percentage = (value / max) * 100;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `scoreGradient-${passed ? 'pass' : 'fail'}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${
        passed ? 'bg-emerald-400' : 'bg-rose-400'
      }`} />
      <svg className="relative transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#cbd5e1" strokeWidth="6" opacity="0.9" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} 
          className="transition-all duration-1000 ease-out drop-shadow-lg" 
          style={{ filter: `drop-shadow(0 0 6px ${passed ? '#22c55e' : '#f43f5e'})` }} />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={passed ? '#34d399' : '#fb7185'} />
            <stop offset="50%" stopColor={passed ? '#10b981' : '#f43f5e'} />
            <stop offset="100%" stopColor={passed ? '#059669' : '#e11d48'} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">of {max}</span>
      </div>
    </div>
  );
};

// Animated status indicator
const StatusDot = ({ passed }) => (
  <span className={`relative flex h-2.5 w-2.5`}>
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
      passed ? 'bg-emerald-400' : 'bg-rose-400'
    }`} />
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
      passed ? 'bg-emerald-500' : 'bg-rose-500'
    }`} />
  </span>
);

// Professional stat chip
const QuickStat = ({ icon: Icon, label, passed }) => (
  <div className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-default
    border backdrop-blur-sm hover:scale-105 hover:-translate-y-0.5 ${
    passed 
      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300/70 dark:border-emerald-700/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-400' 
      : 'bg-rose-50 dark:bg-rose-900/30 border-rose-300/70 dark:border-rose-700/70 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-400'
  }`}>
    <Icon className="w-4 h-4" />
    <span className="text-sm font-semibold">{label}</span>
    {passed 
      ? <CheckCircle className="w-3.5 h-3.5 ml-auto" /> 
      : <XCircle className="w-3.5 h-3.5 ml-auto" />
    }
  </div>
);

// Professional detail row
const DetailRow = ({ label, value, passed }) => {
  const formatValue = (val) => {
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'number') return Number.isInteger(val) ? val : val.toFixed(2);
    return val ?? 'N/A';
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0 group">
      <span className="text-slate-600 dark:text-slate-300 text-sm">{label}</span>
      <div className="flex items-center gap-2.5">
        <span className={`font-semibold text-sm ${
          passed === true ? 'text-emerald-600 dark:text-emerald-400' : passed === false ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'
        }`}>
          {formatValue(value)}
        </span>
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
          passed === true ? 'bg-emerald-100 dark:bg-emerald-900/40' : passed === false ? 'bg-rose-100 dark:bg-rose-900/40' : 'bg-amber-100 dark:bg-amber-900/40'
        }`}>
          {passed === true ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> :
           passed === false ? <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> :
           <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />}
        </div>
      </div>
    </div>
  );
};

// Professional detail section card
const DetailSection = ({ title, icon: Icon, status, children }) => (
  <div className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden
                  transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200/70 dark:hover:shadow-slate-900/50">
    {/* Top accent bar */}
    <div className={`h-0.5 transition-all duration-300 ${
      status ? 'bg-emerald-500' : 'bg-rose-500'
    }`} />
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${
          status ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white flex-1">{title}</h3>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          status 
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50' 
            : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/50'
        }`}>
          {status ? 'Pass' : 'Fail'}
        </span>
      </div>
      {children}
    </div>
  </div>
);

// ============ SUMMARY VIEW ============
const SummaryView = ({ data, imagePreview, onViewDetails }) => {
  const { score, maxScore, overallPassed, quickStats, mandatoryFailures } = data;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Main Result Card - Professional Dark Theme */}
      <div className={`relative overflow-hidden rounded-3xl p-1 ${
        overallPassed 
          ? 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400' 
          : 'bg-gradient-to-br from-rose-400 via-pink-400 to-red-400'
      }`}>
        <div className="relative bg-white dark:bg-slate-800 rounded-[22px] p-6 overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl ${
              overallPassed ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
            <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl ${
              overallPassed ? 'bg-teal-500' : 'bg-pink-500'
            }`} />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-40" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative flex items-center gap-6">
            {/* Image with ring */}
            {imagePreview && (
              <div className="relative flex-shrink-0">
                <div className={`absolute -inset-1 rounded-2xl blur-md ${
                  overallPassed 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-400' 
                    : 'bg-gradient-to-br from-rose-400 to-pink-400'
                }`} />
                <div className={`relative w-28 h-28 rounded-2xl overflow-hidden ring-2 ${
                  overallPassed ? 'ring-emerald-400/60' : 'ring-rose-400/60'
                }`}>
                  <img src={imagePreview} alt="Verified" className="w-full h-full object-cover" />
                  {/* gradient overlay on image */}
                  <div className={`absolute inset-0 opacity-20 ${
                    overallPassed
                      ? 'bg-gradient-to-t from-emerald-600 to-transparent'
                      : 'bg-gradient-to-t from-rose-600 to-transparent'
                  }`} />
                </div>
                <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-2xl ${
                  overallPassed 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-br from-rose-500 to-pink-500'
                }`}>
                  {overallPassed 
                    ? <BadgeCheck className="w-5 h-5 text-white" /> 
                    : <CircleOff className="w-5 h-5 text-white" />
                  }
                </div>
              </div>
            )}

            {/* Status content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Award className={`w-4 h-4 ${overallPassed ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">Verification Result</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {overallPassed ? 'Verified Successfully' : 'Verification Failed'}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {quickStats.slice(0, 4).map(({ label, passed }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <StatusDot passed={passed} />
                    <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score circle */}
            <div className="flex-shrink-0">
              <CircularProgress value={score} max={maxScore} passed={overallPassed} size={90} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {quickStats.map(({ label, passed, icon }) => (
          <QuickStat key={label} icon={icon} label={label} passed={passed} />
        ))}
      </div>

      {/* Show mandatory failures directly in summary so users don't miss them */}
      {mandatoryFailures.length > 0 && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-700/50 bg-rose-50 dark:bg-rose-900/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-rose-700 dark:text-rose-300 font-bold">Why Verification Failed</h3>
          </div>
          <ul className="space-y-1.5">
            {mandatoryFailures.map((item, idx) => (
              <li key={`${idx}-${item}`} className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                {idx + 1}. {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="group w-full py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl 
                   font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 
                   hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-200 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-300
                   transition-all duration-300 hover:shadow-lg hover:shadow-violet-100/80 dark:hover:shadow-violet-900/30"
      >
        <span>View Full Analysis</span>
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

// ============ DETAILS VIEW ============
const DetailsView = ({ data, imagePreview, onBack }) => {
  const { score, maxScore, overallPassed, quickStats, face, eyes, quality, pose, lighting, 
    background, geometry, text, hands, objectDetector, humanOnly, aiCheck,
    mandatoryFailures, msg } = data;

  const textPassed = text.text_ok ?? !text.text_detected;
  const aiPassed = !(aiCheck?.is_ai_generated);

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-violet-900/30
                     hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
        </button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Full Analysis Report</h2>
      </div>

      {/* Summary Bar */}
      <div className={`relative overflow-hidden flex items-center justify-between p-5 rounded-2xl ${
        overallPassed 
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
          : 'bg-gradient-to-r from-rose-600 to-pink-600'
      }`}>
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        <div className="relative flex items-center gap-4">
          {imagePreview && (
            <div className="relative flex-shrink-0">
              <div className={`absolute -inset-0.5 rounded-xl blur-sm ${
                overallPassed ? 'bg-gradient-to-br from-emerald-300 to-teal-300' : 'bg-gradient-to-br from-rose-300 to-pink-300'
              }`} />
              <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 opacity-20 ${
                  overallPassed ? 'bg-gradient-to-t from-emerald-700 to-transparent' : 'bg-gradient-to-t from-rose-700 to-transparent'
                }`} />
              </div>
            </div>
          )}
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Status</p>
            <p className="text-white font-black text-xl">{overallPassed ? 'Passed' : 'Failed'}</p>
          </div>
        </div>
        <div className="relative text-right">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Score</p>
          <p className="text-white font-black text-3xl">{score}<span className="text-lg text-white/60">/{maxScore}</span></p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {quickStats.map(({ label, passed, icon }) => (
          <QuickStat key={label} icon={icon} label={label} passed={passed} />
        ))}
      </div>

      {/* Mandatory failures from API */}
      {mandatoryFailures.length > 0 && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-700/50 bg-rose-50 dark:bg-rose-900/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-rose-700 dark:text-rose-300 font-bold">Mandatory Failures</h3>
          </div>
          <ul className="space-y-2">
            {mandatoryFailures.map((item, idx) => (
              <li key={`${idx}-${item}`} className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                {idx + 1}. {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <DetailSection title="Face Detection" icon={Scan} status={face.face_detected && face.face_count === 1}>
          <DetailRow label="Face Detected" value={face.face_detected} passed={face.face_detected} />
          <DetailRow label="Face Count" value={face.face_count} passed={face.face_count === 1} />
        </DetailSection>

        <DetailSection title="Eyes Detection" icon={Eye} status={eyes.eyes_detected}>
          <DetailRow label="Eyes Visible" value={eyes.eyes_detected} passed={eyes.eyes_detected} />
        </DetailSection>

        <DetailSection title="Image Quality" icon={Focus} status={!quality.is_blurry}>
          <DetailRow label="Blur Score" value={quality.blur_score} passed={!quality.is_blurry} />
          <DetailRow label="Is Blurry" value={quality.is_blurry} passed={!quality.is_blurry} />
        </DetailSection>

        <DetailSection title="Head Pose" icon={User} status={pose.head_pose === 'frontal' || pose.head_pose === 'straight'}>
          <DetailRow label="Position" value={pose.head_pose} passed={pose.head_pose === 'frontal' || pose.head_pose === 'straight'} />
        </DetailSection>

        <DetailSection title="Lighting" icon={Sun} status={lighting.lighting === 'good'}>
          <DetailRow label="Brightness" value={lighting.brightness} passed={lighting.lighting === 'good'} />
          <DetailRow label="Quality" value={lighting.lighting} passed={lighting.lighting === 'good'} />
        </DetailSection>

        <DetailSection title="Background" icon={Image} status={background.background_ok}>
          <DetailRow label="Background OK" value={background.background_ok} passed={background.background_ok} />
          <DetailRow label="Edge Ratio" value={background.edge_ratio} passed={background.background_ok} />
        </DetailSection>

        <DetailSection title="Face Geometry" icon={Square} status={geometry.geometry_ok}>
          <DetailRow label="Geometry OK" value={geometry.geometry_ok} passed={geometry.geometry_ok} />
        </DetailSection>

        <DetailSection title="Text Detection" icon={Type} status={textPassed}>
          <DetailRow label="Text Found" value={text.text_detected} passed={textPassed} />
          <DetailRow label="Word Count" value={text.word_count} passed={textPassed} />
          <DetailRow label="Text Area" value={`${((text.text_area_ratio || 0) * 100).toFixed(1)}%`} passed={text.text_ok} />
        </DetailSection>

        <DetailSection title="Hands Check" icon={Hand} status={hands.is_ok}>
          <DetailRow label="Hands Visible" value={hands.hands_detected} passed={!hands.hands_detected || hands.is_ok} />
          <DetailRow label="Position" value={hands.hand_position} passed={hands.is_ok} />
          {hands.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{hands.reason}</p>}
        </DetailSection>

        <DetailSection title="Object Detection" icon={Box} status={!objectDetector.non_human_object_present}>
          <DetailRow label="Foreign Objects" value={objectDetector.non_human_object_present} passed={!objectDetector.non_human_object_present} />
          {objectDetector.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{objectDetector.reason}</p>}
        </DetailSection>

        <DetailSection title="Human Verification" icon={Shield} status={humanOnly.status === 'PASS'}>
          <DetailRow label="Status" value={humanOnly.status} passed={humanOnly.status === 'PASS'} />
          {humanOnly.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{humanOnly.reason}</p>}
        </DetailSection>

        <DetailSection title="AI Detection" icon={Zap} status={aiPassed}>
          <DetailRow label="AI Generated" value={aiCheck?.is_ai_generated} passed={aiPassed} />
          <DetailRow label="AI Score" value={aiCheck?.ai_score} passed={aiPassed} />
          <DetailRow label="Source" value={aiCheck?.source} passed={aiPassed} />
          {aiCheck?.reason && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{aiCheck.reason}</p>}
        </DetailSection>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Zap className="w-4 h-4" />
          <span className="font-medium">API Response</span>
        </div>
        <span className="text-emerald-600 text-sm font-semibold">{msg}</span>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
export default function ResultDisplay({ result, imagePreview }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const apiData = result.data || result;
  const details = apiData.details || {};
  
  const { face = {}, eyes = {}, quality = {}, pose = {}, lighting = {},
          background = {}, geometry = {}, text = {}, hands = {},
          object_detector: objectDetector = {}, human_only: humanOnly = {},
          ai_check: aiCheck = {} } = details;

  const score = apiData.score || 0;
  const maxScore = apiData.max_score || 13;
  const overallPassed = String(apiData.image_status || '').toLowerCase() === 'passed';
  const mandatoryFailuresRaw =
    apiData.mandatory_failures ??
    details.mandatory_failures ??
    result?.mandatory_failures ??
    [];
  const mandatoryFailures = Array.isArray(mandatoryFailuresRaw)
    ? mandatoryFailuresRaw
    : mandatoryFailuresRaw
      ? [String(mandatoryFailuresRaw)]
      : [];
  const textPassed = text.text_ok ?? !text.text_detected;
  const aiPassed = !(aiCheck?.is_ai_generated);

  const quickStats = [
    { label: 'Face', passed: face.face_detected, icon: Scan },
    { label: 'Eyes', passed: eyes.eyes_detected, icon: Eye },
    { label: 'Quality', passed: !quality.is_blurry, icon: Focus },
    { label: 'Pose', passed: pose.head_pose === 'frontal' || pose.head_pose === 'straight', icon: User },
    { label: 'Text', passed: textPassed, icon: Type },
    { label: 'Hands', passed: hands.is_ok, icon: Hand },
    { label: 'AI', passed: aiPassed, icon: Zap },
    { label: 'Light', passed: lighting.lighting === 'good', icon: Sun },
  ];

  const data = {
    score, maxScore, overallPassed, quickStats,
    face, eyes, quality, pose, lighting, background, geometry, text, hands, objectDetector, humanOnly, aiCheck,
    mandatoryFailures,
    msg: result.msg
  };

  return showDetails ? (
    <DetailsView data={data} imagePreview={imagePreview} onBack={() => setShowDetails(false)} />
  ) : (
    <SummaryView data={data} imagePreview={imagePreview} onViewDetails={() => setShowDetails(true)} />
  );
}
