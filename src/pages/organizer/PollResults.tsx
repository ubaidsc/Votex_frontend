import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";

export default function PollResults() {
  const { id } = useParams<{ id: string }>();
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
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

  const fetchResults = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch poll details
      const pollData = await pollService.getPoll(id);
      setPoll(pollData?.poll);

      // Fetch poll results
      const results = await pollService.getPollResults(id);
      setPollResult(results?.results);
    } catch (error) {
      console.error("Error fetching poll results:", error);
      setError("Failed to load poll results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchResults, 20000); // Poll every 10 seconds

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
        <Button onClick={fetchResults}>Try Again</Button>
      </div>
    );
  }

  if (!pollResult || !poll) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-muted-foreground mb-6">
          No results found for this poll.
        </p>
        <Button asChild>
          <Link to="/organizer/polls">Back to Polls</Link>
        </Button>
      </div>
    );
  }

  // Prepare data for pie chart
  const chartData = pollResult.options.map((option) => ({
    name: option.option,
    value: option.votes,
  }));
  // Calculate percentages for each option
  const optionsWithPercentage = pollResult.options.map((option) => ({
    ...option,
    percentage:
      pollResult.totalVotes > 0
        ? (option.votes / pollResult.totalVotes) * 100
        : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/organizer/polls">
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
            <CardTitle>Summary</CardTitle>
            <CardDescription>Poll statistics and vote counts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium">Total Votes</h3>
              <p className="text-3xl font-bold">{pollResult.totalVotes}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    poll.status === "active"
                      ? "bg-green-500"
                      : poll.status === "draft"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="capitalize">{poll.status}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Deadline</h3>
              <p>{formatDate(poll.deadline)}</p>
            </div>

            <Button onClick={fetchResults} variant="outline" className="w-full">
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
            {optionsWithPercentage.map((option, index) => (
              <div key={option.optionId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="h-3 w-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{option.option}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {option.votes} votes ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
