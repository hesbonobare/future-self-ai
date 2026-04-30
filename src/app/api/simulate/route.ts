import { NextRequest, NextResponse } from "next/server";
import { SimulationRequest } from "@/types/simulation";

const SYSTEM_PROMPT = `You are an advanced life-outcome simulation engine.

Your role is to simulate realistic future scenarios based on a user's decision. You do NOT give advice. You generate possible outcomes as structured simulations.

You must:
- Be grounded in realistic cause-effect relationships
- Avoid fantasy or extreme unrealistic outcomes
- Consider psychological, financial, and social factors
- Show trade-offs, risks, and uncertainty
- Generate multiple plausible futures, not just optimistic ones

You think like:
- A strategist
- A behavioral analyst
- A long-term planner

OUTPUT RULES:
- ALWAYS return valid JSON
- NO markdown, NO explanations outside JSON
- Follow the exact schema provided
- Be consistent and deterministic in structure

TONE:
- Neutral, analytical, slightly narrative
- Not motivational, not robotic

Your output should feel like a simulation report, not a conversation.`;

function buildUserPrompt(data: SimulationRequest): string {
  const variationNote = data.isVariation
    ? "\nIntroduce variation in assumptions and external factors while keeping the same decision context."
    : "";

  return `Simulate the future outcomes of the following decision:

Decision: "${data.decision}"

User context:
- Age: ${data.age}
- Career/Field: ${data.career}
- Financial status: ${data.financial_status}
- Risk tolerance: ${data.risk_level} (low / medium / high)
- Time horizon: ${data.time_horizon}
${variationNote}
Generate 3 scenarios:
1. Best case
2. Most likely case
3. Worst case

Each scenario must include:
- A clear title
- A probability (realistic, not equal for all)
- A timeline of key events
- Turning points that significantly affect outcome
- Final outcome summary
- Risks encountered
- Emotional trajectory (how the person feels over time)
- Financial trajectory (improves, unstable, declines, etc.)

Ensure:
- Each scenario is meaningfully different
- Timelines are realistic and progressive
- Turning points are specific, not generic

Return ONLY JSON using this exact schema:
{
  "decision": "string",
  "scenarios": [
    {
      "type": "best_case | most_likely | worst_case",
      "title": "string",
      "probability": 0,
      "summary": "string",
      "timeline": [
        {
          "time": "string (e.g. Month 3, Year 2)",
          "event": "string",
          "impact": "string"
        }
      ],
      "turning_points": [
        {
          "event": "string",
          "effect": "string"
        }
      ],
      "risks": [
        "string"
      ],
      "emotional_trajectory": [
        {
          "phase": "string",
          "feeling": "string"
        }
      ],
      "financial_trajectory": "string"
    }
  ]
}

VALIDATION RULES:
- Probability values must sum to approximately 100
- Timelines must have at least 4 events
- Turning points must be concrete, not vague
- Avoid generic phrases like "things improve" or "challenges arise"
- Use specific, believable events

If output does not follow schema, regenerate internally before responding.`;
}

export async function POST(req: NextRequest) {
  try {
    const body: SimulationRequest = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "FutureSelf",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(body) },
        ],
        temperature: body.isVariation ? 0.9 : 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `OpenRouter error: ${err}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from AI" },
        { status: 500 }
      );
    }

    const simulation = JSON.parse(content);
    return NextResponse.json(simulation);
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Failed to generate simulation" },
      { status: 500 }
    );
  }
}
