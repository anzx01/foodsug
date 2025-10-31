export interface Food {
  id: number;
  name: string;
  gi: number;
  category: "low" | "medium" | "high";
  desc: string;
  image: string;
  imageType?: "photo" | "emoji";
  nutrition?: {
    calories: number; // 卡路里 kcal/100g
    carbs: number; // 碳水化合物 g/100g
    protein: number; // 蛋白质 g/100g
    fat: number; // 脂肪 g/100g
    fiber: number; // 膳食纤维 g/100g
  };
}

export const foodDatabase: Food[] = [
  { id: 1, name: "苹果", gi: 36, category: "low", desc: "富含果胶，升糖缓慢", image: "apple", imageType: "photo", nutrition: { calories: 52, carbs: 14, protein: 0.3, fat: 0.2, fiber: 2.4 } },
  { id: 2, name: "橙子", gi: 43, category: "low", desc: "维C丰富，低GI水果", image: "orange", imageType: "photo", nutrition: { calories: 47, carbs: 12, protein: 0.9, fat: 0.1, fiber: 2.4 } },
  { id: 3, name: "梨", gi: 38, category: "low", desc: "膳食纤维丰富", image: "🍐", imageType: "emoji", nutrition: { calories: 57, carbs: 15, protein: 0.4, fat: 0.1, fiber: 3.1 } },
  { id: 4, name: "樱桃", gi: 22, category: "low", desc: "极低GI，适合糖友", image: "🍒", imageType: "emoji" },
  { id: 5, name: "草莓", gi: 40, category: "low", desc: "抗氧化，低升糖", image: "strawberry", imageType: "photo" },
  { id: 6, name: "蓝莓", gi: 53, category: "low", desc: "花青素丰富", image: "🫐", imageType: "emoji" },
  { id: 7, name: "燕麦", gi: 55, category: "low", desc: "全谷物，β-葡聚糖", image: "oatmeal", imageType: "photo" },
  { id: 8, name: "全麦面包", gi: 51, category: "low", desc: "粗粮制品", image: "🍞", imageType: "emoji" },
  { id: 9, name: "红薯", gi: 54, category: "low", desc: "膳食纤维丰富", image: "🍠", imageType: "emoji" },
  { id: 10, name: "玉米", gi: 52, category: "low", desc: "粗粮主食", image: "🌽", imageType: "emoji" },
  { id: 11, name: "黑豆", gi: 30, category: "low", desc: "优质植物蛋白", image: "🫘", imageType: "emoji" },
  { id: 12, name: "扁豆", gi: 32, category: "low", desc: "蛋白质丰富", image: "🫘", imageType: "emoji" },
  { id: 13, name: "鸡蛋", gi: 0, category: "low", desc: "几乎不升糖", image: "🥚", imageType: "emoji" },
  { id: 14, name: "牛奶", gi: 27, category: "low", desc: "钙质丰富", image: "🥛", imageType: "emoji" },
  { id: 15, name: "酸奶", gi: 36, category: "low", desc: "益生菌", image: "🥛", imageType: "emoji" },
  { id: 16, name: "西兰花", gi: 15, category: "low", desc: "低卡蔬菜", image: "broccoli", imageType: "photo" },
  { id: 17, name: "菠菜", gi: 15, category: "low", desc: "铁质丰富", image: "🥬", imageType: "emoji" },
  { id: 18, name: "番茄", gi: 15, category: "low", desc: "番茄红素", image: "🍅", imageType: "emoji" },
  { id: 19, name: "黄瓜", gi: 15, category: "low", desc: "水分充足", image: "🥒", imageType: "emoji" },
  { id: 20, name: "芹菜", gi: 15, category: "low", desc: "膳食纤维", image: "🥬", imageType: "emoji" },

  { id: 21, name: "香蕉", gi: 62, category: "medium", desc: "钾含量高", image: "banana", imageType: "photo", nutrition: { calories: 89, carbs: 23, protein: 1.1, fat: 0.3, fiber: 2.6 } },
  { id: 22, name: "葡萄", gi: 59, category: "medium", desc: "糖分较高", image: "🍇", imageType: "emoji" },
  { id: 23, name: "芒果", gi: 60, category: "medium", desc: "热带水果", image: "🥭", imageType: "emoji" },
  { id: 24, name: "菠萝", gi: 66, category: "medium", desc: "酶类丰富", image: "🍍", imageType: "emoji" },
  { id: 25, name: "木瓜", gi: 60, category: "medium", desc: "消化酶", image: "🍈", imageType: "emoji" },
  { id: 26, name: "糙米饭", gi: 56, category: "medium", desc: "保留米糠", image: "brown-rice", imageType: "photo" },
  { id: 27, name: "意大利面", gi: 58, category: "medium", desc: "全麦更优", image: "🍝", imageType: "emoji" },
  { id: 28, name: "贝果", gi: 69, category: "medium", desc: "精制面粉", image: "🥯", imageType: "emoji" },
  { id: 29, name: "爆米花", gi: 65, category: "medium", desc: "升糖较快", image: "🍿", imageType: "emoji" },
  { id: 30, name: "蜂蜜", gi: 58, category: "medium", desc: "天然糖分", image: "🍯", imageType: "emoji" },
  { id: 31, name: "南瓜", gi: 64, category: "medium", desc: "胡萝卜素", image: "🎃", imageType: "emoji" },
  { id: 32, name: "胡萝卜", gi: 69, category: "medium", desc: "维A前体", image: "🥕", imageType: "emoji" },
  { id: 33, name: "甜菜", gi: 64, category: "medium", desc: "根茎类", image: "🥕", imageType: "emoji" },
  { id: 34, name: "藜麦", gi: 53, category: "low", desc: "完全蛋白", image: "🌾", imageType: "emoji" },
  { id: 35, name: "荞麦", gi: 54, category: "low", desc: "无麸质", image: "🌾", imageType: "emoji" },

  { id: 36, name: "白米饭", gi: 83, category: "high", desc: "精制碳水，升糖快", image: "white-rice", imageType: "photo", nutrition: { calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4 } },
  { id: 37, name: "白面包", gi: 75, category: "high", desc: "精制面粉", image: "white-bread", imageType: "photo" },
  { id: 38, name: "馒头", gi: 88, category: "high", desc: "传统主食", image: "🥟", imageType: "emoji" },
  { id: 39, name: "油条", gi: 75, category: "high", desc: "油炸食品", image: "🥖", imageType: "emoji" },
  { id: 40, name: "西瓜", gi: 72, category: "high", desc: "水分多糖分高", image: "watermelon", imageType: "photo" },
  { id: 41, name: "荔枝", gi: 79, category: "high", desc: "高糖水果", image: "🍈", imageType: "emoji" },
  { id: 42, name: "龙眼", gi: 74, category: "high", desc: "热带高糖", image: "🍈", imageType: "emoji" },
  { id: 43, name: "薯片", gi: 80, category: "high", desc: "油炸淀粉", image: "🍟", imageType: "emoji" },
  { id: 44, name: "炸鸡", gi: 75, category: "high", desc: "裹粉油炸", image: "🍗", imageType: "emoji" },
  { id: 45, name: "甜甜圈", gi: 76, category: "high", desc: "高糖高脂", image: "🍩", imageType: "emoji" },
  { id: 46, name: "蛋糕", gi: 77, category: "high", desc: "精制糖", image: "🍰", imageType: "emoji" },
  { id: 47, name: "可乐", gi: 90, category: "high", desc: "液体糖", image: "🥤", imageType: "emoji" },
  { id: 48, name: "饼干", gi: 70, category: "high", desc: "精制面粉", image: "🍪", imageType: "emoji" },
  { id: 49, name: "白粥", gi: 88, category: "high", desc: "糊化淀粉", image: "🥣", imageType: "emoji" },
  { id: 50, name: "米粉", gi: 84, category: "high", desc: "精制米制", image: "🍜", imageType: "emoji" },
  { id: 51, name: "糯米", gi: 87, category: "high", desc: "支链淀粉", image: "🍚", imageType: "emoji" },
  { id: 52, name: "土豆泥", gi: 85, category: "high", desc: "淀粉糊化", image: "🥔", imageType: "emoji" },
  { id: 53, name: "玉米片", gi: 81, category: "high", desc: "加工谷物", image: "🥣", imageType: "emoji" },
  { id: 54, name: "棉花糖", gi: 85, category: "high", desc: "纯糖", image: "🍬", imageType: "emoji" },
  { id: 55, name: "巧克力", gi: 70, category: "high", desc: "高糖零食", image: "🍫", imageType: "emoji" },
];

export const getGICategory = (gi: number): "low" | "medium" | "high" => {
  if (gi <= 55) return "low";
  if (gi <= 69) return "medium";
  return "high";
};

export const getGIColor = (category: "low" | "medium" | "high"): string => {
  switch (category) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "destructive";
  }
};

export const getGIAdvice = (gi: number): string => {
  if (gi <= 55) return "低GI食物，适合糖尿病患者日常食用";
  if (gi <= 69) return "中GI食物，建议适量搭配低GI食物";
  return "高GI食物，不建议糖尿病患者食用";
};
