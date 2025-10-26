"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { useUpdatePackagesByIdMutation } from "@/src/hooks/usePackages";

type PackageType = {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  currency: string;
  is_active: boolean;
  is_recurring: boolean;
  billing_cycle?: string;
  description: string[];
};

const EditPackages = ({ pkg, id }: { pkg: PackageType, id: number }) => {
 const [form, setForm] = useState<PackageType>({
  ...pkg,
  description: pkg.description || [],
});

  const [newDesc, setNewDesc] = useState("");
  const [open, setOpen] = useState(false);

  const [updatePackage, { isLoading }] = useUpdatePackagesByIdMutation();

useEffect(() => {
  setForm({
    ...pkg,
    description: pkg.description || [],
  });
}, [pkg]);


  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updatePackage({
        id: form.id,     // or directly: id: id,
        data: form       // your form data
      }).unwrap();
      console.log("Updating package ID:", form.id);
      toast.success("Package updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-sm text-gray-500 hover:text-gray-900"
          onClick={() => setOpen(true)}
        >
          <Pencil className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package - {form.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
        <div className="w-full flex gap-4">
            {/* Name */}
          <div className="w-[50%] ">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="w-[50%]">
            <Label>Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                handleChange("price", parseFloat(e.target.value))
              }
            />
          </div>
        </div>

       <div className="w-full flex gap-4">
           {/* Duration */}
          <div className="w-[50%]">
            <Label>Duration (days)</Label>
            <Input
              type="number"
              value={form.duration_days}
              onChange={(e) =>
                handleChange("duration_days", parseInt(e.target.value))
              }
            />
          </div>

          {/* Currency */}
          <div className="w-[50%]">
            <Label>Currency</Label>
            <Select
              value={form.currency}
              onValueChange={(val) => handleChange("currency", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="string">string</SelectItem>
              </SelectContent>
            </Select>
          </div>
       </div>

       <div className="w-full gap-4 flex ">
           {/* Active */}
          <div className="flex items-center justify-between border px-4 py-2 rounded-lg w-[50%]">
            <Label>Active</Label>
            <Switch
              checked={form.is_active}
              onCheckedChange={(val) => handleChange("is_active", val)}
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between border px-4 py-2 rounded-lg w-[50%]">
            <Label>Recurring</Label>
            <Switch
              checked={form.is_recurring}
              onCheckedChange={(val) => handleChange("is_recurring", val)}
            />
          </div>
       </div>

          {/* Billing Cycle */}
          {form.is_recurring && (
            <div>
              <Label>Billing Cycle</Label>
              <Input
                value={form.billing_cycle || ""}
                onChange={(e) => handleChange("billing_cycle", e.target.value)}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <Label>Description</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add feature"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    description: [...prev.description, newDesc],
                  }));
                  setNewDesc("");
                }}
                disabled={!newDesc}
              >
                Add
              </Button>
            </div>
            <ul className="space-y-1 grid grid-cols-2 text-sm text-muted-foreground">
              {form.description.map((d, i) => (
                <li key={i} className="flex justify-between">
                  <span>{d}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = [...form.description];
                      updated.splice(i, 1);
                      setForm((prev) => ({ ...prev, description: updated }));
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="pt-4 space-x-2 flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPackages;