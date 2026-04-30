"use client";

import { useState } from "react";
import { SimulationResult, SimulationRequest } from "@/types/simulation";
import { ScenarioCard } from "@/components/ScenarioCard";
import { OracleCharacter } from "@/components/OracleCharacter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  RotateCcw,
  ChevronRight,
  GitBranch,
  Clock,
  TrendingUp,
} from "lucide-react";

function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        background: `linear-gradient(to right, oklch(0.72 0.18 195) ${pct}%, oklch(0.22 0.03 265) ${pct}%)`,
      }}
      className="w-full h-2 rounded-full outline-none cursor-pointer appearance-none
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-5
        [&::-webkit-slider-thumb]:h-5
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:border-2
        [&::-webkit-slider-thumb]:border-primary
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:shadow-lg
        [&::-webkit-slider-thumb]:transition-transform
        [&::-webkit-slider-thumb]:hover:scale-110
        [&::-moz-range-thumb]:w-5
        [&::-moz-range-thumb]:h-5
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:bg-white
        [&::-moz-range-thumb]:border-2
        [&::-moz-range-thumb]:border-primary
        [&::-moz-range-thumb]:cursor-pointer
        [&::-moz-range-thumb]:shadow-lg"
    />
  );
}

const EXAMPLE_DECISIONS = [
  "Should I quit my corporate job to start a tech startup?",
  "Should I move to a new country for a better career opportunity?",
  "Should I go back to school for an MBA while working full-time?",
  "Should I invest my savings in real estate instead of keeping them in the bank?",
];

const FINANCIAL_OPTIONS = [
  { value: "struggling", label: "Struggling — debt or barely making ends meet" },
  { value: "stable", label: "Stable — covering expenses with little savings" },
  { value: "comfortable", label: "Comfortable — savings and moderate investments" },
  { value: "wealthy", label: "Wealthy — significant assets and investments" },
];


function getRiskLabel(value: number) {
  if (value <= 33) return "low";
  if (value <= 66) return "medium";
  return "high";
}

function getTimeHorizon(value: number) {
  if (value <= 12) return "1 year";
  if (value <= 37) return "3 years";
  if (value <= 62) return "5 years";
  if (value <= 87) return "7 years";
  return "10 years";
}

export function FutureSelfApp() {
  const [decision, setDecision] = useState("");
  const [age, setAge] = useState(28);
  const [career, setCareer] = useState("");
  const [financialStatus, setFinancialStatus] = useState("");
  const [riskSlider, setRiskSlider] = useState(50);
  const [timeSlider, setTimeSlider] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVariation, setIsVariation] = useState(false);

  async function runSimulation(variation = false) {
    if (!decision.trim()) return;
    setLoading(true);
    setError(null);
    setIsVariation(variation);

    const payload: SimulationRequest = {
      decision: decision.trim(),
      age,
      career: career || "Not specified",
      financial_status:
        FINANCIAL_OPTIONS.find((o) => o.value === financialStatus)?.label ||
        financialStatus ||
        "Not specified",
      risk_level: getRiskLabel(riskSlider),
      time_horizon: getTimeHorizon(timeSlider),
      isVariation: variation,
    };

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Simulation failed");
      }

      const data = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setIsVariation(false);
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6">
          <header className="mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <OracleCharacter state="complete" size={44} className="shrink-0" />
              <div>
                <span className="text-base sm:text-lg font-bold shimmer-text">FutureSelf</span>
                <p className="text-xs text-muted-foreground hidden sm:block">Simulation Report by ORACLE</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              <span>New Decision</span>
            </button>
          </header>

          <div className="mb-4 rounded-xl border border-white/8 bg-card p-3 sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Decision Simulated
            </p>
            <p className="text-sm sm:text-base text-foreground font-medium">&ldquo;{result.decision}&rdquo;</p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: GitBranch, label: "3 Futures", sub: "Simulated" },
              { icon: Clock, label: getTimeHorizon(timeSlider), sub: "Time Horizon" },
              {
                icon: TrendingUp,
                label: getRiskLabel(riskSlider).charAt(0).toUpperCase() + getRiskLabel(riskSlider).slice(1),
                sub: "Risk Profile",
              },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border border-white/8 bg-card p-2 sm:p-3 text-center">
                <stat.icon className="mx-auto mb-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            {result.scenarios.map((scenario, i) => (
              <ScenarioCard key={i} scenario={scenario} index={i} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => runSimulation(true)}
              disabled={loading}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            >
              {loading && isVariation ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating variation...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  What If? — Regenerate with Variation
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              className="w-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
            >
              Simulate a New Decision
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:py-12 sm:px-6">

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <OracleCharacter state="thinking" size={200} />
            <p className="mt-6 text-sm text-muted-foreground animate-pulse">
              ORACLE is scanning your possible futures...
            </p>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary mb-5">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            AI Life Outcome Simulator
          </div>

          {/* ORACLE character - centrepiece of the hero */}
          <div className="flex justify-center mb-4">
            <OracleCharacter state="idle" size={160} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight shimmer-text mb-2">
            FutureSelf
          </h1>
          <p className="text-base sm:text-xl font-medium text-foreground/90">
            See where your decisions take you.
          </p>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Tell ORACLE your decision. It will simulate 3 realistic futures — best case,
            most likely, and worst case — with timelines, turning points, and outcomes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              What decision are you facing?
            </label>
            <Textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g. Should I quit my job to start a business?"
              className="min-h-[110px] resize-none border-white/20 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/30 text-sm"
            />
            <p className="mt-2 mb-1.5 text-xs text-muted-foreground font-medium">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_DECISIONS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setDecision(ex)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-foreground/70 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  {ex.length > 45 ? ex.slice(0, 45) + "…" : ex}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Your Age
              </label>
              <input
                type="number"
                min={16}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-lg border border-white/20 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Career / Field
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Financial Situation
            </label>
            <Select value={financialStatus} onValueChange={(v) => setFinancialStatus(v ?? "")}>
              <SelectTrigger className="w-full border-white/20 bg-background text-foreground focus:border-primary/60 py-2.5 h-auto">
                <SelectValue placeholder="Select your financial status..." />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-card text-foreground min-w-[var(--anchor-width)]">
                {FINANCIAL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="py-2.5">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-white/10 bg-background/50 p-4 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Risk Tolerance
                </label>
                <span className="text-sm font-bold text-primary">
                  {riskSlider <= 33 ? "Low" : riskSlider <= 66 ? "Medium" : "High"}
                </span>
              </div>
              <RangeSlider value={riskSlider} onChange={setRiskSlider} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="border-t border-white/8 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Time Horizon
                </label>
                <span className="text-sm font-bold text-primary">
                  {getTimeHorizon(timeSlider)}
                </span>
              </div>
              <RangeSlider value={timeSlider} onChange={setTimeSlider} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Short term (1 yr)</span>
                <span>Long term (10 yrs)</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={() => runSimulation(false)}
            disabled={loading || !decision.trim()}
            className="w-full h-13 bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 disabled:opacity-40 glow-cyan transition-all duration-300 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                Simulating your future...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Simulate My Future
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-4">
          Powered by AI · Not financial or life advice · For exploration only
        </p>
      </div>
    </div>
  );
}
