import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Trophy,
  Calculator,
  Info,
  Map,
  Navigation,
  Lightbulb,
  Star,
  User,
  ExternalLink,
  ArrowRight,
  Target,
  Brain,
  Zap,
  Heart,
  CheckCircle,
  Award,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const gradeCalculator = {
    "A*": { min: 80, color: "bg-green-500" },
    A: { min: 70, color: "bg-blue-500" },
    B: { min: 60, color: "bg-purple-500" },
    C: { min: 50, color: "bg-orange-500" },
    D: { min: 40, color: "bg-yellow-500" },
  };

  const quickLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      name: "Past Papers",
      path: "/past-papers",
      icon: Trophy,
      color: "text-green-500",
    },
    { name: "Notes", path: "/notes", icon: Star, color: "text-yellow-500" },
    {
      name: "Flashcards",
      path: "/flashcards",
      icon: Brain,
      color: "text-purple-500",
    },
    {
      name: "Quiz Generator",
      path: "/quiz-generator",
      icon: Zap,
      color: "text-red-500",
    },
    { name: "Planner", path: "/planner", icon: Target, color: "text-cyan-500" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Notes",
      description: "Interactive study notes with embedded quizzes and keywords",
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-50 dark:border-blue-200/40 border-blue-200",
    },
    {
      icon: Trophy,
      title: "Past Papers Library",
      description:
        "Extensive collection of past papers with AI-powered solutions",
      color:
        "bg-green-50 text-green-600 dark:bg-green-600/20 dark:text-green-50 dark:border-green-200/40 border-green-200",
    },
    {
      icon: Brain,
      title: "Smart Flashcards",
      description: "Adaptive flashcard system with spaced repetition",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-600/20 dark:text-purple-50 dark:border-purple-200/40 border-purple-200",
    },
    {
      icon: Calculator,
      title: "Grade Calculator",
      description: "Accurate UMS and grade boundary analysis",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-600/20 dark:text-orange-50 dark:border-orange-200/40 border-orange-200",
    },
  ];

  return (
    <>
      {" "}
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center py-12   rounded-2xl border">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4  rounded-full animate-pulse">
                <Rocket className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold   bg-clip-text text-transparent">
              Biology Unit-4 Study Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your complete companion for mastering Edexcel IAL Biology Unit-4
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="animate-bounce">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Learning
              </Badge>
              <Badge variant="secondary" className="animate-bounce">
                <Award className="h-3 w-3 mr-1" />
                Grade A* Focused
              </Badge>
              <Badge variant="secondary" className="animate-bounce">
                <Heart className="h-3 w-3 mr-1" />
                Student Friendly
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="intro" className="text-xs">
              Intro
            </TabsTrigger>
            <TabsTrigger value="grade-a" className="text-xs">
              Get A*
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs">
              Grades
            </TabsTrigger>
            <TabsTrigger value="about-site" className="text-xs">
              About
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="text-xs">
              Sitemap
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs">
              Tips
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">
              Resources
            </TabsTrigger>
            <TabsTrigger value="about-me" className="text-xs">
              Creator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Introduction to Unit-4 Biology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Unit-4 Biology covers advanced concepts in metabolism,
                  genetics, and ecology. This comprehensive study platform
                  provides everything you need to excel in your exams.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <Card
                      key={feature.title}
                      className={`${feature.color} border-l-4 transition-all duration-300 hover:scale-105 cursor-pointer`}
                      onMouseEnter={() => setHoveredCard(feature.title)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <feature.icon
                            className={`h-6 w-6 mt-0.5 ${
                              hoveredCard === feature.title
                                ? "animate-bounce"
                                : ""
                            }`}
                          />
                          <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm opacity-80">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade-a" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  How to Get an A* in Biology Unit-4
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Study Strategy
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Complete all syllabus objectives systematically",
                        "Practice past papers under timed conditions",
                        "Use active recall with flashcards",
                        "Create mind maps for complex topics",
                        "Form study groups for discussion",
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Exam Technique
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Read questions carefully and identify command words",
                        "Use scientific terminology accurately",
                        "Show your working in calculations",
                        "Manage your time effectively",
                        "Review answers before submitting",
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-500 animate-pulse" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r dark:from-yellow-50/10 from-yellow-50 dark:to-orange-50/10 to-orange-50 p-6 rounded-lg border border-yellow-200/10">
                  <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Pro Tip
                  </h4>
                  <p className="text-yellow-300 text-sm">
                    Aim for 80%+ consistently in practice papers. Use this
                    platform's grade calculator to track your progress and
                    identify areas for improvement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Grade Calculation System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Understanding how grades are calculated can help you set
                  realistic targets and track progress.
                </p>

                <div className="space-y-4">
                  {Object.entries(gradeCalculator).map(([grade, info]) => (
                    <div
                      key={grade}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${info.color} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {grade}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Grade {grade}</span>
                          <span className="text-sm text-muted-foreground">
                            {info.min}%+
                          </span>
                        </div>
                        <Progress value={info.min} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    UMS vs Raw Marks
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Raw marks are converted to UMS (Uniform Mark Scale) which
                    determines your final grade. Use our Grade Boundary tool for
                    accurate calculations.
                  </p>
                </div>

                <Link to="/grade-boundary">
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Open Grade Calculator
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about-site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-purple-500" />
                  About This Study Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  This comprehensive study platform was designed specifically
                  for Edexcel IAL Biology Unit-4 students. It combines
                  traditional study methods with modern technology to create an
                  optimal learning experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="text-blue-700 dark:text-blue-300 font-semibold">
                        Study Tools
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300">
                        Notes, flashcards, quizzes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold text-green-800">Practice</h4>
                      <p className="text-sm text-green-600">
                        Past papers, MCQs
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">
                        Progress
                      </h4>
                      <p className="text-sm text-purple-600">
                        Tracking, analytics
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-green-500" />
                  Site Navigation & Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickLinks.map((link, index) => (
                    <Link key={link.path} to={link.path}>
                      <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
                        <CardContent className="p-4 text-center">
                          <link.icon
                            className={`h-6 w-6 mx-auto mb-2 ${link.color} group-hover:animate-bounce`}
                          />
                          <p className="text-sm font-medium group-hover:text-primary">
                            {link.name}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Page Descriptions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <strong>Dashboard:</strong> Central hub with progress
                      overview
                    </div>
                    <div>
                      <strong>Notes:</strong> Interactive study materials
                    </div>
                    <div>
                      <strong>Past Papers:</strong> Extensive exam practice
                    </div>
                    <div>
                      <strong>Flashcards:</strong> Memory reinforcement tools
                    </div>
                    <div>
                      <strong>Planner:</strong> Study schedule management
                    </div>
                    <div>
                      <strong>Grade Calculator:</strong> Performance analysis
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Study Tips & Tricks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Memory Techniques</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          1
                        </Badge>
                        <div>
                          <strong>Spaced Repetition:</strong> Review material at
                          increasing intervals
                        </div>
                      </li>
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          2
                        </Badge>
                        <div>
                          <strong>Mnemonics:</strong> Create memorable phrases
                          for complex sequences
                        </div>
                      </li>
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          3
                        </Badge>
                        <div>
                          <strong>Visual Maps:</strong> Draw diagrams and
                          concept maps
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Time Management</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          1
                        </Badge>
                        <div>
                          <strong>Pomodoro:</strong> 25-minute focused study
                          sessions
                        </div>
                      </li>
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          2
                        </Badge>
                        <div>
                          <strong>Prioritize:</strong> Focus on weak areas first
                        </div>
                      </li>
                      <li className="flex gap-3 items-start">
                        <Badge variant="outline" className="mt-0.5">
                          3
                        </Badge>
                        <div>
                          <strong>Regular Breaks:</strong> Maintain focus and
                          avoid burnout
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  Important Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h4 className="text-blue-700 dark:text-blue-300 font-semibold">
                        Official Resources
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Edexcel Specification Document</li>
                        <li>• Grade Boundaries Archive</li>
                        <li>• Examiner Reports</li>
                        <li>• Sample Assessment Materials</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-700 mb-2">
                        Study Materials
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Interactive Notes & Diagrams</li>
                        <li>• Video Explanations</li>
                        <li>• Practice Questions Bank</li>
                        <li>• Revision Checklists</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about-me" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  About the Creator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-indigo-600" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      This platform was created by a passionate biology educator
                      with years of experience in helping students achieve their
                      academic goals. The goal is to make quality education
                      accessible and engaging for everyone.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Biology Education</Badge>
                      <Badge variant="secondary">Exam Preparation</Badge>
                      <Badge variant="secondary">Student Success</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default About;
