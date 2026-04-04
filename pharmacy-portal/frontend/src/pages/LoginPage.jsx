import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Pill, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

const LoginPage = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If already logged in, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <Pill className="text-primary w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold font-lexend text-foreground">Pharmacy Login</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access the pharmacy portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">
                            Pharmacy Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="pharmacy@healthconnect.com"
                                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground transition-all focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground transition-all focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            "Sign In to Pharmacy"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">
                        Authorized pharmacy staff only. Access is monitored and logged for compliance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
