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
  { id: 1, name: "绿豆", gi: 38, category: "low", desc: "低GI豆类，营养丰富", image: "lvdou", imageType: "photo" },
  { id: 2, name: "红豆", gi: 37, category: "low", desc: "高蛋白低GI食物", image: "hongdou", imageType: "photo" },
  { id: 3, name: "莲藕", gi: 49, category: "low", desc: "根茎类蔬菜，升糖缓慢", image: "lianou", imageType: "photo" },
  { id: 4, name: "小米粥", gi: 52, category: "low", desc: "粗粮粥品，营养丰富", image: "xiaomizhou", imageType: "photo" },
  { id: 5, name: "荞麦面", gi: 47, category: "low", desc: "无麸质面食，适合糖友", image: "qiaomaimian", imageType: "photo" },
  { id: 6, name: "芋头", gi: 54, category: "low", desc: "根茎类主食，低升糖", image: "yutou", imageType: "photo" },
  { id: 7, name: "冬瓜", gi: 15, category: "low", desc: "低卡蔬菜，几乎不升糖", image: "donggua", imageType: "photo" },
  { id: 8, name: "豆腐", gi: 15, category: "low", desc: "植物蛋白，升糖极低", image: "doufu", imageType: "photo" },
  { id: 9, name: "黄豆芽", gi: 25, category: "low", desc: "豆芽蔬菜，营养丰富", image: "huangdouya", imageType: "photo" },
  { id: 10, name: "黄瓜", gi: 15, category: "low", desc: "低卡蔬菜，水分充足", image: "huanggua", imageType: "photo" },
  { id: 11, name: "红薯粉丝", gi: 63, category: "medium", desc: "淀粉制品，升糖适中", image: "hongshufensi", imageType: "photo" },
  { id: 12, name: "糙米饭", gi: 65, category: "medium", desc: "全谷物主食，保留米糠", image: "caomifan", imageType: "photo" },
  { id: 13, name: "刀削面", gi: 66, category: "medium", desc: "传统面食，升糖中等", image: "daoxiaomian", imageType: "photo" },
  { id: 14, name: "馄饨", gi: 60, category: "medium", desc: "带馅面食，升糖中等", image: "huntun", imageType: "photo" },
  { id: 15, name: "馒头", gi: 68, category: "medium", desc: "传统主食，升糖中等", image: "mantou", imageType: "photo" },
  { id: 16, name: "粽子", gi: 67, category: "medium", desc: "糯米制品，升糖中等", image: "zongzi", imageType: "photo" },
  { id: 17, name: "玉米", gi: 60, category: "medium", desc: "粗粮主食，营养均衡", image: "yumi", imageType: "photo" },
  { id: 18, name: "八宝粥", gi: 58, category: "medium", desc: "杂粮粥品，升糖中等", image: "babaozhou", imageType: "photo" },
  { id: 19, name: "薏仁", gi: 58, category: "medium", desc: "谷物杂粮，营养价值高", image: "yiren", imageType: "photo" },
  { id: 20, name: "山药", gi: 65, category: "medium", desc: "根茎类食物，升糖中等", image: "shanyao", imageType: "photo" },
  { id: 21, name: "油条", gi: 95, category: "high", desc: "油炸食品，升糖很快", image: "youtiao", imageType: "photo" },
  { id: 22, name: "炒米粉", gi: 85, category: "high", desc: "炒制米食，升糖较快", image: "chaomifen", imageType: "photo" },
  { id: 23, name: "白米粥", gi: 78, category: "high", desc: "精制米粥，升糖较快", image: "baimizhou", imageType: "photo" },
  { id: 24, name: "白米饭", gi: 83, category: "high", desc: "精制主食，升糖很快", image: "baimifan", imageType: "photo" },
  { id: 25, name: "糯米饭", gi: 87, category: "high", desc: "高升糖主食，需控制", image: "nuomifan", imageType: "photo" },
  { id: 26, name: "叉烧酥", gi: 76, category: "high", desc: "高糖高脂，升糖较快", image: "chashaosu", imageType: "photo" },
  { id: 27, name: "月饼", gi: 79, category: "high", desc: "高糖食品，升糖较快", image: "yuebing", imageType: "photo" },
  { id: 28, name: "炸春卷", gi: 82, category: "high", desc: "油炸食品，升糖很快", image: "zhachunjuan", imageType: "photo" },
  { id: 29, name: "绿豆糕", gi: 78, category: "high", desc: "传统糕点，升糖较快", image: "lvdougao", imageType: "photo" },
  { id: 30, name: "豆沙包", gi: 75, category: "high", desc: "高糖包点，升糖较快", image: "doushabao", imageType: "photo" },
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
