import { Camera, Apple, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabBarProps {
  activeTab: "recognize" | "food" | "profile";
  onTabChange: (tab: "recognize" | "food" | "profile") => void;
}

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        <button
          onClick={() => onTabChange("recognize")}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
            activeTab === "recognize"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Camera className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">识别</span>
        </button>
        
        <button
          onClick={() => onTabChange("food")}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
            activeTab === "food"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Apple className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">食物</span>
        </button>
        
        <button
          onClick={() => onTabChange("profile")}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
            activeTab === "profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">我的</span>
        </button>
      </div>
    </div>
  );
};
