"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { IconDeviceMobile, IconCurrencyBitcoin, IconLock } from "@tabler/icons-react";
import MuxPlayer from "@mux/mux-player-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Video = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  difficulty?: string;
  thumbnailUrl: string;
  playbackId?: string;
  price?: number;
};

type PaymentSettings = {
  mobileMoneyAccount?: string;
  mobileMoneyOwner?: string;
  mobileMoneyInstructions?: string;
  cryptoAccount?: string;
  cryptoOwner?: string;
  cryptoInstructions?: string;
};

type Payment = {
  id: string;
  videoId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: number;
};

export default function StudentContent() {
  const [activeTab, setActiveTab] = useState<"unpurchased" | "pending" | "purchased">("unpurchased");
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState<Video | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"priceAsc" | "priceDesc" | "titleAsc" | "titleDesc">("priceAsc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch videos
  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch("/api/mux/videos");
      const data = await res.json();
      setVideos(data);
    }
    fetchVideos();
  }, []);

  // Fetch payment settings
  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch("/api/admin/payment-settings");
      const data = await res.json();
      setSettings(data);
    }
    fetchSettings();
  }, []);

  // Fetch user payments
  const fetchPayments = async () => {
    const res = await fetch("/api/me/payments");
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmitPayment = async () => {
    if (!selectedVideo || !proofFile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("videoId", selectedVideo.id);
      formData.append("proof", proofFile);

      const res = await fetch("/api/admin/payments", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to submit payment");

      alert("Payment request submitted!");
      setSelectedVideo(null);
      setProofFile(null);
      await fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Error submitting payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const purchasedVideoIds = payments.filter(p => p.status === "APPROVED").map(p => p.videoId);
  const pendingVideoIds = payments.filter(p => p.status === "PENDING").map(p => p.videoId);

  const unpurchasedVideos = videos.filter(
    v => v.price && !purchasedVideoIds.includes(v.id) && !pendingVideoIds.includes(v.id)
  );
  const purchasedVideos = videos.filter(v => purchasedVideoIds.includes(v.id));
  const pendingVideos = videos.filter(v => pendingVideoIds.includes(v.id));

  const baseVideos =
    activeTab === "unpurchased"
      ? unpurchasedVideos
      : activeTab === "pending"
      ? pendingVideos
      : purchasedVideos;

  const filteredVideos = useMemo(() => {
    let temp = baseVideos;

    if (search) {
      temp = temp.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) temp = temp.filter(v => v.category === categoryFilter);
    if (difficultyFilter) temp = temp.filter(v => v.difficulty === difficultyFilter);

    switch (sortOrder) {
      case "priceAsc": temp.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "priceDesc": temp.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "titleAsc": temp.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "titleDesc": temp.sort((a, b) => b.title.localeCompare(a.title)); break;
    }

    return temp;
  }, [baseVideos, search, categoryFilter, difficultyFilter, sortOrder]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">My Videos</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["unpurchased", "pending", "purchased"].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
          >
            {tab === "unpurchased" ? "Unpurchased" : tab === "pending" ? "Pending Payment" : "Purchased"}
          </Button>
        ))}
      </div>

      {/* Filters with shadcn/ui Select */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          placeholder="Search videos..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="flex-1 min-w-[150px]"
        />
        <Select
          value={categoryFilter || "all"}
          onValueChange={value => { setCategoryFilter(value === "all" ? "" : value); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {[...new Set(videos.map(v => v.category))].map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={difficultyFilter || "all"}
          onValueChange={value => { setDifficultyFilter(value === "all" ? "" : value); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {[...new Set(videos.map(v => v.difficulty).filter(Boolean))].map(diff => (
              <SelectItem key={diff} value={diff}>{diff}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={value => { setSortOrder(value as any); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priceAsc">Price ↑</SelectItem>
            <SelectItem value="priceDesc">Price ↓</SelectItem>
            <SelectItem value="titleAsc">Title A-Z</SelectItem>
            <SelectItem value="titleDesc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedVideos.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">No videos available</p>
        )}

        {paginatedVideos.map(video => {
          const isPurchased = purchasedVideoIds.includes(video.id);
          const isPending = pendingVideoIds.includes(video.id);
          const isLocked = !isPurchased && !isPending;

          return (
            <Card
              key={video.id}
              className="relative overflow-hidden cursor-pointer"
              onClick={() => {
                if (isPending) setShowPendingModal(video); // show waiting modal
                else if (!isPurchased) setSelectedVideo(video);
              }}
            >
              {/* Locked videos */}
              {isLocked && (
                <>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover blur-sm grayscale"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 text-muted-foreground text-center">
                    <IconLock size={24} className="mb-1" />
                    <p className="font-semibold">Buy to Unlock</p>
                    <p>{video.price} USD</p>
                  </div>
                </>
              )}

              {/* Pending videos */}
              {isPending && (
                <>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover blur-sm grayscale"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20 text-primary font-semibold text-center animate-pulse">
                    <p>Pending Payment</p>
                    <p>{video.price} USD</p>
                  </div>
                </>
              )}

              {/* Purchased videos */}
              {isPurchased && (
                <MuxPlayer
                  playbackId={video.playbackId!}
                  metadata={{ video_title: video.title, video_id: video.id }}
                  autoPlay={false}
                  controls
                  className="w-full h-48"
                />
              )}

              <div className="p-3 space-y-1">
                <h3 className="font-semibold">{video.title}</h3>
                {video.subtitle && <p className="text-muted-foreground">{video.subtitle}</p>}
                <p className="text-muted-foreground text-sm">{video.description}</p>
                <p className="text-xs text-muted-foreground">
                  Category: {video.category} | Difficulty: {video.difficulty || "N/A"}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} size="sm">Prev</Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
            >
              {i + 1}
            </Button>
          ))}
          <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} size="sm">Next</Button>
        </div>
      )}

      {/* Payment Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex justify-center items-center overflow-auto bg-background/60 p-2">
          <div className="bg-background rounded-xl shadow-xl w-[700px] max-h-[400px] p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2 overflow-auto">
              <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
              {selectedVideo.subtitle && <p className="text-muted-foreground">{selectedVideo.subtitle}</p>}
              <p className="text-muted-foreground text-sm">{selectedVideo.description}</p>
              <p className="text-xs text-muted-foreground">
                Category: {selectedVideo.category} | Difficulty: {selectedVideo.difficulty || "N/A"}
              </p>
            </div>

            <Card className="space-y-2 overflow-auto p-2 max-h-[400px]">
              <h3 className="text-base font-semibold mb-1">Payment Methods</h3>
              {settings.mobileMoney?.account && (
                <Card className="flex flex-col md:flex-row items-start md:items-center gap-1 p-1 m-0">
                  <IconDeviceMobile size={20} className="flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-0">{settings.mobileMoney.owner || "Mobile Money Owner"}</p>
                    <p className="font-medium text-sm mb-0">{settings.mobileMoney.account}</p>
                    <p className="text-xs text-muted-foreground mb-0">{settings.mobileMoney.instructions}</p>
                  </div>
                </Card>
              )}
              {settings.crypto?.account && (
                <Card className="flex flex-col md:flex-row items-start md:items-center gap-1 p-1 m-0">
                  <IconCurrencyBitcoin size={20} className="flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-0">{settings.crypto.owner || "Crypto Owner"}</p>
                    <p className="font-medium text-sm mb-0">{settings.crypto.account}</p>
                    <p className="text-xs text-muted-foreground mb-0">{settings.crypto.instructions}</p>
                  </div>
                </Card>
              )}
              <div className="space-y-1 mt-1">
                <Label className="text-sm mb-0">Upload Payment Proof</Label>
                <Input type="file" className="text-sm p-1" onChange={e => setProofFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex gap-1 mt-1">
                <Button onClick={handleSubmitPayment} disabled={submitting || !proofFile} className="flex-1 text-sm p-1">
                  {submitting ? "Submitting..." : "I Paid"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedVideo(null)} className="flex-1 text-sm p-1">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Pending Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center overflow-auto bg-background/60 p-2">
          <div className="bg-background rounded-xl shadow-xl w-[400px] p-6 text-center">
            <h2 className="text-xl font-bold mb-4">{showPendingModal.title}</h2>
            <p className="mb-6">Waiting for Admin Asam to approve your payment.</p>
            <Button onClick={() => setShowPendingModal(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
