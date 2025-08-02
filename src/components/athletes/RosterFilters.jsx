import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SportTypeComboBox from "../shared/SportTypeComboBox";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

export default function RosterFilters({ onFilterChange, currentFilters }) {
    const initialFilters = {
        name: "",
        classYear: "All",
        recruitingStatus: "All",
        sportType: "All",
        minGpa: ""
    };
    
    // Local state for text inputs that require manual search
    const [searchInputs, setSearchInputs] = useState({
        name: currentFilters?.name || "",
        minGpa: currentFilters?.minGpa || ""
    });
    
    // Current applied filters
    const [appliedFilters, setAppliedFilters] = useState(currentFilters || initialFilters);

    // Update local state when parent filters change
    useEffect(() => {
        if (currentFilters) {
            setAppliedFilters(currentFilters);
            setSearchInputs({
                name: currentFilters.name || "",
                minGpa: currentFilters.minGpa || ""
            });
        }
    }, [currentFilters]);

    const handleDropdownChange = (key, value) => {
        const newFilters = { ...appliedFilters, [key]: value };
        setAppliedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearchInputChange = (key, value) => {
        setSearchInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        const newFilters = { 
            ...appliedFilters, 
            name: searchInputs.name,
            minGpa: searchInputs.minGpa
        };
        setAppliedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        setAppliedFilters(initialFilters);
        setSearchInputs({ name: "", minGpa: "" });
        onFilterChange(initialFilters);
    };

    // Handle Enter key press for search inputs
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Card className="card-readable mb-6 md:mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4 responsive-padding">
                <CardTitle className="text-lg md:text-xl text-high-contrast">Filters</CardTitle>
            </CardHeader>
            <CardContent className="responsive-padding">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                    {/* Name Filter with Search Button */}
                    <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                        <Label htmlFor="name-filter" className="label-readable">Name</Label>
                        <div className="flex gap-1">
                            <Input
                                id="name-filter"
                                type="text"
                                placeholder="Search by name"
                                value={searchInputs.name}
                                onChange={(e) => handleSearchInputChange("name", e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="input-readable flex-1"
                            />
                        </div>
                    </div>

                    {/* Class Year Filter */}
                    <div className="space-y-1">
                        <Label htmlFor="class-year-filter" className="label-readable">Class Year</Label>
                        <Select value={appliedFilters.classYear} onValueChange={(value) => handleDropdownChange("classYear", value)}>
                            <SelectTrigger id="class-year-filter" className="input-readable"><SelectValue placeholder="All Years" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Years</SelectItem>
                                <SelectItem value="Freshman">Freshman</SelectItem>
                                <SelectItem value="Sophomore">Sophomore</SelectItem>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sport Type Filter */}
                    <div className="space-y-1">
                        <Label htmlFor="sport-type-filter" className="label-readable">Sport</Label>
                        <SportTypeComboBox 
                            value={appliedFilters.sportType} 
                            onValueChange={(value) => handleDropdownChange("sportType", value === "All" ? "All" : value)} 
                            placeholder="All Sports" 
                        />
                    </div>

                    {/* Recruiting Status Filter */}
                    <div className="space-y-1">
                        <Label htmlFor="recruiting-status-filter" className="label-readable">Recruiting Status</Label>
                        <Select value={appliedFilters.recruitingStatus} onValueChange={(value) => handleDropdownChange("recruitingStatus", value)}>
                            <SelectTrigger id="recruiting-status-filter" className="input-readable"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Verbal">Verbal</SelectItem>
                                <SelectItem value="Committed">Committed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* GPA Filter with Search Button */}
                    <div className="space-y-1">
                        <Label htmlFor="gpa-filter" className="label-readable">Min. GPA</Label>
                        <Input
                            id="gpa-filter"
                            type="number"
                            placeholder="e.g., 3.5"
                            step="0.1"
                            value={searchInputs.minGpa}
                            onChange={(e) => handleSearchInputChange("minGpa", e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-readable"
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                        <Label className="invisible label-readable">Actions</Label>
                        <div className="flex gap-2 mobile-stack sm:flex-row">
                            <Button 
                                onClick={handleSearch} 
                                className="btn-team-primary flex-1 mobile-full-width"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                <span>Search</span>
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={resetFilters} 
                                className="btn-team-secondary mobile-full-width sm:w-auto"
                            >
                                <X className="w-4 h-4" />
                                <span className="sm:hidden ml-2">Reset</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}