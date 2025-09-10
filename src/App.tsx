import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SyllabusChecklist from "./pages/SyllabusChecklist";
import PastPapers from "./pages/PastPapers";
import PastPapersSearch from "./pages/PastPapersSearch";
import Topical from "./pages/Topical";
import Flashcards from "./pages/Flashcards";
import WhatsappCommunity from "./pages/WhatsappCommunity";
import { PdfAnnotation } from "./pages/PdfAnnotation";
import { PdfViewer } from "./pages/PdfViewer";
import GradeBoundary from "./pages/GradeBoundary";
import Planner from "./pages/Planner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MCQSolver from "./pages/MCQSolver";
import ResourceVault from "./pages/ResourceVault";
import PdfNotes from "./pages/PdfNotes";
import WrittenSolver from "./pages/WrittenSolver";
import QuizGenerator from "./pages/QuizGenerator";
import Notes from "./pages/Notes";
import VideoLibrary from "./pages/VideoLibrary";
import KeywordsLibrary from "./pages/KeywordsLibrary";
import About from "./pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/whatsapp-community"
                  element={<WhatsappCommunity />}
                />
                <Route
                  path="/syllabus"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <SyllabusChecklist />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/past-papers"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <PastPapers />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/past-papers/search"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <PastPapersSearch />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/topical"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <Topical />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/flashcards"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <Flashcards />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pdf-annotation/:paperId"
                  element={<PdfAnnotation />}
                />
                <Route path="/pdf-viewer/:paperId" element={<PdfViewer />} />
                <Route
                  path="/grade-boundary"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <GradeBoundary />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/planner"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <Planner />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mcq-solver"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <MCQSolver />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/written-solver"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <WrittenSolver />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vault"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <ResourceVault />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vault/pdf-notes"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <PdfNotes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vault/video-library"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <VideoLibrary />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vault/keywords-library"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <KeywordsLibrary />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-generator"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <QuizGenerator />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:unitId" element={<Notes />} />
                <Route path="/notes/:unitId/:lessonId" element={<Notes />} />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        {" "}
                        <About />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
