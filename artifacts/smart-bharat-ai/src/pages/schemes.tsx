import { useState } from "react";
import { useFindSchemes } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Loader2, CheckCircle2, FileText, Globe, ExternalLink,
  BookmarkPlus, Star, AlertCircle, Sparkles, Building2, User,
  IndianRupee, MapPin, Users, Briefcase, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { IndiaFlagIcon } from "@/components/ui/IndiaFlagIcon";

const formSchema = z.object({
  age: z.coerce.number().min(1, "Age required").max(120),
  gender: z.string().min(1, "Gender required"),
  occupation: z.string().min(1, "Occupation required"),
  income: z.string().min(1, "Income required"),
  state: z.string().min(1, "State required"),
  category: z.string().min(1, "Category required"),
});

type FormValues = z.infer<typeof formSchema>;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh",
  "Puducherry", "Goa"
];

interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  documents: string[];
  applicationProcess: string;
  officialPortal: string;
  department?: string;
  type?: string;
}

function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Scheme Saved", description: `"${scheme.name}" has been saved to your profile.` });
  };

  const isCentral = scheme.type === "Central";
  const badgeColor = isCentral
    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border border-border/60 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group bg-card">
        {/* Top gradient bar */}
        <div className={`h-1.5 w-full ${isCentral ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" : "bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500"}`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 ${badgeColor}`}>
                  {isCentral ? "🏛️ Central Scheme" : "🗺️ State Scheme"}
                </Badge>
                {scheme.department && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {scheme.department}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                {scheme.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{scheme.description}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-10 rounded-xl bg-primary/10 flex items-center justify-center p-1 border border-primary/20">
                <IndiaFlagIcon className="w-full h-full" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Benefits — always visible */}
          <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5" /> Key Benefits
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{scheme.benefits}</p>
          </div>

          {/* Eligibility — always visible */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Star className="h-3.5 w-3.5" /> Eligibility
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{scheme.eligibility}</p>
          </div>

          {/* Expandable section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-4"
              >
                {/* Documents */}
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3">
                    <FileText className="h-3.5 w-3.5" /> Required Documents
                  </h4>
                  <ul className="space-y-1.5">
                    {scheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Process */}
                {scheme.applicationProcess && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      <Globe className="h-3.5 w-3.5" /> How to Apply
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{scheme.applicationProcess}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="h-3.5 w-3.5" /> View documents & application process</>
            )}
          </button>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t px-6 py-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px]">{scheme.officialPortal}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saved}
              className="h-8 text-xs gap-1.5"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              asChild
            >
              <a href={scheme.officialPortal} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border border-border/40 bg-card">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse" />
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-28 bg-muted rounded-full animate-pulse" />
          <div className="h-5 w-36 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-6 w-2/3 bg-muted rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SchemesPage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [lastProfile, setLastProfile] = useState<FormValues | null>(null);
  const findSchemes = useFindSchemes();
  const { toast } = useToast();

  const form = useForm<FormValues>({
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

  const onSubmit = async (values: FormValues) => {
    setHasSearched(true);
    setLastProfile(values);
    try {
      await findSchemes.mutateAsync({ data: values });
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch schemes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const schemes = (findSchemes.data ?? []) as Scheme[];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Scheme Finder</h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          AI-powered government scheme recommendations tailored to your profile. Powered by Groq.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Your Citizen Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">We use this information to find schemes you are eligible for.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <User className="h-3.5 w-3.5 text-muted-foreground" /> Age
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={120} className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> Gender
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other / Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="occupation" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Occupation
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Farmer">Farmer / Agricultural Worker</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Salaried">Salaried Employee</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                        <SelectItem value="Business Owner">Business Owner</SelectItem>
                        <SelectItem value="Unemployed">Unemployed / Job Seeker</SelectItem>
                        <SelectItem value="Daily Wage Worker">Daily Wage Worker</SelectItem>
                        <SelectItem value="Homemaker">Homemaker</SelectItem>
                        <SelectItem value="Retired">Retired / Senior Citizen</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="income" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" /> Annual Income
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Below 1L">Below ₹1 Lakh</SelectItem>
                        <SelectItem value="1L - 2.5L">₹1L – ₹2.5 Lakhs</SelectItem>
                        <SelectItem value="2.5L - 5L">₹2.5L – ₹5 Lakhs</SelectItem>
                        <SelectItem value="5L - 8L">₹5L – ₹8 Lakhs</SelectItem>
                        <SelectItem value="8L - 12L">₹8L – ₹12 Lakhs</SelectItem>
                        <SelectItem value="Above 12L">Above ₹12 Lakhs</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> State / UT
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="max-h-56">
                        {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> Social Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC (Other Backward Class)</SelectItem>
                        <SelectItem value="SC">SC (Scheduled Caste)</SelectItem>
                        <SelectItem value="ST">ST (Scheduled Tribe)</SelectItem>
                        <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
                        <SelectItem value="Minority">Minority</SelectItem>
                        <SelectItem value="PwD">PwD (Person with Disability)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={findSchemes.isPending}
                  className="min-w-[200px] h-11 gap-2 text-sm font-semibold"
                >
                  {findSchemes.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Find My Schemes</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-6">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {findSchemes.isPending ? "Finding Schemes…" : `${schemes.length} Scheme${schemes.length !== 1 ? "s" : ""} Found`}
              </h2>
              {lastProfile && !findSchemes.isPending && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  For a {lastProfile.age}-year-old {lastProfile.gender.toLowerCase()} {lastProfile.occupation.toLowerCase()} in {lastProfile.state} ({lastProfile.category})
                </p>
              )}
            </div>
            {!findSchemes.isPending && schemes.length > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/20 border px-3 py-1 text-sm font-semibold">
                AI Powered
              </Badge>
            )}
          </div>

          {/* Loading skeletons */}
          {findSchemes.isPending && (
            <div className="grid gap-6">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {findSchemes.isError && !findSchemes.isPending && (
            <div className="flex items-start gap-4 p-6 rounded-xl border border-destructive/40 bg-destructive/5 text-sm">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive">Failed to fetch schemes</p>
                <p className="text-muted-foreground mt-1">The AI service encountered an error. Please try again.</p>
              </div>
            </div>
          )}

          {/* No results */}
          {!findSchemes.isPending && !findSchemes.isError && schemes.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-muted/20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold">No Exact Match Found</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                No schemes exactly match your profile. Try adjusting your income range or category to discover more options.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => form.setFocus("category")}>
                Adjust Profile
              </Button>
            </div>
          )}

          {/* Scheme cards */}
          {!findSchemes.isPending && schemes.length > 0 && (
            <div className="grid gap-6">
              {schemes.map((scheme, i) => (
                <SchemeCard key={scheme.id} scheme={scheme} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}