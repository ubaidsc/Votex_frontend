import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Layouts
import { OrganizerLayout } from '@/components/layout/OrganizerLayout';
import { VoterLayout } from '@/components/layout/VoterLayout';

// Auth Pages
import OrganizerLogin from '@/pages/auth/OrganizerLogin';
import VoterLogin from '@/pages/auth/VoterLogin';
import Register from '@/pages/auth/Register';

// Organizer Pages
import ManageVoters from '@/pages/organizer/ManageVoters';
import ManagePolls from '@/pages/organizer/ManagePolls';
import PollResults from '@/pages/organizer/PollResults';

// Voter Pages
import Polls from '@/pages/voter/Polls';
import Results from '@/pages/voter/Results';

// Common Pages
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login/organizer" element={<OrganizerLogin />} />
            <Route path="/login/voter" element={<VoterLogin />} />
            <Route path="/register" element={<Register />} />
            
            {/* Organizer Routes */}
            <Route path="/organizer" element={<Navigate to="/organizer/voters" replace />} />
            <Route path="/organizer/voters" element={
              <OrganizerLayout>
                <ManageVoters />
              </OrganizerLayout>
            } />
            <Route path="/organizer/polls" element={
              <OrganizerLayout>
                <ManagePolls />
              </OrganizerLayout>
            } />
            <Route path="/organizer/results/:id" element={
              <OrganizerLayout>
                <PollResults />
              </OrganizerLayout>
            } />
            <Route path="/organizer/results" element={
              <OrganizerLayout>
                <Navigate to="/organizer/polls" replace />
              </OrganizerLayout>
            } />
            
            {/* Voter Routes */}
            <Route path="/voter" element={<Navigate to="/voter/polls" replace />} />
            <Route path="/voter/polls" element={
              <VoterLayout>
                <Polls />
              </VoterLayout>
            } />
            <Route path="/voter/results/:id" element={
              <VoterLayout>
                <Results />
              </VoterLayout>
            } />
            <Route path="/voter/results" element={
              <VoterLayout>
                <Navigate to="/voter/polls" replace />
              </VoterLayout>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;