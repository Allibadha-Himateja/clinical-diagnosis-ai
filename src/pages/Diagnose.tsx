
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  mockPatients,
  mockModels,
  mockSymptomInputs,
  predictDisease
} from "@/lib/mockData";
import { SymptomInput, PredictionResult, Patient, ModelMetadata } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Diagnose = () => {
  const [searchParams] = useSearchParams();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const { toast } = useToast();
  
  // Get initial values from URL params
  useEffect(() => {
    const patientId = searchParams.get("patientId") || "";
    const modelId = searchParams.get("model") || "";
    
    if (patientId) setSelectedPatientId(patientId);
    if (modelId) {
      setSelectedModelId(modelId);
      const selectedModel = mockModels.find(m => m.id === modelId);
      if (selectedModel) {
        setSymptoms([...mockSymptomInputs[selectedModel.diseaseCategory]]);
      }
    }
  }, [searchParams]);
  
  // Update symptoms when model changes
  useEffect(() => {
    if (selectedModelId) {
      const selectedModel = mockModels.find(m => m.id === selectedModelId);
      if (selectedModel) {
        setSymptoms([...mockSymptomInputs[selectedModel.diseaseCategory]]);
        setResults([]);
      }
    } else {
      setSymptoms([]);
      setResults([]);
    }
  }, [selectedModelId]);
  
  const handleSymptomChange = (symptomId: string, value: number | boolean | string) => {
    setSymptoms(prevSymptoms =>
      prevSymptoms.map(symptom =>
        symptom.id === symptomId ? { ...symptom, value } : symptom
      )
    );
  };
  
  const handleRunPrediction = async () => {
    if (!selectedModelId) {
      toast({
        title: "Model required",
        description: "Please select a prediction model first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const results = await predictDisease(selectedModelId, symptoms);
      setResults(results);
      toast({
        title: "Prediction complete",
        description: "Disease prediction has been successfully generated",
      });
    } catch (error) {
      toast({
        title: "Prediction failed",
        description: "There was an error generating predictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedPatient = selectedPatientId 
    ? mockPatients.find(p => p.id === selectedPatientId) 
    : null;
    
  const selectedModel = selectedModelId 
    ? mockModels.find(m => m.id === selectedModelId) 
    : null;
    
  const getSymptomsByCategory = (category: string) => {
    return symptoms.filter(s => s.category === category);
  };

  // For the pie chart in results
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const pieChartData = results.map(result => ({
    name: result.disease,
    value: result.probability * 100
  }));
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">AI Disease Prediction</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient & Model Selection</CardTitle>
                <CardDescription>
                  Select a patient and prediction model to begin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="patient-select" className="mb-2 block">
                      Select Patient
                    </Label>
                    <Select
                      value={selectedPatientId}
                      onValueChange={setSelectedPatientId}
                    >
                      <SelectTrigger id="patient-select">
                        <SelectValue placeholder="Select a patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((patient: Patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.age}, {patient.gender})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="model-select" className="mb-2 block">
                      Prediction Model
                    </Label>
                    <Select
                      value={selectedModelId}
                      onValueChange={setSelectedModelId}
                    >
                      <SelectTrigger id="model-select">
                        <SelectValue placeholder="Select a model..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockModels.map((model: ModelMetadata) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} (Accuracy: {(model.accuracy * 100).toFixed(1)}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {selectedModel && (
                  <div className="mt-6">
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertTitle>Model Information</AlertTitle>
                      <AlertDescription>
                        <p className="mb-1">{selectedModel.description}</p>
                        <p className="text-sm">
                          <span className="font-semibold">Version:</span> {selectedModel.version} | 
                          <span className="font-semibold"> Category:</span> {selectedModel.diseaseCategory} |
                          <span className="font-semibold"> Last Updated:</span> {selectedModel.lastUpdated}
                        </p>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedModelId && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Clinical Data Input</CardTitle>
                  <CardDescription>
                    Enter symptoms and clinical data for diagnosis prediction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="symptoms">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                      <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                      <TabsTrigger value="labs">Lab Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="symptoms" className="space-y-4 mt-4">
                      {getSymptomsByCategory("symptom").map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`symptom-${symptom.id}`}
                            checked={symptom.value as boolean}
                            onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked)}
                          />
                          <Label htmlFor={`symptom-${symptom.id}`}>{symptom.name}</Label>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="vitals" className="space-y-6 mt-4">
                      {getSymptomsByCategory("vital").map((vital) => (
                        <div key={vital.id} className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`vital-${vital.id}`}>{vital.name}</Label>
                            <span className="text-sm font-medium">
                              {vital.value}
                            </span>
                          </div>
                          <Slider
                            id={`vital-${vital.id}`}
                            min={0}
                            max={vital.name.includes("BP") ? 200 : vital.name.includes("Heart Rate") ? 180 : 120}
                            step={1}
                            value={[Number(vital.value)]}
                            onValueChange={(value) => handleSymptomChange(vital.id, value[0])}
                          />
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="labs" className="space-y-6 mt-4">
                      {getSymptomsByCategory("lab").map((lab) => (
                        <div key={lab.id} className="space-y-2">
                          <Label htmlFor={`lab-${lab.id}`}>{lab.name}</Label>
                          <Input
                            id={`lab-${lab.id}`}
                            type="number"
                            value={lab.value.toString()}
                            onChange={(e) => handleSymptomChange(lab.id, parseFloat(e.target.value) || 0)}
                            step={0.1}
                          />
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleRunPrediction} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Generate Prediction
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            {selectedPatient && (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-lg">{selectedPatient.name}</p>
                      <p className="text-muted-foreground">
                        {selectedPatient.age} years, {selectedPatient.gender}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Blood Type</p>
                      <p>{selectedPatient.bloodType || "Not recorded"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Medical History</p>
                      {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedPatient.medicalHistory.map((condition, i) => (
                            <li key={i} className="text-sm">{condition}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No medical history recorded</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {results.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>
                    AI-generated diagnosis predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{result.disease}</h4>
                          <div className={`px-2 py-1 rounded text-xs ${
                            result.riskLevel === 'high'
                              ? 'bg-destructive/10 text-destructive'
                              : result.riskLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {result.riskLevel.toUpperCase()} RISK
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Probability</span>
                            <span>{(result.probability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={result.probability * 100} className="h-2" />
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Confidence</span>
                            <span>{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={result.confidence * 100} className="h-2" />
                        </div>
                        
                        {result.suggestedTests && result.suggestedTests.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-1">Suggested Tests</p>
                            <ul className="text-sm space-y-1">
                              {result.suggestedTests.map((test, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                                  {test}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Alert variant="default" className="bg-accent/20 border-accent/30">
                    <AlertTriangle className="h-4 w-4 text-accent-foreground" />
                    <AlertTitle>Clinical Decision Support</AlertTitle>
                    <AlertDescription className="text-sm">
                      These predictions are intended to assist clinical decision-making and 
                      should not replace professional medical judgment.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
