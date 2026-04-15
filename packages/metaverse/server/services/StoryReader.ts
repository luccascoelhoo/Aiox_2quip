import fs from 'fs/promises';
import path from 'path';

export interface StoryCriteria {
  text: string;
  done: boolean;
}

export interface StoryOverview {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  criteriaCount: number;
  doneCount: number;
}

export interface StoryDetail extends StoryOverview {
  content: string;
  criteria: StoryCriteria[];
}

export class StoryReader {
  private readonly STORIES_DIR: string;

  constructor(aioxRoot: string) {
    this.STORIES_DIR = path.join(aioxRoot, 'docs', 'stories');
  }

  async listStories(): Promise<StoryOverview[]> {
    try {
      const files = await fs.readdir(this.STORIES_DIR);
      const stories: StoryOverview[] = [];

      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const id = file.replace('.md', '');
        const detail = await this.readStory(id);
        if (detail) {
          stories.push({
            id: detail.id,
            title: detail.title,
            status: detail.status,
            criteriaCount: detail.criteriaCount,
            doneCount: detail.doneCount,
          });
        }
      }
      return stories;
    } catch {
      return [];
    }
  }

  async readStory(id: string): Promise<StoryDetail | null> {
    try {
      const filePath = path.join(this.STORIES_DIR, `${id}.md`);
      const content = await fs.readFile(filePath, 'utf-8');

      // Title extraction
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/—.*$/, '').trim() : id;

      // Status extraction
      let status: 'PENDING' | 'IN_PROGRESS' | 'DONE' = 'PENDING';
      if (content.includes('Status:** IN_PROGRESS')) status = 'IN_PROGRESS';
      if (content.includes('Status:** DONE') || title.includes('✅ DONE')) status = 'DONE';

      // Criteria extraction
      const criteria: StoryCriteria[] = [];
      const checkboxRegex = /-\s+\[([ xX\/])\]\s+(.+)$/gm;
      let match;
      while ((match = checkboxRegex.exec(content)) !== null) {
        const char = match[1].toLowerCase();
        criteria.push({
          done: char === 'x' || char === '/',
          text: match[2].trim(),
        });
      }

      return {
        id,
        title,
        status,
        criteria,
        criteriaCount: criteria.length,
        doneCount: criteria.filter(c => c.done).length,
        content,
      };
    } catch {
      return null;
    }
  }
}
