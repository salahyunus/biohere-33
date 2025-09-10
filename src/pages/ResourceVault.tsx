import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  Youtube,
  FileText,
  BookOpen,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Video,
  BookmarkIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "link" | "youtube" | "notes";
  category: string;
  url: string;
  downloadUrl?: string;
  thumbnail?: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Complete Biology Unit 4 Notes",
    description: "Comprehensive notes covering all topics in Unit 4",
    type: "pdf",
    category: "Notes",
    url: "#",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "Photosynthesis & Respiration Guide",
    description: "Detailed guide on cellular processes",
    type: "notes",
    category: "Topic Guides",
    url: "#",
  },
  {
    id: "3",
    title: "Biology with Prof. Johnson",
    description: "Excellent YouTube channel for A-level Biology",
    type: "youtube",
    category: "Video Resources",
    url: "https://youtube.com/@biologyprof",
  },
  {
    id: "4",
    title: "Past Papers Collection 2020-2024",
    description: "Complete collection of recent past papers",
    type: "pdf",
    category: "Past Papers",
    url: "#",
    downloadUrl: "#",
  },
  {
    id: "5",
    title: "Interactive Biology Simulations",
    description: "Online simulations for better understanding",
    type: "link",
    category: "Interactive",
    url: "https://example.com/simulations",
  },
  {
    id: "6",
    title: "Genetics Problem Solving",
    description: "Step-by-step genetics problem solutions",
    type: "pdf",
    category: "Problem Sets",
    url: "#",
    downloadUrl: "#",
  },
];

const ResourceVault: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const resourceTypes = [
    { value: "pdf", label: "PDFs", icon: FileText, color: "text-red-500" },
    { value: "notes", label: "Notes", icon: BookOpen, color: "text-blue-500" },
    {
      value: "youtube",
      label: "YouTube",
      icon: Youtube,
      color: "text-red-600",
    },
    { value: "link", label: "Links", icon: LinkIcon, color: "text-green-500" },
  ];

  const categories = [
    "Notes",
    "Past Papers",
    "Topic Guides",
    "Video Resources",
    "Interactive",
    "Problem Sets",
  ];

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(resource.type);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(resource.category);

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleTypeFilter = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find((rt) => rt.value === type);
    if (!resourceType) return FileText;
    return resourceType.icon;
  };

  const getResourceColor = (type: string) => {
    const resourceType = resourceTypes.find((rt) => rt.value === type);
    return resourceType?.color || "text-gray-500";
  };

  const handleResourceAction = (resource: Resource) => {
    if (resource.type === "pdf" && resource.downloadUrl) {
      // Trigger download
      const link = document.createElement("a");
      link.href = resource.downloadUrl;
      link.download = resource.title;
      link.click();
    } else {
      // Open link
      window.open(resource.url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Resource Vault</h1>
        <p className="text-muted-foreground">
          Access study materials, past papers, video resources, and helpful
          links
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => navigate("/vault/pdf-notes")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">PDF Notes</CardTitle>
                <CardDescription className="text-sm">
                  Comprehensive study notes in PDF format
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant="secondary" className="text-xs">
              7 Topics Available
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => navigate("/vault/video-library")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Video className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Video Library</CardTitle>
                <CardDescription className="text-sm">
                  Educational videos and tutorials
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 animate-fade-in">
            <Badge variant="secondary" className="text-xs">
              6 Channels Available
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => navigate("/vault/keywords-library")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookmarkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Keywords Library</CardTitle>
                <CardDescription className="text-sm">
                  Interactive keyword definitions and testing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 animate-fade-in">
            <Badge variant="secondary" className="text-xs">
              Interactive Learning
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedTypes.length > 0 ||
                  selectedCategories.length > 0) && (
                  <Badge variant="secondary">
                    {selectedTypes.length + selectedCategories.length}
                  </Badge>
                )}
              </div>
              {isFilterOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6 space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-medium mb-3">Content Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {resourceTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={selectedTypes.includes(type.value)}
                            onCheckedChange={() => handleTypeFilter(type.value)}
                          />
                          <Icon className={`h-4 w-4 ${type.color}`} />
                          <span className="text-sm">{type.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryFilter(category)}
                        />
                        <span className="text-sm">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredResources.length} of {mockResources.length} resources
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = getResourceIcon(resource.type);
          const iconColor = getResourceColor(resource.type);

          return (
            <Card
              key={resource.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {resource.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 animate-fade-in">
                <Button
                  onClick={() => handleResourceAction(resource)}
                  className="w-full"
                  variant={resource.type === "pdf" ? "default" : "outline"}
                >
                  {resource.type === "pdf" ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  ) : resource.type === "youtube" ? (
                    <>
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceVault;
