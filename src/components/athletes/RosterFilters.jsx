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
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                    {/* Name Filter with Search Button */}
                    <div className="space-y-1">
                        <Label htmlFor="name-filter">Name</Label>
                        <div className="flex gap-1">
                            <Input
                                id="name-filter"
                                type="text"
                                placeholder="Search by name"
                                value={searchInputs.name}
                                onChange={(e) => handleSearchInputChange("name", e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Class Year Filter */}
                    <div className="space-y-1">
                        <Label htmlFor="class-year-filter">Class Year</Label>
                        <Select value={appliedFilters.classYear} onValueChange={(value) => handleDropdownChange("classYear", value)}>
                            <SelectTrigger id="class-year-filter"><SelectValue placeholder="All Years" /></SelectTrigger>
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
                        <Label htmlFor="sport-type-filter">Sport</Label>
                        <SportTypeComboBox 
                            value={appliedFilters.sportType} 
                            onValueChange={(value) => handleDropdownChange("sportType", value === "All" ? "All" : value)} 
                            placeholder="All Sports" 
                        />
                    </div>

                    {/* Recruiting Status Filter */}
                    <div className="space-y-1">
                        <Label htmlFor="recruiting-status-filter">Recruiting Status</Label>
                        <Select value={appliedFilters.recruitingStatus} onValueChange={(value) => handleDropdownChange("recruitingStatus", value)}>
                            <SelectTrigger id="recruiting-status-filter"><SelectValue placeholder="All Statuses" /></SelectTrigger>
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
                        <Label htmlFor="gpa-filter">Min. GPA</Label>
                        <Input
                            id="gpa-filter"
                            type="number"
                            placeholder="e.g., 3.5"
                            step="0.1"
                            value={searchInputs.minGpa}
                            onChange={(e) => handleSearchInputChange("minGpa", e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-1">
                        <Label className="invisible">Actions</Label>
                        <div className="flex gap-1">
                            <Button onClick={handleSearch} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700">
                                <Search className="w-4 h-4 mr-1" />
                                Search
                            </Button>
                            <Button variant="ghost" onClick={resetFilters} className="h-10 px-3">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}