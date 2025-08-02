import Layout from "./Layout.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Athletes = lazy(() => import("./Athletes"));
const Statistics = lazy(() => import("./Statistics"));
const PlayerProfile = lazy(() => import("./PlayerProfile"));
const TeamSettings = lazy(() => import("./TeamSettings"));

const PAGES = {
    Athletes: Athletes,
    Statistics: Statistics,
    PlayerProfile: PlayerProfile,
    TeamSettings: TeamSettings,
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
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>            
                    <Route path="/" element={<Athletes />} />
                    <Route path="/Athletes" element={<Athletes />} />
                    <Route path="/Statistics" element={<Statistics />} />
                    <Route path="/PlayerProfile" element={<PlayerProfile />} />
                    <Route path="/TeamSettings" element={<TeamSettings />} />
                </Routes>
            </Suspense>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}