"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// mock: replace with fetch(`/api/kits`)
const mockKits = [
  { id: "1", name: "Scalping Pro Kit", price: 49, thumbnail: "/kit1.jpg" },
  { id: "2", name: "Risk Mastery Kit", price: 29, thumbnail: "/kit2.jpg" },
];

export default function StudentKits() {
  const [kits, setKits] = useState<typeof mockKits>([]);

  useEffect(() => {
    // load kits (replace with API call)
    setKits(mockKits);
  }, []);

  const handlePurchase = (kitId: string) => {
    console.log("Purchasing kit:", kitId);
    // TODO: integrate with payment flow
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {kits.map(kit => (
        <Card key={kit.id} className="overflow-hidden">
          <img src={kit.thumbnail} alt={kit.name} className="w-full h-40 object-cover" />
          <CardHeader>
            <CardTitle>{kit.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="text-lg font-semibold">${kit.price}</span>
            <Button onClick={() => handlePurchase(kit.id)}>Buy Now</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
