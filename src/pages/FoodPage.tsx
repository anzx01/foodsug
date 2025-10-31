import { useState } from "react";
import { foodDatabase, Food } from "@/data/foodDatabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import all food photos
import appleImg from "@/assets/foods/apple.jpg";
import orangeImg from "@/assets/foods/orange.jpg";
import whiteRiceImg from "@/assets/foods/white-rice.jpg";
import bananaImg from "@/assets/foods/banana.jpg";
import oatmealImg from "@/assets/foods/oatmeal.jpg";
import whiteBreadImg from "@/assets/foods/white-bread.jpg";
import strawberryImg from "@/assets/foods/strawberry.jpg";
import broccoliImg from "@/assets/foods/broccoli.jpg";
import watermelonImg from "@/assets/foods/watermelon.jpg";
import brownRiceImg from "@/assets/foods/brown-rice.jpg";

const foodImages: Record<string, string> = {
  apple: appleImg,
  orange: orangeImg,
  "white-rice": whiteRiceImg,
  banana: bananaImg,
  oatmeal: oatmealImg,
  "white-bread": whiteBreadImg,
  strawberry: strawberryImg,
  broccoli: broccoliImg,
  watermelon: watermelonImg,
  "brown-rice": brownRiceImg,
};

type FilterType = "all" | "low" | "medium" | "high";

export const FoodPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredFoods = foodDatabase.filter((food) => {
    if (activeFilter === "all") return true;
    return food.category === activeFilter;
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-lg mx-auto pt-6 px-4">
          <div className="gradient-header rounded-2xl p-6 mb-6 text-white shadow-success">
            <h1 className="text-2xl font-bold mb-2">食物库</h1>
            <p className="text-sm opacity-90">科学饮食，健康生活</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "shadow-md" : ""}
            >
              全部
            </Button>
            <Button
              variant={activeFilter === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("low")}
              className={activeFilter === "low" ? "bg-success hover:bg-success/90 shadow-success" : "hover:bg-success/10"}
            >
              低GI
            </Button>
            <Button
              variant={activeFilter === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("medium")}
              className={activeFilter === "medium" ? "bg-warning hover:bg-warning/90 shadow-warning" : "hover:bg-warning/10"}
            >
              中GI
            </Button>
            <Button
              variant={activeFilter === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("high")}
              className={activeFilter === "high" ? "bg-destructive hover:bg-destructive/90 shadow-destructive" : "hover:bg-destructive/10"}
            >
              高GI
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FoodCard = ({ food }: { food: Food }) => {
  const getGradient = (category: string) => {
    switch (category) {
      case "low":
        return "from-green-50 to-emerald-100";
      case "medium":
        return "from-amber-50 to-yellow-100";
      case "high":
        return "from-red-50 to-rose-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const shadowClass = 
    food.category === "low"
      ? "hover:shadow-success"
      : food.category === "medium"
      ? "hover:shadow-warning"
      : "hover:shadow-destructive";

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all ${shadowClass} group border-none`}>
      <div className={`aspect-square bg-gradient-to-br ${getGradient(food.category)} flex items-center justify-center relative overflow-hidden`}>
        {food.imageType === "photo" && foodImages[food.image] ? (
          <img
            src={foodImages[food.image]}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{food.image}</span>
        )}
      </div>
      <div className="p-3 space-y-2 bg-gradient-to-b from-card to-secondary/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{food.name}</h3>
          <Badge
            className={`text-xs ${
              food.category === "low"
                ? "bg-success text-success-foreground"
                : food.category === "medium"
                ? "bg-warning text-warning-foreground"
                : "bg-destructive text-destructive-foreground"
            }`}
          >
            {food.gi}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{food.desc}</p>
      </div>
    </Card>
  );
};
