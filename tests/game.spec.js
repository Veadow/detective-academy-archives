import { test, expect } from '@playwright/test';
import { puzzles, checkAnswer, isReleased } from '../src/puzzles.js';

test('完整解题流程：错误提示、重复核验、四题解析和最终密码', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.locator('#answer-1').fill('2');
  await page.locator('#file-1 button').click();
  await expect(page.locator('#feedback-1')).toContainText('还不成立');
  await expect(page.getByTestId('progress-count')).toHaveText('0 / 4');
  for (const p of puzzles) {
    await page.locator('#answer-' + p.id).fill(p.answer);
    await page.locator('#file-' + p.id + ' button').click();
    await expect(page.locator('#file-' + p.id + ' .explanation')).toContainText(p.principle);
  }
  await page.locator('#file-1 button').click();
  await expect(page.getByTestId('progress-count')).toHaveText('4 / 4');
  await page.locator('#final-answer').fill('1111');
  await page.getByRole('button', { name: '提交重启密码' }).click();
  await expect(page.locator('#final-feedback')).toContainText('未通过');
  await expect(page.locator('.preparation-screen')).toHaveCount(0);
  await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '4');
  await page.locator('#final-answer').fill('7536');
  await page.getByRole('button', { name: '提交重启密码' }).click();
  await expect(page.getByRole('heading', { name: '学院正在筹备，请耐心等待' })).toBeVisible();
  await expect(page.locator('article, form, nav')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: '学院正在筹备，请耐心等待' })).toBeVisible();
  await expect(page.locator('article, form, nav')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学院正在筹备，请耐心等待' })).toBeVisible();
  await expect(page.locator('article, form, nav')).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: false });
});

test('手机与放大文字不溢出，目录可以跳到指定档案', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('nav a[href="#file-3"]').click();
  await expect(page).toHaveURL(/#file-3$/);
  await page.locator('#answer-3').fill('3');
  await page.locator('#file-3 button').click();
  await expect(page.locator('#feedback-3')).toContainText('推理通过');
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: false });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('定时公开边界与格式检查', () => {
  const p = puzzles[0], old = p.releaseAt;
  try {
    p.releaseAt = '2026-10-10T18:00:00+08:00';
    const release = Date.parse(p.releaseAt);
    expect(isReleased(p, release - 1)).toBe(false);
    expect(isReleased(p, release)).toBe(true);
    expect(() => checkAnswer(1, '7', release - 1)).toThrow('尚未公开');
    expect(() => checkAnswer('final', '7536', release - 1)).toThrow('全部公开');
    expect(checkAnswer(1, '7', release).correct).toBe(true);
    expect(() => checkAnswer(1, '77', release)).toThrow('一位数字');
    expect(() => checkAnswer('final', '753', release)).toThrow('四位数字');
    p.releaseAt = 'invalid-date';
    expect(isReleased(p, release)).toBe(false);
  } finally { p.releaseAt = old; }
});

test('代理核验入口复用页面状态，非法输入不改变进度', async ({ page }) => {
  await page.addInitScript(() => {
    const tools = new Map();
    Object.defineProperty(document, 'modelContext', { value: {
      registerTool(tool, options) { tools.set(tool.name, tool); options.signal.addEventListener('abort', () => tools.delete(tool.name)); },
    }});
    window.testTools = tools;
  });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => window.testTools.has('submit_archive_answer'))).toBe(true);
  const tool = await page.evaluate(async () => {
    const tool = window.testTools.get('submit_archive_answer');
    const result = await tool.execute({id: 1, answer: '7'});
    let invalid; try { await tool.execute({id: 5, answer: '7'}); } catch (error) { invalid = error.message; }
    return { name: tool.name, schema: tool.inputSchema, annotations: tool.annotations, result, invalid };
  });
  expect(tool.result.correct).toBe(true);
  expect(tool.schema.required).toEqual(['id', 'answer']);
  expect(tool.annotations.readOnlyHint).toBe(false);
  expect(tool.invalid).toContain('不存在');
  await expect(page.getByTestId('progress-count')).toHaveText('1 / 4');
  await expect(page.locator('#answer-1')).toHaveValue('7');
  await expect(page.locator('#file-1 .explanation')).toBeVisible();
});
