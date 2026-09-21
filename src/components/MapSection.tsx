import React, { useEffect, useRef, useState } from 'react';
import { Issue, Priority } from '../types';
import { cn } from '../lib/utils';
import { UserPlus, AlertTriangle, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    mappls: any;
  }
}

interface MapSectionProps {
  issues: Issue[];
  onAssignClick: (issue: Issue) => void;
}

const center = {
  lat: 28.6139, // New Delhi
  lng: 77.2090
};

// Colors based on priority
const getMarkerColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return '#ef4444'; // red
    case 'medium': return '#fbbf24'; // amber
    case 'low': return '#915DFF'; // brand purple
    default: return '#64748b';
  }
};

export default function MapSection({ issues, onAssignClick }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);

  const mapplsKey = (import.meta as any).env.VITE_MAPPLS_API_KEY || '';
  const mapplsJSKey = (import.meta as any).env.VITE_MAPPLS_JS_KEY || '';
  const token = mapplsJSKey || mapplsKey;
  const isPlaceholderKey = !token || token === 'YOUR_MAPPLS_API_KEY' || token === 'YOUR_MAPPLS_JS_KEY' || token.length < 5;

  useEffect(() => {
    if (isPlaceholderKey) return;

    const scriptId = 'mappls-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      // Using whichever key is available, prioritizing JS Key
      script.src = `https://apis.mappls.com/advancedmaps/api/${token}/map_sdk?v=3.0&layer=vector`;
      script.async = true;
      script.onload = () => {
        console.log('Mappls SDK script loaded');
        setScriptLoaded(true);
      };
      script.onerror = (e) => console.error('Mappls SDK failed to load', e);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, [token, isPlaceholderKey]);

  useEffect(() => {
    if (scriptLoaded && mapRef.current && !map) {
      const initMap = () => {
        if (!window.mappls || !window.mappls.Map) {
          console.warn('Mappls SDK not yet available, retrying...');
          setTimeout(initMap, 100);
          return;
        }

        try {
          console.log("Attempting to initialize Mappls with token...");
          // Initialize using the token from environment
          // If initialize hangs, we try to create the map anyway after a delay
          const initTimeout = setTimeout(() => {
            if (!map) {
              console.warn("Mappls initialize callback timed out, attempting direct construction...");
              createMap();
            }
          }, 3000);

          const createMap = () => {
            if (map) return;
            try {
              const mapplsMap = new window.mappls.Map(mapRef.current, {
                center: [center.lng, center.lat],
                zoom: 12,
              });

              mapplsMap.on('load', () => {
                console.log("Mappls Map Loaded successfully");
                setMap(mapplsMap);
              });
            } catch (err) {
              console.error("Direct Mappls construction failed:", err);
            }
          };

          window.mappls.initialize(token, () => {
            clearTimeout(initTimeout);
            console.log("Mappls Key Authenticated and Ready!");
            createMap();
          });
        } catch (err) {
          console.error('Mappls Initialization Error:', err);
        }
      };

      initMap();
    }
  }, [scriptLoaded, map]);

  // Handle Markers
  useEffect(() => {
    if (!map || !window.mappls) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    issues.forEach(issue => {
      const marker = new window.mappls.Marker({
        map: map,
        position: { lat: issue.lat, lng: issue.lng },
        icon_url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Fallback or custom
        width: 35,
        height: 35,
        popupHtml: `<div id="popup-${issue.id}" style="padding: 10px; min-width: 150px;">
          <h4 style="margin: 0; font-weight: bold;">${issue.title}</h4>
          <p style="margin: 5px 0; font-size: 12px; color: #666;">${issue.description}</p>
          <button id="btn-${issue.id}" style="width: 100%; border: none; background: #915DFF; color: white; padding: 5px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">Assign Team</button>
        </div>`
      });

      marker.on('click', () => {
        setSelectedIssue(issue);
        // Wait for popup to render then attach listener
        setTimeout(() => {
          const btn = document.getElementById(`btn-${issue.id}`);
          if (btn) {
            btn.onclick = () => onAssignClick(issue);
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });
  }, [map, issues, onAssignClick]);

  if (isPlaceholderKey) {
    return (
      <div className="w-full h-full bg-slate-50 rounded-lg border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-2">Mappls API Key Required</h3>
        <p className="text-xs text-slate-500 max-w-[280px] mb-6 leading-relaxed">
          Please provide a valid Mappls API Key in your environment variables to enable the real-time dashboard map.
        </p>
        <div className="space-y-2 w-full max-w-[240px]">
          <a 
            href="https://www.mappls.com/api/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Mappls API Dashboard
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {!map && scriptLoaded && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <p className="text-slate-500 font-bold text-sm animate-pulse">Initializing Mappls...</p>
        </div>
      )}

      {selectedIssue && (
        <div className="absolute top-4 right-4 z-40 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 animate-in slide-in-from-right-4 duration-300 max-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <span className={cn(
              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
              selectedIssue.priority === 'high' ? "bg-red-50 text-red-600" :
              selectedIssue.priority === 'medium' ? "bg-amber-50 text-amber-600" :
              "bg-brand-light/30 text-brand-dark"
            )}>
              {selectedIssue.priority}
            </span>
            <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
          </div>
          <h4 className="font-bold text-slate-900 leading-tight">{selectedIssue.title}</h4>
          <p className="text-xs text-slate-600 mt-1">{selectedIssue.description}</p>
          
          {selectedIssue.status !== 'resolved' && (
            <button
              onClick={() => onAssignClick(selectedIssue)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-gradient text-white text-[11px] font-bold py-1.5 rounded-lg hover:brightness-110 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Assign Worker
            </button>
          )}
        </div>
      )}
    </div>
  );
}
