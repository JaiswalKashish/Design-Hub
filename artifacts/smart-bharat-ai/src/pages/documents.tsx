import { useState } from "react";
import { useGetDocumentInfo } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CreditCard, Building2, Globe, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOCUMENT_TYPES = [
  "Passport",
  "PAN Card",
  "Driving License",
  "Birth Certificate",
  "Death Certificate",
  "Income Certificate",
  "Marriage Certificate",
  "Aadhaar",
  "Ration Card",
  "Voter ID"
];

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const getDocumentInfo = useGetDocumentInfo();

  const handleGetInfo = () => {
    if (!selectedDoc) return;
    getDocumentInfo.mutate({ data: { documentType: selectedDoc } });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Assistant</h1>
        <p className="text-muted-foreground mt-1">Get precise information about required documents, fees, and application processes.</p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Document Type
            </label>
            <Select value={selectedDoc} onValueChange={setSelectedDoc}>
              <SelectTrigger className="h-12 text-base border-primary/30 focus:ring-primary/50">
                <SelectValue placeholder="e.g. Passport, PAN Card..." />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map(doc => (
                  <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto h-12" 
            onClick={handleGetInfo}
            disabled={!selectedDoc || getDocumentInfo.isPending}
          >
            {getDocumentInfo.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Get Information"
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {getDocumentInfo.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden border-border/50">
              <div className="bg-primary/5 border-b px-6 py-4 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{getDocumentInfo.data.documentType}</h2>
              </div>
              
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b">
                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400 shrink-0">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Government Fees</h4>
                      <p className="font-semibold text-lg">{getDocumentInfo.data.fees}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Processing Time</h4>
                      <p className="font-semibold text-lg">{getDocumentInfo.data.processingTime}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Where to Apply</h4>
                      <div className="text-sm font-medium mt-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Offline: {getDocumentInfo.data.offlineOffice}</span>
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Online Portal Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
                  {/* Left Col - Documents */}
                  <div className="md:col-span-3 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-primary" /> Required Documents Checklist
                      </h3>
                      <div className="bg-muted/30 rounded-xl border p-4">
                        <ul className="space-y-3">
                          {getDocumentInfo.data.requiredDocuments.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0" />
                              <span className="text-sm md:text-base">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Col - Important Notes */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-amber-500" /> Important Notes
                      </h3>
                      <div className="space-y-3">
                        {getDocumentInfo.data.importantNotes.map((note, i) => (
                          <div key={i} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200/90 text-sm p-3 rounded-lg">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full h-12" asChild>
                        <a href={getDocumentInfo.data.onlinePortal} target="_blank" rel="noopener noreferrer">
                          Visit Official Portal <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}