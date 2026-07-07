import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFindSchemes } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, CheckCircle2, FileText, Globe, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  gender: z.string().min(1),
  occupation: z.string().min(1),
  income: z.string().min(1),
  state: z.string().min(1),
  category: z.string().min(1),
});

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
];

export default function SchemesPage() {
  const { user } = useAuth();
  const [hasSearched, setHasSearched] = useState(false);
  const findSchemes = useFindSchemes();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: "Male",
      occupation: "Salaried",
      income: "2.5L - 5L",
      state: "Maharashtra",
      category: "General",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setHasSearched(true);
    await findSchemes.mutateAsync({ data: values });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheme Finder</h1>
        <p className="text-muted-foreground mt-1">Discover government benefits and schemes tailored to your profile.</p>
      </div>

      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">Your Profile</CardTitle>
          <CardDescription>We use this information to find schemes you're eligible for.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Farmer">Farmer</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Salaried">Salaried</SelectItem>
                          <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                          <SelectItem value="Business Owner">Business Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="< 1L">Below ₹1 Lakh</SelectItem>
                          <SelectItem value="1L - 2.5L">₹1L - ₹2.5 Lakhs</SelectItem>
                          <SelectItem value="2.5L - 5L">₹2.5L - ₹5 Lakhs</SelectItem>
                          <SelectItem value="5L - 8L">₹5L - ₹8 Lakhs</SelectItem>
                          <SelectItem value="> 8L">Above ₹8 Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/UT</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDIAN_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="Minority">Minority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={findSchemes.isPending} className="w-full sm:w-auto min-w-[200px]">
                  {findSchemes.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Eligibility...</>
                  ) : (
                    <><Search className="mr-2 h-4 w-4" /> Find My Schemes</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended Schemes</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {findSchemes.data?.length || 0} Matches Found
            </Badge>
          </div>

          {findSchemes.isPending ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse bg-muted/20">
                  <CardHeader><div className="h-6 bg-muted rounded w-1/3 mb-2"></div><div className="h-4 bg-muted rounded w-2/3"></div></CardHeader>
                  <CardContent><div className="h-20 bg-muted rounded w-full"></div></CardContent>
                </Card>
              ))}
            </div>
          ) : findSchemes.data?.length === 0 ? (
            <div className="text-center p-12 border rounded-xl bg-card">
              <p className="text-muted-foreground">No schemes found matching your exact profile. Try adjusting your parameters.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {findSchemes.data?.map((scheme, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={scheme.id}
                >
                  <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                    <div className="h-2 w-full bg-gradient-to-r from-primary to-accent"></div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-primary">{scheme.name}</CardTitle>
                          <CardDescription className="mt-2 text-base text-foreground/80">{scheme.description}</CardDescription>
                        </div>
                        {scheme.category && (
                          <Badge variant="secondary">{scheme.category}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="flex items-center font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Benefits
                            </h4>
                            <p className="text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                              {scheme.benefits}
                            </p>
                          </div>
                          <div>
                            <h4 className="flex items-center font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" /> Required Documents
                            </h4>
                            <ul className="text-sm space-y-1 bg-muted/30 p-3 rounded-lg">
                              {scheme.documents.map((doc, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="mr-2 text-primary">•</span> {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Eligibility Criteria</h4>
                            <p className="text-sm p-3 rounded-lg border">{scheme.eligibility}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Application Process</h4>
                            <p className="text-sm text-muted-foreground">{scheme.applicationProcess}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t px-6 py-4 flex justify-end gap-3">
                      <Button variant="outline">Save Scheme</Button>
                      <Button asChild>
                        <a href={scheme.officialPortal} target="_blank" rel="noopener noreferrer">
                          Apply Official Portal <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}