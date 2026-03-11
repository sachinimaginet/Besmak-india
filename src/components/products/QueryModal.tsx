"use client";

import { useQueryBasket, BasketProduct } from "@/context/QueryBasketContext";
import { X, Trash2, Send, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CaptchaData {
  question: string;
  token: string;
}

export default function QueryModal({ isOpen, onClose }: QueryModalProps) {
  const { basket, removeFromBasket, clearBasket } = useQueryBasket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    message: "",
  });

  const fetchCaptcha = async () => {
    try {
      const resp = await fetch("/api/captcha");
      const data = await resp.json();
      setCaptcha(data);
      setCaptchaAnswer("");
    } catch (e) {
      toast.error("Failed to load captcha");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCaptcha();
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productIds: basket.map((p) => p.id),
          captchaToken: captcha.token,
          captchaAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send enquiry");
      }

      toast.success("Enquiry sent successfully! We'll get back to you soon.");
      clearBasket();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      fetchCaptcha(); // Refresh captcha on failure
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/20 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,70,155,0.3)] border border-gray-100/50 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Left Side: Product List Summary */}
            <div className="md:w-5/12 bg-gray-50/80 p-6 md:p-8 lg:p-10 border-r border-gray-100 overflow-y-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Your Selection
                </div>
                <h2 className="text-2xl font-black text-primary leading-tight">
                  Enquiry Basket
                </h2>
                <p className="text-sm text-primary/50 font-medium">
                  {basket.length} product{basket.length > 1 ? "s" : ""} ready
                  for query.
                </p>
              </div>

              <div className="space-y-4">
                {basket.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    className="group bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <Trash2 className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest truncate">
                        {product.categoryName}
                      </p>
                      <h4 className="text-xs font-black text-primary truncate">
                        {product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromBasket(product.id)}
                      className="p-2 text-primary/20 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {basket.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-primary/40 font-bold uppercase tracking-widest">
                    Basket is empty
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Form */}
            <div className="md:w-7/12 p-6 md:p-8 lg:p-10 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 transition-colors text-primary/30"
              >
                <X className="w-6 h-6" />
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                      Full Name *
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all placeholder:text-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all placeholder:text-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9XXXX XXXXX"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all placeholder:text-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                      Company Name
                    </label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Pvt Ltd"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all placeholder:text-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                    Industry Sector
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Industry</option>
                    <option value="automotive">Automotive</option>
                    <option value="aerospace">Aerospace</option>
                    <option value="electronics">Electronics</option>
                    <option value="industrial">Industrial Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about your requirements..."
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none text-[13px] font-bold text-primary transition-all placeholder:text-primary/20 resize-none"
                  />
                </div>

                {/* Captcha Section */}
                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-black text-primary text-sm shadow-sm select-none">
                      {captcha ? captcha.question : "..."}
                    </div>
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      className="p-2 text-primary/40 hover:text-primary transition-colors"
                      title="Refresh Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grow">
                    <input
                      required
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="Calculate answer"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none text-sm font-black text-primary transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || basket.length === 0}
                  className="w-full relative overflow-hidden group bg-primary text-white py-5 rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(0,70,155,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(0,70,155,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Enquiry...
                      </>
                    ) : (
                      <>
                        Submit Bulk Enquiry
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
