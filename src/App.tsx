import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PayoutSupportBanner from "@/components/PayoutSupportBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy load components
const Index = React.lazy(() => import("./pages/Index"));
const AllPropFirms = React.lazy(() => import("./pages/AllPropFirms"));
const Comparison = React.lazy(() => import("./pages/Comparison"));
const CheapFirms = React.lazy(() => import("./pages/CheapFirms"));
const DramaTracker = React.lazy(() => import("./pages/DramaTracker"));
const DramaSubmit = React.lazy(() => import("./pages/DramaSubmit"));
const TopFirms = React.lazy(() => import("./pages/TopFirms"));
const PropFirmDetail = React.lazy(() => import("./pages/PropFirmDetail"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const ReviewDetail = React.lazy(() => import("./pages/ReviewDetail"));
const FirmReviewDetail = React.lazy(() => import("./pages/FirmReviewDetail"));
const WriteReview = React.lazy(() => import("./pages/WriteReview"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const EmailConfirmation = React.lazy(() => import("./pages/EmailConfirmation"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const TableReview = React.lazy(() => import("./pages/TableReview"));
const ProtectedRoute = React.lazy(() => import("@/components/ProtectedRoute"));
const AdminRoute = React.lazy(() => import("@/components/AdminRoute"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
      <div className="text-white text-lg">Loading...</div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PayoutSupportBanner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/propfirms" element={<AllPropFirms />} />
              <Route path="/compare" element={<Comparison />} />
              <Route path="/cheap-firms" element={<CheapFirms />} />
              <Route path="/drama-tracker" element={<DramaTracker />} />
              <Route path="/drama-tracker/submit" element={<DramaSubmit />} />
              <Route path="/top-firms" element={<TopFirms />} />
              <Route path="/firms/:id" element={<PropFirmDetail />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/:slug" element={<ReviewDetail />} />
              <Route path="/firm-reviews/:firmId" element={<FirmReviewDetail />} />
              <Route path="/write-review/:firmId" element={<WriteReview />} />
              <Route path="/table-review" element={<TableReview />} />

              {/* Public auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<EmailConfirmation />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin auth */}
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin-dashboard-2024" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;