
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockModels, mockModelPerformance } from "@/lib/mockData";
import { ModelMetadata, ModelPerformance } from "@/lib/types";
import { Database, Plus, Eye } from "lucide-react";

const Models = () => {
  const { user } = useAuth();
  const [models] = useState<ModelMetadata[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<ModelMetadata | null>(null);
  const [selectedModelPerformance, setSelectedModelPerformance] = useState<ModelPerformance | null>(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const isAdmin = user?.role === "admin" || user?.role === "researcher";

  // For new model form
  const [newModel, setNewModel] = useState({
    name: "",
    version: "v1.0",
    diseaseCategory: "cardiac",
    description: "",
  });

  const handleModelSelect = (model: ModelMetadata) => {
    setSelectedModel(model);
    setSelectedModelPerformance(mockModelPerformance[model.id]);
  };

  const handleAddModel = () => {
    console.log("Adding new model:", newModel);
    // In a real application, this would send data to an API
    
    // Reset form
    setNewModel({
      name: "",
      version: "v1.0",
      diseaseCategory: "cardiac",
      description: "",
    });
    
    setShowAddModel(false);
  };

  // Performance metrics chart data
  const performanceData = selectedModelPerformance
    ? [
        {
          name: "Accuracy",
          value: selectedModelPerformance.accuracy,
        },
        {
          name: "Precision",
          value: selectedModelPerformance.precision,
        },
        {
          name: "Recall",
          value: selectedModelPerformance.recall,
        },
        {
          name: "F1 Score",
          value: selectedModelPerformance.f1Score,
        },
      ]
    : [];

  // Mock training history data
  const trainingHistoryData = [
    { epoch: 1, loss: 0.58, accuracy: 0.65 },
    { epoch: 2, loss: 0.45, accuracy: 0.72 },
    { epoch: 3, loss: 0.39, accuracy: 0.77 },
    { epoch: 4, loss: 0.35, accuracy: 0.80 },
    { epoch: 5, loss: 0.32, accuracy: 0.82 },
    { epoch: 6, loss: 0.30, accuracy: 0.84 },
    { epoch: 7, loss: 0.28, accuracy: 0.86 },
    { epoch: 8, loss: 0.26, accuracy: 0.87 },
    { epoch: 9, loss: 0.25, accuracy: 0.88 },
    { epoch: 10, loss: 0.24, accuracy: 0.89 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Diagnostic Models</h1>
            <p className="text-muted-foreground">
              Manage and monitor machine learning models for diagnosis
            </p>
          </div>
          
          {isAdmin && (
            <Dialog open={showAddModel} onOpenChange={setShowAddModel}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Model
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Model</DialogTitle>
                  <DialogDescription>
                    Enter details for a new diagnostic model to add to the system.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model-name" className="text-right">
                      Model Name
                    </Label>
                    <Input
                      id="model-name"
                      value={newModel.name}
                      onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model-version" className="text-right">
                      Version
                    </Label>
                    <Input
                      id="model-version"
                      value={newModel.version}
                      onChange={(e) => setNewModel({ ...newModel, version: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model-category" className="text-right">
                      Disease Category
                    </Label>
                    <Select
                      value={newModel.diseaseCategory}
                      onValueChange={(value) => setNewModel({ ...newModel, diseaseCategory: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiac">Cardiac</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="respiratory">Respiratory</SelectItem>
                        <SelectItem value="neurological">Neurological</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model-description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="model-description"
                      value={newModel.description}
                      onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model-file" className="text-right">
                      Upload Model
                    </Label>
                    <Input
                      id="model-file"
                      type="file"
                      className="col-span-3"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddModel(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddModel}>Add Model</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DashboardCard
              title="Available Models"
              description="AI models for medical diagnosis"
              icon={<Database className="h-5 w-5" />}
              className="h-full"
            >
              <div className="overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id} className={selectedModel?.id === model.id ? "bg-muted/50" : undefined}>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell className="capitalize">{model.diseaseCategory}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleModelSelect(model)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-2">
            {selectedModel ? (
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="history">Training History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{selectedModel.name}</h3>
                          <p className="text-muted-foreground">{selectedModel.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Version</div>
                            <div className="font-medium">{selectedModel.version}</div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Category</div>
                            <div className="font-medium capitalize">{selectedModel.diseaseCategory}</div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                            <div className="font-medium">
                              {typeof selectedModel.accuracy === 'number' 
                                ? (selectedModel.accuracy * 100).toFixed(1) 
                                : '0'}%
                            </div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                            <div className="font-medium">{selectedModel.lastUpdated}</div>
                          </div>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex space-x-2 mt-6">
                            <Button variant="outline">Update Model</Button>
                            <Button>Test Model</Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance">
                      {selectedModelPerformance && (
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[0, 1]} />
                                  <Tooltip 
                                    formatter={(value) => [
                                      `${(Number(value) * 100).toFixed(1)}%`,
                                      "Value"
                                    ]} 
                                  />
                                  <Legend />
                                  <Bar dataKey="value" name="Score" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="border rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-primary">
                                {(selectedModelPerformance.accuracy * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">Accuracy</div>
                            </div>
                            <div className="border rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-primary">
                                {(selectedModelPerformance.precision * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">Precision</div>
                            </div>
                            <div className="border rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-primary">
                                {(selectedModelPerformance.recall * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">Recall</div>
                            </div>
                            <div className="border rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-primary">
                                {(selectedModelPerformance.auc * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">AUC</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Training Progress</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={trainingHistoryData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="epoch" />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                              <Tooltip />
                              <Legend />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="loss"
                                name="Loss"
                                stroke="#ff7300"
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="accuracy"
                                name="Accuracy"
                                stroke="#387908"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg h-full p-10">
                <Database className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select a model from the list to view its details, performance metrics, and training history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
