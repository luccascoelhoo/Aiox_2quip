interface CommandResult {
  success: boolean;
  output: string;
  agentId: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  '*help': '👑 **Available Commands:**\n• `*status` — Show system status\n• `*ids stats` — Registry statistics\n• `*ids health` — Registry health check\n• `*task {name}` — Execute task\n• `@{agent}` — Switch to agent context\n\nType any command to execute it via AIOX engine.',
  '*status': '📊 **System Status:**\n• Active Agent: Orion Prime\n• Agents Online: 14/14\n• Memory Protocol: Active\n• Last Sync: Just now\n• Patterns Learned: 47\n• Gotchas Registered: 12',
  '*ids stats': '📈 **Registry Statistics:**\n• Total Entities: 156\n• Agents: 15\n• Tasks: 42\n• Templates: 34\n• Workflows: 12\n• Health Score: 94%',
  '*ids health': '✅ **Registry Health:** GOOD\n• Orphaned entities: 0\n• Missing dependencies: 2 (non-critical)\n• Last validated: 2 min ago',
};

export class CommandBridge {
  execute(command: string, agentContext?: string): CommandResult {
    const agentId = agentContext || 'aiox-master';
    const baseCommand = command.split(' ')[0].toLowerCase();

    const mockOutput = MOCK_RESPONSES[baseCommand];
    if (mockOutput) {
      return { success: true, output: mockOutput, agentId };
    }

    return {
      success: true,
      output: `⚡ Command \`${command}\` received by @${agentId}. Processing via AIOX engine...\n\n_[Mock mode — connect AIOX CLI for real execution]_`,
      agentId,
    };
  }
}
