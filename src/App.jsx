import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { puzzles, isReleased, checkAnswer } from './puzzles.js';
import PuzzleCard from './components/PuzzleCard.jsx';
import FinalLock from './components/FinalLock.jsx';
import CubePuzzle from './components/CubePuzzle.jsx';

const COMPLETION_STORAGE_KEY = 'detective-academy:completed:v1';

export default function App() {
  const [now, setNow] = useState(Date.now);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [solved, setSolved] = useState({});
  const [restarted, setRestarted] = useState(() => {
    try { return localStorage.getItem(COMPLETION_STORAGE_KEY) === 'true'; }
    catch { return false; }
  });
  const count = Object.keys(solved).length;
  const releasedCount = puzzles.filter(p => isReleased(p, now)).length;

  useEffect(() => {
    if (restarted || puzzles.every(p => p.releaseAt === null)) return;
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    const onVisible = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [restarted]);

  const submit = useCallback((id, answer) => {
    let result;
    try { result = checkAnswer(id, answer); }
    catch (error) { result = { correct: false, message: error.message }; }
    setAnswers(previous => ({ ...previous, [id]: answer }));
    setResults(previous => ({ ...previous, [id]: result }));
    if (result.correct && id === 'final') {
      try { localStorage.setItem(COMPLETION_STORAGE_KEY, 'true'); }
      catch { /* 存储被浏览器禁用时，当前页面仍正常显示完成状态。 */ }
      setRestarted(true);
    }
    else if (result.correct) setSolved(previous => ({ ...previous, [id]: true }));
    return result;
  }, []);

  useEffect(() => {
    if (restarted) return;
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: 'submit_archive_answer', title: '提交档案答案',
        description: '核验一份已公开档案的一位数字答案，或最终四位重启密码，并更新页面上的核验结果。',
        inputSchema: { type: 'object', properties: {
          id: { anyOf: [{ type: 'integer', minimum: 1, maximum: 4 }, { type: 'string', enum: ['final'] }] },
          answer: { type: 'string', pattern: '^[0-9]{1,4}$' },
        }, required: ['id', 'answer'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          if (!input || typeof input.answer !== 'string') throw new Error('缺少答案。');
          checkAnswer(input.id, input.answer); // 非法输入在更改页面之前抛出错误。
          let result;
          flushSync(() => { result = submit(input.id, input.answer); });
          return result;
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* 不支持 WebMCP 的浏览器仍可正常解谜。 */ }
    return () => lifecycle.abort();
  }, [submit, restarted]);

  const editAnswer = (id, value) => setAnswers(previous => ({ ...previous, [id]: value.replace(/[^0-9]/g, '') }));

  if (restarted) {
    return <CubePuzzle />;
  }

  return <>
    <a className="skip" href="#archives">跳到档案内容</a>
    <header className="masthead">
      <div className="brand"><div className="mark" aria-hidden="true">侦</div><div><div className="brand-name">侦探学院</div><small>DETECTIVE ACADEMY / ARCHIVES</small></div></div>
      <div className="mast-meta"><span>复活计划 · 封存档案</span><span>CASE FILE / 001—004</span></div>
    </header>
    <div className="layout">
      <aside className="sidebar">
        <div className="eyebrow">THE REOPENING PROTOCOL</div>
        <h1>四份档案。<br />一次重启。</h1>
        <p className="intro">学院关闭前，院长将重启密码拆成了四位数字。阅读档案，找出每一位密码，让学院重新开门。</p>
        <div className="index-label"><span>档案目录</span><span>{releasedCount} / 4 已公开</span></div>
        <nav className="nav" aria-label="档案目录">
          {puzzles.map(p => <a key={p.id} href={'#file-' + p.id} className={solved[p.id] ? 'solved' : ''}>
            <span className="nav-number">{String(p.id).padStart(2, '0')}</span>
            <span className="nav-title">{isReleased(p, now) ? p.title : '封存档案'}</span>
            <span className="nav-status">{solved[p.id] ? '密码碎片已确认' : isReleased(p, now) ? '可读取' : '等待公开'}</span>
          </a>)}
        </nav>
        <div className="progress"><div className="progress-line"><span>已确认的密码碎片</span><span data-testid="progress-count">{count} / 4</span></div><div className="progress-track" role="progressbar" aria-label="解谜进度" aria-valuemin={0} aria-valuemax={4} aria-valuenow={count}><div style={{ width: count * 25 + '%' }} /></div></div>
        <p className="side-note">规则及已核实的记录均可信。<br />不需要查找外部资料。</p>
        <a href="#restart" className="final-link">前往重启密码核验</a>
      </aside>
      <main className="content" id="archives">
        {puzzles.map(p => <PuzzleCard key={p.id} puzzle={p} released={isReleased(p, now)} answer={answers[p.id] || ''} result={results[p.id]} solved={!!solved[p.id]} onEdit={editAnswer} onSubmit={submit} />)}
        <FinalLock answer={answers.final || ''} result={results.final} ready={releasedCount === 4} onEdit={value => editAnswer('final', value)} onSubmit={value => submit('final', value)} />
      </main>
    </div>
    <footer className="footer"><span>侦探学院 · 复活计划</span><span>封存档案 001—004 / 所有发布时间均为北京时间</span></footer>
  </>;
}
