export default function FinalLock({ answer, result, ready, onEdit, onSubmit }) {
  return <section className="final-panel" id="restart" aria-labelledby="final-title">
    <div className="final-header"><span className="eyebrow">FINAL AUTHORIZATION / 重启许可</span><span className="stamp">等待密码</span></div>
    <h2 id="final-title">让学院重新开门</h2>
    <p>按档案 01 至 04 的顺序，输入你找到的四位数字。</p>
    <form onSubmit={event => { event.preventDefault(); onSubmit(answer); }}>
      <label htmlFor="final-answer">四位重启密码</label>
      <div className="answer-controls"><input className="digit" id="final-answer" name="answer" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="off" placeholder="····" required value={answer} onChange={event => onEdit(event.target.value)} aria-describedby="final-feedback" /><button className="verify-button" type="submit" disabled={!ready}>提交重启密码</button></div>
      <p className={'feedback' + (result?.correct ? ' correct' : '')} id="final-feedback" role="status" aria-live="polite">{!ready ? '请等待四份档案全部公开。' : result?.message || '\u00a0'}</p>
    </form>
  </section>;
}
