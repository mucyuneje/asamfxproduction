"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Payment = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofUrl: string;
  description: string;
  user: { id: string; name: string; email: string };
  video: { id: string; title: string };
  createdAt: string;
};

export default function PaymentTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data: Payment[] = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/payments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update payment status");

      setPayments(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
      if (selectedPayment && selectedPayment.id === id) {
        setSelectedPayment({ ...selectedPayment, status });
      }
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
  };

  const getStatusClass = (status: Payment["status"]) => {
    switch (status) {
      case "APPROVED": return "text-green-600 font-semibold";
      case "PENDING": return "text-blue-600 font-semibold";
      case "REJECTED": return "text-red-600 font-semibold";
    }
  };

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const filteredPayments = useMemo(() => {
    let data = [...payments];
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(p =>
        p.user.name.toLowerCase().includes(lower) ||
        p.user.email.toLowerCase().includes(lower) ||
        p.video.title.toLowerCase().includes(lower)
      );
    }
    if (filterStatus !== "ALL") data = data.filter(p => p.status === filterStatus);
    return data;
  }, [payments, search, filterStatus]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 p-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by user or video"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Video</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))
          ) : (
            paginatedPayments.map(payment => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="cursor-pointer hover:bg-muted"
                onClick={() => setSelectedPayment(payment)}
              >
                <TableCell>{payment.user.name}</TableCell>
                <TableCell>{payment.user.email}</TableCell>
                <TableCell>{payment.video.title}</TableCell>
                <TableCell>
                  <span className={getStatusClass(payment.status)}>{capitalize(payment.status)}</span>
                </TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
      </div>

      {/* Full-Screen Modal */}
      {selectedPayment && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-6 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-background rounded-xl shadow-2xl w-full max-w-3xl p-6 flex flex-col gap-6 relative"
          >
            <button className="absolute top-4 right-4 text-3xl font-bold" onClick={() => setSelectedPayment(null)}>✕</button>

            <h2 className="text-2xl font-bold">{selectedPayment.video.title}</h2>
            <span className={getStatusClass(selectedPayment.status) + " mb-4 text-base"}>
              {capitalize(selectedPayment.status)}
            </span>

            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedPayment.proofUrl}
                alt="Payment Proof"
                className="w-full md:w-2/5 rounded-lg shadow-lg object-cover max-h-[400px]"
              />
              <div className="flex-1 flex flex-col gap-2 text-sm">
                <p><strong>Requested By:</strong> {selectedPayment.user.name} ({selectedPayment.user.email})</p>
                <p><strong>Description:</strong> {selectedPayment.description}</p>
                <p><strong>Requested On:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>

                {selectedPayment.status === "PENDING" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-500 flex-1"
                      onClick={() => { handleUpdateStatus(selectedPayment.id, "APPROVED"); setSelectedPayment(null); }}
                    >
                      Approve
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:bg-red-500 flex-1"
                      onClick={() => { handleUpdateStatus(selectedPayment.id, "REJECTED"); setSelectedPayment(null); }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
