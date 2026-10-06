import { test, expect } from '@playwright/test';
import { cubeFaces, ciphertext } from '../src/cube-puzzle.js';
import { createSolvedCube, toNet, applyMoves, inverseMoves, scramble } from '../scripts/cube-model.mjs';

async function openUnlocked(page) {
  await page.addInitScript(() => localStorage.setItem('detective-academy:completed:v1', 'true'));
  await page.goto('/');
}

test('独立使用浏览器 Web Crypto 解密，保留原文标点和大小写', async ({ page }) => {
  await openUnlocked(page);
  const decrypted = await page.evaluate(async (ciphertext) => {
    const bytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    if (new TextDecoder().decode(bytes.slice(0, 8)) !== 'Salted__') throw new Error('Invalid envelope');
    const password = await crypto.subtle.importKey('raw', new TextEncoder().encode('Aletheia'), 'PBKDF2', false, ['deriveBits']);
    const derived = new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', salt: bytes.slice(8, 16), iterations: 10000, hash: 'SHA-256'}, password, 384));
    const key = await crypto.subtle.importKey('raw', derived.slice(0, 32), 'AES-CBC', false, ['decrypt']);
    return new TextDecoder().decode(await crypto.subtle.decrypt({name: 'AES-CBC', iv: derived.slice(32)}, key, bytes.slice(16)));
  }, ciphertext);
  expect(decrypted).toBe("You can't see the whole truth.But the key is the truth.");
});

test('展开图可通过真实魔方转动还原为白色 Aletheia 与黄色 Logos', () => {
  const cube = createSolvedCube(() => 'X');
  for (const {face, stickers} of cubeFaces) {
    stickers.forEach((sticker, index) => Object.assign(cube.find(item => item.id === `${face}${index}`), sticker));
  }
  const restored = toNet(applyMoves(cube, inverseMoves(scramble)));
  expect(restored.find(face => face.face === 'U').stickers.map(s => s.letter).join('')).toBe('Aletheia ');
  expect(restored.find(face => face.face === 'D').stickers.map(s => s.letter).join('')).toBe('Logos    ');
  for (const face of restored) expect(new Set(face.stickers.map(s => s.color)).size).toBe(1);
  for (const face of restored.filter(face => !['U','D'].includes(face.face))) {
    expect(face.stickers.every(sticker => /^[A-Z]$/.test(sticker.letter))).toBe(true);
  }
});

test('学院箴言在手机和电脑中完整显示，复制密文与刷新状态正常', async ({ page, context }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openUnlocked(page);
  await expect(page.locator('.cube-face')).toHaveCount(6);
  await expect(page.locator('.cube-sticker')).toHaveCount(54);
  await expect(page.locator('.cube-clue p')).toHaveText('cube · white');
  await expect(page.locator('.ciphertext code')).toHaveText(ciphertext);
  await expect(page.locator('body')).not.toContainText('Aletheia');
  await expect(page.locator('body')).not.toContainText("You can't see the whole truth");
  await page.getByRole('button', {name: '复制密文'}).click();
  await expect(page.getByRole('status')).toHaveText('密文已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ciphertext);
  await page.reload();
  await expect(page.getByRole('heading', {name: '真相的另一面'})).toBeVisible();
  await page.setViewportSize({width: 1440, height: 1000});
  await page.screenshot({path: 'test-results/cube-desktop.png', fullPage: true});
  for (const width of [375, 320]) {
    await page.setViewportSize({width, height: 812});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.cube-net')).toBeVisible();
  }
  await page.setViewportSize({width: 375, height: 812});
  await page.screenshot({path: 'test-results/cube-mobile.png', fullPage: true});
  await page.setViewportSize({width: 1440, height: 1000});
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
