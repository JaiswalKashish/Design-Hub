import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const OFFICE_TYPES = [
  "All",
  "Police Station", 
  "Hospitals", 
  "Passport Office", 
  "Municipality", 
  "Post Office", 
  "Electricity Office", 
  "Water Department"
];

// Mock data
const OFFICES = [
  { id: 1, name: "Central Police Station", type: "Police Station", address: "M.G. Road, District Center", distance: "1.2 km", status: "Open 24/7", phone: "100" },
  { id: 2, name: "District General Hospital", type: "Hospitals", address: "Civil Lines, Near Bus Stand", distance: "2.5 km", status: "Open 24/7", phone: "102" },
  { id: 3, name: "Passport Seva Kendra", type: "Passport Office", address: "IT Park, Sector 4", distance: "4.8 km", status: "Closes at 5 PM", phone: "1800-258-1800" },
  { id: 4, name: "Municipal Corporation", type: "Municipality", address: "Town Hall, City Center", distance: "1.5 km", status: "Closes at 6 PM", phone: "011-2345678" },
  { id: 5, name: "Head Post Office", type: "Post Office", address: "Railway Station Road", distance: "3.1 km", status: "Closes at 4 PM", phone: "155232" },
  { id: 6, name: "Electricity Board Office", type: "Electricity Office", address: "Power House, Sector 2", distance: "2.0 km", status: "Closes at 5 PM", phone: "1912" },
];

export default function NearbyPage() {
  const [filter, setFilter] = useState("All");

  const filteredOffices = filter === "All" ? OFFICES : OFFICES.filter(o => o.type === filter);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nearby Government Offices</h1>
        <p className="text-muted-foreground mt-1">Find and navigate to the nearest public service centers.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Map Area */}
        <div className="lg:w-2/3 h-[40vh] lg:h-full rounded-2xl border bg-muted/30 overflow-hidden relative shadow-inner">
          {/* Faux Map Background using CSS pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-background rounded-full shadow-lg flex items-center justify-center mb-4 border-4 border-primary relative">
              <MapPin className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Map Loading...</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              In a real application, this space would render a react-leaflet or Google Maps component showing your location and nearby offices.
            </p>
          </div>
          
          {/* Map Controls Mock */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <div className="bg-background rounded-md shadow-md border overflow-hidden flex flex-col">
              <button className="p-2 hover:bg-muted font-bold">+</button>
              <div className="h-px bg-border"></div>
              <button className="p-2 hover:bg-muted font-bold">-</button>
            </div>
            <button className="bg-background p-2 rounded-md shadow-md border hover:bg-muted text-primary">
              <Navigation className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* List Area */}
        <div className="lg:w-1/3 flex flex-col h-[50vh] lg:h-full">
          <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide flex gap-2 shrink-0">
            {OFFICE_TYPES.map(type => (
              <Badge 
                key={type}
                variant={filter === type ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm ${
                  filter !== type ? 'hover:bg-muted border-border' : ''
                }`}
                onClick={() => setFilter(type)}
              >
                {type}
              </Badge>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <motion.div initial={false} className="space-y-4">
              {filteredOffices.map((office, i) => (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">{office.name}</h3>
                        <Badge variant="secondary" className="text-xs shrink-0">{office.distance}</Badge>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-foreground/50" />
                          <span>{office.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-foreground/70">
                            <Clock className="h-3.5 w-3.5" />
                            <span className={office.status.includes('24/7') ? 'text-green-600 font-medium' : ''}>
                              {office.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-primary font-medium">
                            <Phone className="h-3.5 w-3.5" />
                            {office.phone}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full mt-4 h-9 text-xs">
                        <Navigation className="mr-2 h-3.5 w-3.5" /> Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredOffices.length === 0 && (
                <div className="text-center p-8 bg-muted/30 rounded-xl border border-dashed">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No offices found in this category nearby.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}