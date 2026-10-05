// 所有题目、答案和发布时间均在前端。
// releaseAt: null 表示立即公开。定时公开时填写带时区的完整日期，例如：
// releaseAt: '2026-10-10T18:00:00+08:00'
export const puzzles = [
  {
    id: 1, releaseAt: null, title: '换了封皮的乌鸦', subtitle: '一件东西，两个名字。', answer: '7', principle: '同一律',
    explanation: '“乌鸦”始终指那本唯一原件。换封皮、改名称没有改变它的身份，所以登记为“白塔”的原件位于 7 号柜。外观相似不能证明身份相同。',
    body: '<p>档案室留下了两条命名约定：</p><ul><li>“乌鸦”专指学院第一本值班记录的唯一原件。</li><li>“黑鸟”专指这本记录的复印件。</li></ul><div class="evidence"><span>维修记录 · 已核实</span><p>“乌鸦”的黑色封皮已经损坏。维修员将它换成白色封皮，内容与内页均未更换。维修后，这本原件以新名称“白塔”登记入库。</p></div><p>如今，库房里有三件东西：</p><div class="table-wrap"><table><thead><tr><th>柜号</th><th>登记名称</th><th>外观与说明</th></tr></thead><tbody><tr><td>3</td><td>黑鸟</td><td>黑色封皮的复印件</td></tr><tr><td>7</td><td>白塔</td><td>白色封皮的记录本</td></tr><tr><td>9</td><td>展示模型</td><td>根据“乌鸦”旧外观制作的黑色模型</td></tr></tbody></table></div><p class="question">找到“乌鸦”。它所在的柜号，就是第一位密码。</p>',
  },
  {
    id: 2, releaseAt: null, title: '唯一一句假话', subtitle: '四份证词，一处破绽。', answer: '5', principle: '矛盾律',
    explanation: '林和沈的陈述互相否定，必有一句是假话，已经用掉唯一的假话名额。因此周和记录员都说真话：沈没有取走，林也没有取走。取走者只能是周，编号为 5。',
    body: '<p>一份密卷被取走了。可靠的调查结果确认：</p><ul><li>林、沈、周三人中，恰好一人取走密卷。</li><li>下列四条陈述中，恰好一条是假话。</li><li>所有陈述都针对同一次取走密卷的事件。</li></ul><div class="testimonies"><blockquote><span>证词 01 · 林</span><p>“沈取走了密卷。”</p></blockquote><blockquote><span>证词 02 · 沈</span><p>“我没有取走密卷。”</p></blockquote><blockquote><span>证词 03 · 周</span><p>“林没有取走密卷。”</p></blockquote><blockquote><span>证词 04 · 记录员</span><p>“沈刚才那句话是真的。”</p></blockquote></div><div class="table-wrap"><table><thead><tr><th>人物</th><th>身份编号</th></tr></thead><tbody><tr><td>林</td><td>2</td></tr><tr><td>沈</td><td>8</td></tr><tr><td>周</td><td>5</td></tr></tbody></table></div><p class="question">谁取走了密卷？此人的编号就是第二位密码。</p>',
  },
  {
    id: 3, releaseAt: null, title: '无法查看的门', subtitle: '看不见的状态，确定的去向。', answer: '3', principle: '排中律',
    explanation: '若门已锁，钥匙在红盒或蓝盒；红盒会推出门未锁，所以只能是蓝盒。若门未锁，钥匙在蓝盒或黑盒；黑盒会推出门已锁，所以也只能是蓝盒。两种情况穷尽可能，答案都是编号 3 的蓝盒。这里也配合使用了矛盾律。',
    body: '<p>监控已经损坏，你无法查看午夜十二点整档案室门的状态。</p><p>门锁正常。门在那个时刻要么已锁，要么未锁。“未锁”就是“已锁”的否定。</p><p>可靠记录确认：钥匙恰好在以下一个盒子里。</p><div class="table-wrap"><table><thead><tr><th>盒子</th><th>编号</th></tr></thead><tbody><tr><td>红盒</td><td>1</td></tr><tr><td>蓝盒</td><td>3</td></tr><tr><td>黑盒</td><td>9</td></tr></tbody></table></div><div class="evidence"><span>四条规则 · 同一时刻</span><ol><li>如果门已锁，钥匙就在红盒或蓝盒。</li><li>如果门未锁，钥匙就在蓝盒或黑盒。</li><li>如果钥匙在红盒，门就未锁。</li><li>如果钥匙在黑盒，门就已锁。</li></ol></div><p class="question">你不必知道门究竟有没有锁，也能找到钥匙。盒子的编号，就是第三位密码。</p>',
  },
  {
    id: 4, releaseAt: null, title: '理由不足，禁止重启', subtitle: '结论之外，还需要证据。', answer: '6', principle: '充足理由律',
    explanation: '记录甲把候选缩小为 2、4、6、8；记录乙进一步缩小为 6、8；记录丙排除 8，只剩 6。因此 C 的结论正确且理由充分。A、B 只使用部分条件，结论还违反了其他已知记录。',
    body: '<p>最后一位密码是一个从 1 到 9 的整数。系统留下三条经过验证的记录：</p><div class="evidence"><span>系统记录 · 已验证</span><ul><li>记录甲：密码是偶数。</li><li>记录乙：密码大于 4。</li><li>记录丙：密码不是 4 的倍数。</li></ul></div><p>三名调查员分别提交报告：</p><div class="testimonies"><blockquote><span>调查员 A</span><p>“密码是 2，因为 2 是偶数。”</p></blockquote><blockquote><span>调查员 B</span><p>“密码是 8，因为 8 是偶数，而且大于 4。”</p></blockquote><blockquote><span>调查员 C</span><p>“密码是 6，因为只有 6 同时符合全部三条记录。”</p></blockquote></div><p>只有结论正确、理由足以排除其他候选的报告，才能通过审核。</p><p class="question">哪份报告可以通过？报告中的数字，就是第四位密码。</p>',
  },
];

export function isReleased(puzzle, now) {
  return puzzle.releaseAt === null || now >= Date.parse(puzzle.releaseAt);
}

export function checkAnswer(id, answer, now = Date.now()) {
  if (typeof answer !== 'string') throw new Error('请填写数字答案。');
  if (id === 'final') {
    if (!/^\d{4}$/.test(answer)) throw new Error('请输入四位数字。');
    if (!puzzles.every(p => isReleased(p, now))) throw new Error('请等待四份档案全部公开。');
    const correct = answer === puzzles.map(p => p.answer).join('');
    return { correct, message: correct ? '密码核验通过。' : '密码未通过，请检查四位数字的排列顺序。' };
  }
  const puzzle = puzzles.find(p => p.id === id);
  if (!puzzle) throw new Error('档案不存在。');
  if (!isReleased(puzzle, now)) throw new Error('这份档案尚未公开。');
  if (!/^\d$/.test(answer)) throw new Error('请输入一位数字。');
  const correct = answer === puzzle.answer;
  return { correct, message: correct ? '推理通过，密码碎片已确认。' : '这条推理还不成立，请重新检查档案。' };
}
