import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface VideoTopic {
  id: string;
  title: string;
  videoId: string;
  duration: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  topics: VideoTopic[];
}

const channels: Channel[] = [
  {
    id: "biology-prof",
    name: "Biology with Prof. Johnson",
    description: "Complete A-level Biology coverage",
    topics: [
      {
        id: "1",
        title: "Cell Structure and Organization",
        videoId: "dQw4w9WgXcQ",
        duration: "15:23",
      },
      {
        id: "2",
        title: "Biological Molecules",
        videoId: "dQw4w9WgXcQ",
        duration: "18:45",
      },
      {
        id: "3",
        title: "Enzymes and Metabolism",
        videoId: "dQw4w9WgXcQ",
        duration: "22:10",
      },
      {
        id: "4",
        title: "Cell Membranes and Transport",
        videoId: "dQw4w9WgXcQ",
        duration: "19:32",
      },
      {
        id: "5",
        title: "Cell Division",
        videoId: "dQw4w9WgXcQ",
        duration: "16:55",
      },
    ],
  },
  {
    id: "bio-simplified",
    name: "Biology Simplified",
    description: "Easy-to-understand biology concepts",
    topics: [
      {
        id: "1",
        title: "Photosynthesis Explained",
        videoId: "dQw4w9WgXcQ",
        duration: "12:30",
      },
      {
        id: "2",
        title: "Cellular Respiration",
        videoId: "dQw4w9WgXcQ",
        duration: "14:20",
      },
      {
        id: "3",
        title: "DNA and RNA Structure",
        videoId: "dQw4w9WgXcQ",
        duration: "17:45",
      },
      {
        id: "4",
        title: "Protein Synthesis",
        videoId: "dQw4w9WgXcQ",
        duration: "20:15",
      },
    ],
  },
  {
    id: "advanced-bio",
    name: "Advanced Biology Concepts",
    description: "Deep dive into complex topics",
    topics: [
      {
        id: "1",
        title: "Gene Regulation",
        videoId: "dQw4w9WgXcQ",
        duration: "25:40",
      },
      {
        id: "2",
        title: "Biotechnology Applications",
        videoId: "dQw4w9WgXcQ",
        duration: "28:15",
      },
      {
        id: "3",
        title: "Evolutionary Biology",
        videoId: "dQw4w9WgXcQ",
        duration: "32:20",
      },
    ],
  },
  {
    id: "bio-lab",
    name: "Biology Lab Techniques",
    description: "Practical biology demonstrations",
    topics: [
      {
        id: "1",
        title: "Microscopy Techniques",
        videoId: "dQw4w9WgXcQ",
        duration: "21:30",
      },
      {
        id: "2",
        title: "Chromatography Methods",
        videoId: "dQw4w9WgXcQ",
        duration: "18:45",
      },
      {
        id: "3",
        title: "DNA Extraction Lab",
        videoId: "dQw4w9WgXcQ",
        duration: "24:10",
      },
      {
        id: "4",
        title: "Enzyme Activity Tests",
        videoId: "dQw4w9WgXcQ",
        duration: "19:55",
      },
    ],
  },
  {
    id: "exam-prep",
    name: "Biology Exam Prep",
    description: "Focused exam preparation content",
    topics: [
      {
        id: "1",
        title: "Unit 4 Overview",
        videoId: "dQw4w9WgXcQ",
        duration: "35:20",
      },
      {
        id: "2",
        title: "Common Exam Mistakes",
        videoId: "dQw4w9WgXcQ",
        duration: "22:45",
      },
      {
        id: "3",
        title: "Essay Question Techniques",
        videoId: "dQw4w9WgXcQ",
        duration: "27:30",
      },
      {
        id: "4",
        title: "Multiple Choice Strategies",
        videoId: "dQw4w9WgXcQ",
        duration: "15:40",
      },
      {
        id: "5",
        title: "Time Management Tips",
        videoId: "dQw4w9WgXcQ",
        duration: "18:25",
      },
    ],
  },
  {
    id: "bio-animations",
    name: "Biology Animations",
    description: "Visual learning through animations",
    topics: [
      {
        id: "1",
        title: "Mitosis Animation",
        videoId: "dQw4w9WgXcQ",
        duration: "8:15",
      },
      {
        id: "2",
        title: "Meiosis Process",
        videoId: "dQw4w9WgXcQ",
        duration: "10:30",
      },
      {
        id: "3",
        title: "Protein Folding",
        videoId: "dQw4w9WgXcQ",
        duration: "12:45",
      },
      {
        id: "4",
        title: "Membrane Transport",
        videoId: "dQw4w9WgXcQ",
        duration: "9:20",
      },
    ],
  },
];

const VideoLibrary: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentTopic = selectedChannel.topics[currentTopicIndex];

  const handleChannelChange = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel) {
      setSelectedChannel(channel);
      setCurrentTopicIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTopicIndex < selectedChannel.topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    }
  };

  const handleTopicSelect = (index: number) => {
    setCurrentTopicIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            Watch educational videos from top biology channels
          </p>
        </div>

        {/* Channel Selector */}
        <div className="mb-6">
          <Select
            value={selectedChannel.id}
            onValueChange={handleChannelChange}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {channel.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          {/* Collapsible Sidebar */}
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-80" : "w-12"
            }`}
          >
            <Card className="h-fit">
              <div className="p-4 border-b flex items-center justify-between">
                {isSidebarOpen && (
                  <h3 className="font-semibold">
                    Topics ({selectedChannel.topics.length})
                  </h3>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {isSidebarOpen && (
                <CardContent className="p-4 animate-fade-in">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedChannel.topics.map((topic, index) => (
                      <Button
                        key={topic.id}
                        variant={
                          index === currentTopicIndex ? "default" : "ghost"
                        }
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleTopicSelect(index)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {topic.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {topic.duration}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Main Video Area */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6 animate-fade-in">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentTopic.videoId}`}
                    title={currentTopic.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {currentTopic.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">{selectedChannel.name}</Badge>
                    <span>Duration: {currentTopic.duration}</span>
                    <span>
                      Topic {currentTopicIndex + 1} of{" "}
                      {selectedChannel.topics.length}
                    </span>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentTopicIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    {currentTopicIndex + 1} / {selectedChannel.topics.length}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={
                      currentTopicIndex === selectedChannel.topics.length - 1
                    }
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;
