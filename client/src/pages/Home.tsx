import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Streamdown } from 'streamdown';
import { useState } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Interactive Methodology Explorer - Main landing page
 * Displays the 8 guiding principles, 6-stage lifecycle, and interactive features
 */
export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [currentStage, setCurrentStage] = useState<'discover' | 'plan' | 'implement' | 'verify' | 'operate' | 'improve'>('discover');
  const [taskGoal, setTaskGoal] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<{ title: string; text: string } | null>(null);

  const generateTaskMutation = trpc.methodology.generateTask.useMutation();
  const explainRuleMutation = trpc.methodology.explainRule.useMutation();

  const methodologyData: Record<string, any> = {
    discover: {
      title: '1. Discover',
      goal: 'Establish problem context, constraints, risks, and candidate solutions grounded in authoritative sources.',
      activities: [
        'Literature & ecosystem review (papers, vendor docs, standards)',
        'Stakeholder interviews and success criteria definition (SLOs & business metrics)',
        'Pattern & anti-pattern identification',
        'Tooling and library evaluation (maintenance, license, maturity)',
        'High-level threat model & privacy assessment',
        'Initial risk register and mitigation proposals'
      ],
      tasks: [
        'Task: Literature scan — compile 6–10 authoritative sources',
        'Spike: Prototype feasibility (PoC) — minimal prototype validating assumptions',
        'Task: Risk register creation — list top 8 technical/legal risks',
        'Task: Tooling evaluation matrix — compare 3 candidate tools'
      ]
    },
    plan: {
      title: '2. Plan',
      goal: 'Convert discovery outcomes into an actionable plan with architecture, milestones, and acceptance criteria.',
      activities: [
        'Architecture sketches (component diagrams + data/control flows)',
        'API contracts and integration points',
        'Config spec (centralized schema for env variables and feature flags)',
        'Test strategy: unit/integration/e2e/performance/privacy tests',
        'CI/CD pipeline design and rollback strategy',
        'Runbook & on-call responsibilities defined'
      ],
      tasks: [
        'Task: Architecture sketch creation (diagram + data flow)',
        'Feature: API contract definition — OpenAPI schema + example payloads',
        'Task: Config schema & feature flags — central config file',
        'Task: CI/CD pipeline spec — stages and rollback policy',
        'Task: Acceptance criteria & SLO definitions'
      ]
    },
    implement: {
      title: '3. Implement',
      goal: 'Deliver clean, modular, production-ready code and infrastructure that meets acceptance criteria.',
      activities: [
        'Readability first: clear names, small functions, and API docs',
        'Modular packaging with clear versioning',
        'Structured logging and error hierarchy',
        'Config-over-code and feature flags for non-breaking releases',
        'Secure defaults: least privilege, encrypted secrets, input validation'
      ],
      tasks: [
        'Feature: Core library/module implementation',
        'Task: Structured logging integration — logging wrappers + examples',
        'Task: Error type definitions & docs',
        'Task: Secrets management integration (Vault/KMS onboarding)',
        'Task: Linting + pre-commit hooks setup'
      ]
    },
    verify: {
      title: '4. Verify',
      goal: 'Provide high confidence that the implementation is correct, performant, resilient, and compliant.',
      activities: [
        'Unit Tests: Isolate logic with meaningful coverage',
        'Integration Tests: Exercise interactions between components',
        'End-to-End Tests: Validate critical user flows in a production-like environment',
        'Performance Benchmarks: Regression and baseline for throughput',
        'Security & Privacy Reviews: Vulnerability scans, secrets exposure tests'
      ],
      tasks: [
        'Task: Unit test coverage for module X (list critical edge cases)',
        'Task: Integration tests for external API contracts with mock servers',
        'Task: Performance benchmark and baseline record',
        'Task: Security scan & dependencies audit',
        'Task: Accessibility/UX spot-check (if customer-facing)'
      ]
    },
    operate: {
      title: '5. Operate',
      goal: 'Run the system reliably in production and keep stakeholders informed.',
      activities: [
        'Deployment pipelines with canary/blue-green strategies',
        'Observability: metrics (SLOs), structured logs, distributed traces',
        'Alerting tied to actionable playbooks (runbooks)',
        'Incident management & blameless postmortems',
        'Secrets rotation policy and automated credential expiry'
      ],
      tasks: [
        'Task: Canary deployment pipeline stage and runbook',
        'Task: Dashboard creation (latency, error rate, throughput, cost)',
        'Task: Backup and recovery test (restore from backup in staging)',
        'Task: Secrets rotation implementation and test'
      ]
    },
    improve: {
      title: '6. Improve',
      goal: 'Institutionalize learning and evolve the product/process.',
      activities: [
        'Postmortems with action items tracked to closure',
        'Experiment registry for A/B experiments and model runs',
        'Quarterly architecture & dependency review (technical debt log)',
        'Retrospectives on process and tooling'
      ],
      tasks: [
        'Task: Postmortem write-up template + action items',
        'Task: Quarterly dependency & architecture review',
        'Task: Experiment registry entry for experiment #X'
      ]
    }
  };

  const stageData = methodologyData[currentStage];

  const handleGenerateTask = async () => {
    if (!taskGoal.trim()) return;
    try {
      await generateTaskMutation.mutateAsync({ goal: taskGoal, stage: currentStage });
    } catch (error) {
      console.error('Failed to generate task:', error);
    }
  };

  const handleExplainRule = async (ruleTitle: string, ruleText: string) => {
    setSelectedRule({ title: ruleTitle, text: ruleText });
    setShowRuleModal(true);
    try {
      await explainRuleMutation.mutateAsync({ ruleTitle, ruleText });
    } catch (error) {
      console.error('Failed to explain rule:', error);
    }
  };

  const principles = [
    { title: '1. Research → Implement → Verify', desc: 'Keep an evidence-driven loop: discover, build, and confirm.' },
    { title: '2. Config-over-Code', desc: 'Environment, thresholds, and feature flags must be externalized.' },
    { title: '3. Design for Observability', desc: 'Instrument early: logs, metrics, traces, and health checks.' },
    { title: '4. Security & Privacy by Design', desc: 'Include threat models, secrets handling, and federated options.' },
    { title: '5. Modularity & Single Responsibility', desc: 'Small, testable components with clear interfaces.' },
    { title: '6. Fail-fast, Recover-gracefully', desc: 'Define error types and recovery strategies; prefer explicit failures.' },
    { title: '7. Empirical & Measurable', desc: 'Every claim should be testable and measurable through benchmarks.' },
    { title: '8. Continuous Improvement', desc: 'Retrospectives and experiment registries to capture learnings.' }
  ];

  const rules = [
    { title: 'Split Rule (Task > 5 days)', text: 'If a task exceeds 5 work-days remaining, the owner must split it into subtasks. This ensures work remains granular and completable.' },
    { title: 'Escalation Rule (P0 Blocked > 24h)', text: 'If a P0 (critical) task is blocked for more than 24 hours, it automatically notifies leadership to ensure the blocker is removed.' },
    { title: 'SLO Breach Rule', text: 'If an SLO alert fires twice in 7 days, an incident RCA epic is automatically created and prioritized to P0 to fix the root cause.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Interactive Methodology Explorer</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-600">{user.name}</span>
                <Button onClick={() => logout()} variant="outline" size="sm">Logout</Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()} size="sm">Login</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">A Practical & Adaptive Methodology</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">This application translates the Professional Working Methodology into an interactive experience. Explore the guiding principles, visualize the 6-stage lifecycle, and interact with the task-first playbook designed for building high-quality, production-ready systems.</p>
        </section>

        {/* Guiding Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-blue-400">The 8 Guiding Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg text-blue-900 mb-2">{principle.title}</h3>
                <p className="text-sm text-gray-600">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Lifecycle Explorer */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-400">Interactive Lifecycle Explorer</h2>
          <p className="text-lg text-gray-700 mb-6">Click any stage to see its goals, activities, and default tasks. This demonstrates how the high-level methodology is translated into actionable work.</p>
          
          {/* Stage Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['discover', 'plan', 'implement', 'verify', 'operate', 'improve'] as const).map((stage, idx) => (
              <button
                key={stage}
                onClick={() => setCurrentStage(stage)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  currentStage === stage
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx + 1}. {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </button>
            ))}
          </div>

          {/* Stage Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">{stageData.title}</h3>
            <p className="text-lg text-gray-700 font-semibold mb-6">{stageData.goal}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Activities</h4>
                <ul className="space-y-2">
                  {stageData.activities.map((activity: string, idx: number) => (
                    <li key={idx} className="text-gray-600 flex items-start">
                      <span className="mr-3 text-blue-900 font-bold">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Default Task Set</h4>
                <ul className="space-y-2">
                  {stageData.tasks.map((task: string, idx: number) => (
                    <li key={idx} className="text-gray-600 flex items-start">
                      <span className="mr-3 text-blue-900 font-bold">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Task Generation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-400">✨ Methodology Assistant: Generate Task</h2>
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
            <p className="text-gray-700 mb-4">Describe a high-level goal for the current stage, and the assistant will generate a concrete, actionable task that adheres to the methodology principles.</p>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={taskGoal}
                onChange={(e) => setTaskGoal(e.target.value)}
                placeholder="e.g., Securely store user passwords and connect to KMS"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={handleGenerateTask}
                disabled={generateTaskMutation.isPending || !taskGoal.trim()}
                className="bg-blue-900 text-white hover:bg-blue-800"
              >
                {generateTaskMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Task'
                )}
              </Button>
            </div>
            {generateTaskMutation.data && (
              <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{generateTaskMutation.data.title}</h4>
                <p className="text-gray-700 mb-3">{generateTaskMutation.data.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="font-semibold text-gray-900">Estimate:</span> {generateTaskMutation.data.estimate} days</div>
                  <div><span className="font-semibold text-gray-900">Risk:</span> {generateTaskMutation.data.risk}</div>
                  <div><span className="font-semibold text-gray-900">Priority:</span> {generateTaskMutation.data.priority}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Adaptive Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-400">Adaptive Task Rules</h2>
          <p className="text-lg text-gray-700 mb-6">The methodology isn't static. It uses automated, adaptive rules to respond to project realities and enforce quality. Click the ✨ button to get an LLM-powered explanation of why the rule is important.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rules.map((rule, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-400">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{rule.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{rule.text}</p>
                <Button
                  onClick={() => handleExplainRule(rule.title, rule.text)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={explainRuleMutation.isPending}
                >
                  {explainRuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Explaining...
                    </>
                  ) : (
                    '✨ Explain This Rule'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Rule Explanation Modal */}
        {showRuleModal && selectedRule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedRule.title}</h3>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {explainRuleMutation.isPending ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
                  </div>
                ) : explainRuleMutation.data ? (
                  <Streamdown>{explainRuleMutation.data.explanation}</Streamdown>
                ) : (
                  <p className="text-gray-600">No explanation available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
