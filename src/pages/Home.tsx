import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, CheckCircle, Shield, UserCheck } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <PageLayout>
      <div className="container px-4 md:px-6 py-10 md:py-14 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Vote className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Secure Online Voting System
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
            A modern, secure platform for conducting elections and polls with complete
            integrity and transparency.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/login/organizer">Organizer Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login/voter">Voter Login</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                End-to-end encryption and secure authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our system uses the latest security protocols to ensure that all votes are 
                cast privately and counted accurately, with no way to trace votes back to individuals.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Transparent Results</CardTitle>
              <CardDescription>
                Real-time, verifiable voting results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Follow election results in real-time with detailed analytics and visual breakdowns,
                ensuring full transparency throughout the voting process.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                Simple tools for organizers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organizers can create and manage elections, add voters, and analyze results with an 
                intuitive dashboard designed for efficiency and ease of use.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="border rounded-lg p-6 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">Our simple three-step process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Create a Poll</h3>
              <p className="text-muted-foreground">
                Organizers create a poll, add options, and set a deadline for voting.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Add Voters</h3>
              <p className="text-muted-foreground">
                Add eligible voters to the system with secure credentials for authentication.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Collect Votes</h3>
              <p className="text-muted-foreground">
                Voters cast their ballots securely, and results are calculated in real-time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to get started?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Register as Organizer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login/voter">Login as Voter</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}