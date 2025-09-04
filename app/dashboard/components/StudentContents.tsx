"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { IconTrophy, IconClock, IconEye, IconCategory } from "@tabler/icons-react";
import MuxPlayer from "@mux/mux-player-react";

type Video = {
  id: string;
  title: string;
  category: string;
  price: number; // 0 = free
  playbackId?: string;
  lastWatched?: string;
};

type Payment = {
  id: string;
  videoId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: number;
};

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [freeVideos, setFreeVideos] = useState<Video[]>([]);
  const [unpurchasedVideosCount, setUnpurchasedVideosCount] = useState(0);
  const [userName, setUserName] = useState("Student");

  // Fetch videos
  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch("/api/mux/videos");
      const data = await res.json();
      setVideos(data);
    }
    fetchVideos();
  }, []);

  // Fetch payments
  useEffect(() => {
    async function fetchPayments() {
      const res = await fetch("/api/me/payments");
      const data = await res.json();
      setPayments(data);
    }
    fetchPayments();
  }, []);

  const purchasedVideoIds = useMemo(
    () => payments.filter(p => p.status === "APPROVED").map(p => p.videoId),
    [payments]
  );

  const totalPurchased = purchasedVideoIds.length;
  const pendingPaymentsCount = payments.filter(p => p.status === "PENDING").length;

  // Count unpurchased videos (all not purchased, including paid)
  useEffect(() => {
    const count = videos.filter(v => !purchasedVideoIds.includes(v.id)).length;
    setUnpurchasedVideosCount(count);
  }, [videos, purchasedVideoIds]);

  // Free videos (max 4)
  useEffect(() => {
    const freeVids = videos.filter(v => v.price === 0).slice(0, 4);
    setFreeVideos(freeVids);
  }, [videos]);

  const favoriteCategories = useMemo(() => {
    return videos
      .filter(v => purchasedVideoIds.includes(v.id))
      .reduce((acc, v) => {
        acc[v.category] = (acc[v.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  }, [videos, purchasedVideoIds]);

  const topCategories = Object.entries(favoriteCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome & Stats */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-gray-600">Keep up the great work!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4 p-4">
          <IconTrophy size={32} className="text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{totalPurchased}</p>
            <p className="text-sm text-gray-500">Videos Purchased</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-4">
          <IconClock size={32} className="text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{pendingPaymentsCount}</p>
            <p className="text-sm text-gray-500">Pending Payments</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-4">
          <IconEye size={32} className="text-green-500" />
          <div>
            <p className="text-2xl font-bold">{unpurchasedVideosCount}</p>
            <p className="text-sm text-gray-500">Unpurchased Videos</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-4">
          <IconCategory size={32} className="text-purple-500" />
          <div>
            <p className="text-sm font-medium">Favorite Categories</p>
            <p className="text-sm text-gray-500">{topCategories.join(", ") || "N/A"}</p>
          </div>
        </Card>
      </div>

      {/* Free Videos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Free Videos</h2>
        {freeVideos.length === 0 ? (
          <p className="text-gray-400">No free videos available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {freeVideos.map(video => (
              <Card
                key={video.id}
                className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition"
              >
                {video.playbackId ? (
                  <MuxPlayer
                    playbackId={video.playbackId}
                    metadata={{ video_title: video.title, video_id: video.id }}
                    autoPlay={false}
                    controls
                    className="w-full h-48 sm:h-56 lg:h-64 mb-2"
                  />
                ) : (
                  <p className="font-semibold">{video.title}</p>
                )}
                <p className="text-sm text-gray-500">{video.category}</p>
                <span className="mt-2 text-xs text-green-500 font-medium">Free</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
