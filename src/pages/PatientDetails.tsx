
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPatients } from "@/lib/mockData";
import { Patient } from "@/lib/types";
import { ArrowLeft, Calendar, Clock, User, Activity, FileText } from "lucide-react";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data - in a real app this would be an API call
    const fetchPatient = () => {
      setLoading(true);
      setTimeout(() => {
        const foundPatient = mockPatients.find(p => p.id === id);
        if (foundPatient) {
          setPatient(foundPatient);
        }
        setLoading(false);
      }, 500);
    };

    fetchPatient();
  }, [id]);

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

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" asChild className="mb-8">
            <Link to="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Link>
          </Button>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Patient Not Found</h2>
            <p className="text-muted-foreground mt-2">The patient you're looking for doesn't exist</p>
          </div>
        </div>
      </div>
    );
  }

  // Mock diagnoses for the patient
  const diagnoses = [
    {
      id: '1',
      date: '2023-10-15',
      disease: 'Hypertension',
      confidence: 0.89,
      doctor: 'Dr. Smith',
      notes: 'Patient presented with elevated blood pressure. Recommended lifestyle changes and monitoring.'
    },
    {
      id: '2',
      date: '2023-09-20',
      disease: 'Type 2 Diabetes',
      confidence: 0.92,
      doctor: 'Dr. Johnson',
      notes: 'Follow-up confirmed initial diagnosis. Starting on metformin and dietary plan.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Information</CardTitle>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 text-primary">
                    <User size={36} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-center">{patient.name}</h3>
                  <p className="text-muted-foreground text-center">ID: {patient.id}</p>
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
                      <p className="text-sm text-muted-foreground">Added on</p>
                      <p className="font-medium">{patient.dateAdded}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Medical History</p>
                  {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {patient.medicalHistory.map((condition, i) => (
                        <li key={i} className="text-sm">{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">No medical history recorded</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="diagnoses">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="diagnoses">AI Diagnoses</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagnoses" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Assisted Diagnoses</CardTitle>
                    <CardDescription>
                      Record of all AI diagnostic predictions for this patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {diagnoses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No diagnoses recorded</p>
                        <Button asChild className="mt-4">
                          <Link to={`/diagnose?patientId=${patient.id}`}>
                            New Diagnosis
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {diagnoses.map((diagnosis) => (
                          <div key={diagnosis.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{diagnosis.disease}</h4>
                              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {(diagnosis.confidence * 100).toFixed(0)}% confidence
                              </div>
                            </div>
                            <div className="flex space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {diagnosis.date}
                              </div>
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                {diagnosis.doctor}
                              </div>
                            </div>
                            <p className="text-sm">{diagnosis.notes}</p>
                          </div>
                        ))}
                        <Button asChild>
                          <Link to={`/diagnose?patientId=${patient.id}`}>
                            New Diagnosis
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="records" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>
                      View and manage medical documentation for this patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No medical records available</p>
                      <Button variant="outline" className="mt-4">
                        Upload Medical Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
