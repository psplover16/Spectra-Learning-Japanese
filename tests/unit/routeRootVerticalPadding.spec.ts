import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

function extractCssRuleBody(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escapedSelector}\\s*\\{(?<body>[\\s\\S]*?)\\}`, 'm').exec(css);

  return match?.groups?.body ?? '';
}

describe('route root vertical padding', () => {
  it('does not give the N5 grammar route root vertical padding from shared css', async () => {
    const mainCss = await readFile('src/styles/main.css', 'utf8');
    const n5GrammarViewRuleBody = extractCssRuleBody(mainCss, '.n5-grammar-view');

    expect(n5GrammarViewRuleBody).not.toMatch(/\b(?:py|pt|pb)-[^\s;]+/);
    expect(n5GrammarViewRuleBody).not.toMatch(/\bpadding-top\s*:/);
    expect(n5GrammarViewRuleBody).not.toMatch(/\bpadding-bottom\s*:/);
  });

  it('keeps N5 grammar route-level group spacing in the template root', async () => {
    const n5GrammarView = await readFile('src/modules/n5Grammar/views/N5GrammarView.vue', 'utf8');

    expect(n5GrammarView).toMatch(
      /data-testid="n5-grammar-view"\s+class="n5-grammar-view space-y-4"/
    );
  });
});
