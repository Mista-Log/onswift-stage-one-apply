import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="p-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
          <img 
            src="/white-logo.png" 
            alt="OnSwift Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-2xl font-bold text-foreground">OnSwift</span>
      </div>
    </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-12 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Join OnSwift's Elite <br />
              Freelancer Network.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with premium clients and work on exciting projects. 
              Apply now to join our community of top-tier freelancers.
            </p>
          </div>

          {/* CTA Question */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-foreground">
              Ready to unlock your potential?
            </h2>

            {/* Application Card */}
            <div className="flex justify-center">
              <Card 
                className="p-8 max-w-sm w-full cursor-pointer transition-all hover:shadow-medium hover:scale-105 bg-card border-border"
                onClick={() => navigate("/apply")}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">
                    I'm a Freelancer
                  </h3>
                  <p className="text-muted-foreground">
                    Apply to join our network of talented professionals
                  </p>
                  <Button 
                    className="w-full mt-4"
                    size="lg"
                  >
                    Start Application
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          <span>© 2024 OnSwift. All rights reserved.</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
