
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPatients } from "@/lib/mockData";
import { Patient } from "@/lib/types";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Patients = () => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "male" as "male" | "female" | "other",
    bloodType: "",
    medicalHistory: "",
    email: "",
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAddPatient = () => {
    // Validate form data
    if (!newPatient.name || !newPatient.age) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Name and age are required.",
      });
      return;
    }

    // Create new patient
    const currentDate = new Date().toISOString().split('T')[0];
    const newId = `patient-${patients.length + 1}`;
    
    const patientToAdd: Patient = {
      id: newId,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      bloodType: newPatient.bloodType || undefined,
      medicalHistory: newPatient.medicalHistory ? newPatient.medicalHistory.split(',').map(item => item.trim()) : undefined,
      dateAdded: currentDate,
      email: newPatient.email || undefined
    };
    
    // Add to state (in a real app, this would be an API call)
    setPatients([...patients, patientToAdd]);
    
    // Show success message
    toast({
      title: "Patient added",
      description: `${patientToAdd.name} has been added successfully.`,
    });
    
    // Reset form
    setNewPatient({
      name: "",
      age: "",
      gender: "male",
      bloodType: "",
      medicalHistory: "",
      email: "",
    });
    
    // Close dialog
    setIsDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Patients</h1>
            <p className="text-muted-foreground">
              Manage and view patient records
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's details below to add them to your records.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) => setNewPatient({ ...newPatient, gender: value as "male" | "female" | "other" })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bloodType" className="text-right">
                    Blood Type
                  </Label>
                  <Input
                    id="bloodType"
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., A+, O-, AB+"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="medicalHistory" className="text-right">
                    Medical History
                  </Label>
                  <Input
                    id="medicalHistory"
                    value={newPatient.medicalHistory}
                    onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                    className="col-span-3"
                    placeholder="Separate conditions with commas"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="col-span-3"
                    placeholder="patient@example.com"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddPatient}>Add Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6 flex justify-between">
          <div className="flex items-center w-full max-w-sm space-x-2">
            <Input
              type="search"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.bloodType}</TableCell>
                    <TableCell>{patient.dateAdded}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/patients/${patient.id}`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
