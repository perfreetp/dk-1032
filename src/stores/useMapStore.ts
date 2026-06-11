import { create } from 'zustand';
import { MonitorPoint, Event } from '../types';
import { monitorPoints as allMonitorPoints } from '../services/mockData';

interface MapStore {
  selectedPointId: string | null;
  selectedPoint: MonitorPoint | null;
  nearbyPoints: MonitorPoint[];
  relatedEvents: Event[];
  setSelectedPoint: (pointId: string | null) => void;
  clearSelection: () => void;
  getNearbyPoints: (position: { lat: number; lng: number }, radius?: number) => MonitorPoint[];
}

export const useMapStore = create<MapStore>((set, get) => ({
  selectedPointId: null,
  selectedPoint: null,
  nearbyPoints: [],
  relatedEvents: [],

  setSelectedPoint: (pointId) => {
    if (!pointId) {
      set({ selectedPointId: null, selectedPoint: null, nearbyPoints: [], relatedEvents: [] });
      return;
    }

    const point = allMonitorPoints.find((p) => p.id === pointId) || null;
    const nearbyPoints = get().getNearbyPoints(point?.position || { lat: 31.23, lng: 121.47 }, 0.03);

    set({
      selectedPointId: pointId,
      selectedPoint: point,
      nearbyPoints,
      relatedEvents: [],
    });
  },

  clearSelection: () => {
    set({ selectedPointId: null, selectedPoint: null, nearbyPoints: [], relatedEvents: [] });
  },

  getNearbyPoints: (position, radius = 0.03) => {
    return allMonitorPoints.filter((point) => {
      const latDiff = Math.abs(point.position.lat - position.lat);
      const lngDiff = Math.abs(point.position.lng - position.lng);
      return latDiff < radius && lngDiff < radius;
    });
  },
}));
