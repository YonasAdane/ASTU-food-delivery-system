"use client";

import { useState, useEffect } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { DriverCard } from "@/components/drivers/DriverCard";
import { DriverSkeleton } from "@/components/drivers/DriverSkeleton";
import { DriverStats } from "@/components/drivers/DriverStats";
import { DriverFilters } from "@/components/drivers/DriverFilters";
import { AddDriverDialog } from "@/components/drivers/AddDriverDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { getDrivers, getDriverStats, Driver, DriverResponse } from "@/actions/driver-actions";
import { CreateDriverFormValues } from "@/lib/validations/driver-schema";
import { useTheme } from "next-themes";

export default function DriversPage() {
  // Query state using nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(12));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault("rating"));
  const [viewMode, setViewMode] = useQueryState("viewMode", parseAsString.withDefault("grid"));

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFleet: 0,
    activeNow: 0,
    avgDeliveryTime: 0,
    avgRating: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  const { theme, setTheme } = useTheme();

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page,
          limit,
          search,
          status: status === "all" || !status ? undefined : status,
          sortBy: sortBy || undefined,
        };
        
        const response: DriverResponse = await getDrivers(params);
        setDrivers(response.data);
        setPagination({
          total: response.meta.total,
          pages: response.meta.pages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch drivers");
        console.error("Error fetching drivers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [page, limit, search, status, sortBy]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      
      try {
        const statsData = await getDriverStats();
        setStats({
          totalFleet: statsData.totalFleet,
          activeNow: statsData.activeNow,
          avgDeliveryTime: statsData.avgDeliveryTime,
          avgRating: statsData.avgRating
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Set defaults on error
        setStats({
          totalFleet: 0,
          activeNow: 0,
          avgDeliveryTime: 0,
          avgRating: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleAddDriver = async (data: CreateDriverFormValues) => {
    setDialogLoading(true);
    try {
      // In a real app, you would call the API to create the driver
      console.log("Creating driver with data:", data);
      // Simulate API call
      setTimeout(() => {
        setDialogLoading(false);
        setShowAddDialog(false);
        // Refresh the drivers list
        window.location.reload();
      }, 1000);
    } catch (err) {
      setDialogLoading(false);
      setError(err instanceof Error ? err.message : "Failed to add driver");
      console.error("Error adding driver:", err);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < pagination.pages) {
      setPage(page + 1);
    }
  };

  const goToPage = (pageNum: number) => {
    setPage(pageNum);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pages.push(
        <Button 
          key={1} 
          variant={1 === page ? "default" : "outline"} 
          size="sm"
          onClick={() => goToPage(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button 
          key={i} 
          variant={i === page ? "default" : "outline"} 
          size="sm"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }
    
    if (endPage < pagination.pages) {
      if (endPage < pagination.pages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <Button 
          key={pagination.pages} 
          variant={pagination.pages === page ? "default" : "outline"} 
          size="sm"
          onClick={() => goToPage(pagination.pages)}
        >
          {pagination.pages}
        </Button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="layout-container flex flex-col max-w-[1200px] mx-auto px-6 py-8 gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#181411] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] dark:text-white">
                Drivers Management
              </h1>
              <p className="text-[#8a7560] text-base font-normal dark:text-gray-300">
                Manage your fleet, view status, and track performance.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#d67315] text-white gap-2 text-base font-bold transition-colors shadow-lg shadow-primary/20"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="text-white" />
                <span>Add New Driver</span>
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-12 w-12"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <DriverStats
            totalFleet={stats.totalFleet}
            activeNow={stats.activeNow}
            avgDeliveryTime={stats.avgDeliveryTime}
            avgRating={stats.avgRating}
            isLoading={statsLoading}
          />

          {/* Filter & Search Toolbar */}
          <DriverFilters
            search={search}
            status={status}
            sortBy={sortBy}
            viewMode={viewMode as 'grid' | 'list'}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortByChange={setSortBy}
            onViewModeChange={handleViewModeChange}
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading &&(
              <DriverSkeleton />
            )}
          {/* Drivers Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
          }>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <DriverCard 
                  key={driver._id} 
                  driver={driver} 
                  onMessage={(d) => console.log("Message driver", d)}
                  onViewProfile={(d) => console.log("View profile", d)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <p className="text-[#8a7560] dark:text-gray-300">No drivers found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={goToPreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= pagination.pages}
                  onClick={goToNextPage}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="outline"
                      className="rounded-l-md"
                      disabled={page <= 1}
                      onClick={goToPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {renderPageNumbers()}
                    
                    <Button
                      variant="outline"
                      className="rounded-r-md"
                      disabled={page >= pagination.pages}
                      onClick={goToNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Driver Dialog */}
      <AddDriverDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddDriver}
        loading={dialogLoading}
      />
    </div>
  );
}