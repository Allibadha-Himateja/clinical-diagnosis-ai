
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'doctor' | 'admin' | 'researcher' | 'patient') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Smith',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor' as const
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as const
  },
  {
    id: '3',
    name: 'Research Team',
    email: 'researcher@example.com',
    password: 'password123',
    role: 'researcher' as const
  },
  {
    id: '4',
    name: 'John Doe',
    email: 'patient@example.com',
    password: 'password123',
    role: 'patient' as const,
    patientId: '1' // Linked to the patient record with ID 1
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('clinicalUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - in real app would call actual authentication API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('clinicalUser', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome, ${foundUser.name}!`,
        });
        
        // Redirect based on role
        if (foundUser.role === 'patient') {
          navigate('/patient-portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: 'doctor' | 'admin' | 'researcher' | 'patient') => {
    setLoading(true);
    try {
      // Mock API call - in real app would call actual registration API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      const newUser = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        role,
        patientId: role === 'patient' ? (MOCK_USERS.length + 1).toString() : undefined
      };
      
      setUser(newUser);
      localStorage.setItem('clinicalUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      // Redirect based on role
      if (role === 'patient') {
        navigate('/patient-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinicalUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
