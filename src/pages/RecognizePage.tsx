import { useState } from "react";
import { Camera, Image as ImageIcon, RefreshCw, Flame, Wheat, Beef, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getGIAdvice } from "@/data/foodDatabase";
import { toast } from "sonner";

export const RecognizePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<{
    food_name: string;
    gi_value: number;
    suitable_for_diabetics: boolean;
    recommendation: string;
    estimated_nutrition: {
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
      fiber: number;
    };
  } | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        setSelectedImage(base64Image);
        await analyzeFood(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async (base64Image: string, retryCount = 0) => {
    setIsRecognizing(true);
    setRecognitionResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      const response = await fetch('http://localhost:3001/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.success && result.data) {
        setRecognitionResult(result.data);
        toast.success('识别完成！');
      } else {
        throw new Error(result.error || '识别失败');
      }

    } catch (error) {
      console.error('识别错误:', error);

      let errorMessage = '识别失败，请重试';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请检查网络连接';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '无法连接到服务器，请确保后端服务已启动';
        } else if (error.message.includes('HTTP 404')) {
          errorMessage = 'API接口不存在，请检查服务器配置';
        } else if (error.message.includes('HTTP 500')) {
          errorMessage = '服务器内部错误，请稍后重试';
        } else {
          errorMessage = error.message;
        }
      }

      // 如果是连接错误且重试次数小于2，自动重试
      if ((error instanceof Error && error.message.includes('Failed to fetch')) && retryCount < 2) {
        toast.loading(`连接失败，正在重试... (${retryCount + 1}/2)`);
        setTimeout(() => {
          analyzeFood(base64Image, retryCount + 1);
        }, 2000);
        return;
      }

      toast.error(errorMessage);
    } finally {
      setIsRecognizing(false);
    }
  };

  const getCategory = (gi: number): "low" | "medium" | "high" => {
    if (gi <= 55) return "low";
    if (gi <= 69) return "medium";
    return "high";
  };

  const handleReset = () => {
    setSelectedImage(null);
    setRecognitionResult(null);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="flex-1 overflow-auto pb-20 px-4">
        <div className="max-w-lg mx-auto pt-6">
          {/* Header */}
          <div className="gradient-header rounded-2xl p-6 mb-6 text-white shadow-success">
            <h1 className="text-2xl font-bold mb-2">食物识别</h1>
            <p className="text-sm opacity-90">AI智能识别，守护您的健康</p>
          </div>

          {!selectedImage ? (
            <div className="space-y-4 animate-fade-in">
              <label htmlFor="camera-input">
                <Button
                  size="lg"
                  className="w-full h-40 flex flex-col gap-4 gradient-success shadow-success hover:shadow-lg transition-all"
                  asChild
                >
                  <div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-semibold">拍照识别</span>
                    <span className="text-xs opacity-90">实时拍摄食物照片</span>
                  </div>
                </Button>
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              <label htmlFor="album-input">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-32 flex flex-col gap-3 border-2 hover:border-primary hover:bg-secondary/50 transition-all"
                  asChild
                >
                  <div>
                    <ImageIcon className="w-8 h-8 text-primary" />
                    <span className="font-semibold">相册选择</span>
                  </div>
                </Button>
                <input
                  id="album-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              <Card className="p-6 bg-gradient-to-br from-accent to-secondary border-none shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">使用提示</h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        拍摄或选择清晰的食物照片
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        AI自动识别并返回详细营养信息
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        根据GI值科学安排饮食
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-4 animate-scale-in">
              <Card className="overflow-hidden shadow-lg border-none">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="w-full h-64 object-cover"
                />
              </Card>

              {isRecognizing && (
                <Card className="p-8 bg-gradient-to-br from-card to-secondary/30 border-none shadow-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium">AI识别中...</p>
                    <p className="text-sm text-muted-foreground/70">正在分析食物成分</p>
                  </div>
                </Card>
              )}

              {recognitionResult && !isRecognizing && (
                <div className="space-y-4">
                  <Card className="p-6 space-y-4 shadow-lg border-none bg-gradient-to-br from-card to-secondary/20">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">
                        {recognitionResult.food_name}
                      </h2>
                      <Badge
                        className={`text-sm px-3 py-1 ${
                          getCategory(recognitionResult.gi_value) === "low"
                            ? "bg-success text-success-foreground shadow-success"
                            : getCategory(recognitionResult.gi_value) === "medium"
                            ? "bg-warning text-warning-foreground shadow-warning"
                            : "bg-destructive text-destructive-foreground shadow-destructive"
                        }`}
                      >
                        GI {recognitionResult.gi_value}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-24">
                          升糖指数
                        </span>
                        <div className="flex-1">
                          <Progress
                            value={(recognitionResult.gi_value / 100) * 100}
                            className={`h-3 ${
                              getCategory(recognitionResult.gi_value) === "low"
                                ? "[&>div]:bg-success"
                                : getCategory(recognitionResult.gi_value) === "medium"
                                ? "[&>div]:bg-warning"
                                : "[&>div]:bg-destructive"
                            }`}
                          />
                        </div>
                        <span className="text-xl font-bold text-foreground w-12 text-right">
                          {recognitionResult.gi_value}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-accent to-secondary border border-border/50">
                      <p className="text-sm text-accent-foreground leading-relaxed">
                        💡 {recognitionResult.recommendation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm font-medium text-muted-foreground">是否适合糖尿病患者:</span>
                      <Badge className={recognitionResult.suitable_for_diabetics ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                        {recognitionResult.suitable_for_diabetics ? "适合" : "不适合"}
                      </Badge>
                    </div>
                  </Card>

                  {recognitionResult.estimated_nutrition && (
                    <Card className="p-6 space-y-4 shadow-lg border-none">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <span className="text-2xl">🥗</span>
                        营养成分 <span className="text-sm text-muted-foreground font-normal">(每100g)</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <NutritionItem
                          icon={<Flame className="w-5 h-5" />}
                          label="热量"
                          value={recognitionResult.estimated_nutrition.calories}
                          unit="kcal"
                          color="text-orange-500"
                          bgColor="bg-orange-50"
                        />
                        <NutritionItem
                          icon={<Wheat className="w-5 h-5" />}
                          label="碳水"
                          value={recognitionResult.estimated_nutrition.carbs}
                          unit="g"
                          color="text-amber-500"
                          bgColor="bg-amber-50"
                        />
                        <NutritionItem
                          icon={<Beef className="w-5 h-5" />}
                          label="蛋白质"
                          value={recognitionResult.estimated_nutrition.protein}
                          unit="g"
                          color="text-red-500"
                          bgColor="bg-red-50"
                        />
                        <NutritionItem
                          icon={<Droplet className="w-5 h-5" />}
                          label="脂肪"
                          value={recognitionResult.estimated_nutrition.fat}
                          unit="g"
                          color="text-yellow-500"
                          bgColor="bg-yellow-50"
                        />
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <span className="text-sm font-medium text-foreground">膳食纤维</span>
                          <span className="text-lg font-bold text-primary">
                            {recognitionResult.estimated_nutrition.fiber}g
                          </span>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-secondary"
                    onClick={handleReset}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新识别
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NutritionItem = ({ 
  icon, 
  label, 
  value, 
  unit, 
  color, 
  bgColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  unit: string; 
  color: string;
  bgColor: string;
}) => {
  return (
    <div className={`${bgColor} rounded-xl p-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <div className={`${color}`}>{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};
