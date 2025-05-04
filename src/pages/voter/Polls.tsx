import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Poll, VoteStatus } from "@/types";
import { pollService } from "@/services/pollService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDate, isAfterNow } from "@/lib/utils";

export default function Polls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voteStatuses, setVoteStatuses] = useState<Record<string, VoteStatus>>(
    {}
  );
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const data = await pollService.getAvailablePolls();
      setPolls(data.polls);

      // Fetch vote status for each poll
      const statuses: Record<string, VoteStatus> = {};
      for (const poll of data.polls) {
        try {
          const status = await pollService.getVoteStatus(poll.id);
          console.log(status.status);
          statuses[poll.id] = status.status;
        } catch (error) {
          console.error(
            `Error fetching vote status for poll ${poll.id}:`,
            error
          );
          statuses[poll.id] = { hasVoted: false };
        }
      }
      setVoteStatuses(statuses);
    } catch (error) {
      console.error("Error fetching polls:", error);
      // toast.error("Failed to load available polls");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      setVotingInProgress(pollId);
      await pollService.castVote(pollId, optionId);

      // Update vote status
      setVoteStatuses((prev) => ({
        ...prev,
        [pollId]: { hasVoted: true, optionId },
      }));

      toast.success("Your vote has been recorded");
    } catch (error) {
      console.error("Error casting vote:", error);
    } finally {
      setVotingInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-muted-foreground">Loading available polls...</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">No Active Polls</h2>
          <p className="text-muted-foreground mb-6">
            There are currently no active polls available for you to vote on.
            Please check back later.
          </p>
          <Button onClick={fetchPolls}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Active Polls</h1>
        <p className="text-muted-foreground">
          Cast your vote in the following active polls.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => {
          const voteStatus = voteStatuses[poll.id];
          const hasVoted = voteStatus?.hasVoted || false;
          const isPollActive =
            poll.status === "active" && isAfterNow(poll.deadline);

          return (
            <Card
              key={poll.id}
              className={`overflow-hidden transition-all duration-200 ${
                !isPollActive ? "opacity-70" : ""
              }`}
            >
              <CardHeader>
                {hasVoted && (
                  <div className="absolute top-3 right-3 bg-primary/10 text-primary rounded-full p-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>
                  Deadline: {formatDate(poll.deadline)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{poll.description}</p>

                <Separator className="my-4" />

                {hasVoted ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      You have already voted in this poll.
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link to={`/voter/results/${poll.id}`}>View Results</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-medium mb-3">Options:</h3>
                    <div className="space-y-2">
                      {poll.options.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className="w-full justify-start"
                          disabled={
                            !isPollActive || votingInProgress === poll.id
                          }
                          onClick={() => handleVote(poll.id, option.id)}
                        >
                          {votingInProgress === poll.id ? (
                            <LoadingSpinner size="small" className="mr-2" />
                          ) : (
                            <div className="h-4 w-4 mr-2 rounded-full border border-input flex items-center justify-center">
                              {voteStatus?.optionId === option.id && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="bg-muted/40 pt-2">
                <p className="text-xs text-muted-foreground">
                  {isPollActive
                    ? `Voting ends on ${format(
                        new Date(poll.deadline),
                        "MMM d, yyyy 'at' h:mm a"
                      )}`
                    : "This poll is no longer active"}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
