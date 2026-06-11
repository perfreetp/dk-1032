export interface MonitorPoint {
  id: string;
  name: string;
  type: 'traffic' | 'pipeline' | 'environment' | 'video';
  position: { lat: number; lng: number; altitude?: number };
  status: 'normal' | 'warning' | 'error' | 'offline';
  data: Record<string, any>;
  lastUpdate: string;
}

export interface TrafficData {
  roadId: string;
  roadName: string;
  congestionLevel: 'smooth' | 'slow' | 'congested';
  vehicleCount: number;
  averageSpeed: number;
  updateTime: string;
}

export interface BusArrival {
  lineId: string;
  lineName: string;
  stationName: string;
  arrivals: Array<{
    busId: string;
    arrivalTime: string;
    distance: number;
  }>;
}

export interface PipelineData {
  nodeId: string;
  nodeName: string;
  waterLevel: number;
  pipePressure: number;
  hasAnomaly: boolean;
  anomalyType?: 'water_ponding' | 'manhole_cover' | 'pipe_leak';
  position: { lat: number; lng: number };
}

export interface EnvironmentData {
  stationId: string;
  stationName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  noise: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  position: { lat: number; lng: number };
}

export interface Event {
  id: string;
  title: string;
  type: 'traffic' | 'pipeline' | 'environment' | 'safety' | 'other';
  level: 'low' | 'medium' | 'high' | 'critical';
  street: string;
  position: { lat: number; lng: number };
  description: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  reporter: string;
  createTime: string;
  updateTime: string;
  handler?: string;
  progress: number;
  records: EventRecord[];
  dispatch?: Dispatch;
}

export interface Dispatch {
  id: string;
  department: string;
  responsiblePerson: string;
  estimatedTime: string;
  actualTime?: string;
  status: 'pending' | 'dispatched' | 'processing' | 'completed' | 'timeout';
  isTimeout: boolean;
  dispatchTime: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  contact: string;
  phone: string;
}

export interface CarouselConfig {
  id: string;
  name: string;
  pages: string[];
  interval: number;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  eventId: string;
  operator: string;
  action: string;
  remark?: string;
  attachments?: string[];
  createTime: string;
}

export interface HandoverRecord {
  id: string;
  shiftType: 'day' | 'night';
  handOverBy: string;
  handOverTo: string;
  summary: string;
  pendingEvents: string[];
  remarks: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
  approveTime?: string;
}

export interface EmergencyPlan {
  id: string;
  name: string;
  type: string;
  level: string;
  content: string;
  triggerConditions: string[];
  procedures: string[];
  contacts: string[];
  updateTime: string;
}

export interface CoreMetrics {
  trafficFlow: number;
  pipelinePressure: number;
  airQuality: number;
  activeEvents: number;
  totalMonitors: number;
  onlineMonitors: number;
}

export interface Alert {
  id: string;
  title: string;
  type: 'traffic' | 'pipeline' | 'environment' | 'safety';
  level: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  location: string;
  description: string;
}

export interface FavoriteArea {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  zoom: number;
  createdAt: string;
}
