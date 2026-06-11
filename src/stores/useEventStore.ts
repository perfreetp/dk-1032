import { create } from 'zustand';
import { Event, EventRecord, Dispatch } from '../types';
import { events as initialEvents } from '../services/mockData';

interface EventStore {
  events: Event[];
  selectedEventId: string | null;
  mapFocusPosition: { lat: number; lng: number } | null;
  focusedEventId: string | null;
  addEventRecord: (eventId: string, record: Omit<EventRecord, 'id' | 'eventId' | 'createTime'>) => void;
  updateEventStatus: (eventId: string, status: Event['status'], progress: number) => void;
  createDispatch: (eventId: string, dispatch: Omit<Dispatch, 'id' | 'dispatchTime' | 'isTimeout'>) => void;
  setSelectedEvent: (eventId: string | null) => void;
  setMapFocusPosition: (position: { lat: number; lng: number } | null) => void;
  setFocusedEventId: (eventId: string | null) => void;
  getSelectedEvent: () => Event | undefined;
  getAllEvents: () => Event[];
  getEventById: (eventId: string) => Event | undefined;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: initialEvents,
  selectedEventId: null,
  mapFocusPosition: null,
  focusedEventId: null,

  addEventRecord: (eventId, recordData) => {
    const newRecord: EventRecord = {
      id: `rec-${Date.now()}`,
      eventId,
      ...recordData,
      createTime: new Date().toLocaleString('zh-CN'),
    };

    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              records: [...event.records, newRecord],
              updateTime: new Date().toISOString(),
            }
          : event
      ),
    }));
  },

  updateEventStatus: (eventId, status, progress) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status,
              progress,
              updateTime: new Date().toISOString(),
            }
          : event
      ),
    }));
  },

  createDispatch: (eventId, dispatchData) => {
    const estimatedTimeDate = new Date(dispatchData.estimatedTime);
    const now = new Date();
    const isTimeout = estimatedTimeDate < now;

    const newDispatch: Dispatch = {
      id: `disp-${Date.now()}`,
      ...dispatchData,
      status: 'dispatched',
      isTimeout,
      dispatchTime: new Date().toLocaleString('zh-CN'),
    };

    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              dispatch: newDispatch,
              status: 'processing' as const,
              updateTime: new Date().toISOString(),
            }
          : event
      ),
    }));
  },

  setSelectedEvent: (eventId) => {
    set({ selectedEventId: eventId });
  },

  setMapFocusPosition: (position) => {
    set({ mapFocusPosition: position });
  },

  setFocusedEventId: (eventId) => {
    set({ focusedEventId: eventId });
  },

  getSelectedEvent: () => {
    const state = get();
    return state.events.find((e) => e.id === state.selectedEventId);
  },

  getAllEvents: () => {
    return get().events;
  },

  getEventById: (eventId) => {
    return get().events.find((e) => e.id === eventId);
  },
}));

setInterval(() => {
  const store = useEventStore.getState();
  const now = new Date();

  store.events.forEach((event) => {
    if (event.dispatch && event.dispatch.status !== 'completed') {
      const estimatedTime = new Date(event.dispatch.estimatedTime);
      const shouldBeTimeout = estimatedTime < now;

      if (shouldBeTimeout !== event.dispatch.isTimeout) {
        useEventStore.setState((state) => ({
          events: state.events.map((e) =>
            e.id === event.id
              ? {
                  ...e,
                  dispatch: e.dispatch
                    ? { ...e.dispatch, isTimeout: shouldBeTimeout }
                    : undefined,
                }
              : e
          ),
        }));
      }
    }
  });
}, 60000);
