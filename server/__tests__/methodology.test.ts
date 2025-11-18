import { describe, it, expect } from 'vitest';
import { invokeLLM } from '../_core/llm';

describe('Methodology LLM Integration', () => {
  describe('Task Generation', () => {
    it('should generate a valid task structure', async () => {
      const systemPrompt = `You are a professional methodology assistant. Generate a concrete, actionable task based on the user's goal.
Return ONLY a valid JSON object with this exact structure:
{
  "title": "string",
  "description": "string",
  "estimate": number (1-5 days),
  "risk": "Low|Medium|High",
  "priority": "P0|P1|P2|P3"
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Implement secure password hashing with bcrypt for the implement stage' }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'task',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                estimate: { type: 'integer', minimum: 1, maximum: 5 },
                risk: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'P3'] }
              },
              required: ['title', 'description', 'estimate', 'risk', 'priority'],
              additionalProperties: false
            }
          }
        }
      });

      expect(response).toBeDefined();
      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);
      
      const content = response.choices[0]?.message?.content;
      expect(content).toBeDefined();
      
      if (typeof content === 'string') {
        const task = JSON.parse(content);
        expect(task.title).toBeDefined();
        expect(task.description).toBeDefined();
        expect(task.estimate).toBeGreaterThanOrEqual(1);
        expect(task.estimate).toBeLessThanOrEqual(5);
        expect(['Low', 'Medium', 'High']).toContain(task.risk);
        expect(['P0', 'P1', 'P2', 'P3']).toContain(task.priority);
      }
    });
  });

  describe('Rule Explanation', () => {
    it('should generate a comprehensive rule explanation', async () => {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are an expert in professional methodologies. Provide a detailed, business-focused explanation of why the given rule is important.
Focus on: business value, technical impact, and practical examples.
Keep the explanation comprehensive but concise (2-3 paragraphs).`
          },
          {
            role: 'user',
            content: `Explain this rule: "Split Rule (Task > 5 days)" - If a task exceeds 5 work-days remaining, the owner must split it into subtasks.`
          }
        ]
      });

      expect(response).toBeDefined();
      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);

      const content = response.choices[0]?.message?.content;
      expect(content).toBeDefined();
      
      if (typeof content === 'string') {
        expect(content.length).toBeGreaterThan(100);
        expect(content.toLowerCase()).toMatch(/split|task|subtask|day/);
      }
    }, 15000);
  });
});
