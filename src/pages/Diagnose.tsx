
// This file will need to be created with the appropriate implementation
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockModels, mockPatients, mockSymptomInputs, predictDisease } from "@/lib/mockData";
import { ModelMetadata, Patient, PredictionResult, SymptomInput } from "@/lib/types";
import { ArrowLeft, Stethoscope, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const Diagnose = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelMetadata | null>(null);
  const [symptomInputs, setSymptomInputs] = useState<SymptomInput[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [diagnosisCompleted, setDiagnosisCompleted] = useState(false);

  // Load patient data if patientId is provided in URL
  useEffect(() => {
    if (patientIdParam) {
      const patient = mockPatients.find(p => p.id === patientIdParam);
      if (patient) {
        setSelectedPatient(patient);
      }
    }
  }, [patientIdParam]);

  // Update symptom inputs when model is selected
  useEffect(() => {
    if (selectedModel) {
      const modelSymptoms = mockSymptomInputs[selectedModel.diseaseCategory];
      if (modelSymptoms) {
        setSymptomInputs([...modelSymptoms]);
      }
    }
  }, [selectedModel]);

  const handleModelChange = (modelId: string) => {
    const model = mockModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setPredictions([]);
      setDiagnosisCompleted(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  const handleSymptomChange = (id: string, value: number | boolean | string) => {
    setSymptomInputs(
      symptomInputs.map(input => 
        input.id === id ? { ...input, value } : input
      )
    );
  };

  const handleDiagnose = async () => {
    if (!selectedModel || !selectedPatient) {
      toast({
        title: "Error",
        description: "Please select both a patient and a diagnostic model.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const results = await predictDisease(selectedModel.id, symptomInputs);
      setPredictions(results);
      setDiagnosisCompleted(true);

      toast({
        title: "Diagnosis Complete",
        description: `Generated predictions using ${selectedModel.name}`,
      });
    } catch (error) {
      toast({
        title: "Diagnosis Failed",
        description: "There was an error running the diagnostic model.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-1">AI Diagnostic Assistant</h1>
        <p className="text-muted-foreground mb-8">
          Use machine learning models to predict possible diagnoses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <DashboardCard 
              title="Patient Selection" 
              description="Select the patient for diagnosis" 
              icon={<Stethoscope />}
            >
              <Select 
                value={selectedPatient?.id || ""} 
                onValueChange={handlePatientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.age}, {patient.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPatient && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                  <div>
                    <span className="font-medium">Age:</span> {selectedPatient.age}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {selectedPatient.gender}
                  </div>
                  <div>
                    <span className="font-medium">Blood Type:</span> {selectedPatient.bloodType || 'Not recorded'}
                  </div>
                  <div>
                    <span className="font-medium">Medical History:</span>
                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                      <ul className="list-disc list-inside mt-1 ml-2">
                        {selectedPatient.medicalHistory.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="block mt-1 ml-2">No history recorded</span>
                    )}
                  </div>
                </div>
              )}
            </DashboardCard>

            <DashboardCard 
              title="Model Selection" 
              description="Choose a diagnostic model to use" 
              icon={<CheckCircle2 />}
            >
              <Select 
                value={selectedModel?.id || ""} 
                onValueChange={handleModelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Diagnostic Model" />
                </SelectTrigger>
                <SelectContent>
                  {mockModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.diseaseCategory})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedModel && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                  <div>
                    <span className="font-medium">Version:</span> {selectedModel.version}
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span> {selectedModel.accuracy * 100}%
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {selectedModel.lastUpdated}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 ml-2">{selectedModel.description}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDiagnose}
                disabled={!selectedPatient || !selectedModel || loading}
                className="w-full mt-4"
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  'Generate Diagnosis'
                )}
              </Button>
            </DashboardCard>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                {!selectedModel ? (
                  <div className="flex flex-col items-center justify-center text-center h-full py-12">
                    <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
                    <p className="text-muted-foreground">
                      Please select a diagnostic model to see relevant input fields
                    </p>
                  </div>
                ) : diagnosisCompleted && predictions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Diagnostic Results</h3>
                      <Button variant="outline" size="sm" onClick={() => setDiagnosisCompleted(false)}>
                        Modify Inputs
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      {predictions.map((prediction, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-semibold text-lg">{prediction.disease}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeClass(prediction.riskLevel)}`}>
                              {prediction.riskLevel.toUpperCase()} RISK
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground mb-1">Probability</div>
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2 mr-3">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Number(prediction.probability) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {typeof prediction.probability === 'number' 
                                  ? (prediction.probability * 100).toFixed(1) 
                                  : '0'}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm text-muted-foreground mb-1">Model Confidence</div>
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2 mr-3">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Number(prediction.confidence) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {typeof prediction.confidence === 'number' 
                                  ? (prediction.confidence * 100).toFixed(1) 
                                  : '0'}%
                              </span>
                            </div>
                          </div>
                          
                          {prediction.suggestedTests && prediction.suggestedTests.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-2">Suggested Tests</h5>
                              <ul className="text-sm list-disc list-inside">
                                {prediction.suggestedTests.map((test, i) => (
                                  <li key={i}>{test}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button variant="outline" className="mr-2">Save to Patient Records</Button>
                      <Button>Print Results</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Enter Symptoms & Test Results</h3>
                    <Separator />
                    
                    <ScrollArea className="h-[500px] pr-4">
                      {symptomInputs.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          No input fields available for this model
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Group inputs by category */}
                          {['symptom', 'vital', 'lab'].map((category) => {
                            const categoryInputs = symptomInputs.filter(input => input.category === category);
                            if (categoryInputs.length === 0) return null;
                            
                            return (
                              <div key={category} className="space-y-4">
                                <h4 className="font-medium capitalize">{category} Inputs</h4>
                                
                                {categoryInputs.map((input) => {
                                  if (typeof input.value === 'boolean') {
                                    // Boolean inputs (symptoms)
                                    return (
                                      <div key={input.id} className="flex items-center justify-between">
                                        <Label htmlFor={input.id} className="flex-grow">{input.name}</Label>
                                        <Switch
                                          id={input.id}
                                          checked={input.value}
                                          onCheckedChange={(checked) => handleSymptomChange(input.id, checked)}
                                        />
                                      </div>
                                    );
                                  } else if (typeof input.value === 'number') {
                                    // Numeric inputs (vitals, labs)
                                    const min = 0;
                                    const max = 300;
                                    const step = 1;
                                    
                                    return (
                                      <div key={input.id} className="space-y-2">
                                        <div className="flex justify-between">
                                          <Label htmlFor={input.id}>{input.name}</Label>
                                          <span className="text-sm font-medium">{input.value}</span>
                                        </div>
                                        <Slider
                                          id={input.id}
                                          min={min}
                                          max={max}
                                          step={step}
                                          value={[input.value as number]}
                                          onValueChange={([value]) => handleSymptomChange(input.id, value)}
                                        />
                                      </div>
                                    );
                                  } else if (typeof input.value === 'string') {
                                    // Categorical inputs
                                    return (
                                      <div key={input.id} className="space-y-2">
                                        <Label htmlFor={input.id}>{input.name}</Label>
                                        <RadioGroup
                                          id={input.id}
                                          value={input.value}
                                          onValueChange={(value) => handleSymptomChange(input.id, value)}
                                          className="flex flex-col space-y-1"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="normal" id={`${input.id}-normal`} />
                                            <Label htmlFor={`${input.id}-normal`}>Normal</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="moderate" id={`${input.id}-moderate`} />
                                            <Label htmlFor={`${input.id}-moderate`}>Moderate</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="severe" id={`${input.id}-severe`} />
                                            <Label htmlFor={`${input.id}-severe`}>Severe</Label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                                
                                {category !== 'lab' && <Separator />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
