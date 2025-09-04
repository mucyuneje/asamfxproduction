"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

type StockLog = {
  id: number;
  action: "REQUEST" | "APPROVED" | "DECLINED";
  productName: string;
  createdAt: string;
  actionBy?: string;
};

interface RequestsProps {
  token: string;
}

export default function Requests({ token }: RequestsProps) {
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "DECLINED" | "ALL">("PENDING");
  const [search, setSearch] = useState("");

  // Fetch stock requests
  const fetchRequests = () => {
    fetch("/api/stock-logs", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setStockLogs(data || []));
  };

  useEffect(() => { fetchRequests(); }, [token]);

  // Approve / Decline request
  const updateRequest = async (id: number, status: "APPROVED" | "DECLINED") => {
    try {
      await fetch(`/api/stock-logs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchRequests(); // Refresh
    } catch (err) { console.error(err); }
  };

  const filteredRequests = stockLogs.filter(log => {
    const statusMatch =
      filter === "ALL" ||
      (filter === "PENDING" && log.action === "REQUEST") ||
      (filter === "APPROVED" && log.action === "APPROVED") ||
      (filter === "DECLINED" && log.action === "DECLINED");

    const searchMatch =
      log.productName.toLowerCase().includes(search.toLowerCase()) ||
      (log.actionBy?.toLowerCase().includes(search.toLowerCase()) ?? false);

    return statusMatch && searchMatch;
  });

  // Counts for report
  const counts = {
    pending: stockLogs.filter(l => l.action === "REQUEST").length,
    approved: stockLogs.filter(l => l.action === "APPROVED").length,
    declined: stockLogs.filter(l => l.action === "DECLINED").length,
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Requests</h2>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "DECLINED", "ALL"].map(f => (
            <button
              key={f}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filter === f ? "bg-accent text-white" : "bg-background border border-border hover:bg-accent/10"
              }`}
              onClick={() => setFilter(f as any)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by product or user"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm w-full sm:w-64"
        />
      </div>

      {/* Pending Requests / Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Approve or decline product requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {filteredRequests.length ? (
            filteredRequests.map(log => (
              <div
                key={log.id}
                className="flex justify-between items-center p-2 border rounded-lg bg-background/50 hover:bg-accent/5 transition"
              >
                <div>
                  <div className="text-sm font-medium">{log.productName}</div>
                  <div className="text-xs text-muted-foreground">
                    Requested by {log.actionBy || "Teacher"} <br />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
                {log.action === "REQUEST" && (
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      onClick={() => updateRequest(log.id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      onClick={() => updateRequest(log.id, "DECLINED")}
                    >
                      Decline
                    </button>
                  </div>
                )}
                {log.action !== "REQUEST" && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      log.action === "APPROVED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.action}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No requests found.</div>
          )}
        </CardContent>
      </Card>

      {/* Requests Summary / Report */}
      <Card>
        <CardHeader>
          <CardTitle>Requests Report</CardTitle>
          <CardDescription>Summary of all requests</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-2 border rounded-lg bg-background/50">
            <div className="text-sm font-medium">Pending</div>
            <div className="text-lg font-bold text-yellow-600">{counts.pending}</div>
          </div>
          <div className="p-2 border rounded-lg bg-background/50">
            <div className="text-sm font-medium">Approved</div>
            <div className="text-lg font-bold text-green-600">{counts.approved}</div>
          </div>
          <div className="p-2 border rounded-lg bg-background/50">
            <div className="text-sm font-medium">Declined</div>
            <div className="text-lg font-bold text-red-600">{counts.declined}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
