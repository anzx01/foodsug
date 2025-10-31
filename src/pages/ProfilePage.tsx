import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, Edit2 } from "lucide-react";
import {
  getBloodSugarRecords,
  saveBloodSugarRecord,
  updateBloodSugarRecord,
  deleteBloodSugarRecord,
  getRecentStatistics,
  BloodSugarRecord,
} from "@/data/bloodSugarStorage";
import { toast } from "sonner";
import { BloodSugarChart } from "@/components/BloodSugarChart";

export const ProfilePage = () => {
  const [records, setRecords] = useState<BloodSugarRecord[]>([]);
  const [statistics, setStatistics] = useState({ average: 0, min: 0, max: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BloodSugarRecord | null>(null);
  const [formData, setFormData] = useState({
    value: "",
    time: new Date().toISOString().slice(0, 16),
    type: "fasting" as "fasting" | "postprandial",
  });

  const loadData = () => {
    const data = getBloodSugarRecords();
    setRecords(data.sort((a, b) => b.timestamp - a.timestamp));
    setStatistics(getRecentStatistics(3));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value) {
      toast.error("请输入血糖值");
      return;
    }

    if (editingRecord) {
      updateBloodSugarRecord(editingRecord.id, {
        value: parseFloat(formData.value),
        time: formData.time.replace("T", " "),
        type: formData.type,
      });
      toast.success("记录已更新");
    } else {
      saveBloodSugarRecord({
        value: parseFloat(formData.value),
        time: formData.time.replace("T", " "),
        type: formData.type,
      });
      toast.success("记录已保存");
    }

    handleCloseDialog();
    loadData();
  };

  const handleEdit = (record: BloodSugarRecord) => {
    setEditingRecord(record);
    setFormData({
      value: record.value.toString(),
      time: record.time.replace(" ", "T"),
      type: record.type,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定删除此记录？")) {
      deleteBloodSugarRecord(id);
      toast.success("记录已删除");
      loadData();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRecord(null);
    setFormData({
      value: "",
      time: new Date().toISOString().slice(0, 16),
      type: "fasting",
    });
  };

  const chartData = records
    .slice(0, 30)
    .reverse()
    .map((r) => ({
      date: r.time.split(" ")[0],
      value: r.value,
    }));

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-lg mx-auto pt-6 px-4 space-y-6">
          {/* Header */}
          <div className="gradient-header rounded-2xl p-6 text-white shadow-success">
            <h1 className="text-2xl font-bold mb-2">我的血糖</h1>
            <p className="text-sm opacity-90">追踪记录，科学管理</p>
          </div>

          {/* Chart */}
          <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-card to-secondary/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📈</span>
              <h3 className="font-semibold text-foreground">血糖趋势</h3>
              <span className="text-sm text-muted-foreground">(近30天)</span>
            </div>
            <BloodSugarChart data={chartData} />
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in">
            <StatCard
              label="平均"
              value={statistics.average}
              icon={<Minus className="w-4 h-4" />}
              variant="default"
            />
            <StatCard
              label="最低"
              value={statistics.min}
              icon={<TrendingDown className="w-4 h-4" />}
              variant="success"
            />
            <StatCard
              label="最高"
              value={statistics.max}
              icon={<TrendingUp className="w-4 h-4" />}
              variant="warning"
            />
          </div>

          {/* Record Button */}
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            if (!open) handleCloseDialog();
            else setDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full h-14 gradient-success shadow-success hover:shadow-lg transition-all">
                <Plus className="w-5 h-5 mr-2" />
                <span className="text-base font-semibold">记录血糖</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRecord ? "编辑血糖记录" : "记录血糖"}</DialogTitle>
                <DialogDescription>
                  {editingRecord ? "修改您的血糖记录" : "输入您的血糖测量值以追踪血糖变化趋势"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="value">血糖值 (mmol/L)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder="请输入血糖值"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">测量时间</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">测量状态</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "fasting" | "postprandial") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">空腹</SelectItem>
                      <SelectItem value="postprandial">餐后2小时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  {editingRecord ? "更新记录" : "保存记录"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* History */}
          <Card className="p-6 shadow-lg border-none animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold text-foreground">历史记录</h3>
            </div>
            <div className="space-y-3">
              {records.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-accent/30 hover:shadow-md transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-foreground">
                        {record.value}
                      </span>
                      <span className="text-sm text-muted-foreground">mmol/L</span>
                      <Badge
                        variant={
                          record.value < 5.6 ? "default" :
                          record.value < 7.0 ? "outline" : "destructive"
                        }
                        className={`text-xs ${
                          record.value < 5.6 
                            ? "bg-success text-success-foreground" 
                            : record.value < 7.0
                            ? "bg-warning text-warning-foreground"
                            : ""
                        }`}
                      >
                        {record.value < 5.6 ? "正常" : record.value < 7.0 ? "偏高" : "高"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {record.time} •{" "}
                      {record.type === "fasting" ? "空腹" : "餐后2小时"}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-primary/10"
                      onClick={() => handleEdit(record)}
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-destructive/10"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  variant = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning";
}) => {
  const colorClass =
    variant === "success"
      ? "text-success bg-success/10"
      : variant === "warning"
      ? "text-warning bg-warning/10"
      : "text-primary bg-primary/10";

  const cardClass = 
    variant === "success"
      ? "shadow-success"
      : variant === "warning"
      ? "shadow-warning"
      : "shadow-md";

  return (
    <Card className={`p-4 border-none ${cardClass} bg-gradient-to-br from-card to-secondary/30`}>
      <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <span className="text-xs text-muted-foreground block mb-1">{label}</span>
      <p className="text-2xl font-bold text-foreground">{value || "—"}</p>
    </Card>
  );
};
