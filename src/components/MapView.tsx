
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RiskArea, getSampleRiskAreas, findOptimalRoute } from '@/utils/mapUtils';
import AnimatedTransition from './AnimatedTransition';

// Temporary Mapbox token for demo - in production this should be stored securely
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xpczFqcnlkMDl3bjNkbzZibjZ3bHZhNyJ9.mxsYDzEIxlQcYJhKFpazYw';

interface MapViewProps {
  startPoint?: [number, number];
  endPoint?: [number, number];
  waypoints?: Array<[number, number]>;
  riskAreas?: RiskArea[];
  showOptimizedRoute?: boolean;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  startPoint = [40.7128, -74.0060], // Default: New York
  endPoint = [34.0522, -118.2437],  // Default: Los Angeles
  waypoints = [],
  riskAreas = getSampleRiskAreas(),
  showOptimizedRoute = true,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [route, setRoute] = useState<Array<[number, number]>>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<Array<[number, number]>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5,
      pitch: 40,
      bearing: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add atmosphere and terrain
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Draw routes and markers when data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear previous layers
    const layersToRemove = ['route', 'optimized-route', 'risk-areas', 'point-markers'];
    layersToRemove.forEach(layer => {
      if (map.current?.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
      if (map.current?.getSource(layer)) {
        map.current.removeSource(layer);
      }
    });

    // Combine start, waypoints, and end into a basic route
    const fullRoute = [startPoint, ...waypoints, endPoint];
    setRoute(fullRoute);

    // Generate optimized route considering risk areas
    const newOptimizedRoute = findOptimalRoute(startPoint, endPoint, riskAreas);
    setOptimizedRoute(newOptimizedRoute);

    // Add risk areas
    map.current.addSource('risk-areas', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: riskAreas.map(area => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [area.center[1], area.center[0]] // [lng, lat] format
          },
          properties: {
            radius: area.radius * 1000, // Convert to meters
            riskLevel: area.riskLevel,
            description: area.description,
          }
        }))
      }
    });

    // Add risk area circles
    map.current.addLayer({
      id: 'risk-areas',
      type: 'circle',
      source: 'risk-areas',
      paint: {
        'circle-radius': ['get', 'radius'],
        'circle-color': [
          'match',
          ['get', 'riskLevel'],
          'low', 'rgba(78, 228, 120, 0.15)',
          'medium', 'rgba(255, 195, 0, 0.15)',
          'high', 'rgba(255, 69, 58, 0.15)',
          'rgba(128, 128, 128, 0.15)' // default
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': [
          'match',
          ['get', 'riskLevel'],
          'low', 'rgba(78, 228, 120, 0.8)',
          'medium', 'rgba(255, 195, 0, 0.8)',
          'high', 'rgba(255, 69, 58, 0.8)',
          'rgba(128, 128, 128, 0.8)' // default
        ],
        'circle-opacity': 0.6,
        'circle-stroke-opacity': 0.8
      }
    });

    // Add route source
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: fullRoute.map(point => [point[1], point[0]]) // [lng, lat] format
        }
      }
    });

    // Add the original route layer
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': showOptimizedRoute ? 0.4 : 0.8,
        'line-dasharray': [2, 1]
      }
    });

    // Add optimized route if requested
    if (showOptimizedRoute && newOptimizedRoute.length > 1) {
      map.current.addSource('optimized-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: newOptimizedRoute.map(point => [point[1], point[0]]) // [lng, lat] format
          }
        }
      });

      map.current.addLayer({
        id: 'optimized-route',
        type: 'line',
        source: 'optimized-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#0A84FF',
          'line-width': 4,
          'line-opacity': 0.9,
          'line-dasharray': [1, 0]
        }
      });
    }

    // Add markers source
    map.current.addSource('point-markers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          // Start point marker
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [startPoint[1], startPoint[0]] // [lng, lat] format
            },
            properties: {
              title: 'Start',
              markerType: 'start'
            }
          },
          // End point marker
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [endPoint[1], endPoint[0]] // [lng, lat] format
            },
            properties: {
              title: 'End',
              markerType: 'end'
            }
          },
          // Waypoint markers
          ...waypoints.map((point, index) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point[1], point[0]] // [lng, lat] format
            },
            properties: {
              title: `Waypoint ${index + 1}`,
              markerType: 'waypoint'
            }
          }))
        ]
      }
    });

    // Add markers layer
    map.current.addLayer({
      id: 'point-markers',
      type: 'circle',
      source: 'point-markers',
      paint: {
        'circle-radius': 8,
        'circle-color': [
          'match',
          ['get', 'markerType'],
          'start', '#4BB543',
          'end', '#FF3A2F',
          'waypoint', '#FFC72C',
          '#888'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    // Fit the map to show the entire route
    const coordinates = [...fullRoute, ...newOptimizedRoute];
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend([coord[1], coord[0]]);
    }, new mapboxgl.LngLatBounds([coordinates[0][1], coordinates[0][0]], [coordinates[0][1], coordinates[0][0]]));
    
    map.current.fitBounds(bounds, {
      padding: 80,
      duration: 1000
    });

    // Popup for markers and risk areas
    map.current.on('click', 'point-markers', (e) => {
      if (!e.features?.[0]) return;
      
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const title = feature.properties?.title || 'Marker';
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<div class="font-medium text-convoy-text">${title}</div>`)
        .addTo(map.current!);
    });

    map.current.on('click', 'risk-areas', (e) => {
      if (!e.features?.[0]) return;
      
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const riskLevel = feature.properties?.riskLevel || 'unknown';
      const description = feature.properties?.description || 'Risk area';
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="text-convoy-text">
            <div class="font-medium">Risk Area: ${riskLevel.toUpperCase()}</div>
            <div class="text-sm mt-1">${description}</div>
          </div>
        `)
        .addTo(map.current!);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'point-markers', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    
    map.current.on('mouseleave', 'point-markers', () => {
      map.current!.getCanvas().style.cursor = '';
    });

    map.current.on('mouseenter', 'risk-areas', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    
    map.current.on('mouseleave', 'risk-areas', () => {
      map.current!.getCanvas().style.cursor = '';
    });

  }, [startPoint, endPoint, waypoints, riskAreas, mapLoaded, showOptimizedRoute]);

  return (
    <AnimatedTransition className={`rounded-2xl overflow-hidden shadow-xl relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-100">
        <h3 className="text-sm font-medium mb-2 text-convoy-text">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gray-500 rounded"></div>
            <span>Original Route</span>
          </div>
          {showOptimizedRoute && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-convoy-primary rounded"></div>
              <span>Optimized Route</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
            <span>End Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span>Waypoint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/40 border border-red-400"></div>
            <span>Risk Area</span>
          </div>
        </div>
      </div>
      
      {/* Temporary Token Notice */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-gray-100 text-xs text-gray-500">
        Demo Mode: Using temporary Mapbox token
      </div>
    </AnimatedTransition>
  );
};

export default MapView;
