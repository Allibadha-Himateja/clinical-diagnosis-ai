
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/contexts/AuthContext";
import { mockPatients, mockModels } from "@/lib/mockData";
import { 
  Activity, 
  Users, 
  FileBarChart, 
  Brain, 
  Heart, 
  ArrowRight,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

// Generate some activity data
const activityData = [
  { name: 'Mon', predictions: 5 },
  { name: 'Tue', predictions: 8 },
  { name: 'Wed', predictions: 12 },
  { name: 'Thu', predictions: 7 },
  { name: 'Fri', predictions: 10 },
  { name: 'Sat', predictions: 3 },
  { name: 'Sun', predictions: 2 },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">
              Here's an overview of your clinical diagnosis system
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/diagnose">
              New Diagnosis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="Total Patients"
            description="All registered patients"
            icon={<Users size={20} />}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-semibold">{mockPatients.length}</div>
              <div className="flex items-center text-xs font-medium text-green-500">
                <ChevronUp className="mr-1 h-4 w-4" />
                12.5%
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Available Models"
            description="Trained prediction models"
            icon={<Brain size={20} />}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-semibold">{mockModels.length}</div>
              <div className="flex items-center text-xs font-medium text-green-500">
                <ChevronUp className="mr-1 h-4 w-4" />
                8.2%
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Recent Diagnoses"
            description="Last 7 days"
            icon={<Heart size={20} />}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-semibold">42</div>
              <div className="flex items-center text-xs font-medium text-red-500">
                <ChevronDown className="mr-1 h-4 w-4" />
                3.1%
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Diagnosis Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictions" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
            <div className="space-y-4">
              {mockPatients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years, {patient.gender}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/patients/${patient.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full">
                <Link to="/patients">
                  View All Patients
                </Link>
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Available Prediction Models</h3>
            <div className="space-y-4">
              {mockModels.map((model) => (
                <div 
                  key={model.id} 
                  className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {model.diseaseCategory} | Version: {model.version} | Accuracy: {(model.accuracy * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Button asChild>
                    <Link to={`/diagnose?model=${model.id}`}>
                      Use Model
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
