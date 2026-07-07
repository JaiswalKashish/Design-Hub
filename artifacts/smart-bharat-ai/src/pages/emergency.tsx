import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShieldAlert, Flame, Ambulance, Users, Baby, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { IndiaFlagIcon } from "@/components/ui/IndiaFlagIcon";

const EMERGENCIES = [
  { id: "police", name: "Police", number: "100", icon: ShieldAlert, color: "blue" },
  { id: "fire", name: "Fire Brigade", number: "101", icon: Flame, color: "red" },
  { id: "ambulance", name: "Ambulance", number: "102", icon: Ambulance, color: "green" },
  { id: "women", name: "Women Helpline", number: "1091", icon: Users, color: "purple" },
  { id: "child", name: "Child Helpline", number: "1098", icon: Baby, color: "orange" },
  { id: "disaster", name: "Disaster Management", number: "108", icon: AlertTriangle, color: "yellow" },
];

const colorVariants: Record<string, string> = {
  blue: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20",
  red: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
  green: "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20",
  purple: "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20",
  orange: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20",
  yellow: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
};

const iconColors: Record<string, string> = {
  blue: "text-blue-500",
  red: "text-red-500",
  green: "text-green-500",
  purple: "text-purple-500",
  orange: "text-orange-500",
  yellow: "text-amber-500",
};

export default function EmergencyPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-lg mb-8 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <h2 className="font-bold text-destructive text-lg">EMERGENCY ASSISTANCE</h2>
          <p className="text-destructive/80 text-sm">Tap any card below to call immediately. Only use these numbers in genuine emergencies.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-10">
        <div className="inline-flex items-center justify-center bg-background border px-4 py-1.5 rounded-full mb-2 shadow-sm">
          <IndiaFlagIcon className="w-5 h-4 mr-2" />
          <span className="font-bold text-sm tracking-widest uppercase text-muted-foreground">National Helplines</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Help is one tap away.</h1>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {EMERGENCIES.map((service) => (
          <motion.div key={service.id} variants={item}>
            <a href={`tel:${service.number}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl ring-offset-background">
              <Card className="h-full overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="p-8 flex flex-col items-center text-center flex-1">
                    <div className={`p-5 rounded-full bg-muted/50 mb-6 group-hover:scale-110 transition-transform duration-300 ${iconColors[service.color]}`}>
                      <service.icon className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                    <p className="text-5xl font-black font-mono tracking-tight my-4 {iconColors[service.color]}">{service.number}</p>
                  </div>
                  <div className={`py-4 px-6 flex items-center justify-center gap-2 font-bold text-lg transition-colors shadow-lg ${colorVariants[service.color]}`}>
                    <Phone className="h-5 w-5" />
                    CALL NOW
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>All calls to emergency numbers are toll-free and accessible even without a SIM card.</p>
      </div>
    </div>
  );
}