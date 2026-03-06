"use client";

import { useState } from "react";
import { ArrowRight, Inbox, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductEnquiryFormProps {
  productId: string;
  productName: string;
}

export default function ProductEnquiryForm({
  productId,
  productName,
}: ProductEnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId,
          message: `Inquiry for product: ${productName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send enquiry");
      }

      toast.success("Enquiry sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-8 border-t border-gray-100/80">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-11 h-11 bg-primary text-white rounded-[0.9rem] flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,70,155,0.4)] transform rotate-3 transition-transform hover:rotate-0">
          <Inbox className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-primary leading-none mb-1">
            Request Quote
          </h2>
          <p className="text-[11px] text-primary/40 font-black uppercase tracking-tighter">
            Premium Service Desk
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-1.5 group">
          <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
            Full Name
          </label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="space-y-1.5 group">
          <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
            Email Address
          </label>
          <input
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
            placeholder="john@company.com"
          />
        </div>
        <div className="space-y-1.5 group">
          <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
            Phone Number
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
            placeholder="+91 98XXX XXXXX"
          />
        </div>
        <div className="space-y-1.5 group">
          <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
            Company Name
          </label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all placeholder:text-primary/30 hover:bg-white"
            placeholder="Company Pvt Ltd"
          />
        </div>
        <div className="space-y-1.5 group md:col-span-2">
          <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
            Industry Sector
          </label>
          <div className="relative">
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-xs font-bold text-primary transition-all hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">Select Industry</option>
              <option value="automotive">Automotive</option>
              <option value="aerospace">Aerospace</option>
              <option value="electronics">Electronics</option>
              <option value="industrial">Industrial Manufacturing</option>
              <option value="energy">Energy & Infrastructure</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 relative overflow-hidden group bg-primary text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(0,70,155,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(0,70,155,0.4)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Enquiry
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>
      <p className="text-[8px] text-center text-primary/30 font-black uppercase tracking-widest mt-6 opacity-60">
        Confidential inquiry • Response within 24h
      </p>
    </div>
  );
}
