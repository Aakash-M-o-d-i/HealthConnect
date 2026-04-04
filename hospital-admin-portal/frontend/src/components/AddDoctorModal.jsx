import React, { useState, useEffect } from 'react';
import { X, User, Mail, Stethoscope, Briefcase, Plus, Copy, Check, ShieldCheck, Key, Save, Loader2 } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AddDoctorModal = ({ isOpen, onClose, onAdd, onEdit, initialData }) => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [loading, setLoading] = useState(false);
  const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
    "Hematology", "Infectious Disease", "Nephrology", "Neurology", 
    "Oncology", "Pediatrics", "Psychiatry", "Radiology", 
    "Rheumatology", "Urology", "Orthopedics", "Ophthalmology", 
    "Gynecology", "General Medicine", "Emergency Medicine", 
    "Anesthesiology", "Pathology", "General Surgery", "ENT Specialization"
  ].sort();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    experience: '',
    status: 'Active'
  });
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        specialty: initialData.specialty || '',
        experience: initialData.experience || '',
        status: initialData.status || 'Active'
      });
      setStep('form');
    } else {
      setFormData({ name: '', email: '', specialty: '', experience: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setLoading(true);
    try {
      if (initialData) {
        const response = await api.put(`/doctors/${initialData.id}`, {
            name: formData.name,
            specialization: formData.specialty,
            experience: formData.experience,
            email: formData.email
        });
        onEdit({ 
            ...initialData, 
            ...formData, 
            avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() 
        });
        handleClose();
      } else {
        const password = generatePassword();
        const response = await api.post('/doctors/', {
            name: formData.name,
            specialization: formData.specialty,
            experience: formData.experience,
            email: formData.email,
            password: password
        });

        const newCredentials = { 
            username: formData.email, 
            password: password 
        };
        setCredentials(newCredentials);
        
        const newDoctor = {
          ...response.data,
          specialty: response.data.specialization,
          status: 'Active',
          experience: response.data.experience,
          avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        
        onAdd(newDoctor);
        setStep('success');
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', email: '', specialty: '', experience: '', status: 'Active' });
    setCredentials(null);
    setCopied(false);
    onClose();
  };

  const copyToClipboard = () => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEdit = !!initialData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70] px-4"
          >
            <Card 
              className="shadow-2xl border-primary/20"
              title={step === 'form' ? (isEdit ? "Edit Doctor Details" : "Add New Doctor") : "Credentials Generated"}
              subtitle={step === 'form' ? (isEdit ? "Update the professional profile of the doctor." : "Fill in the details to onboard a new medical professional.") : "Please share these login details with the doctor."}
              headerAction={
                <button 
                  onClick={handleClose}
                  className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              }
            >
              {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Dr. John Doe"
                      icon={User}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john.doe@hospital.com"
                      icon={Mail}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isEdit}
                    />
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Specialty</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Stethoscope size={18} />
                        </div>
                        <select
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleChange}
                          required
                          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select Specialty</option>
                          {specialties.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Plus size={16} className="rotate-45" />
                        </div>
                      </div>
                    </div>
                    <Input
                      label="Experience"
                      name="experience"
                      placeholder="e.g. 10 years"
                      icon={Briefcase}
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground ml-1">Current Status</label>
                      <div className="flex gap-4">
                          {['Active', 'On Leave'].map(status => (
                              <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                  <input 
                                      type="radio" 
                                      name="status" 
                                      value={status}
                                      checked={formData.status === status}
                                      onChange={handleChange}
                                      className="w-4 h-4 text-primary bg-secondary border-border focus:ring-primary/20"
                                  />
                                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{status}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      icon={loading ? Loader2 : (isEdit ? Save : Plus)}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : (isEdit ? "Save Changes" : "Onboard Doctor")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8 py-4">
                   <div className="flex justify-center">
                      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center border-4 border-success/5 shadow-inner">
                         <ShieldCheck className="text-success" size={40} />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 bg-secondary rounded-2xl border border-border group relative">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                            <User size={10} /> Username
                         </p>
                         <p className="text-lg font-lexend font-bold text-foreground">{credentials.username}</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-2xl border border-border group relative">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                            <Key size={10} /> Temporary Password
                         </p>
                         <p className="text-lg font-lexend font-bold text-foreground font-mono">{credentials.password}</p>
                      </div>
                   </div>

                   <div className="pt-4 flex flex-col gap-3">
                      <Button 
                        onClick={copyToClipboard}
                        variant={copied ? "secondary" : "primary"}
                        className="w-full py-4 text-base"
                        icon={copied ? Check : Copy}
                      >
                        {copied ? "Copied to Clipboard!" : "Copy All Credentials"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={handleClose}
                        className="w-full text-xs uppercase tracking-widest font-black"
                      >
                        Dismiss
                      </Button>
                   </div>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddDoctorModal;
