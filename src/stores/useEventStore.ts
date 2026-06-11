import { create } from 'zustand';
import { Event, EventRecord } from '../types';
import { events as initialEvents } from '../services/mockData';

interface EventStore {
  events: Event[];
  selectedEventId: string | null;
  addEventRecord: (eventId: string, record: Omit<EventRecord, 'id' | 'eventId' | 'createTime'>) => void;
  updateEventStatus: (eventId: string, status: Event['status'], progress: number) => void;
  setSelectedEvent: (eventId: string | null) => void;
  getSelectedEvent: () => Event | undefined;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: initialEvents,
  selectedEventId: null,

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

  setSelectedEvent: (eventId) => {
    set({ selectedEventId: eventId });
  },

  getSelectedEvent: () => {
    const state = get();
    return state.events.find((e) => e.id === state.selectedEventId);
  },
}));
