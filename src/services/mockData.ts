import {
  MonitorPoint,
  TrafficData,
  BusArrival,
  PipelineData,
  EnvironmentData,
  Event,
  Alert,
  CoreMetrics,
  FavoriteArea,
  EmergencyPlan,
  Department,
  CarouselConfig,
} from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number) =>
  (Math.random() * (max - min) + min).toFixed(2);

export const monitorPoints: MonitorPoint[] = [
  { id: 'mp-1', name: '中山路路口监控', type: 'traffic', position: { lat: 31.23, lng: 121.47 }, status: 'normal', data: { vehicleCount: 1256 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-2', name: '人民广场站监控', type: 'video', position: { lat: 31.23, lng: 121.48 }, status: 'normal', data: { cameraId: 'cam-001' }, lastUpdate: new Date().toISOString() },
  { id: 'mp-3', name: '南京东路泵站', type: 'pipeline', position: { lat: 31.24, lng: 121.47 }, status: 'warning', data: { waterLevel: 2.5 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-4', name: '外滩空气质量站', type: 'environment', position: { lat: 31.24, lng: 121.49 }, status: 'normal', data: { aqi: 58 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-5', name: '西藏路积水点', type: 'pipeline', position: { lat: 31.23, lng: 121.46 }, status: 'error', data: { waterLevel: 0.8 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-6', name: '延安路监控点', type: 'traffic', position: { lat: 31.22, lng: 121.46 }, status: 'error', data: { vehicleCount: 856 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-7', name: '淮海路监控点', type: 'traffic', position: { lat: 31.22, lng: 121.45 }, status: 'warning', data: { vehicleCount: 1100 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-8', name: '陆家嘴监控点', type: 'video', position: { lat: 31.24, lng: 121.51 }, status: 'normal', data: { cameraId: 'cam-002' }, lastUpdate: new Date().toISOString() },
  { id: 'mp-9', name: 'B区排水泵站', type: 'pipeline', position: { lat: 31.24, lng: 121.46 }, status: 'error', data: { waterLevel: 2.5 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-10', name: 'C区排水泵站', type: 'pipeline', position: { lat: 31.25, lng: 121.48 }, status: 'normal', data: { waterLevel: 0.8 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-11', name: '陆家嘴监测站', type: 'environment', position: { lat: 31.24, lng: 121.51 }, status: 'warning', data: { aqi: 72 }, lastUpdate: new Date().toISOString() },
  { id: 'mp-12', name: '静安寺监测站', type: 'environment', position: { lat: 31.22, lng: 121.45 }, status: 'normal', data: { aqi: 48 }, lastUpdate: new Date().toISOString() },
];

export const departments: Department[] = [
  { id: 'dept-1', name: '交警支队', icon: '🚗', contact: '李警官', phone: '021-12345678' },
  { id: 'dept-2', name: '市政管理处', icon: '🔧', contact: '王处长', phone: '021-23456789' },
  { id: 'dept-3', name: '排水养护中心', icon: '💧', contact: '张主任', phone: '021-34567890' },
  { id: 'dept-4', name: '环境监测中心', icon: '🌿', contact: '陈站长', phone: '021-45678901' },
  { id: 'dept-5', name: '应急管理局', icon: '🚨', contact: '刘局长', phone: '021-56789012' },
  { id: 'dept-6', name: '城管执法大队', icon: '🏛️', contact: '赵队长', phone: '021-67890123' },
];

export const carouselConfigs: CarouselConfig[] = [
  { id: 'carousel-1', name: '日常监控', pages: ['/', '/traffic', '/pipeline', '/environment'], interval: 10, createdAt: '2026-06-01' },
  { id: 'carousel-2', name: '事件重点', pages: ['/events', '/map', '/events', '/report'], interval: 15, createdAt: '2026-06-05' },
  { id: 'carousel-3', name: '全功能轮播', pages: ['/', '/map', '/traffic', '/pipeline', '/environment', '/events', '/report'], interval: 8, createdAt: '2026-06-10' },
];

export const trafficData: TrafficData[] = [
  { roadId: 'rd-1', roadName: '南京东路', congestionLevel: 'smooth', vehicleCount: 856, averageSpeed: 45, updateTime: new Date().toISOString() },
  { roadId: 'rd-2', roadName: '淮海中路', congestionLevel: 'slow', vehicleCount: 1243, averageSpeed: 28, updateTime: new Date().toISOString() },
  { roadId: 'rd-3', roadName: '延安高架', congestionLevel: 'congested', vehicleCount: 2156, averageSpeed: 15, updateTime: new Date().toISOString() },
  { roadId: 'rd-4', roadName: '内环高架', congestionLevel: 'smooth', vehicleCount: 1876, averageSpeed: 52, updateTime: new Date().toISOString() },
  { roadId: 'rd-5', roadName: '世纪大道', congestionLevel: 'slow', vehicleCount: 1456, averageSpeed: 35, updateTime: new Date().toISOString() },
];

export const busArrivals: BusArrival[] = [
  { lineId: 'bus-49', lineName: '49路', stationName: '福州路站', arrivals: [{ busId: 'b-001', arrivalTime: '2分钟', distance: 500 }, { busId: 'b-002', arrivalTime: '8分钟', distance: 1800 }] },
  { lineId: 'bus-20', lineName: '20路', stationName: '福州路站', arrivals: [{ busId: 'b-003', arrivalTime: '5分钟', distance: 1200 }] },
  { lineId: 'bus-37', lineName: '37路', stationName: '福州路站', arrivals: [{ busId: 'b-004', arrivalTime: '3分钟', distance: 800 }, { busId: 'b-005', arrivalTime: '12分钟', distance: 3000 }] },
];

export const pipelineData: PipelineData[] = [
  { nodeId: 'pl-1', nodeName: 'A区排水泵站', waterLevel: 1.2, pipePressure: 0.35, hasAnomaly: false, position: { lat: 31.23, lng: 121.47 } },
  { nodeId: 'pl-2', nodeName: 'B区排水泵站', waterLevel: 2.5, pipePressure: 0.42, hasAnomaly: true, anomalyType: 'water_ponding', position: { lat: 31.24, lng: 121.46 } },
  { nodeId: 'pl-3', nodeName: 'C区排水泵站', waterLevel: 0.8, pipePressure: 0.28, hasAnomaly: false, position: { lat: 31.25, lng: 121.48 } },
  { nodeId: 'pl-4', nodeName: 'D区排水泵站', waterLevel: 3.1, pipePressure: 0.55, hasAnomaly: true, anomalyType: 'manhole_cover', position: { lat: 31.22, lng: 121.49 } },
  { nodeId: 'pl-5', nodeName: 'E区排水泵站', waterLevel: 1.5, pipePressure: 0.32, hasAnomaly: false, position: { lat: 31.23, lng: 121.50 } },
];

export const environmentData: EnvironmentData[] = [
  { stationId: 'env-1', stationName: '外滩监测站', aqi: 58, pm25: 35, pm10: 65, noise: 62, temperature: 22, humidity: 65, windSpeed: 3.5, windDirection: '东南风', position: { lat: 31.24, lng: 121.49 } },
  { stationId: 'env-2', stationName: '陆家嘴监测站', aqi: 72, pm25: 45, pm10: 78, noise: 71, temperature: 23, humidity: 60, windSpeed: 2.8, windDirection: '东风', position: { lat: 31.24, lng: 121.51 } },
  { stationId: 'env-3', stationName: '人民广场监测站', aqi: 65, pm25: 40, pm10: 70, noise: 68, temperature: 22, humidity: 62, windSpeed: 3.2, windDirection: '东南风', position: { lat: 31.23, lng: 121.48 } },
  { stationId: 'env-4', stationName: '静安寺监测站', aqi: 48, pm25: 28, pm10: 55, noise: 58, temperature: 21, humidity: 68, windSpeed: 2.5, windDirection: '南风', position: { lat: 31.22, lng: 121.45 } },
];

export const events: Event[] = [
  {
    id: 'evt-1',
    title: '延安路高架交通事故',
    type: 'traffic',
    level: 'high',
    street: '延安路',
    position: { lat: 31.22, lng: 121.46 },
    description: '延安路高架西向东方向发生两车追尾事故,占用右侧车道',
    status: 'processing',
    reporter: '交警指挥中心',
    createTime: '2026-06-12 08:30:00',
    updateTime: '2026-06-12 09:15:00',
    handler: '张伟',
    progress: 65,
    dispatch: {
      id: 'disp-1',
      department: '交警支队',
      responsiblePerson: '李警官',
      estimatedTime: '2026-06-12 10:30:00',
      status: 'processing',
      isTimeout: false,
      dispatchTime: '2026-06-12 08:35:00',
    },
    records: [
      { id: 'rec-1', eventId: 'evt-1', operator: '张伟', action: '接单处理', remark: '已派交警前往现场', createTime: '2026-06-12 08:35:00' },
      { id: 'rec-2', eventId: 'evt-1', operator: '张伟', action: '现场处置', remark: '事故车辆已移至应急车道', createTime: '2026-06-12 09:00:00' },
    ],
  },
  {
    id: 'evt-2',
    title: '西藏路积水告警',
    type: 'pipeline',
    level: 'critical',
    street: '西藏路',
    position: { lat: 31.23, lng: 121.46 },
    description: '西藏路南段积水深度超过30cm,影响车辆通行',
    status: 'processing',
    reporter: '管网监测系统',
    createTime: '2026-06-12 07:20:00',
    updateTime: '2026-06-12 07:25:00',
    progress: 30,
    dispatch: {
      id: 'disp-2',
      department: '排水养护中心',
      responsiblePerson: '张主任',
      estimatedTime: '2026-06-12 09:00:00',
      status: 'processing',
      isTimeout: true,
      dispatchTime: '2026-06-12 07:25:00',
    },
    records: [],
  },
  {
    id: 'evt-3',
    title: '南京东路噪声超标',
    type: 'environment',
    level: 'medium',
    street: '南京东路',
    position: { lat: 31.23, lng: 121.48 },
    description: '南京东路步行街夜间噪声持续超标,周边居民投诉',
    status: 'resolved',
    reporter: '环境监测系统',
    createTime: '2026-06-11 22:30:00',
    updateTime: '2026-06-12 01:15:00',
    handler: '李娜',
    progress: 100,
    dispatch: {
      id: 'disp-3',
      department: '环境监测中心',
      responsiblePerson: '陈站长',
      estimatedTime: '2026-06-11 23:30:00',
      actualTime: '2026-06-12 01:15:00',
      status: 'completed',
      isTimeout: false,
      dispatchTime: '2026-06-11 22:35:00',
    },
    records: [
      { id: 'rec-3', eventId: 'evt-3', operator: '李娜', action: '现场核查', remark: '确认为酒吧音响超标', createTime: '2026-06-11 23:00:00' },
      { id: 'rec-4', eventId: 'evt-3', operator: '李娜', action: '整改通知', remark: '已要求酒吧降低音量', createTime: '2026-06-12 00:30:00' },
      { id: 'rec-5', eventId: 'evt-3', operator: '李娜', action: '验收完成', remark: '噪声已降至正常范围', createTime: '2026-06-12 01:15:00' },
    ],
  },
];

export const alerts: Alert[] = [
  { id: 'alert-1', title: '积水告警', type: 'pipeline', level: 'critical', time: '2026-06-12 07:20', location: '西藏路', description: '积水深度超标' },
  { id: 'alert-2', title: '井盖异常', type: 'pipeline', level: 'high', time: '2026-06-12 06:45', location: '淮海路', description: '井盖倾斜' },
  { id: 'alert-3', title: '交通拥堵', type: 'traffic', level: 'medium', time: '2026-06-12 08:30', location: '延安高架', description: '事故导致拥堵' },
  { id: 'alert-4', title: '噪声超标', type: 'environment', level: 'low', time: '2026-06-12 09:00', location: '南京东路', description: '夜间噪声超标' },
  { id: 'alert-5', title: 'AQI上升', type: 'environment', level: 'low', time: '2026-06-12 08:00', location: '陆家嘴', description: '空气质量转中' },
];

export const coreMetrics: CoreMetrics = {
  trafficFlow: 12456,
  pipelinePressure: 0.42,
  airQuality: 62,
  activeEvents: 12,
  totalMonitors: 256,
  onlineMonitors: 248,
};

export const favoriteAreas: FavoriteArea[] = [
  { id: 'fav-1', name: '外滩景区', position: { lat: 31.24, lng: 121.49 }, zoom: 16, createdAt: '2026-06-01' },
  { id: 'fav-2', name: '陆家嘴金融区', position: { lat: 31.24, lng: 121.51 }, zoom: 17, createdAt: '2026-06-05' },
  { id: 'fav-3', name: '人民广场', position: { lat: 31.23, lng: 121.48 }, zoom: 18, createdAt: '2026-06-10' },
];

export const emergencyPlans: EmergencyPlan[] = [
  {
    id: 'plan-1',
    name: '暴雨红色预警预案',
    type: '自然灾害',
    level: '一级',
    content: '当气象部门发布暴雨红色预警时,启动该预案',
    triggerConditions: ['暴雨红色预警', '积水点超过10个'],
    procedures: ['通知相关部门', '开放应急避难场所', '调度排水车辆'],
    contacts: ['防汛办: 12345', '应急局: 67890'],
    updateTime: '2026-06-01',
  },
  {
    id: 'plan-2',
    name: '重污染天气应急响应',
    type: '环境事件',
    level: '二级',
    content: '当AQI持续超过300时,启动该预案',
    triggerConditions: ['AQI>300', '持续时间>6小时'],
    procedures: ['发布健康提示', '限行措施', '工业减排'],
    contacts: ['环保局: 11111'],
    updateTime: '2026-05-20',
  },
];

export const streets = [
  '全部街道',
  '南京东路',
  '淮海中路',
  '延安路',
  '西藏路',
  '人民路',
  '外滩',
  '陆家嘴',
];

export const updateTrafficData = () => {
  return trafficData.map((road) => ({
    ...road,
    vehicleCount: randomBetween(road.vehicleCount * 0.8, road.vehicleCount * 1.2),
    averageSpeed: randomBetween(15, 60),
    updateTime: new Date().toISOString(),
  }));
};

export const updatePipelineData = () => {
  return pipelineData.map((node) => ({
    ...node,
    waterLevel: randomFloat(0.5, 3.5),
    pipePressure: randomFloat(0.2, 0.6),
    hasAnomaly: Math.random() > 0.7,
  }));
};

export const updateEnvironmentData = () => {
  return environmentData.map((station) => ({
    ...station,
    aqi: randomBetween(30, 100),
    pm25: randomBetween(15, 80),
    pm10: randomBetween(30, 120),
    noise: randomBetween(45, 85),
    temperature: randomFloat(18, 28),
    humidity: randomBetween(50, 80),
  }));
};

export const updateCoreMetrics = (prev: CoreMetrics): CoreMetrics => ({
  trafficFlow: randomBetween(10000, 15000),
  pipelinePressure: parseFloat(randomFloat(0.3, 0.6)),
  airQuality: randomBetween(40, 80),
  activeEvents: prev.activeEvents + (Math.random() > 0.8 ? 1 : 0),
  totalMonitors: 256,
  onlineMonitors: randomBetween(240, 256),
});
