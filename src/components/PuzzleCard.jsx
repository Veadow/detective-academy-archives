function releaseTime(value) {
  if (!Number.isFinite(Date.parse(value))) return '时间待确认';
  return new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

export default function PuzzleCard({ puzzle, released, answer, result, solved, onEdit, onSubmit }) {
  const { id } = puzzle;
  return <article className={'document' + (released ? '' : ' locked')} id={'file-' + id} aria-labelledby={'title-' + id}>
    <div className="doc-top"><span>封存档案 / {String(id).padStart(2, '0')}</span><span className="stamp">{solved ? '推理通过' : released ? '已公开' : '尚未公开'}</span></div>
    <h2 id={'title-' + id}>{released ? puzzle.title : '档案 ' + String(id).padStart(2, '0')}</h2>
    {released ? <>
      <p className="subtitle">{puzzle.subtitle}</p>
      {/* 题面来自本项目固定配置，不接受用户输入的 HTML。 */}
      <div className="puzzle-body" dangerouslySetInnerHTML={{ __html: puzzle.body }} />
      <div className="answer-area">
        <form onSubmit={event => { event.preventDefault(); onSubmit(id, answer); }}>
          <label htmlFor={'answer-' + id}>第 {id} 位密码 · 一位数字</label>
          <div className="answer-controls"><input id={'answer-' + id} name="answer" className="digit" type="text" inputMode="numeric" pattern="[0-9]" maxLength={1} autoComplete="off" placeholder="?" required value={answer} onChange={event => onEdit(id, event.target.value)} aria-describedby={'feedback-' + id} /><button className="verify-button" type="submit">验证推理</button></div>
          <p className={'feedback' + (result?.correct ? ' correct' : '')} id={'feedback-' + id} role="status" aria-live="polite">{result?.message || '\u00a0'}</p>
        </form>
        {solved && <div className="explanation"><strong>{puzzle.principle}</strong><p>{puzzle.explanation}</p></div>}
      </div>
    </> : <><p>将于北京时间 {releaseTime(puzzle.releaseAt)} 公开。</p><p>此前公开的档案仍可继续阅读。</p></>}
  </article>;
}
