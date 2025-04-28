
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockModels, mockModelPerformance } from "@/lib/mockData";
import { ModelMetadata } from "@/lib/types";
import { Brain, Activity, BarChart3, LucideCheck } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Generate some sample history data
const generateTrainingHistory = () => {
  const epochs = 30;
  const data = [];
  let accuracy = 0.65;
  let loss = 0.75;
  
  for (let i = 1; i <= epochs; i++) {
    accuracy += Math.random() * 0.03;
    accuracy = Math.min(accuracy, 0.98);
    
    loss -= Math.random() * 0.04;
    loss = Math.max(loss, 0.05);
    
    data.push({
      epoch: i,
      accuracy: parseFloat(accuracy.toFixed(3)),
      loss: parseFloat(loss.toFixed(3)),
      valAccuracy: parseFloat((accuracy - Math.random() * 0.05).toFixed(3)),
      valLoss: parseFloat((loss + Math.random() * 0.08).toFixed(3)),
    });
  }
  
  return data;
};

const Models = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(mockModels[0].id);
  
  const selectedModel = mockModels.find((m) => m.id === selectedModelId) || mockModels[0];
  const performance = mockModelPerformance[selectedModelId];
  
  // Generate training history for the selected model
  const trainingHistory = generateTrainingHistory();
  
  // Generate confusion matrix data
  const confusionMatrix = {
    labels: ["Healthy", "Disease A", "Disease B", "Disease C"],
    data: [
      [120, 5, 2, 1],
      [8, 98, 4, 2],
      [3, 7, 88, 5],
      [2, 1, 6, 92],
    ],
  };
  
  // Performance metrics for radar chart
  const performanceMetrics = [
    { metric: "Accuracy", value: performance.accuracy * 100 },
    { metric: "Precision", value: performance.precision * 100 },
    { metric: "Recall", value: performance.recall * 100 },
    { metric: "F1 Score", value: performance.f1Score * 100 },
    { metric: "AUC", value: performance.auc * 100 },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Models</h1>
            <p className="text-muted-foreground">
              View and analyze trained diagnostic models
            </p>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="space-y-4">
              {mockModels.map((model) => (
                <Card
                  key={model.id}
                  className={`cursor-pointer hover:border-primary transition-colors ${
                    selectedModelId === model.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedModelId(model.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{model.name}</span>
                      {selectedModelId === model.id && (
                        <LucideCheck className="h-5 w-5 text-primary" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{model.diseaseCategory}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Version:</span>
                        <span>{model.version}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span>{(model.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          asChild
                        >
                          <Link to={`/diagnose?model=${model.id}`}>
                            Use Model
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{selectedModel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{selectedModel.description}</p>
                
                <Tabs defaultValue="performance">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                    <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="performance" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Accuracy</span>
                              <span className="font-medium">{(performance.accuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${performance.accuracy * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Precision</span>
                              <span className="font-medium">{(performance.precision * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${performance.precision * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Recall</span>
                              <span className="font-medium">{(performance.recall * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${performance.recall * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>F1 Score</span>
                              <span className="font-medium">{(performance.f1Score * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${performance.f1Score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>AUC</span>
                              <span className="font-medium">{(performance.auc * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${performance.auc * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Radar Analysis</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceMetrics}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar
                                name="Model Performance"
                                dataKey="value"
                                stroke="#0ea5e9"
                                fill="#0ea5e9"
                                fillOpacity={0.6}
                              />
                              <Legend />
                              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="training" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Training History</h3>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={trainingHistory}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="accuracy"
                              name="Training Accuracy"
                              stroke="#0ea5e9"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="valAccuracy"
                              name="Validation Accuracy"
                              stroke="#6366f1"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="loss"
                              name="Training Loss"
                              stroke="#ef4444"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="valLoss"
                              name="Validation Loss"
                              stroke="#f97316"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="confusion" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Confusion Matrix</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="p-2 border"></th>
                              {confusionMatrix.labels.map((label, i) => (
                                <th key={i} className="p-2 border font-medium text-center">
                                  {label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {confusionMatrix.data.map((row, i) => (
                              <tr key={i}>
                                <th className="p-2 border font-medium text-center">
                                  {confusionMatrix.labels[i]}
                                </th>
                                {row.map((cell, j) => (
                                  <td
                                    key={j}
                                    className={`p-2 border text-center ${
                                      i === j
                                        ? "bg-green-100 text-green-800"
                                        : cell > 0
                                        ? "bg-red-50 text-red-800"
                                        : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Class-wise Performance</h4>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={confusionMatrix.labels.map((label, i) => {
                                const truePos = confusionMatrix.data[i][i];
                                const rowSum = confusionMatrix.data[i].reduce((a, b) => a + b, 0);
                                const colSum = confusionMatrix.data.reduce((a, b) => a + b[i], 0);
                                const precision = truePos / colSum;
                                const recall = truePos / rowSum;
                                const f1 = 2 * (precision * recall) / (precision + recall);
                                
                                return {
                                  name: label,
                                  precision: parseFloat((precision * 100).toFixed(1)),
                                  recall: parseFloat((recall * 100).toFixed(1)),
                                  f1: parseFloat((f1 * 100).toFixed(1)),
                                };
                              })}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="precision" name="Precision" fill="#0ea5e9" />
                              <Bar dataKey="recall" name="Recall" fill="#10b981" />
                              <Bar dataKey="f1" name="F1 Score" fill="#8b5cf6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
