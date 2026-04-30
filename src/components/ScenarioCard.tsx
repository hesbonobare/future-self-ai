"use client";

import { useState } from "react";
import { Scenario } from "@/types/simulation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Heart,
  DollarSign,
  Clock,
} from "lucide-react";

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
}

const scenarioConfig = {
  best_case: {
    label: "Best Case",
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
    icon: TrendingUp,
    iconColor: "text-emerald-400",
    timelineDot: "bg-emerald-400",
    timelineLine: "from-emerald-400/50 to-transparent",
  },
  most_likely: {
    label: "Most Likely",
    gradient: "from-cyan-500/10 to-blue-500/5",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    dot: "bg-cyan-400",
    glow: "shadow-cyan-500/10",
    icon: Minus,
    iconColor: "text-cyan-400",
    timelineDot: "bg-cyan-400",
    timelineLine: "from-cyan-400/50 to-transparent",
  },
  worst_case: {
    label: "Worst Case",
    gradient: "from-red-500/10 to-orange-500/5",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    dot: "bg-red-400",
    glow: "shadow-red-500/10",
    icon: TrendingDown,
    iconColor: "text-red-400",
    timelineDot: "bg-red-400",
    timelineLine: "from-red-400/50 to-transparent",
  },
};

export function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const [expanded, setExpanded] = useState(index === 1);
  const config = scenarioConfig[scenario.type] ?? scenarioConfig.most_likely;
  const Icon = config.icon;

  return (
    <Card
      className={`
        relative overflow-hidden border bg-linear-to-br ${config.gradient} ${config.border}
        shadow-2xl ${config.glow} transition-all duration-300 hover:shadow-3xl
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r ${config.timelineLine}`}
      />

      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/30 border ${config.border}`}
            >
              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${config.badge}`}
                >
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {scenario.probability}% probability
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mt-1 leading-snug">
                {scenario.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 rounded-full p-2 hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
          {scenario.summary}
        </p>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 shrink-0" />
            <span className="leading-snug">{scenario.financial_trajectory}</span>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-5 px-4 sm:px-6">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              <Clock className="h-3 w-3" />
              Timeline
            </h4>
            <div className="space-y-0">
              {scenario.timeline.map((item, i) => (
                <div
                  key={i}
                  className="relative pl-7 pb-4 last:pb-0"
                >
                  {i < scenario.timeline.length - 1 && (
                    <div
                      className={`absolute left-[10px] top-5 bottom-0 w-px bg-linear-to-b ${config.timelineLine}`}
                    />
                  )}
                  <div
                    className={`absolute left-[6px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-background ${config.timelineDot}`}
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${config.iconColor}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{item.event}</p>
                    <p className="text-xs text-muted-foreground italic">
                      {item.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              <Zap className="h-3 w-3" />
              Turning Points
            </h4>
            <div className="space-y-2">
              {scenario.turning_points.map((tp, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/5 bg-black/20 p-3"
                >
                  <p className="text-sm font-medium text-foreground/90">
                    {tp.event}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tp.effect}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              <AlertTriangle className="h-3 w-3" />
              Risks
            </h4>
            <div className="flex flex-wrap gap-2">
              {scenario.risks.map((risk, i) => (
                <span
                  key={i}
                  className="rounded-md border border-white/8 bg-black/20 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {risk}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              <Heart className="h-3 w-3" />
              Emotional Trajectory
            </h4>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {scenario.emotional_trajectory.map((phase, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/5 bg-black/20 p-2.5"
                >
                  <p className="text-xs font-medium text-foreground/80">
                    {phase.phase}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {phase.feeling}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
