interface CommandResult {
  success: boolean;
  output: string;
  agentId: string;
}

const AGENT_HELP: Record<string, string> = {
  'aiox-master': '👑 **Orion Prime — Commands:**\n• `*help` — Show available commands\n• `*status` — System status overview\n• `*create` — Create new resource\n• `*ids check` — Verify entity registry\n• `*ids stats` — Registry statistics\n• `*ids health` — Registry health check',
  'architect': '🏛️ **Aria — Architect Commands:**\n• `*create-full-stack-architecture` — Generate architecture document\n• `*analyze-project-structure` — Analyze current project\n• `*assess-complexity` — Evaluate system complexity\n• `*create-plan` — Create implementation plan\n• `*create-context` — Generate context document\n• `*map-codebase` — Map the codebase structure',
  'dev': '💻 **Dev — Developer Commands:**\n• `*implement` — Implement a feature/story\n• `*refactor` — Refactor existing code\n• `*debug` — Debug an issue\n• `*execute-subtask` — Run a specific subtask\n• `*track-attempt` — Track implementation attempt\n• `*rollback` — Rollback recent changes',
  'devops': '🔧 **DevOps — Commands:**\n• `*deploy` — Deploy to environment\n• `*pipeline` — Manage CI/CD pipeline\n• `*monitor` — System monitoring\n• `*create-worktree` — Create Git worktree\n• `*list-worktrees` — List active worktrees\n• `*merge-worktree` — Merge and cleanup worktree',
  'data-engineer': '🗄️ **Dara — Data Commands:**\n• `*schema` — Design/review database schema\n• `*migrate` — Create/run migrations\n• `*query` — Optimize queries\n• `*analyze-data` — Analyze data patterns',
  'qa': '✅ **QA — Quality Commands:**\n• `*test` — Run test suites\n• `*create-suite` — Create new test suite\n• `*coverage` — Check code coverage\n• `*review-build` — Review a build/story\n• `*critique-spec` — Review specifications\n• `*verify-fix` — Verify a bug fix',
  'pm': '📋 **Morgan — Product Commands:**\n• `*create-epic` — Create new epic\n• `*create-prd` — Generate PRD document\n• `*roadmap` — View/update roadmap\n• `*gather-requirements` — Gather requirements\n• `*write-spec` — Write specification',
  'po': '📦 **Pax — Product Owner Commands:**\n• `*backlog-review` — Review backlog\n• `*validate-story` — Validate story criteria\n• `*close-story` — Close completed story',
  'sm': '📊 **SM — Scrum Master Commands:**\n• `*draft` — Draft stories from PRD\n• `*sprint` — Manage current sprint\n• `*retrospective` — Run retrospective',
  'analyst': '🔍 **Analyst — Business Commands:**\n• `*research` — Research topic/technology\n• `*brainstorm` — Brainstorm solutions\n• `*analyze` — Business analysis\n• `*extract-patterns` — Extract code patterns',
  'ux-design-expert': '🎨 **Uma — UX Commands:**\n• `*design` — Create UI/UX design\n• `*prototype` — Build prototype\n• `*usability-review` — Review usability',
  'copywriter': '✍️ **Versa — Copy Commands:**\n• `*write-landing-copy` — Write landing page copy\n• `*define-brand-voice` — Define brand voice\n• `*rewrite` — Rewrite/improve text',
  'strategist': '🎯 **Stratton — Strategy Commands:**\n• `*create-growth-strategy` — Growth strategy plan\n• `*create-funnel` — Design conversion funnel\n• `*competitive-analysis` — Competitive analysis',
  'hacker': '🔓 **Cipher — Security Commands:**\n• `*threat-model` — Create threat model\n• `*security-audit` — Run security audit\n• `*harden` — Harden system security',
};

const GLOBAL_COMMANDS: Record<string, string> = {
  '*help': '👑 **2quip Metaverse — Command Center**\n\n**Global Commands:**\n• `*help` — This help menu\n• `*status` — System status\n• `*ids stats` — Registry statistics\n• `*ids health` — Registry health\n\n**Shortcuts:**\n• `Ctrl+K` — Command Palette\n• `Tab` — Agent Panel\n• `B` — Badges\n• `M` — Missions\n• `Enter` — Focus Chat\n\n**Interact:**\n• Click an agent NPC to open context menu\n• Left-click on tile to move player\n• Right-click + drag to pan camera\n• Scroll to zoom in/out\n\nType `*help` in an agent chat for agent-specific commands.',
  '*status': '📊 **System Status:**\n• Active Agent: Orion Prime\n• Agents Online: 14/14\n• Memory Protocol: Active\n• Backend: Connected\n• Last Sync: Just now\n• Patterns Learned: 47\n• Gotchas Registered: 12\n• Stories Active: 3\n• Build Status: ✅ Passing',
  '*ids stats': '📈 **Registry Statistics:**\n• Total Entities: 156\n• Agents: 15\n• Tasks: 42\n• Templates: 34\n• Workflows: 12\n• Health Score: 94%',
  '*ids health': '✅ **Registry Health:** GOOD\n• Orphaned entities: 0\n• Missing dependencies: 2 (non-critical)\n• Last validated: 2 min ago',
  '*ids check': '🔍 **Registry Check:**\n• All agents registered: ✅\n• Template integrity: ✅\n• Workflow chains valid: ✅\n• No circular dependencies: ✅\n• Health score: 94/100',
};

export class CommandBridge {
  execute(command: string, agentContext?: string): CommandResult {
    const agentId = agentContext || 'aiox-master';
    const baseCommand = command.split(' ')[0].toLowerCase();

    // Agent-specific help
    if (baseCommand === '*help' && agentContext && AGENT_HELP[agentContext]) {
      return { success: true, output: AGENT_HELP[agentContext], agentId };
    }

    // Global commands
    const globalOutput = GLOBAL_COMMANDS[baseCommand];
    if (globalOutput) {
      return { success: true, output: globalOutput, agentId };
    }

    // Agent-specific command simulation
    const agentHelp = AGENT_HELP[agentId];
    if (agentHelp && agentHelp.includes(baseCommand)) {
      return {
        success: true,
        output: `⚡ **@${agentId}** processing \`${command}\`...\n\n✅ Command executed successfully.\n\n_Results would appear here when connected to the AIOX CLI engine._\n\nTip: Use \`*help\` for available commands for this agent.`,
        agentId,
      };
    }

    return {
      success: true,
      output: `⚡ Command \`${command}\` received by **@${agentId}**.\n\n📝 Processing via AIOX engine...\n\n_[Simulated mode — connect AIOX CLI for real execution]_\n\n💡 Try: \`*help\` for available commands.`,
      agentId,
    };
  }
}
