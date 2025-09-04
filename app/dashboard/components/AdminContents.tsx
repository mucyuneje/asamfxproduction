"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

type Video = {
  id: string;
  title: string;
  category: string;
  paymentMethod: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const videoRes = await fetch("/api/mux/videos");
      const videoData = await videoRes.json();
      setVideos(videoData);

      const userRes = await fetch("/api/users");
      const userData = await userRes.json();
      setUsers(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalVideos = videos.length;
  const totalPaidVideos = videos.filter(v => v.paymentMethod === "Paid").length;
  const totalUsers = users.length;
  const recentVideos = videos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[totalVideos, totalPaidVideos, totalUsers].map((stat, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>
                {loading ? <Skeleton className="h-5 w-24" /> : 
                  idx === 0 ? "Total Videos" : idx === 1 ? "Paid Videos" : "Total Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <motion.p
                    key={stat} // animate only when data changes
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold"
                  >
                    {stat}
                  </motion.p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Videos */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Uploads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle><Skeleton className="h-5 w-32" /></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </CardContent>
                </Card>
              ))
            : recentVideos.map(video => (
                <Card key={video.id}>
                  <CardHeader>
                    <CardTitle>
                      <motion.span
                        key={video.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {video.title}
                      </motion.span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="space-y-1"
                    >
                      <p className="text-sm text-gray-500">Category: {video.category}</p>
                      <p className="text-sm text-gray-500">Type: {video.paymentMethod}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Uploaded: {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
