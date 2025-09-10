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
    "Expert": { min: 90, color: "bg-green-500" },
    "Advanced": { min: 75, color: "bg-blue-500" },
    "Intermediate": { min: 60, color: "bg-purple-500" },
    "Beginner": { min: 40, color: "bg-orange-500" },
    "Novice": { min: 20, color: "bg-yellow-500" },
  };

  const quickLinks = [
    {
      name: "Project Dashboard",
      path: "/dashboard",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      name: "Code Challenges",
      path: "/past-papers",
      icon: Trophy,
      color: "text-green-500",
    },
    { name: "Dev Notes", path: "/notes", icon: Star, color: "text-yellow-500" },
    {
      name: "Tech Flashcards",
      path: "/flashcards",
      icon: Brain,
      color: "text-purple-500",
    },
    {
      name: "Code Quiz Generator",
      path: "/quiz-generator",
      icon: Zap,
      color: "text-red-500",
    },
    { name: "Project Planner", path: "/planner", icon: Target, color: "text-cyan-500" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Tutorials",
      description: "Learn web development with hands-on coding exercises and real projects",
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-50 dark:border-blue-200/40 border-blue-200",
    },
    {
      icon: Trophy,
      title: "Code Challenge Library",
      description:
        "Practice with hundreds of coding challenges from beginner to advanced",
      color:
        "bg-green-50 text-green-600 dark:bg-green-600/20 dark:text-green-50 dark:border-green-200/40 border-green-200",
    },
    {
      icon: Brain,
      title: "Smart Learning Tools",
      description: "AI-powered code assistance and personalized learning paths",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-600/20 dark:text-purple-50 dark:border-purple-200/40 border-purple-200",
    },
    {
      icon: Calculator,
      title: "Performance Analytics",
      description: "Track your progress and optimize your web applications",
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
              Quackly - Web Development Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your ultimate companion for mastering web development - from frontend to backend and everything in between
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="animate-bounce">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Learning
              </Badge>
              <Badge variant="secondary" className="animate-bounce">
                <Award className="h-3 w-3 mr-1" />
                Industry Ready
              </Badge>
              <Badge variant="secondary" className="animate-bounce">
                <Heart className="h-3 w-3 mr-1" />
                Developer Friendly
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
              Get Pro
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="about-site" className="text-xs">
              About
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="text-xs">
              Tools
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
                  Introduction to Web Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Web development encompasses frontend, backend, and full-stack development. 
                  Quackly provides comprehensive tools and resources to help you master modern web technologies, 
                  from HTML/CSS basics to advanced frameworks and deployment strategies.
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
                  How to Become a Pro Developer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Learning Strategy
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Master the fundamentals: HTML, CSS, and JavaScript",
                        "Build projects to apply your knowledge practically", 
                        "Learn version control with Git and GitHub",
                        "Practice with coding challenges daily",
                        "Join developer communities for collaboration",
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
                      Career Skills
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Learn to read and write clean, maintainable code",
                        "Understand debugging and testing methodologies",
                        "Practice responsive design and accessibility",
                        "Master deployment and DevOps basics",
                        "Build a strong portfolio on GitHub",
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
                    Focus on building real projects and contributing to open source. 
                    Use Quackly's analytics tools to track your coding progress and 
                    identify areas where you can level up your skills.
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
                  Performance Analytics System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Understanding performance metrics helps you optimize your web applications 
                  and track your learning progress as a developer.
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
                          <span className="font-medium">Level: {grade}</span>
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
                    Performance vs Learning Progress
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Performance metrics track your application's speed and efficiency, 
                    while learning progress shows your skill development. Use our analytics 
                    tool for comprehensive tracking.
                  </p>
                </div>

                <Link to="/grade-boundary">
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Open Performance Analytics
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
                  About Quackly Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Quackly is a comprehensive web development platform designed to help 
                  developers of all skill levels. It combines interactive learning tools 
                  with practical coding challenges to create an optimal development 
                  learning experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="text-blue-700 dark:text-blue-300 font-semibold">
                        Dev Tools
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300">
                        Code editors, debuggers, analyzers
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold text-green-800">Learning</h4>
                      <p className="text-sm text-green-600">
                        Challenges, tutorials
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
                        Analytics, portfolio
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
                  Developer Tools & Quick Links
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
                      <strong>Project Dashboard:</strong> Central hub for managing dev projects
                    </div>
                    <div>
                      <strong>Code Challenges:</strong> Practice coding with various difficulties
                    </div>
                    <div>
                      <strong>Dev Notes:</strong> Documentation and code snippets
                    </div>
                    <div>
                      <strong>Tech Flashcards:</strong> Quick review of concepts
                    </div>
                    <div>
                      <strong>Project Planner:</strong> Plan and track development milestones
                    </div>
                    <div>
                      <strong>Analytics:</strong> Monitor performance and progress
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
