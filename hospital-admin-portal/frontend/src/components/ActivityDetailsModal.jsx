import React from 'react';
import { X, Info, Clock, User, Shield, Terminal, ArrowRight } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityDetailsModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[70] px-4"
          >
            <Card 
              className="shadow-2xl border-primary/20"
              title="Event Details"
              subtitle="Comprehensive log information for the selected system event."
              headerAction={
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              }
            >
              <div className="space-y-8 py-2">
                {/* Header Info */}
                <div className="flex items-center gap-5 p-6 bg-secondary/50 rounded-3xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-lexend font-black text-xl border border-primary/20 shadow-inner">
                    {activity.avatar}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-lexend font-bold text-foreground">{activity.user}</h3>
                    <p className="text-sm text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} /> Certified Entity
                    </p>
                  </div>
                </div>

                {/* Event Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Terminal size={12} /> Action Performed
                         </p>
                         <p className="text-base font-bold text-foreground leading-relaxed">{activity.action}</p>
                      </div>
                      <div className="space-y-1.5">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Clock size={12} /> Timestamp
                         </p>
                         <p className="text-sm font-medium text-foreground">{activity.time} • Mar 27, 2026, 18:21</p>
                      </div>
                   </div>

                   <div className="p-4 bg-accent/30 rounded-2xl border border-border space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Metadata</p>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Event ID:</span>
                            <span className="font-mono font-bold text-primary">HC-LOG-{activity.id}992</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Security Level:</span>
                            <span className="px-2 py-0.5 bg-success/10 text-success rounded-md font-black">NORMAL</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Source IP:</span>
                            <span className="font-mono font-bold text-foreground">192.168.1.104</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Additional context */}
                <div className="p-5 bg-secondary/30 rounded-2xl border border-border italic text-sm text-muted-foreground leading-relaxed">
                   "This event was automatically logged by the HealthConnect Core Service. No further action is required unless security protocols dictate a manual review."
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    Close Log
                  </Button>
                  <Button 
                    className="flex-1"
                    icon={ArrowRight}
                  >
                    View Full Audit Trail
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityDetailsModal;
