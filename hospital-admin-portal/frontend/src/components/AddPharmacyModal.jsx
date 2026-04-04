import React, { useState, useEffect } from 'react';
import { X, Building2, Mail, Shield, MapPin, Phone, User, Plus, Copy, Check, ShieldCheck, Key, Save, Loader2 } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AddPharmacyModal = ({ isOpen, onClose, onAdd, onEdit, initialData }) => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    license_no: '',
    owner: '',
    address: '',
    city: '',
    phone: '',
    status: 'Active'
  });
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        license_no: initialData.license_no || '',
        owner: initialData.owner || '',
        address: initialData.address || '',
        city: initialData.city || '',
        phone: initialData.phone || '',
        status: initialData.status || 'Active'
      });
      setStep('form');
    } else {
      setFormData({ name: '', email: '', license_no: '', owner: '', address: '', city: '', phone: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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
            const response = await api.put(`/pharmacies/${initialData.id}`, {
                name: formData.name,
                email: formData.email,
                license_no: formData.license_no,
                owner: formData.owner,
                address: formData.address,
                city: formData.city,
                phone: formData.phone
            });
            onEdit({ 
                ...initialData, 
                ...formData, 
                avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) 
            });
            handleClose();
        } else {
            const password = generatePassword();
            const response = await api.post('/pharmacies/', {
                name: formData.name,
                email: formData.email,
                password: password,
                license_no: formData.license_no,
                owner: formData.owner,
                address: formData.address,
                city: formData.city,
                phone: formData.phone
            });

            const newCredentials = { 
                username: formData.email, 
                password: password 
            };
            setCredentials(newCredentials);
            
            const newPharmacy = {
              ...response.data,
              location: response.data.city || 'Unknown',
              status: 'Active',
              avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            };
            
            onAdd(newPharmacy);
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
    setFormData({ name: '', email: '', license_no: '', owner: '', address: '', city: '', phone: '', status: 'Active' });
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70] px-4"
          >
            <Card 
              className="shadow-2xl border-emerald-500/20"
              title={step === 'form' ? (isEdit ? "Update Partner Info" : "Register New Pharmacy") : "Pharmacy Credentials"}
              subtitle={step === 'form' ? (isEdit ? "Modify the operational details of the pharmacy." : "Expand the HealthConnect network with a new pharmacy partner.") : "Secure credentials for the new pharmacy partner."}
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
                      label="Pharmacy Name"
                      name="name"
                      placeholder="City Central Pharmacy"
                      icon={Building2}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="contact@citypharmacy.com"
                      icon={Mail}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isEdit}
                    />
                    <Input
                      label="License Number"
                      name="license_no"
                      placeholder="e.g. PH-2026-4412"
                      icon={Shield}
                      value={formData.license_no}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Owner Name"
                      name="owner"
                      placeholder="John Wilson"
                      icon={User}
                      value={formData.owner}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="+91 98765 43210"
                      icon={Phone}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Input
                      label="City"
                      name="city"
                      placeholder="e.g. Mumbai"
                      icon={MapPin}
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Full Address"
                    name="address"
                    placeholder="Shop No. 12, MG Road..."
                    icon={MapPin}
                    value={formData.address}
                    onChange={handleChange}
                  />
                  
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
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                      icon={loading ? Loader2 : (isEdit ? Save : Plus)}
                      disabled={loading}
                    >
                        {loading ? "Registering..." : (isEdit ? "Save Changes" : "Confirm Onboarding")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8 py-4">
                   <div className="flex justify-center">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/5 shadow-inner">
                         <ShieldCheck className="text-emerald-500" size={40} />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 bg-secondary rounded-2xl border border-border group relative">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                            <User size={10} /> Network Username
                         </p>
                         <p className="text-lg font-lexend font-bold text-foreground">{credentials.username}</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-2xl border border-border group relative">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                            <Key size={10} /> Network Password
                         </p>
                         <p className="text-lg font-lexend font-bold text-foreground font-mono">{credentials.password}</p>
                      </div>
                   </div>

                   <div className="pt-4 flex flex-col gap-3">
                      <Button 
                        onClick={copyToClipboard}
                        variant={copied ? "secondary" : "primary"}
                        className="w-full py-4 text-base bg-emerald-500 hover:bg-emerald-600"
                        icon={copied ? Check : Copy}
                      >
                        {copied ? "Copied Successfully!" : "Copy Portal Access"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={handleClose}
                        className="w-full text-[10px] uppercase tracking-widest font-black text-muted-foreground"
                      >
                        Back to Network View
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

export default AddPharmacyModal;
