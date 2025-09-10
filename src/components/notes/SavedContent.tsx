import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  Highlighter,
  Image,
  Tag,
  ExternalLink,
  Trash2,
} from "lucide-react";

export const SavedContent: React.FC = () => {
  const [bookmarkedLessons] = useState([
    {
      id: "1",
      title: "Introduction to Cell Theory",
      unit: "Cell Structure",
      date: "2024-01-15",
    },
  ]);

  const [highlightedText] = useState([
    {
      id: "1",
      text: "The cell theory is one of the fundamental principles of biology",
      lesson: "Introduction to Cell Theory",
      date: "2024-01-15",
      tags: ["important"],
    },
  ]);

  const [savedImages] = useState([
    {
      id: "1",
      src: "https://dummyimage.com/300x200/4f46e5/ffffff?text=Cell+Diagram",
      caption: "Cell Theory Diagram",
      lesson: "Introduction to Cell Theory",
      date: "2024-01-15",
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Saved Content</h1>
        <p className="text-lg text-muted-foreground">
          All your bookmarked lessons, highlighted text, and saved images
        </p>
      </div>

      <Tabs defaultValue="bookmarks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookmarks">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="highlights">
            <Highlighter className="h-4 w-4 mr-2" />
            Highlights
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookmarkedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lesson.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saved on {lesson.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="highlights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Highlighted Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {highlightedText.map((highlight) => (
                <div
                  key={highlight.id}
                  className="p-3 border rounded space-y-2"
                >
                  <div className="bg-yellow-100 p-2 rounded">
                    "{highlight.text}"
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{highlight.lesson}</p>
                      <p className="text-xs text-muted-foreground">
                        Highlighted on {highlight.date}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {highlight.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedImages.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <img
                      src={image.src}
                      alt={image.caption}
                      className="w-full rounded-lg"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{image.caption}</p>
                        <p className="text-xs text-muted-foreground">
                          From {image.lesson} • {image.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
