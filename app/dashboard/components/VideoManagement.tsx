"use client";

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import MuxPlayer from "@mux/mux-player-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { IconCurrencyDollar, IconCheck, IconX, IconEdit } from "@tabler/icons-react";
import toast from "react-hot-toast";

type Video = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  difficulty?: string;
  paymentMethod: string;
  price?: number;
  uploadId: string;
  playbackId?: string;
};

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState<"All" | "Free" | "Paid">("All");
  const [sortByPriceAsc, setSortByPriceAsc] = useState<null | boolean>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mux/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
    } catch (err: any) {
      console.error("Failed to fetch videos:", err);
      toast.error(err?.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const pollPlaybackId = async (uploadId: string) => {
    let playbackId: string | null = null;
    const maxRetries = 60;
    let attempts = 0;
    while (!playbackId && attempts < maxRetries) {
      try {
        const res = await fetch(`/api/mux/upload/${uploadId}`);
        if (res.ok) {
          const data = await res.json();
          playbackId = data.playbackId;
          if (playbackId) break;
        }
      } catch (err) {
        console.error("Error polling playbackId:", err);
      }
      attempts++;
      await new Promise((r) => setTimeout(r, 1000));
    }
    return playbackId;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];
      setUploading(true);
      setProgress(0);

      try {
        const res = await fetch("/api/mux/upload", { method: "POST" });
        if (!res.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, uploadId } = await res.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
          };
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(`Upload failed: ${xhr.status}`));
          xhr.onerror = () => reject("Network error during upload");
          xhr.send(file);
        });

        await fetch("/api/mux/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subtitle: subtitle || undefined,
            description,
            category,
            difficulty: difficulty || undefined,
            paymentMethod,
            price: price === "" ? undefined : Number(price),
            uploadId,
          }),
        });

        const playbackId = await pollPlaybackId(uploadId);
        if (playbackId) {
          await fetch(`/api/mux/update-playback/${uploadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playbackId }),
          });
        }

        toast.success(`Video "${title}" uploaded successfully!`);

        setTitle(""); setSubtitle(""); setDescription("");
        setCategory(""); setDifficulty(""); setPaymentMethod(""); setPrice("");
        setProgress(0);
        setOpenUpload(false);
        fetchVideos();
      } catch (err: any) {
        console.error("Upload & save failed:", err);
        toast.error(err?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [title, subtitle, description, category, difficulty, paymentMethod, price]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "video/*": [] } });

  const openEditModal = (video: Video) => {
    setEditVideo(video);
    setTitle(video.title);
    setSubtitle(video.subtitle || "");
    setDescription(video.description);
    setCategory(video.category);
    setDifficulty(video.difficulty || "");
    setPaymentMethod(video.paymentMethod);
    setPrice(video.price ?? "");
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!editVideo) return;

    try {
      await fetch(`/api/mux/videos/${editVideo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, description, category, difficulty, paymentMethod, price }),
      });

      toast.success(`Video "${title}" updated successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Update failed");
    } finally {
      setOpenEdit(false);
      setEditVideo(null);
      fetchVideos();
    }
  };

  let displayedVideos = [...videos];
  if (searchQuery.trim()) displayedVideos = displayedVideos.filter((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
  if (filterPayment !== "All") displayedVideos = displayedVideos.filter((v) => v.paymentMethod === filterPayment);
  if (sortByPriceAsc !== null) displayedVideos.sort((a, b) => (sortByPriceAsc ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Video Management</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search videos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
          <Select value={filterPayment} onValueChange={(val) => setFilterPayment(val as any)}>
            <SelectTrigger className="min-w-[120px]"><SelectValue placeholder="Filter payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setSortByPriceAsc(sortByPriceAsc === null ? true : sortByPriceAsc === true ? false : null)}>
            {sortByPriceAsc === true ? "Price ↑" : sortByPriceAsc === false ? "Price ↓" : "Sort Price"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </Button>
          <Button onClick={() => setOpenUpload(true)}>+ Upload</Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="animate-pulse rounded-2xl shadow-md">
                      <Skeleton className="w-full h-48 rounded-t-2xl" />
                      <CardContent className="space-y-2 mt-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-40" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : displayedVideos.map((v) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                    <Card className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
                      {v.playbackId ? (
                        <MuxPlayer playbackId={v.playbackId} metadata={{ video_title: v.title }} autoplay={false} controls className="w-full h-48" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-48 bg-muted text-muted-foreground">Processing...</div>
                      )}
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg truncate">{v.title}</h3>
                        {v.subtitle && <p className="text-sm text-muted-foreground truncate">{v.subtitle}</p>}
                        <p className="text-sm text-muted-foreground truncate">{v.description}</p>
                        {v.difficulty && <p className="text-sm text-muted-foreground mt-1">Difficulty: {v.difficulty}</p>}

                        {/* Price + Edit */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 bg-primary/10 text-primary font-semibold text-xl px-3 py-1 rounded-full">
                            <IconCurrencyDollar size={20} /> {v.price ?? 0}
                          </div>
                          <Button size="sm" onClick={() => openEditModal(v)}>
                            <IconEdit size={16} className="mr-1" /> Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-muted">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Subtitle</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((__, j) => <td key={j} className="p-4"><Skeleton className="h-5 w-full" /></td>)}</tr>
                  ))
                : displayedVideos.map((v) => (
                    <tr key={v.id} className="hover:bg-muted/10 transition">
                      <td className="p-2">{v.title}</td>
                      <td className="p-2">{v.subtitle || "-"}</td>
                      <td className="p-2">{v.category}</td>
                      <td className="p-2">{v.difficulty || "-"}</td>
                      <td className="p-2 flex items-center gap-1">
                        {v.paymentMethod === "Paid" ? <IconCheck size={16} className="text-success" /> : <IconX size={16} className="text-destructive" />}
                        {v.paymentMethod}
                      </td>
                      <td className="p-2">
                        <div className="inline-flex items-center gap-1 bg-primary/10 text-primary font-semibold text-xl px-3 py-1 rounded-full">
                          <IconCurrencyDollar size={20} /> {v.price ?? 0}
                        </div>
                      </td>
                      <td className="p-2">
                        <Button size="sm" onClick={() => openEditModal(v)}>
                          <IconEdit size={16} className="mr-1" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload & Edit Modals */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader><DialogTitle>Upload New Video</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Label>Subtitle</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              <Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} />
              <Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} />
              <Label>Difficulty</Label><Input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                <SelectContent><SelectItem value="Free">Free</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent>
              </Select>
              <Label>Price</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
            <div {...getRootProps()} className="flex flex-col items-center justify-center border-2 border-dashed rounded p-2 min-h-[300px] cursor-pointer">
              <input {...getInputProps()} />
              <p className="text-muted-foreground text-center">{isDragActive ? "Drop video here..." : "Drag & drop video, or click to browse"}</p>
              {uploading && <div className="w-full bg-muted/30 rounded-full h-3 mt-4"><div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }} /></div>}
            </div>
          </div>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenUpload(false)} disabled={uploading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader><DialogTitle>Edit Video</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Label>Subtitle</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              <Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} />
              <Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} />
              <Label>Difficulty</Label><Input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Free">Free</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent>
              </Select>
              <Label>Price</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
