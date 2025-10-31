export interface BloodSugarRecord {
  id: string;
  value: number;
  time: string;
  type: "fasting" | "postprandial";
  timestamp: number;
}

const STORAGE_KEY = "blood_sugar_records";

export const getBloodSugarRecords = (): BloodSugarRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return generateMockData();
  return JSON.parse(data);
};

export const saveBloodSugarRecord = (record: Omit<BloodSugarRecord, "id" | "timestamp">): void => {
  const records = getBloodSugarRecords();
  const newRecord: BloodSugarRecord = {
    ...record,
    id: Date.now().toString(),
    timestamp: new Date(record.time).getTime(),
  };
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const updateBloodSugarRecord = (id: string, updates: Partial<Omit<BloodSugarRecord, "id" | "timestamp">>): void => {
  const records = getBloodSugarRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = {
      ...records[index],
      ...updates,
      timestamp: updates.time ? new Date(updates.time).getTime() : records[index].timestamp,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const deleteBloodSugarRecord = (id: string): void => {
  const records = getBloodSugarRecords();
  const filtered = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getRecentStatistics = (days: number = 3) => {
  const records = getBloodSugarRecords();
  const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentRecords = records.filter((r) => r.timestamp >= cutoffDate);

  if (recentRecords.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }

  const values = recentRecords.map((r) => r.value);
  return {
    average: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

// Generate mock data for first-time users
const generateMockData = (): BloodSugarRecord[] => {
  const mockData: BloodSugarRecord[] = [];
  const now = Date.now();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    
    // Morning fasting
    mockData.push({
      id: `mock-${i}-1`,
      value: Math.round((5 + Math.random() * 2) * 10) / 10,
      time: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 07:00`,
      type: "fasting",
      timestamp: date.getTime() + 7 * 60 * 60 * 1000,
    });
    
    // Post-lunch
    mockData.push({
      id: `mock-${i}-2`,
      value: Math.round((7 + Math.random() * 3) * 10) / 10,
      time: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 14:00`,
      type: "postprandial",
      timestamp: date.getTime() + 14 * 60 * 60 * 1000,
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  return mockData;
};
