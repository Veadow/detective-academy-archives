import { useRef, useState } from 'react';
import { ciphertext, cubeFaces } from '../cube-puzzle.js';

const colorNames = { white: '白色', yellow: '黄色', green: '绿色', blue: '蓝色', orange: '橙色', red: '红色' };
const faceNames = { U: '上面', L: '左面', F: '正面', R: '右面', B: '背面', D: '下面' };

export default function CubePuzzle() {
  const [copyStatus, setCopyStatus] = useState('');
  const cipherRef = useRef(null);
  async function copyCipher() {
    try {
      await navigator.clipboard.writeText(ciphertext);
      setCopyStatus('密文已复制');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cipherRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
      setCopyStatus('密文已选中，请手动复制');
    }
  }
  return <div className="cube-page">
    <header className="masthead">
      <div className="brand"><div className="mark" aria-hidden="true">侦</div><div><div className="brand-name">侦探学院</div><small>DETECTIVE ACADEMY / MAXIM</small></div></div>
      <div className="mast-meta"><span>复活的侦探学院</span><span>THE ACADEMY'S MAXIM</span></div>
    </header>
    <main className="cube-layout">
      <section className="cipher-panel" aria-labelledby="cube-title">
        <div className="eyebrow">THE ACADEMY'S MAXIM</div>
        <h1 id="cube-title">真相的另一面</h1>
        <p className="cube-intro">复活的侦探学院留下了一则箴言。<br />一段密文，一件线索。</p>
        <div className="cipher-label"><span>01 / 密文</span><span>AES · BASE64</span></div>
        <pre className="ciphertext" tabIndex={0} aria-label="Base64 格式的 AES 密文"><code ref={cipherRef}>{ciphertext}</code></pre>
        <div className="cipher-actions"><button type="button" className="copy-button" onClick={copyCipher}>复制密文 <span aria-hidden="true">↗</span></button><span className="copy-status" role="status">{copyStatus}</span></div>
        <details className="cipher-details">
          <summary>加密参数</summary>
          <dl><dt>算法</dt><dd>AES-256-CBC / PKCS#7</dd><dt>口令编码</dt><dd>UTF-8，区分大小写</dd><dt>密钥派生</dt><dd>PBKDF2-HMAC-SHA256，10,000 次，输出 48 字节：前 32 字节为密钥，后 16 字节为 IV。</dd><dt>盐值</dt><dd>8 字节随机盐，已包含在密文中，无需另行寻找。</dd><dt>数据格式</dt><dd>Base64 解码后依次为：8 字节 <code>Salted__</code>、8 字节盐值、密文。</dd></dl>
        </details>
        <div className="cube-clue"><span>HINT / 提示</span><p>cube · white</p></div>
      </section>
      <section className="cube-document" aria-labelledby="cube-evidence-title">
        <div className="doc-top"><span>02 / 线索</span><span className="stamp">学院箴言</span></div>
        <h2 id="cube-evidence-title">一件被打乱的物品</h2>
        <figure className="cube-figure">
          <div className="cube-net" aria-label="三阶魔方展开图，上面在正面上方，下面在正面下方，中间从左到右为左面、正面、右面、背面">
            {cubeFaces.map(({ face, stickers }) => <div className={`cube-face face-${face}`} key={face} role="group" aria-label={`${faceNames[face]} ${face}`}>
              {stickers.map(({ color, letter }, index) => <span className={`cube-sticker sticker-${color}`} key={index} aria-label={`${Math.floor(index / 3) + 1}行${index % 3 + 1}列，${colorNames[color]}，${letter === ' ' ? '空格' : letter}`}>{letter === ' ' ? '\u00a0' : letter}</span>)}
            </div>)}
          </div>
          <figcaption><span>U</span> 在 F 上方，<span>D</span> 在 F 下方。<br />中间一排从左到右为 <span>L · F · R · B</span>。</figcaption>
        </figure>
      </section>
    </main>
    <footer className="footer"><span>复活的侦探学院 · 箴言</span><span>CUBE</span></footer>
  </div>;
}
