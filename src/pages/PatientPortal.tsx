
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { mockPatients, mockPredictionResults } from "@/lib/mockData";
import { Patient, PredictionResult } from "@/lib/types";
import { Calendar, User, FileText, Activity, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientPortal = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch patient data associated with the logged-in user
    const fetchPatientData = () => {
      setLoading(true);
      
      setTimeout(() => {
        // For demo purposes, we'll find a patient with a matching ID if user is a patient
        // Or the first patient if the user is a healthcare provider
        if (user?.role === 'patient' && user?.patientId) {
          const foundPatient = mockPatients.find(p => p.id === user.patientId);
          if (foundPatient) {
            setPatient(foundPatient);
            
            // Get diagnoses for this patient from all categories
            const allDiagnoses: PredictionResult[] = [];
            Object.values(mockPredictionResults).forEach(categoryDiagnoses => {
              // In a real app, we would filter by patient ID
              // Here we're just showing all diagnoses as an example
              allDiagnoses.push(...categoryDiagnoses);
            });
            
            setDiagnoses(allDiagnoses);
          }
        } else {
          // For healthcare providers, show the first patient as an example
          if (mockPatients.length > 0) {
            setPatient(mockPatients[0]);
            
            // Get diagnoses from all categories for the first patient
            const allDiagnoses: PredictionResult[] = [];
            Object.values(mockPredictionResults).forEach(categoryDiagnoses => {
              allDiagnoses.push(...categoryDiagnoses);
            });
            
            setDiagnoses(allDiagnoses);
          }
        }
        
        setLoading(false);
      }, 1000);
    };

    fetchPatientData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-1">Patient Portal</h1>
        <p className="text-muted-foreground mb-8">
          View your health information and diagnostic results
        </p>
        
        {!patient ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">No Patient Record Found</h2>
            <p className="text-muted-foreground mt-2">We couldn't find your patient record</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 text-primary">
                      <User size={36} />
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{patient.name}</h2>
                    <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{patient.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium capitalize">{patient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium">{patient.bloodType || 'Not recorded'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Registered</p>
                        <p className="font-medium">{patient.dateAdded}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <DashboardCard 
                title="Medical History" 
                description="Your recorded health conditions" 
                icon={<FileText className="h-4 w-4" />}
              >
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {patient.medicalHistory.map((condition, i) => (
                      <li key={i}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No medical history recorded</p>
                )}
              </DashboardCard>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="diagnoses" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="diagnoses">
                    <Activity className="mr-2 h-4 w-4" />
                    Diagnoses
                  </TabsTrigger>
                  <TabsTrigger value="appointments">
                    <Calendar className="mr-2 h-4 w-4" />
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="records">
                    <Database className="mr-2 h-4 w-4" />
                    Medical Records
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="diagnoses">
                  <h2 className="text-xl font-semibold mb-4">Diagnostic Results</h2>
                  
                  {diagnoses.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium mb-1">No Diagnoses Found</h3>
                      <p className="text-muted-foreground">
                        You don't have any diagnostic results yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {diagnoses.map((diagnosis, index) => {
                        const riskColorClass = diagnosis.riskLevel === 'high' 
                          ? 'text-red-600 bg-red-50' 
                          : diagnosis.riskLevel === 'medium' 
                            ? 'text-yellow-600 bg-yellow-50' 
                            : 'text-green-600 bg-green-50';
                        
                        return (
                          <Card key={index}>
                            <CardContent className="p-5">
                              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{diagnosis.disease}</h3>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    <span>{diagnosis.date || '2023-10-15'}</span>
                                    <span className="mx-2">•</span>
                                    <span>Dr. Smith</span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 md:mt-0 w-fit ${riskColorClass}`}>
                                  {diagnosis.riskLevel.toUpperCase()} RISK
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="text-sm text-muted-foreground mb-1">Probability</div>
                                <div className="flex items-center">
                                  <div className="w-full bg-muted rounded-full h-2 mr-3">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${typeof diagnosis.probability === 'number' ? diagnosis.probability * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {typeof diagnosis.probability === 'number' ? (diagnosis.probability * 100).toFixed(1) : '0'}%
                                  </span>
                                </div>
                              </div>
                              
                              {diagnosis.suggestedTests && diagnosis.suggestedTests.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Recommended Tests</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {diagnosis.suggestedTests.map((test, i) => (
                                      <span key={i} className="px-2 py-1 bg-muted rounded-md text-xs">
                                        {test}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4 pt-4 border-t flex justify-end">
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="appointments">
                  <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
                  
                  <div className="text-center py-8 border rounded-lg">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-1">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any scheduled appointments
                    </p>
                    <Button>Schedule an Appointment</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="records">
                  <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                  
                  <div className="text-center py-8 border rounded-lg">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-1">Medical Records</h3>
                    <p className="text-muted-foreground mb-4">
                      View and download your medical records
                    </p>
                    <Button variant="outline">Request Records</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;
