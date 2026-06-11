import { create } from 'zustand';
import { MonitorPoint, Event } from '../types';
import { monitorPoints as allMonitorPoints } from '../services/mockData';
import { useEventStore } from './useEventStore';

interface MapStore {
  selectedPointId: string | null;
  selectedPoint: MonitorPoint | null;
  nearbyPoints: MonitorPoint[];
  relatedEvents: Event[];
  focusedEventPosition: { lat: number; lng: number } | null;
  setSelectedPoint: (pointId: string | null) => void;
  clearSelection: () => void;
  getNearbyPoints: (position: { lat: number; lng: number }, radius?: number) => MonitorPoint[];
  setFocusedEventPosition: (position: { lat: number; lng: number } | null) => void;
  getRelatedEvents: (position: { lat: number; lng: number }, radius?: number) => Event[];
}

export const useMapStore = create<MapStore>((set, get) => ({
  selectedPointId: null,
  selectedPoint: null,
  nearbyPoints: [],
  relatedEvents: [],
  focusedEventPosition: null,

  setSelectedPoint: (pointId) => {
    if (!pointId) {
      set({ selectedPointId: null, selectedPoint: null, nearbyPoints: [], relatedEvents: [] });
      return;
    }

    const point = allMonitorPoints.find((p) => p.id === pointId) || null;
    const nearbyPoints = get().getNearbyPoints(point?.position || { lat: 31.23, lng: 121.47 }, 0.02);
    const relatedEvents = get().getRelatedEvents(point?.position || { lat: 31.23, lng: 121.47 }, 0.02);

    set({
      selectedPointId: pointId,
      selectedPoint: point,
      nearbyPoints,
      relatedEvents,
    });
  },

  clearSelection: () => {
    set({ selectedPointId: null, selectedPoint: null, nearbyPoints: [], relatedEvents: [] });
  },

  getNearbyPoints: (position, radius = 0.02) => {
    return allMonitorPoints.filter((point) => {
      const latDiff = Math.abs(point.position.lat - position.lat);
      const lngDiff = Math.abs(point.position.lng - position.lng);
      return latDiff < radius && lngDiff < radius;
    });
  },

  setFocusedEventPosition: (position) => {
    set({ focusedEventPosition: position });
  },

  getRelatedEvents: (position, radius = 0.02) => {
    const eventStore = useEventStore.getState();
    return eventStore.events.filter((event) => {
      const latDiff = Math.abs(event.position.lat - position.lat);
      const lngDiff = Math.abs(event.position.lng - position.lng);
      return latDiff < radius && lngDiff < radius;
    });
  },
}));
