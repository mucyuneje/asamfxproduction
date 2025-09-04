"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDeviceMobile, IconCurrencyBitcoin } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

type PaymentMethod = {
  account?: string;
  owner?: string;
  instructions?: string;
};

type PaymentSettings = {
  mobileMoney?: PaymentMethod;
  crypto?: PaymentMethod;
};

export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"MOBILE_MONEY" | "CRYPTO">("MOBILE_MONEY");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/payment-settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Payment settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );

  const currentMethod = activeMethod === "MOBILE_MONEY" ? settings.mobileMoney : settings.crypto;

  const updateMethodField = (field: keyof PaymentMethod, value: string) => {
    if (activeMethod === "MOBILE_MONEY") {
      setSettings({
        ...settings,
        mobileMoney: { ...settings.mobileMoney, [field]: value },
      });
    } else {
      setSettings({
        ...settings,
        crypto: { ...settings.crypto, [field]: value },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.h2
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Admin Payment Settings
      </motion.h2>

      {/* Method Buttons */}
      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Button
          variant={activeMethod === "MOBILE_MONEY" ? "default" : "outline"}
          onClick={() => setActiveMethod("MOBILE_MONEY")}
          className="flex items-center gap-2"
        >
          <IconDeviceMobile size={20} /> Mobile Money
        </Button>
        <Button
          variant={activeMethod === "CRYPTO" ? "default" : "outline"}
          onClick={() => setActiveMethod("CRYPTO")}
          className="flex items-center gap-2"
        >
          <IconCurrencyBitcoin size={20} /> Crypto
        </Button>
      </motion.div>

      {/* Inputs for Account, Owner, Instructions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {activeMethod === "MOBILE_MONEY" ? "Mobile Money" : "Crypto"} Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Account number / Wallet"
                value={currentMethod?.account || ""}
                onChange={(e) => updateMethodField("account", e.target.value)}
              />
              <Input
                placeholder="Owner Name"
                value={currentMethod?.owner || ""}
                onChange={(e) => updateMethodField("owner", e.target.value)}
              />
              <Input
                placeholder="Instructions / Notes"
                value={currentMethod?.instructions || ""}
                onChange={(e) => updateMethodField("instructions", e.target.value)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Show Both Accounts Side by Side */}
      <motion.div className="flex gap-4 flex-wrap mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
        {/* Mobile Money Card */}
        <Card className="flex-1 min-w-[220px] p-4 rounded-xl shadow-md bg-muted">
          <div className="flex items-center gap-4">
            <IconDeviceMobile size={36} className="text-primary" />
            <div>
              <p className="text-sm font-semibold">Mobile Money</p>
              <p className="text-lg font-mono">{settings.mobileMoney?.account || "Not set"}</p>
              <p className="text-sm">{settings.mobileMoney?.owner}</p>
              {settings.mobileMoney?.instructions && (
                <p className="text-xs text-muted-foreground">{settings.mobileMoney.instructions}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Crypto Card */}
        <Card className="flex-1 min-w-[220px] p-4 rounded-xl shadow-md bg-muted">
          <div className="flex items-center gap-4">
            <IconCurrencyBitcoin size={36} className="text-yellow-500" />
            <div>
              <p className="text-sm font-semibold">Crypto</p>
              <p className="text-lg font-mono">{settings.crypto?.account || "Not set"}</p>
              <p className="text-sm">{settings.crypto?.owner}</p>
              {settings.crypto?.instructions && (
                <p className="text-xs text-muted-foreground">{settings.crypto.instructions}</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
