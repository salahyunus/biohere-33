import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Lightbulb,
  Star,
  Info,
  Save,
  Play,
  Pause,
} from "lucide-react";
import { NotesContent } from "@/hooks/useNotesData";
import { InteractiveQuiz } from "./InteractiveQuiz";
import { InteractiveFlashcards } from "./InteractiveFlashcards";
import { InteractiveKeywords } from "./InteractiveKeywords";

interface ContentRendererProps {
  content: NotesContent;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
}) => {
  const handleSaveContent = () => {
    // Save to saved content
    console.log("Saving content:", content.id);
  };

  switch (content.type) {
    case "heading":
      const HeadingTag =
        `h${content.content.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          className={`font-bold ${
            content.content.level === 1
              ? "text-3xl"
              : content.content.level === 2
              ? "text-2xl"
              : content.content.level === 3
              ? "text-xl"
              : "text-lg"
          }`}
        >
          {content.content.text}
        </HeadingTag>
      );

    case "paragraph":
      return (
        <div
          className="text-base leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: content.content.text.replace(
              /<keyword definition="([^"]*)">(.*?)<\/keyword>/g,
              '<span class="underline decoration-dashed cursor-help" title="$1">$2</span>'
            ),
          }}
        />
      );

    case "image":
      return (
        <div className="relative group">
          <img
            src={content.content.src}
            alt={content.content.alt}
            className="w-full rounded-lg shadow-lg"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleSaveContent}
          >
            <Save className="h-4 w-4" />
          </Button>
          {content.content.caption && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              {content.content.caption}
            </p>
          )}
        </div>
      );

    case "video":
      return (
        <div className="relative group">
          <video
            src={content.content.src}
            controls
            className="w-full rounded-lg shadow-lg"
          >
            Your browser does not support video playback.
          </video>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleSaveContent}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      );

    case "tip":
      const tipConfig = {
        "examiner-tip": {
          icon: Star,
          color: "bg-blue-50 border-blue-200",
          badge: "bg-blue-500",
        },
        "common-mistake": {
          icon: AlertTriangle,
          color: "bg-red-50 border-red-200",
          badge: "bg-red-500",
        },
        warning: {
          icon: AlertTriangle,
          color: "bg-orange-50 border-orange-200",
          badge: "bg-orange-500",
        },
        important: {
          icon: Info,
          color: "bg-green-50 border-green-200",
          badge: "bg-green-500",
        },
      };

      const config = tipConfig[content.content.type as keyof typeof tipConfig];
      const TipIcon = config.icon;

      return (
        <Card className={`${config.color} border-l-4`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TipIcon className="h-5 w-5 mt-0.5 text-current" />
              <div className="flex-1">
                <Badge className={`${config.badge} text-white mb-2`}>
                  {content.content.title}
                </Badge>
                <p className="text-sm">{content.content.text}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "quiz":
      return <InteractiveQuiz content={content.content} />;

    case "flashcards":
      return <InteractiveFlashcards content={content.content} />;

    case "keywords":
      return <InteractiveKeywords content={content.content} />;

    default:
      return null;
  }
};
