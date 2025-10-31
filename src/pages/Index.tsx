import { useState } from "react";
import { TabBar } from "@/components/TabBar";
import { RecognizePage } from "./RecognizePage";
import { FoodPage } from "./FoodPage";
import { ProfilePage } from "./ProfilePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"recognize" | "food" | "profile">("recognize");

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-hidden">
        {activeTab === "recognize" && <RecognizePage />}
        {activeTab === "food" && <FoodPage />}
        {activeTab === "profile" && <ProfilePage />}
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
