import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Plus, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import ActivityDetailsModal from '../components/ActivityDetailsModal';
import api from '../services/api';
import { cn } from '../lib/utils';

const StatCard = ({ icon: Icon, label, value, trend, loading }) => (
  <Card className="group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="space-y-4 w-full">
        <div className={cn("p-3 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm")}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            {loading ? (
                <div className="h-9 w-20 bg-secondary animate-pulse rounded-lg"></div>
            ) : (
                <h2 className="text-3xl font-lexend font-bold text-foreground tracking-tight">{value}</h2>
            )}
            {trend && !loading && (
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-0.5",
                trend.startsWith('+') ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowRight size={10} className="rotate-90" />}
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const ActivityItem = ({ activity, onClick }) => (
  <div 
    onClick={() => onClick(activity)}
    className="flex items-center justify-between py-5 group cursor-pointer border-b border-border/50 last:border-0 hover:bg-accent/30 -mx-6 px-6 transition-all duration-200"
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-lexend font-bold text-primary shadow-sm border border-border group-hover:border-primary/20 transition-colors">
          {activity.avatar || "SY"}
        </div>
        {activity.status === 'live' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success border-2 border-background rounded-full">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></span>
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-foreground">
          <span className="font-bold text-primary">{activity.user}</span> {activity.action}
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5">
          {activity.time} • <span className="uppercase text-[9px] font-black tracking-widest text-primary/60">System Log</span>
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          Details
        </span>
        <div className="p-2 rounded-full h-10 w-10 flex items-center justify-center bg-transparent group-hover:bg-primary/10 transition-colors">
          <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-all transform group-hover:translate-x-1" />
        </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [stats, setStats] = useState({
    total_doctors: 0,
    total_pharmacies: 0,
    total_staff: 0,
    total_patients: 0,
    system_health: "99.9%"
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/activities')
      ]);
      setStats(statsRes.data);
      setActivities(activityRes.data);
    } catch (error) {
      console.error("Dashboard sync error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded border border-primary/20">Active Session</span>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">• Last Sync: {new Date().toLocaleTimeString()}</span>
           </div>
          <h1 className="text-4xl font-lexend font-black text-foreground tracking-tight underline decoration-primary decoration-8 underline-offset-[12px]">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-8 font-medium">Welcome back, Admin. Real-time network activity is listed below.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={fetchDashboardData} loading={loading}>Sync Network</Button>
          <Button icon={Plus}>Manual Activity</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Registered Doctors" 
          value={stats.total_doctors} 
          trend="+12%" 
          loading={loading}
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Partner Pharmacies" 
          value={stats.total_pharmacies} 
          trend="+5.4%" 
          loading={loading}
        />
        <StatCard 
          icon={Users} 
          label="Administrative Staff" 
          value={stats.total_staff} 
          trend="+2.1%" 
          loading={loading}
        />
        <StatCard 
          icon={Heart} 
          label="Unified Patients" 
          value={stats.total_patients} 
          trend="+8.7%" 
          loading={loading}
        />
      </div>

      {/* Full Width System Activity */}
      <Card 
        title="Live System Activity" 
        subtitle="Operational logs and network events happening across all departments."
        headerAction={
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchDashboardData} loading={loading} className="font-bold">Sync</Button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <Button variant="ghost" size="sm" icon={Filter} className="font-bold">Filter</Button>
            </div>
        }
      >
        <div className="mb-8 flex items-center justify-between gap-4">
             <div className="flex-1 max-w-md">
                <Input icon={Search} placeholder="Search activity logs..." className="bg-secondary/20 border-border/50" />
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-xl border border-success/20">
                    <span className={cn("w-2 h-2 bg-success rounded-full", loading ? "animate-spin" : "animate-pulse")}></span>
                    <span className="text-[10px] font-black text-success uppercase tracking-wider">
                        {loading ? "Syncing..." : "Live Feed"}
                    </span>
                </div>
             </div>
        </div>

        <div className="flex flex-col">
          {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <ActivityItem 
                  key={activity.id || idx} 
                  activity={activity} 
                  onClick={setSelectedActivity} 
                />
              ))
          ) : (
              <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <Activity size={48} className="opacity-10" />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Network quiet</p>
                    <p className="text-xs font-medium mt-1">No operational logs found in current cycle.</p>
                  </div>
              </div>
          )}
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
                Showing top {activities.length} network alerts. <span className="text-primary font-bold cursor-pointer hover:underline">Clear current log</span>
            </p>
            <button className="text-primary text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-3 transition-all group">
                Access Archives <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </Card>

      <ActivityDetailsModal 
        isOpen={!!selectedActivity} 
        onClose={() => setSelectedActivity(null)} 
        activity={selectedActivity} 
      />
    </div>
  );
};

export default Dashboard;
