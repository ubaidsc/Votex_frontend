import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PollResult } from "@/types";
import { pollService } from "@/services/pollService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/utils";

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
  const [voteStatus, setVoteStatus] = useState<{
    hasVoted: boolean;
    optionId?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [poll, setPoll] = useState<any>(null);

  // Colors for the pie chart
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const fetchData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch poll details
      const pollData = await pollService.getPoll(id);
      if (!pollData || !pollData.poll) {
        throw new Error("Invalid poll data received");
      }
      setPoll(pollData.poll);

      // Fetch vote status
      const status = await pollService.getVoteStatus(id);
      if (!status) {
        throw new Error("Invalid vote status received");
      }
      setVoteStatus(status);

      // Only fetch results if the user has voted
      if (status.hasVoted) {
        const results = await pollService.getPollResults(id);
        if (!results || !Array.isArray(results.options)) {
          throw new Error("Invalid poll results format");
        }
        setPollResult(results);
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
      setError("Failed to load poll results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-muted-foreground">Loading poll results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-destructive mb-4 text-lg">Error</div>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchData}>Try Again</Button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-muted-foreground mb-6">Poll not found.</p>
        <Button asChild>
          <Link to="/voter/polls">Back to Polls</Link>
        </Button>
      </div>
    );
  }

  if (!voteStatus?.hasVoted) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">You Haven't Voted Yet</h2>
          <p className="text-muted-foreground mb-6">
            You need to cast your vote before you can see the results of this
            poll.
          </p>
          <Button asChild>
            <Link to="/voter/polls">Go to Polls</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!pollResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-muted-foreground mb-6">
          No results available for this poll yet.
        </p>
        <Button onClick={fetchData}>Refresh</Button>
      </div>
    );
  }

  // Prepare data for pie chart
  const chartData = pollResult.options.map((option) => ({
    name: option.text,
    value: option.voteCount,
  }));

  // Find the option the user voted for
  const userVote = pollResult.options.find(
    (option) => option.id === voteStatus?.optionId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/voter/polls">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{poll.title}</h1>
          <p className="text-muted-foreground">
            Results as of {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>
              Visual representation of all votes cast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} votes`, "Votes"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Vote</CardTitle>
            <CardDescription>You voted for this option</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="font-medium">{userVote?.text}</p>
            </div>

            <div>
              <h3 className="font-medium">Total Votes</h3>
              <p className="text-3xl font-bold">{pollResult.totalVotes}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Deadline</h3>
              <p>{formatDate(poll.deadline)}</p>
            </div>

            <Button onClick={fetchData} variant="outline" className="w-full">
              Refresh Results
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Breakdown of votes for each option</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pollResult.options.map((option, index) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="h-3 w-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span
                      className={`font-medium ${
                        option.id === voteStatus?.optionId ? "text-primary" : ""
                      }`}
                    >
                      {option.text}
                      {option.id === voteStatus?.optionId && " (Your vote)"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {option.voteCount} votes ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={option.percentage}
                  className={`h-2 ${
                    option.id === voteStatus?.optionId ? "bg-primary/20" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
