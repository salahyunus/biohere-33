import React from "react";
import {
  MessageCircle,
  Users,
  BookOpen,
  HelpCircle,
  Star,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const WhatsAppCommunity: React.FC = () => {
  const handleJoinWhatsApp = () => {
    // Replace with actual WhatsApp group/community link
    window.open("https://chat.whatsapp.com/your-group-link", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Join Our WhatsApp Community!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow Unit 4 Biology students, share resources, ask
              questions, and get study tips from our active community.
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <Button
            onClick={handleJoinWhatsApp}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg gap-3 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
            Join WhatsApp Community
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Active Community</CardTitle>
              <CardDescription>
                Join 500+ students actively discussing Unit 4 Biology topics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Resource Sharing</CardTitle>
              <CardDescription>
                Share and access study materials, notes, and past papers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <HelpCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>
                Get instant help with difficult concepts and exam questions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">✅ Do:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Be respectful and helpful</li>
                  <li>• Share relevant study resources</li>
                  <li>• Ask questions about Unit 4 Biology</li>
                  <li>• Help others with their doubts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-600">❌ Don't:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Share irrelevant content</li>
                  <li>• Spam or self-promote</li>
                  <li>• Be disrespectful to members</li>
                  <li>• Share copyrighted materials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to boost your Unit 4 Biology studies?
          </p>
          <Button
            onClick={handleJoinWhatsApp}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCommunity;
