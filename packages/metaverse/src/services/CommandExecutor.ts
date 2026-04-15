import { aioxClient } from './AIOXClient';
import { eventBus } from '../bridge/EventBus';

export class CommandExecutor {
  private unsubscribe: (() => void) | null = null;

  start(): void {
    this.unsubscribe = eventBus.on('command:execute', async (data) => {
      try {
        const result = await aioxClient.executeCommand(data.command, data.agentContext);
        eventBus.emit('command:response', {
          output: result.output,
          agentId: result.agentId,
          success: result.success,
        });
      } catch {
        eventBus.emit('command:response', {
          output: '❌ Failed to connect to AIOX backend. Is the API server running?',
          agentId: 'system',
          success: false,
        });
      }
    });
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}

export const commandExecutor = new CommandExecutor();
