/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { BulkActions } from "@/components/admin/BulkActions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  Filter,
  Download,
  Loader2,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Swal from "sweetalert2";

async function getModels() {
  try {
    const response = await fetch("/api/admin/models", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

export default function ModelsManagementPage() {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const data = await getModels();
      setModels(data);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to load models");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-Side Filtering Logic
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      industryFilter === "all" || model.industry === industryFilter;
    const matchesType = typeFilter === "all" || model.dealType === typeFilter;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "featured"
        ? model.featured === true
        : model.featured === false; // Assuming 'standard' means not featured

    let matchesYear = true;
    if (yearFilter !== "all") {
      const year = new Date(model.completionDate).getFullYear().toString();
      matchesYear = year === yearFilter;
    }

    return (
      matchesSearch &&
      matchesIndustry &&
      matchesType &&
      matchesStatus &&
      matchesYear
    );
  });

  // Bulk delete function with SweetAlert
  const handleBulkDelete = async () => {
    if (selectedModels.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedModels.length} models. This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!result.isConfirmed) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          ids: selectedModels,
          modelType: "model",
        }),
      });

      if (response.ok) {
        Swal.fire("Deleted!", "Your models have been deleted.", "success");
        setSelectedModels([]);
        fetchModels();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete models");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete models");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk feature/unfeature function
  // We use this wrapper to satisfy the type requirement if needed,
  // but passing async functions directly usually works in TS.
  const handleBulkFeature = async (feature: boolean = true) => {
    if (selectedModels.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: feature ? "feature" : "unfeature",
          ids: selectedModels,
          modelType: "model",
        }),
      });

      if (response.ok) {
        toast.success(
          `${feature ? "Featured" : "Unfeatured"} ${
            selectedModels.length
          } model(s)`
        );
        setSelectedModels([]);
        fetchModels();
      } else {
        const error = await response.json();
        throw new Error(
          error.error || `Failed to ${feature ? "feature" : "unfeature"} models`
        );
      }
    } catch (error: any) {
      toast.error(
        error.message || `Failed to ${feature ? "feature" : "unfeature"} models`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle individual delete with SweetAlert
  const handleDelete = async (modelId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/models/${modelId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your model has been deleted.",
            icon: "success",
          });
          fetchModels();
        } else {
          throw new Error("Failed to delete model");
        }
      } catch (error) {
        toast.error("Failed to delete model");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const truncateTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + "...";
    }
    return title;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">M&A Models</h1>
          <p className="text-muted-foreground">
            Manage your M&A models and deal analyses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BulkActions
            selectedItems={selectedModels}
            totalItems={filteredModels.length}
            onSelectAll={() =>
              setSelectedModels(filteredModels.map((m) => m._id))
            }
            onClearSelection={() => setSelectedModels([])}
            onBulkDelete={handleBulkDelete}
            // FIXED: Passing functions correctly to avoid type errors
            onBulkPublish={() => handleBulkFeature(true)}
            onBulkArchive={() => handleBulkFeature(false)}
          />
          <Button asChild>
            <Link href="/admin/models/new">
              <Plus className="mr-2 h-4 w-4" />
              New Model
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <AdminSearch
            placeholder="Search models..."
            onSearch={(query) => setSearchQuery(query)}
            onFilterClick={() => setShowFilters(!showFilters)}
            showFilters={false} // Hide duplicate filter button
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                  >
                    <option value="all">All Industries</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial Services">
                      Financial Services
                    </option>
                    <option value="Consumer Goods">Consumer Goods</option>
                    <option value="Energy">Energy</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Telecommunications">
                      Telecommunications
                    </option>
                    <option value="Industrials">Industrials</option>
                    <option value="Materials">Materials</option>
                    <option value="Utilities">Utilities</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deal Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Merger">Merger</option>
                    <option value="Acquisition">Acquisition</option>
                    <option value="Leveraged Buyout">LBO</option>
                    <option value="Divestiture">Divestiture</option>
                    <option value="Joint Venture">Joint Venture</option>
                    <option value="Strategic Alliance">
                      Strategic Alliance
                    </option>
                    <option value="Takeover">Takeover</option>
                    <option value="Management Buyout">Management Buyout</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="featured">Featured</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{models.length}</div>
          <div className="text-sm text-muted-foreground">Total Models</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            $
            {(
              models.reduce(
                (sum: number, model: any) => sum + model.dealSize,
                0
              ) / 1000000000
            ).toFixed(1)}
            B
          </div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {new Set(models.map((m: any) => m.industry)).size}
          </div>
          <div className="text-sm text-muted-foreground">Industries</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {models
              .reduce((sum: number, model: any) => sum + (model.views || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedModels.length === filteredModels.length &&
                    filteredModels.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedModels(filteredModels.map((m) => m._id));
                    } else {
                      setSelectedModels([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Deal Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Deal Type</TableHead>
              <TableHead>Deal Size</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No models found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model: any) => (
                <TableRow key={model._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedModels.includes(model._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedModels([...selectedModels, model._id]);
                        } else {
                          setSelectedModels(
                            selectedModels.filter((id) => id !== model._id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/models/${model.slug}`}
                      className="font-medium hover:text-primary transition-colors whitespace-nowrap"
                      target="_blank"
                      title={model.title} // Keeps the tooltip so users can see full name on hover
                    >
                      {truncateTitle(model.title)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{model.industry}</Badge>
                  </TableCell>
                  <TableCell>{model.dealType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(model.dealSize, model.currency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(model.completionDate)}
                    </div>
                  </TableCell>
                  <TableCell>{model.views?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge variant={model.featured ? "default" : "secondary"}>
                      {model.featured ? "Featured" : "Standard"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {model.excelFileUrl && (
                            <DropdownMenuItem asChild>
                              <a href={model.excelFileUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                Download Excel
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/models/${model.slug}`}
                              target="_blank"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Public
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/models/edit/${model.slug}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(model._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredModels.length} of {models.length} models
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
