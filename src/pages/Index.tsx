
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity, Brain, HeartPulse, ShieldCheck, Workflow, ArrowRight, Check } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Activity size={28} className="mr-2 text-primary" />
            <span className="font-semibold text-xl">
              Clinical<span className="text-primary">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-primary">AI-Powered</span> Medical Diagnosis Support
              </h1>
              <p className="text-lg text-muted-foreground">
                Enhance your clinical decision-making with advanced machine learning algorithms
                that predict disease likelihood based on patient data and symptoms.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <p className="ml-2 text-muted-foreground">
                    High accuracy prediction models for cardiac, respiratory, and diabetic conditions
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <p className="ml-2 text-muted-foreground">
                    Secure patient data management and detailed analysis
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <p className="ml-2 text-muted-foreground">
                    Comprehensive visualization of prediction results and model performance
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    Login to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 p-6 flex items-center justify-center shadow-xl">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
                  <div className="flex items-center mb-4">
                    <HeartPulse className="h-6 w-6 text-primary mr-2" />
                    <h3 className="font-semibold">Cardiac Risk Assessment</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full animate-pulse-slow" style={{ width: "76%" }}></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-accent h-full rounded-full animate-pulse-slow" style={{ width: "54%" }}></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-destructive h-full rounded-full animate-pulse-slow" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="font-medium">87%</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className="font-medium text-destructive">High</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 h-20 w-20 bg-accent/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Advanced Features</h2>
            <p className="text-muted-foreground">
              Our platform combines medical expertise with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-lg p-6">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Machine Learning Models</h3>
              <p className="text-muted-foreground">
                State-of-the-art algorithms trained on extensive medical datasets to predict disease likelihood with high accuracy.
              </p>
            </div>
            
            <div className="bg-background border rounded-lg p-6">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Workflow size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clinical Decision Support</h3>
              <p className="text-muted-foreground">
                Comprehensive analysis tools to help healthcare professionals make informed diagnostic decisions.
              </p>
            </div>
            
            <div className="bg-background border rounded-lg p-6">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Patient Management</h3>
              <p className="text-muted-foreground">
                HIPAA-compliant patient record system with robust data protection and privacy controls.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-primary rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to transform your diagnostic process?
            </h2>
            <p className="mb-6 text-primary-foreground/80">
              Join healthcare professionals worldwide who are enhancing their diagnostic capabilities with AI.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Activity size={20} className="mr-2 text-primary" />
              <span className="font-semibold">
                Clinical<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ClinicalAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
