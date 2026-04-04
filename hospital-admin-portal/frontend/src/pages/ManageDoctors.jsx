import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Filter, 
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  RefreshCw
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import AddDoctorModal from '../components/AddDoctorModal';
import api from '../services/api';
import { cn } from '../lib/utils';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors/');
        setDoctors(response.data.map(doc => ({
          ...doc,
          specialty: doc.specialization || 'General',
          experience: doc.experience || 'N/A',
          status: 'Active',
          avatar: doc.name.split(' ').map(n => n[0]).join('').toUpperCase()
        })));
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = (newDoctor) => {
    setDoctors(prev => [newDoctor, ...prev]);
  };

  const handleEditDoctor = (updatedDoctor) => {
    setDoctors(prev => prev.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc));
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await api.delete(`/doctors/${id}`);
        setDoctors(prev => prev.filter(doc => doc.id !== id));
      } catch (error) {
        alert("Failed to delete doctor: " + error.message);
      }
    }
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const closePortalModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Doctor Profile",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-lexend font-bold text-sm border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
            {row.avatar}
          </div>
          <div>
            <p className="font-bold text-foreground transition-colors duration-200 group-hover:text-primary">{row.name}</p>
            <p className="text-xs text-muted-foreground font-medium">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Specialty",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-bold text-foreground/80">{row.specialty}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Stethoscope size={10} className="text-primary" />
            {row.experience} exp.
          </div>
        </div>
      )
    },
    {
      header: "Status",
      render: (row) => (
        <span className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
          row.status === 'Active' 
            ? 'bg-success/10 text-success border-success/20' 
            : 'bg-warning/10 text-warning border-warning/20'
        )}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 lg:translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={() => openEditModal(row)}
            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteDoctor(row.id)}
            className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-lexend font-black text-foreground tracking-tight">Doctor Directory</h1>
          <p className="text-muted-foreground font-medium">Manage and monitor all medical professionals in your network.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={fetchDoctors} loading={loading}>Sync Data</Button>
          <Button icon={UserPlus} onClick={() => setIsModalOpen(true)}>Add New Doctor</Button>
        </div>
      </div>

      {/* Filter and Search Card */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
          <div className="flex-1 max-w-2xl">
            <Input 
              icon={Search} 
              placeholder="Search by name, email, or specialty..." 
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={Filter} size="sm" className="font-bold">Filter</Button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <button className="p-2.5 text-muted-foreground hover:bg-accent rounded-xl transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="mt-10 -mx-6 border-t border-border/50">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
                <RefreshCw size={40} className="text-primary animate-spin opacity-20" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
             </div>
          ) : (
            <Table columns={columns} data={filteredDoctors} />
          )}
        </div>

        {/* Pagination placeholder */}
        {!loading && (
            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium">
                Showing <span className="font-black text-foreground underline decoration-primary decoration-2 underline-offset-4">1 to {filteredDoctors.length}</span> of {doctors.length} medical staff
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:bg-accent rounded-xl disabled:opacity-20 transition-all" disabled>
                <ChevronLeft size={22} />
                </button>
                <div className="flex items-center p-1 bg-secondary rounded-xl">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white font-black shadow-lg shadow-primary/20 text-sm">1</button>
                </div>
                <button className="p-2 text-muted-foreground hover:bg-accent rounded-xl transition-all" disabled>
                <ChevronRight size={22} />
                </button>
            </div>
            </div>
        )}
      </Card>

      <AddDoctorModal 
        isOpen={isModalOpen} 
        onClose={closePortalModal} 
        onAdd={handleAddDoctor} 
        onEdit={handleEditDoctor}
        initialData={editingDoctor}
      />
    </div>
  );
};

export default ManageDoctors;
