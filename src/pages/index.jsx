import Layout from "./Layout.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Athletes = lazy(() => import("./Athletes"));
const Statistics = lazy(() => import("./Statistics"));
const PlayerProfile = lazy(() => import("./PlayerProfile"));
const TeamSettings = lazy(() => import("./TeamSettings"));
const Auth = lazy(() => import("./Auth"));
const Games = lazy(() => import("./Games"));
const GameEntry = lazy(() => import("./GameEntry"));

const PAGES = {
    Athletes: Athletes,
    Statistics: Statistics,
    PlayerProfile: PlayerProfile,
    TeamSettings: TeamSettings,
    Auth: Auth,
    Games: Games,
    GameEntry: GameEntry,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context  
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Routes>            
                        <Route path="/" element={<Athletes />} />
                        <Route path="/Athletes" element={<Athletes />} />
                        <Route path="/Statistics" element={<Statistics />} />
                        <Route path="/PlayerProfile" element={<PlayerProfile />} />
                        <Route path="/TeamSettings" element={<TeamSettings />} />
                        <Route path="/Games" element={<Games />} />
                        <Route path="/game/new" element={<GameEntry />} />
                        <Route path="/game/:id" element={<GameEntry />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </Layout>
    );
}

// Main router component
function MainRouter() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    console.log('MainRouter state:', { isAuthenticated, isLoading, user, pathname: location.pathname });

    // Show loading while checking auth status
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated and trying to access auth page, redirect to main app
    if (isAuthenticated && location.pathname === '/auth') {
        console.log('Authenticated user on auth page, redirecting to dashboard');
        return <Navigate to="/" replace />;
    }

    // If not authenticated and not on auth page, redirect to auth
    if (!isAuthenticated && location.pathname !== '/auth') {
        console.log('Not authenticated, redirecting to auth');
        return <Navigate to="/auth" replace />;
    }

    return (
        <Routes>
            <Route path="/auth" element={
                <ErrorBoundary>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <Auth />
                    </Suspense>
                </ErrorBoundary>
            } />
            <Route path="/*" element={<PagesContent />} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <MainRouter />
        </Router>
    );
}