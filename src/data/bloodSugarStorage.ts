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
  if (!data) return [];
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

  // 应用与图表相同的转换逻辑
  const convertValue = (value: number): number | null => {
    // 如果数值大于20，假设是mg/dL单位，转换为mmol/L（除以18）
    if (value > 20) {
      value = value / 18;
    }

    // 确保值在合理范围内（2-30 mmol/L）
    if (value < 2 || value > 30) {
      return null;
    }

    return parseFloat(value.toFixed(1));
  };

  const values = recentRecords
    .map((r) => convertValue(r.value))
    .filter((v): v is number => v !== null);

  if (values.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }

  return {
    average: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

// 清理localStorage中的mock数据，只保留真实用户记录
export const cleanupMockData = (): void => {
  const records = getBloodSugarRecords();
  // 过滤掉所有mock数据（以"mock-"开头的ID）
  const realRecords = records.filter((r) => !r.id.startsWith('mock-'));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(realRecords));
};

// 检查是否有记录并清理mock数据
export const initializeStorage = (): void => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const records = JSON.parse(data);
      const hasMockData = records.some((r: BloodSugarRecord) => r.id.startsWith('mock-'));
      if (hasMockData) {
        cleanupMockData();
      }
    } catch (error) {
      // 如果数据格式有问题，清空重新开始
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // 如果没有任何记录，为新用户添加几条示例记录
  const existingRecords = getBloodSugarRecords();
  if (existingRecords.length === 0) {
    const sampleRecords: BloodSugarRecord[] = [
      {
        id: Date.now().toString(),
        value: 5.8,
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        type: "fasting",
        timestamp: new Date().getTime()
      },
      {
        id: (Date.now() + 1).toString(),
        value: 7.2,
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
        type: "postprandial",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime()
      },
      {
        id: (Date.now() + 2).toString(),
        value: 6.1,
        time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
        type: "fasting",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).getTime()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecords));
  }
};
