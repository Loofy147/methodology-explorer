# Interactive Methodology Explorer

A full-stack web application that translates a Professional Working Methodology into an interactive, AI-powered experience. Explore guiding principles, visualize the 6-stage lifecycle, and interact with an intelligent task-first playbook designed for building high-quality, production-ready systems.

## Features

### 🎯 Core Features

- **8 Guiding Principles**: Interactive display of core methodology principles including Research → Implement → Verify, Config-over-Code, Design for Observability, Security & Privacy by Design, Modularity & Single Responsibility, Fail-fast Recovery, Empirical & Measurable, and Continuous Improvement.

- **6-Stage Lifecycle Explorer**: Interactive navigation through the complete methodology lifecycle:
  - **Discover**: Establish problem context, constraints, risks, and candidate solutions
  - **Plan**: Define approach, resource allocation, and success criteria
  - **Implement**: Execute the planned work with quality gates
  - **Verify**: Validate outcomes against criteria and identify improvements
  - **Operate**: Deploy, monitor, and maintain in production
  - **Improve**: Capture learnings and iterate

- **LLM-Powered Task Generation**: Generate concrete, actionable tasks based on high-level goals using AI. Tasks are automatically validated against the 5-day split rule and include:
  - Title and detailed description
  - Time estimate (1-5 days)
  - Risk assessment (Low/Medium/High)
  - Priority level (P0/P1/P2/P3)

- **Adaptive Rule Explanations**: Get AI-powered explanations for methodology rules including:
  - Split Rule (Task > 5 days)
  - Escalation Rule (P0 Blocked > 24h)
  - SLO Breach Rule

- **Database Persistence**: Store generated tasks and rule explanations for historical tracking and analysis.

## Tech Stack

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express 4 + tRPC 11 + TypeScript
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Manus OAuth
- **LLM Integration**: Google Gemini API
- **Testing**: Vitest

## Project Structure

```
methodology_explorer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and hooks
│   │   ├── App.tsx        # Main app router
│   │   └── main.tsx       # Entry point
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── _core/            # Core infrastructure
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database helpers
│   └── __tests__/        # Test files
├── drizzle/              # Database schema and migrations
├── shared/               # Shared types and constants
└── storage/              # S3 storage helpers
```

## Getting Started

### Prerequisites

- Node.js 22.13.0+
- pnpm
- MySQL database
- Environment variables configured

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Required environment variables (automatically injected by Manus platform):

- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Session cookie signing secret
- `VITE_APP_ID`: Manus OAuth application ID
- `OAUTH_SERVER_URL`: Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL`: Manus login portal URL
- `BUILT_IN_FORGE_API_URL`: Manus built-in APIs URL
- `BUILT_IN_FORGE_API_KEY`: Manus built-in APIs key (server-side)
- `VITE_FRONTEND_FORGE_API_KEY`: Manus built-in APIs key (frontend)
- `VITE_FRONTEND_FORGE_API_URL`: Manus built-in APIs URL (frontend)

## Database Schema

### Generated Tasks Table
Stores tasks created by the LLM assistant:
- `id`: Primary key
- `userId`: Reference to user
- `stage`: Lifecycle stage (discover, plan, implement, verify, operate, improve)
- `title`: Task title
- `description`: Detailed task description
- `estimate`: Days required (1-5)
- `risk`: Risk level (Low, Medium, High)
- `priority`: Priority level (P0, P1, P2, P3)
- `userGoal`: Original user goal
- `createdAt`, `updatedAt`: Timestamps

### Rule Explanations Table
Caches LLM-generated rule explanations:
- `id`: Primary key
- `ruleTitle`: Rule name
- `ruleDescription`: Rule description
- `explanation`: AI-generated explanation
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

### tRPC Procedures

#### `methodology.generateTask`
Generates a concrete task based on a high-level goal.

**Input:**
```typescript
{
  goal: string;
  stage: 'discover' | 'plan' | 'implement' | 'verify' | 'operate' | 'improve';
}
```

**Output:**
```typescript
{
  title: string;
  description: string;
  estimate: number; // 1-5
  risk: 'Low' | 'Medium' | 'High';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
}
```

#### `methodology.explainRule`
Provides an explanation for a methodology rule.

**Input:**
```typescript
{
  ruleTitle: string;
  ruleDescription: string;
}
```

**Output:**
```typescript
{
  explanation: string;
}
```

## Testing

Run the test suite:

```bash
pnpm test
```

Tests include:
- LLM task generation validation
- LLM rule explanation generation
- JSON schema validation for structured outputs

## Development Workflow

1. **Frontend Development**: Edit components in `client/src/pages/` and `client/src/components/`
2. **Backend Development**: Add procedures in `server/routers.ts` and helpers in `server/db.ts`
3. **Database Changes**: Update schema in `drizzle/schema.ts`, then run `pnpm db:push`
4. **Testing**: Write tests in `server/__tests__/` and run `pnpm test`

## Deployment

The application is deployed on the Manus platform. To deploy:

1. Create a checkpoint: `webdev_save_checkpoint`
2. Click the Publish button in the Management UI
3. The application will be deployed and accessible via the provided URL

## Key Methodology Concepts

### The 8 Guiding Principles

1. **Research → Implement → Verify**: Keep an evidence-driven loop: discover, build, and confirm.
2. **Config-over-Code**: Environment, thresholds, and feature flags must be externalized.
3. **Design for Observability**: Instrument early: logs, metrics, traces, and health checks.
4. **Security & Privacy by Design**: Include threat models, secrets handling, and federated options.
5. **Modularity & Single Responsibility**: Small, testable components with clear interfaces.
6. **Fail-fast, Recover-gracefully**: Define error types and recovery strategies; prefer explicit failures.
7. **Empirical & Measurable**: Every claim should be testable and measurable through benchmarks.
8. **Continuous Improvement**: Retrospectives and experiment registries to capture learnings.

### Adaptive Rules

The methodology uses automated, adaptive rules to respond to project realities:

- **Split Rule**: Tasks exceeding 5 work-days must be split into subtasks to ensure granular, completable units.
- **Escalation Rule**: P0 (critical) tasks blocked for more than 24 hours automatically notify leadership.
- **SLO Breach Rule**: SLO alerts firing twice in 7 days trigger automatic incident RCA epic creation.

## Contributing

This is a demonstration project showcasing an interactive methodology explorer. For contributions or modifications, please follow the development workflow outlined above.

## License

This project is part of the Manus platform and follows the platform's licensing terms.

## Support

For issues, questions, or feedback, please visit https://help.manus.im

## Acknowledgments

This application implements the Professional Working Methodology, a comprehensive framework for building high-quality, production-ready systems through evidence-driven practices, adaptive rules, and continuous improvement.
