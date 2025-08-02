import React, { useState, useEffect, useCallback } from "react";
import { Athlete } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Eye, UserX, Search, ChevronLeft, ChevronRight, Loader2, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { rateLimiter } from "@/components/utils/rateLimiter";

import AthleteCard from "../components/athletes/AthleteCard";
import AthleteProfile from "../components/athletes/AthleteProfile";
import AddAthleteDialog from "../components/athletes/AddAthleteDialog";
import RosterFilters from "../components/athletes/RosterFilters";
import EditAthleteDialog from "../components/athletes/EditAthleteDialog";

const ITEMS_PER_PAGE = 25;

export default function AthletesPage() {
  const [dataState, setDataState] = useState({
    status: 'loading', // 'loading', 'success', 'error'
    athletes: [],
    total: 0,
    error: null,
  });
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filters, setFilters] = useState({ 
    name: "", 
    classYear: "All", 
    recruitingStatus: "All", 
    sportType: "All", 
    minGpa: "" 
  });
  const [sortOption, setSortOption] = useState("-updated_date");
  const [currentPage, setCurrentPage] = useState(1);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // The single, reliable data fetching effect.
  useEffect(() => {
    let isMounted = true;
    const fetchAthletes = async () => {
      setDataState(prevState => ({ ...prevState, status: 'loading' }));
      
      try {
        const query = {};
        if (filters.classYear !== "All") query.class_year = filters.classYear;
        if (filters.recruitingStatus !== "All") query.recruiting_status = filters.recruitingStatus;
        if (filters.sportType !== "All") query.sport_type = filters.sportType;
        if (filters.name || globalSearch) query.name = { contains: filters.name || globalSearch };
        if (filters.minGpa) {
          const minGpaValue = parseFloat(filters.minGpa);
          if (!isNaN(minGpaValue)) query.gpa = { gte: minGpaValue };
        }

        const { data, total } = await rateLimiter.executeWithRateLimit(() => 
          Athlete.filter(query, sortOption, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE)
        );
        
        if (isMounted) {
          setDataState({ status: 'success', athletes: data || [], total: total || 0, error: null });
          if (data && data.length > 0) {
            const currentSelectedId = selectedAthlete?.id;
            const stillExists = currentSelectedId ? data.find(a => a.id === currentSelectedId) : null;
            setSelectedAthlete(stillExists || data[0]);
          } else {
            setSelectedAthlete(null);
          }
        }
      } catch (e) {
        console.error("Error loading athletes:", e);
        if (isMounted) {
          setDataState({ status: 'error', athletes: [], total: 0, error: "Failed to load athletes. Please try again." });
        }
      }
    };

    fetchAthletes();

    return () => { isMounted = false; };
  }, [filters, currentPage, sortOption, refetchTrigger, globalSearch]);

  // Reset to page 1 whenever filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, globalSearch]);

  const handleAddAthlete = async (athleteData) => {
    try {
      await rateLimiter.executeWithRateLimit(() => Athlete.create(athleteData));
      setShowAddDialog(false);
      // Reset ALL filters to ensure the new athlete is visible
      setFilters({ name: "", classYear: "All", recruitingStatus: "All", sportType: "All", minGpa: "" });
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding athlete:", error);
      alert("Failed to add athlete. Please try again.");
    }
  };
  
  const handleEditAthlete = (athlete) => {
    setEditingAthlete(athlete);
    setShowEditDialog(true);
  };
  
  const handleUpdateAthlete = async (athleteData) => {
    if (!editingAthlete) return;
    try {
      const updatedAthlete = await rateLimiter.executeWithRateLimit(() => Athlete.update(editingAthlete.id, athleteData));
      setShowEditDialog(false);
      setEditingAthlete(null);
      setSelectedAthlete(updatedAthlete);
      // Trigger a manual refetch to ensure list consistency
      setRefetchTrigger(c => c + 1);
    } catch (error) {
      console.error("Error updating athlete:", error);
      alert("Failed to update athlete. Please try again.");
    }
  };

  const isAnyFilterActive = () => filters.name || filters.classYear !== "All" || filters.recruitingStatus !== "All" || filters.sportType !== "All" || filters.minGpa;
  const totalPages = Math.ceil(dataState.total / ITEMS_PER_PAGE);

  if (dataState.status === 'loading') {
    return (
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header and Add Athlete Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-high-contrast">Team Roster</h1>
          <p className="text-medium-contrast mt-1 text-sm md:text-base">Manage athlete profiles and recruiting status</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)} 
          className="btn-team-primary mobile-full-width sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> 
          <span>Add Athlete</span>
        </Button>
      </div>

      {/* Global Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search athletes by name..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-10 pr-10 min-h-[44px]"
          />
          {globalSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalSearch("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-center gap-2 min-h-[44px]"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <RosterFilters onFilterChange={setFilters} currentFilters={filters} />
      </div>
      
      {dataState.status === 'error' && (
         <Card className="card-readable p-6 md:p-12 text-center bg-red-50 border-red-200">
            <CardContent className="flex flex-col items-center p-0">
                <h2 className="text-lg md:text-xl font-semibold mb-2 text-red-700">Error Loading Data</h2>
                <p className="text-red-600 text-sm md:text-base">{dataState.error}</p>
            </CardContent>
         </Card>
      )}

      {dataState.status === 'success' && dataState.total === 0 && !isAnyFilterActive() && (
        <Card className="card-readable p-6 md:p-12 text-center">
          <CardContent className="flex flex-col items-center p-0">
            <UserX className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-high-contrast">No Athletes Yet</h2>
            <p className="text-medium-contrast mb-4 text-sm md:text-base">It looks like your roster is empty. Start by adding your first athlete!</p>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="btn-team-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Athlete
            </Button>
          </CardContent>
        </Card>
      )}
      
      {dataState.status === 'success' && dataState.athletes.length === 0 && isAnyFilterActive() && (
         <Card className="card-readable p-6 md:p-12 text-center">
          <CardContent className="flex flex-col items-center p-0">
            <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-high-contrast">No Athletes Found</h2>
            <p className="text-medium-contrast text-sm md:text-base">Your current filter settings returned no athletes. Try adjusting your search or filters.</p>
          </CardContent>
         </Card>
      )}

      {dataState.status === 'success' && dataState.athletes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Athletes ({dataState.total})
              </h2>
            </div>
            {/* Sort controls */}
            <div className="mb-4">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-updated_date">Last Updated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="-name">Name (Z-A)</SelectItem>
                  <SelectItem value="-gpa">GPA (High-Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 min-h-[calc(70vh-100px)]">
              <AnimatePresence>
                {dataState.athletes.map((athlete) => (
                  <motion.div key={athlete.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AthleteCard athlete={athlete} isSelected={selectedAthlete?.id === athlete.id} onClick={() => setSelectedAthlete(athlete)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3">
            {selectedAthlete ? (
              <AthleteProfile athlete={selectedAthlete} onEdit={() => handleEditAthlete(selectedAthlete)} />
            ) : (
              <Card className="h-full flex items-center justify-center text-center text-gray-500"><CardContent className="flex flex-col items-center p-6">
                <Eye className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg">Select an athlete to view their profile.</p>
              </CardContent></Card>
            )}
          </div>
        </div>
      )}
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="btn-team-primary w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddAthleteDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddAthlete} />
      {editingAthlete && (
        <EditAthleteDialog key={editingAthlete.id} open={showEditDialog} onOpenChange={setShowEditDialog} athlete={editingAthlete} onSave={handleUpdateAthlete} />
      )}
    </div>
  );
}