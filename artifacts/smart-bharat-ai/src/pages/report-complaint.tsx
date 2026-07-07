import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalyzeComplaint, useCreateComplaint } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, MapPin, Camera, Bus, Trash2, Zap, Droplets, Droplet, CheckCircle2, Loader2, ArrowRight, Bot
} from "lucide-react";
import confetti from "canvas-confetti";

const CATEGORIES = [
  { id: "Road", icon: MapPin, label: "Road & Potholes" },
  { id: "Garbage", icon: Trash2, label: "Garbage Collection" },
  { id: "Electricity", icon: Zap, label: "Electricity & Power" },
  { id: "Street Light", icon: Zap, label: "Street Lights" },
  { id: "Drainage", icon: Droplets, label: "Drainage Issue" },
  { id: "Water Leakage", icon: Droplet, label: "Water Supply" },
  { id: "Public Transport", icon: Bus, label: "Public Transport" },
];

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(5, "Location details are required"),
  description: z.string().min(20, "Please provide more details (min 20 chars)"),
});

export default function ReportComplaintPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  
  const analyzeComplaint = useAnalyzeComplaint();
  const createComplaint = useCreateComplaint();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      location: "",
      description: "",
    },
  });

  const categoryValue = form.watch("category");

  const nextStep = () => {
    if (step === 1 && !categoryValue) {
      form.setError("category", { type: "manual", message: "Select a category to proceed" });
      return;
    }
    
    if (step === 2) {
      const isValid = form.trigger(["location", "description"]);
      isValid.then(valid => {
        if (valid) {
          handleAnalyze();
        }
      });
      return;
    }
    
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleAnalyze = async () => {
    setStep(3);
    const values = form.getValues();
    await analyzeComplaint.mutateAsync({
      data: {
        category: values.category,
        description: values.description
      }
    });
  };

  const onSubmit = async () => {
    const values = form.getValues();
    const analysis = analyzeComplaint.data;
    
    const result = await createComplaint.mutateAsync({
      data: {
        userId: user!.id,
        category: values.category,
        description: values.description,
        location: values.location,
        department: analysis?.department,
        priority: analysis?.priority,
        severity: analysis?.severity,
      }
    });

    setGeneratedId(result.complaintId);
    setSuccessModalOpen(true);
    
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report a Complaint</h1>
        <p className="text-muted-foreground mt-1">Smart AI routing ensures your issue reaches the right department instantly.</p>
      </div>

      {/* Progress Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${((step - 1) / 2) * 100}%` }} 
          />
        </div>
        <div className="relative flex justify-between">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-4 border-background ${
                step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground px-2">
          <span>Category</span>
          <span>Details</span>
          <span>AI Analysis</span>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Card className="border-border/60 shadow-md">
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-4">What's the issue?</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => (
                          <div 
                            key={cat.id}
                            onClick={() => form.setValue("category", cat.id, { shouldValidate: true })}
                            className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center text-center gap-3 transition-all ${
                              categoryValue === cat.id 
                                ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary ring-offset-1' 
                                : 'hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <div className={`p-3 rounded-full ${categoryValue === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                              <cat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium">{cat.label}</span>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.category && (
                        <p className="text-sm text-destructive mt-2">{form.formState.errors.category.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Location</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="Enter precise location/landmark..." {...field} className="flex-1" />
                            </FormControl>
                            <Button type="button" variant="outline" size="icon"><MapPin className="h-4 w-4" /></Button>
                          </div>
                          <FormMessage />
                          {/* Map Placeholder */}
                          <div className="h-32 bg-muted/50 border rounded-lg mt-2 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <MapPin className="h-6 w-6 mx-auto mb-1 opacity-50" />
                              <span className="text-sm">Interactive Map</span>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the issue in detail..." 
                              className="min-h-[120px] resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="text-base block mb-2">Photo Evidence (Optional)</FormLabel>
                      <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="bg-primary/10 p-4 rounded-full text-primary mb-3">
                          <Camera className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-sm">Click to upload or drag & drop</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold">AI Analysis Complete</h3>
                      <p className="text-muted-foreground">We've structured your complaint for the authorities.</p>
                    </div>

                    {analyzeComplaint.isPending ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                          <Bot className="h-16 w-16 text-primary relative z-10 animate-bounce" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-lg flex items-center justify-center">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing your text...
                          </p>
                          <p className="text-sm text-muted-foreground">Identifying correct department and priority.</p>
                        </div>
                      </div>
                    ) : analyzeComplaint.data ? (
                      <div className="bg-muted/30 border rounded-xl p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Department</span>
                            <div className="font-medium">{analyzeComplaint.data.department}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Priority</span>
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${analyzeComplaint.data.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                              <span className="font-medium">{analyzeComplaint.data.priority}</span>
                            </div>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Categorized Issue</span>
                            <div className="font-medium">{analyzeComplaint.data.issue}</div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2 block">Optimized Description for Officials</span>
                          <p className="text-sm italic border-l-2 border-primary pl-4 py-1 text-foreground/80">
                            "{analyzeComplaint.data.suggestedDescription}"
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center px-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={analyzeComplaint.isPending || createComplaint.isPending}>
                Back
              </Button>
            ) : <div></div>}
            
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                onClick={onSubmit}
                disabled={analyzeComplaint.isPending || createComplaint.isPending}
              >
                {createComplaint.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Complaint Registered!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Your complaint has been successfully analyzed by AI and routed to the correct department.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted py-6 px-4 rounded-lg my-4 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground mb-1 font-medium">Tracking ID</span>
            <span className="text-3xl font-mono font-bold tracking-widest text-primary">{generatedId}</span>
          </div>
          
          <p className="text-sm text-muted-foreground px-4">
            Save this ID to track your complaint status. We've also sent an SMS to your registered number.
          </p>

          <DialogFooter className="sm:justify-center mt-6 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              setSuccessModalOpen(false);
              form.reset();
              setStep(1);
            }}>Report Another</Button>
            <Button asChild>
              <Link href="/track-complaint">Track Status Now</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}