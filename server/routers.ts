import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  methodology: router({
    generateTask: publicProcedure
      .input(z.object({
        goal: z.string().min(1),
        stage: z.enum(['discover', 'plan', 'implement', 'verify', 'operate', 'improve'])
      }))
      .mutation(async ({ input }) => {
        const stageGoals: Record<string, string> = {
          discover: 'Establish problem context, constraints, risks, and candidate solutions grounded in authoritative sources.',
          plan: 'Convert discovery outcomes into an actionable plan with architecture, milestones, and acceptance criteria.',
          implement: 'Deliver clean, modular, production-ready code and infrastructure that meets acceptance criteria.',
          verify: 'Provide high confidence that the implementation is correct, performant, resilient, and compliant.',
          operate: 'Run the system reliably in production and keep stakeholders informed.',
          improve: 'Institutionalize learning and evolve the product/process.'
        };

        const systemPrompt = `You are a specialized methodology assistant. Your task is to generate a single, concrete, and actionable development task based on the user's high-level goal, ensuring it strictly adheres to the methodology principles.

1. The generated task must fit the goal of the current stage.
2. The task's estimate MUST be a number between 1 and 5, strictly respecting the 'Split Rule' (Task > 5 days must be split).
3. The output MUST be a valid JSON object matching the provided schema.

Current Methodology Stage: ${input.stage}
Stage Goal: ${stageGoals[input.stage]}

Output Risk should be one of: Low, Medium, High.
Output Priority should be one of: P2 (Low), P1 (High), P0 (Critical).`;

        const userQuery = `The current stage is "${input.stage}". I need a concrete, actionable task for the following high-level objective: "${input.goal}". Generate the task details.`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'task_generation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'A concise, actionable task title.' },
                  description: { type: 'string', description: 'A detailed description of what needs to be done.' },
                  estimate: { type: 'integer', description: 'Estimated work days (1-5).' },
                  risk: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                  priority: { type: 'string', enum: ['P2 (Low)', 'P1 (High)', 'P0 (Critical)'] }
                },
                required: ['title', 'description', 'estimate', 'risk', 'priority'],
                additionalProperties: false
              }
            }
          }
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') throw new Error('No response from LLM');
        
        const parsed = JSON.parse(content);
        return parsed;
      }),

    explainRule: publicProcedure
      .input(z.object({
        ruleTitle: z.string().min(1),
        ruleText: z.string().min(1)
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are a methodology expert. Your task is to provide a clear, concise explanation of why an adaptive rule is important in a professional working methodology. Explain the business value, technical implications, and how it helps teams maintain quality and velocity.`;

        const userQuery = `Explain the following methodology rule and why it's important:\n\nRule: ${input.ruleTitle}\nDescription: ${input.ruleText}\n\nProvide a 2-3 paragraph explanation with practical examples.`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery }
          ]
        });

        const content = response.choices[0]?.message?.content;
        const explanation = typeof content === 'string' ? content : '';
        return { explanation };
      })
  })
});

export type AppRouter = typeof appRouter;
