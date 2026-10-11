/**
 * AI · ML 주제 도식. 부품과 규칙은 `./primitives.tsx` 주석을 따릅니다.
 * 설명용 숫자가 들어간 도식은 그림 안에 「설명용」이라고 적습니다.
 */
import { Arrow, ArrowHeads, Box, C, Diagram, Text, row, toneColor, type Tone } from "./primitives";

/* 점 배열 → 부드러운 곡선 path (Catmull-Rom → 베지어) */
function smooth(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

const line = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/** 테두리 없는 옅은 색 면 — 칩·셀 배경 */
function Tint({ x, y, w, h, tone, r = 8, strong }: { x: number; y: number; w: number; h: number; tone?: Tone; r?: number; strong?: boolean }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={tone ? toneColor(tone) : C.surface}
      fillOpacity={tone ? (strong ? 0.22 : 0.12) : 1}
      stroke={tone ? toneColor(tone) : C.hair}
      strokeOpacity={tone ? 0.6 : 1}
      strokeWidth={strong ? 2 : 1.2}
    />
  );
}

/* ═══════════════ 1장 · 머신러닝 ═══════════════ */

export function AiNesting() {
  const layers = [
    { x: 16, y: 16, w: 628, h: 244, name: "AI (인공지능)", ex: "규칙으로 짠 프로그램도 AI" },
    { x: 40, y: 56, w: 580, h: 192, name: "머신러닝 — 데이터로 규칙을 학습", ex: "스팸 필터 · 추천" },
    { x: 64, y: 96, w: 532, h: 140, name: "딥러닝 — 여러 층의 신경망", ex: "얼굴 · 음성 인식" },
  ];
  return (
    <Diagram h={276} label="AI 안에 머신러닝, 그 안에 딥러닝이 있고, LLM은 딥러닝 모델 중 글을 생성하는 대형 모델이다">
      {layers.map((l) => (
        <g key={l.name}>
          <rect x={l.x} y={l.y} width={l.w} height={l.h} rx={18} fill="var(--ink)" fillOpacity={0.035} stroke={C.hair} strokeWidth={1.5} />
          <Text x={l.x + 16} y={l.y + 24} role="section">
            {l.name}
          </Text>
          <Text x={l.x + l.w - 16} y={l.y + 24} role="note" anchor="end">
            {l.ex}
          </Text>
        </g>
      ))}
      <Box x={88} y={136} w={300} h={84} label="LLM (대규모 언어 모델)" sub="글을 생성하는 대형 딥러닝 모델" tone="fe" />
      <Box x={404} y={136} w={168} h={84} label="그 밖의 생성형 AI" sub="이미지 · 음성 생성" />
    </Diagram>
  );
}

export function FittingCurves() {
  const pts: [number, number][] = [
    [0.05, 0.18], [0.15, 0.5], [0.27, 0.58], [0.38, 0.83], [0.5, 0.76],
    [0.62, 0.79], [0.73, 0.55], [0.85, 0.47], [0.95, 0.2],
  ];
  const panels: { title: string; tone: Tone; notes: [string, string]; curve: (u: number) => number; mode: "fn" | "through" }[] = [
    { title: "과소적합", tone: "bad", notes: ["너무 단순해서", "학습 데이터도 못 맞힘"], curve: () => 0.52, mode: "fn" },
    { title: "적절", tone: "tip", notes: ["전체 흐름을 잡음", "새 데이터에도 잘 맞음"], curve: (u) => 0.18 + 0.62 * Math.sin(Math.PI * u), mode: "fn" },
    { title: "과적합", tone: "bad", notes: ["점을 전부 지나가지만", "잡음까지 외움"], curve: () => 0, mode: "through" },
  ];
  const { w, x } = row(3, { gap: 14 });
  return (
    <Diagram h={226} label="너무 단순하면 학습 데이터도 못 맞히고, 너무 복잡하면 잡음까지 외워 새 데이터에 약해진다">
      {panels.map((p, i) => {
        const x0 = x(i);
        const px = (u: number) => x0 + 12 + u * (w - 24);
        const py = (v: number) => 166 - v * 120;
        const path =
          p.mode === "through"
            ? smooth([[0, 0.05], ...pts, [1, 0.02]].map(([u, v]) => [px(u), py(v)] as [number, number]))
            : smooth(Array.from({ length: 41 }, (_, k) => k / 40).map((u) => [px(u), py(p.curve(u))] as [number, number]));
        return (
          <g key={p.title}>
            <rect x={x0} y={32} width={w} height={146} rx={12} fill={C.surface} stroke={C.hair} strokeWidth={1.2} />
            <Text x={x0 + w / 2} y={22} role="section" anchor="middle" tone={p.tone}>
              {p.title}
            </Text>
            <path d={path} fill="none" stroke={toneColor(p.tone)} strokeWidth={2.4} strokeLinecap="round" />
            {pts.map(([u, v]) => (
              <circle key={u} cx={px(u)} cy={py(v)} r={3.6} fill={C.ink} />
            ))}
            <Text x={x0 + w / 2} y={198} role="note" anchor="middle">
              {p.notes[0]}
            </Text>
            <Text x={x0 + w / 2} y={214} role="note" anchor="middle">
              {p.notes[1]}
            </Text>
          </g>
        );
      })}
    </Diagram>
  );
}

export function ConfusionMatrix() {
  const cells: { x: number; y: number; label: string; sub: string; tone?: Tone }[] = [
    { x: 150, y: 52, label: "TP 60", sub: "잘 잡음", tone: "tip" },
    { x: 306, y: 52, label: "FP 20", sub: "괜한 의심", tone: "warn" },
    { x: 150, y: 124, label: "FN 40", sub: "놓침", tone: "bad" },
    { x: 306, y: 124, label: "TN 9,880", sub: "정상을 정상으로" },
  ];
  return (
    <Diagram h={236} label="정확도는 99.4%지만 실제 사기 100건 중 40건을 놓쳤다. 정밀도는 경보의 신뢰도, 재현율은 놓치지 않는 정도다">
      <Text x={225} y={40} role="section" anchor="middle">
        실제 사기
      </Text>
      <Text x={381} y={40} role="section" anchor="middle">
        실제 정상
      </Text>
      <Text x={20} y={82} role="section">
        모델 「사기」
      </Text>
      <Text x={20} y={154} role="section">
        모델 「정상」
      </Text>
      {cells.map((c) => (
        <Box key={c.label} x={c.x} y={c.y} w={146} h={62} label={c.label} sub={c.sub} tone={c.tone} />
      ))}
      <Text x={484} y={64} tone="fe">
        정밀도 = TP ÷ (TP+FP)
      </Text>
      <Text x={484} y={82}>
        = 60 ÷ 80 = 75%
      </Text>
      <Text x={484} y={100} role="note">
        「사기」 경보 중 진짜 비율
      </Text>
      <Text x={484} y={136} tone="tip">
        재현율 = TP ÷ (TP+FN)
      </Text>
      <Text x={484} y={154}>
        = 60 ÷ 100 = 60%
      </Text>
      <Text x={484} y={172} role="note">
        실제 사기 중 잡은 비율
      </Text>
      <line x1={16} y1={202} x2={644} y2={202} stroke={C.hair} strokeWidth={1} />
      <Text x={20} y={224} role="note">
        정확도는 (60 + 9,880) ÷ 10,000 = 99.4%로 높지만, 사기 100건 중 40건을 놓쳤습니다
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 2장 · 신경망 ═══════════════ */

export function Neuron() {
  const inputs = [
    { label: "날씨 좋음", v: "1.0", w: "× 0.6", y: 34 },
    { label: "친구 같이 감", v: "1.0", w: "× 0.3", y: 100 },
    { label: "돈 있음", v: "0.0", w: "× 0.1", y: 166 },
  ];
  const sx = 334;
  const sy = 120;
  return (
    <Diagram h={248} label="입력에 가중치를 곱해 더하고 편향을 더한 뒤 활성화 함수를 거쳐 출력을 낸다">
      <ArrowHeads id="nn" tones={[undefined, "fe"]} />
      {inputs.map((it) => (
        <g key={it.label}>
          <Box x={16} y={it.y} w={128} h={44} label={it.label} sub={`입력 ${it.v}`} />
          <Arrow heads="nn" from={[146, it.y + 22]} to={[sx - 44, sy + (it.y + 22 - sy) * 0.35]} label={it.w} tone="fe" />
        </g>
      ))}
      <circle cx={sx} cy={sy} r={42} fill="var(--fe)" fillOpacity={0.12} stroke="var(--fe)" strokeWidth={2.2} />
      <text x={sx} y={sy + 4} textAnchor="middle" fontSize={26} fill={C.ink}>
        Σ
      </text>
      <Text x={sx} y={sy + 24} role="note" anchor="middle">
        0.9 − 0.5
      </Text>
      <Text x={sx} y={182} anchor="middle" role="note">
        가중합 + 편향 = 0.4
      </Text>
      <Arrow heads="nn" from={[sx + 44, sy]} to={[412, sy]} />
      <rect x={414} y={84} width={124} height={72} rx={11} fill={C.surface} stroke={C.hair} strokeWidth={1.5} />
      <Text x={476} y={102} anchor="middle" role="section">
        활성화 함수
      </Text>
      <path d="M432,140 L470,140 L516,110" fill="none" stroke="var(--fe)" strokeWidth={2} />
      <line x1={432} y1={140} x2={520} y2={140} stroke={C.hair} strokeWidth={1} />
      <Text x={476} y={172} anchor="middle" role="note">
        0 이하는 0 (ReLU)
      </Text>
      <Arrow heads="nn" from={[540, sy]} to={[562, sy]} />
      <Box x={564} y={96} w={80} h={48} label="출력 1" sub="간다" tone="tip" />
      <Text x={16} y={236} role="note">
        가중치(0.6 · 0.3 · 0.1)와 편향(−0.5)이 학습으로 정해지는 파라미터입니다
      </Text>
    </Diagram>
  );
}

export function GradientDescent() {
  const panels: { title: string; tone: Tone; lr: number; steps: number; note: string }[] = [
    { title: "학습률 너무 작음", tone: "warn", lr: 0.12, steps: 6, note: "한없이 느리게 내려감" },
    { title: "적당함", tone: "tip", lr: 0.35, steps: 5, note: "몇 걸음 만에 바닥 근처" },
    { title: "너무 큼", tone: "bad", lr: 1.05, steps: 4, note: "골짜기를 넘어 튀어 오름" },
  ];
  const { w, x } = row(3, { gap: 14 });
  return (
    <Diagram h={234} label="학습률이 작으면 느리고, 적당하면 바닥에 빨리 닿고, 너무 크면 골짜기를 넘어 손실이 커진다">
      {panels.map((p, i) => {
        const x0 = x(i);
        const px = (u: number) => x0 + 12 + ((u + 0.1) / 1.2) * (w - 24);
        const loss = (u: number) => (u - 0.5) ** 2;
        const py = (u: number) => 164 - (Math.min(loss(u), 0.37) / 0.37) * 118;
        const curve = smooth(Array.from({ length: 49 }, (_, k) => -0.1 + (1.2 * k) / 48).map((u) => [px(u), py(u)] as [number, number]));
        const us: number[] = [0.08];
        for (let k = 1; k < p.steps; k++) {
          const u = us[k - 1];
          us.push(u - p.lr * 2 * (u - 0.5));
        }
        const id = `gd${i}`;
        return (
          <g key={p.title}>
            <ArrowHeads id={id} tones={[p.tone]} />
            <rect x={x0} y={32} width={w} height={146} rx={12} fill={C.surface} stroke={C.hair} strokeWidth={1.2} />
            <Text x={x0 + w / 2} y={22} role="section" anchor="middle" tone={p.tone}>
              {p.title}
            </Text>
            <path d={curve} fill="none" stroke={C.dim} strokeWidth={1.6} />
            {us.slice(0, -1).map((u, k) => {
              const len = Math.hypot(px(us[k + 1]) - px(u), py(us[k + 1]) - py(u));
              return (
                <line
                  key={k}
                  x1={px(u)}
                  y1={py(u)}
                  x2={px(us[k + 1])}
                  y2={py(us[k + 1])}
                  stroke={toneColor(p.tone)}
                  strokeWidth={1.6}
                  strokeDasharray={p.lr > 1 ? "4 3" : undefined}
                  markerEnd={len > 22 ? `url(#${id}-${p.tone})` : undefined}
                />
              );
            })}
            {us.map((u, k) => (
              <circle key={k} cx={px(u)} cy={py(u)} r={k === 0 ? 4.5 : 3.4} fill={toneColor(p.tone)} />
            ))}
            <Text x={x0 + w / 2} y={198} role="note" anchor="middle">
              {p.note}
            </Text>
          </g>
        );
      })}
      <Text x={16} y={224} role="note">
        곡선의 높이 = 손실(틀린 정도) · 가로 = 가중치 값 · 점 하나 = 한 걸음 (설명용 그림)
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 3장 · 토크나이저 ═══════════════ */

export function TokenizeFlow() {
  const tones: Tone[] = ["fe", "tip", "warn"];
  const rows = [
    { y: 46, src: "unbelievable", toks: ["un", "believ", "able"], ids: "348 · 9216 · 481", count: "3개" },
    { y: 124, src: "토큰화가 뭔가요?", toks: ["토", "큰", "화", "가", "뭔", "가요", "?"], ids: "숫자 7개", count: "7개" },
  ];
  return (
    <Diagram h={214} label="글은 토큰 조각으로 잘리고 조각마다 번호가 붙어 숫자 배열로 모델에 들어간다">
      <ArrowHeads id="tk" tones={[undefined]} />
      <Text x={16} y={24} role="section">
        원문
      </Text>
      <Text x={200} y={24} role="section">
        토큰 조각
      </Text>
      <Text x={502} y={24} role="section">
        토큰 ID (모델 입력)
      </Text>
      {rows.map((r) => {
        const n = r.toks.length;
        const gap = 4;
        const cw = (264 - gap * (n - 1)) / n;
        return (
          <g key={r.src}>
            <Box x={16} y={r.y} w={156} h={46} label={r.src} />
            <Arrow heads="tk" from={[174, r.y + 23]} to={[196, r.y + 23]} />
            {r.toks.map((t, i) => (
              <g key={i}>
                <Tint x={200 + i * (cw + gap)} y={r.y + 4} w={cw} h={38} tone={tones[i % 3]} />
                <text x={200 + i * (cw + gap) + cw / 2} y={r.y + 28} textAnchor="middle" fontSize={13} fill={C.ink}>
                  {t}
                </text>
              </g>
            ))}
            <Arrow heads="tk" from={[468, r.y + 23]} to={[498, r.y + 23]} />
            <Box x={502} y={r.y} w={142} h={46} label={r.ids} sub={`토큰 ${r.count}`} mono={r.ids.includes("·")} />
          </g>
        );
      })}
      <Text x={16} y={204} role="note">
        설명용 예시 — 실제로 어떻게 잘리는지는 토크나이저마다 다릅니다. 같은 뜻도 언어에 따라 토큰 수가 달라집니다.
      </Text>
    </Diagram>
  );
}

export function ContextWindow() {
  const segs: { w: number; label: string; tone?: Tone }[] = [
    { w: 64, label: "시스템 지시" },
    { w: 62, label: "대화 3" },
    { w: 62, label: "대화 4" },
    { w: 62, label: "대화 5" },
    { w: 110, label: "첨부 자료", tone: "fe" },
    { w: 64, label: "지금 질문", tone: "tip" },
    { w: 76, label: "답 쓸 자리", tone: "warn" },
  ];
  let cx = 128;
  const placed = segs.map((s) => {
    const p = { ...s, x: cx };
    cx += s.w + 2;
    return p;
  });
  const curve = smooth(
    Array.from({ length: 31 }, (_, k) => k / 30).map((t) => [128 + t * 516, 214 - (0.25 + 0.75 * (2 * t - 1) ** 2) * 50] as [number, number])
  );
  return (
    <Diagram h={252} label="컨텍스트 윈도우를 넘는 앞부분은 잘리고, 창 안에서도 가운데 정보는 놓치기 쉽다">
      <Text x={128} y={24} role="section">
        컨텍스트 윈도우 — 한 번에 읽는 범위 (입력 + 출력)
      </Text>
      {[0, 1].map((i) => (
        <rect key={i} x={16 + i * 52} y={44} width={46} height={46} rx={8} fill="none" stroke={C.dim} strokeDasharray="4 3" strokeOpacity={0.6} />
      ))}
      <Text x={39} y={71} anchor="middle" role="note">
        대화 1
      </Text>
      <Text x={91} y={71} anchor="middle" role="note">
        대화 2
      </Text>
      <Text x={16} y={110} role="note" tone="bad">
        창을 넘어 잘림
      </Text>
      <rect x={122} y={38} width={526} height={58} rx={12} fill="none" stroke={C.ink} strokeWidth={1.6} />
      {placed.map((s) => (
        <g key={s.label}>
          <Tint x={s.x} y={44} w={s.w} h={46} tone={s.tone} />
          <text x={s.x + s.w / 2} y={71} textAnchor="middle" fontSize={11.5} fill={C.ink}>
            {s.label}
          </text>
        </g>
      ))}
      <Text x={128} y={144} role="section">
        창 안의 정보를 활용하는 경향
      </Text>
      <line x1={128} y1={214} x2={644} y2={214} stroke={C.hair} />
      <path d={curve} fill="none" stroke="var(--fe)" strokeWidth={2.4} />
      <Text x={386} y={182} anchor="middle" role="note" tone="bad">
        가운데에 묻힌 정보는 놓치기 쉬움
      </Text>
      <Text x={132} y={180} role="note">
        앞
      </Text>
      <Text x={640} y={180} role="note" anchor="end">
        끝
      </Text>
      <Text x={16} y={242} role="note">
        매 질문마다 지난 대화 전체를 다시 읽으므로, 대화가 길수록 비싸고 앞부분부터 밀려납니다 (Liu et al., 2023의 경향을 단순화)
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 4장 · 트랜스포머 ═══════════════ */

export function AttentionWeights() {
  const toks = ["동물이", "길을", "건너지", "않았다.", "그것이", "피곤했기", "때문이다"];
  const weights: Record<number, number> = { 0: 0.62, 1: 0.07, 2: 0.05, 3: 0.02, 5: 0.21, 6: 0.03 };
  const { w, x, cx } = row(7, { gap: 8 });
  const ty = 140;
  const from = 4;
  return (
    <Diagram h={222} label="「그것이」는 문장의 다른 단어를 쳐다보며 「동물이」에 가장 많이 주목해 뜻을 정한다">
      {Object.entries(weights).map(([k, wt]) => {
        const j = Number(k);
        const x1 = cx(from);
        const x2 = cx(j);
        const peak = ty - 30 - Math.abs(from - j) * 22;
        return (
          <path
            key={k}
            d={`M${x1},${ty} Q${(x1 + x2) / 2},${peak - 18} ${x2},${ty}`}
            fill="none"
            stroke="var(--fe)"
            strokeOpacity={0.25 + wt}
            strokeWidth={1 + wt * 14}
            strokeLinecap="round"
          />
        );
      })}
      {toks.map((t, i) => (
        <Box
          key={t}
          x={x(i)}
          y={ty}
          w={w}
          h={50}
          label={t}
          sub={i === from ? "기준 단어" : `주목 ${weights[i].toFixed(2)}`}
          tone={i === from ? "fe" : i === 0 ? "tip" : undefined}
        />
      ))}
      <Text x={16} y={212} role="note">
        선이 굵을수록 많이 주목 (비율의 합 = 1). 설명용 숫자 — 실제 모델은 층·헤드마다 다른 패턴이 나타납니다.
      </Text>
    </Diagram>
  );
}

export function RnnVsTransformer() {
  const n = 5;
  const left = row(n, { start: 16, end: 306, gap: 14 });
  const right = row(n, { start: 352, end: 644, gap: 14 });
  const y = 110;
  return (
    <Diagram h={214} label="RNN은 한 줄로 차례차례 전달해 앞부분이 흐려지고, 트랜스포머는 모든 단어가 동시에 서로를 본다">
      <ArrowHeads id="rt" tones={[undefined, "bad"]} />
      <Text x={16} y={24} role="section" tone="bad">
        RNN — 한 줄로 차례차례
      </Text>
      <Text x={352} y={24} role="section" tone="tip">
        트랜스포머 — 모두가 동시에
      </Text>
      {Array.from({ length: n }, (_, i) => (
        <g key={`l${i}`}>
          <rect x={left.x(i)} y={y} width={left.w} height={36} rx={9} fill={C.surface} stroke={C.hair} strokeWidth={1.4} opacity={0.35 + (i / (n - 1)) * 0.65} />
          <Text x={left.cx(i)} y={y + 23} anchor="middle">
            {`단어${i + 1}`}
          </Text>
          {i < n - 1 && <Arrow heads="rt" from={[left.x(i) + left.w + 1, y + 18]} to={[left.x(i + 1) - 1, y + 18]} />}
        </g>
      ))}
      <Text x={16} y={176} role="note">
        앞 단어를 다 읽어야 다음으로 → 병렬 처리 불가
      </Text>
      <Text x={16} y={194} role="note" tone="bad">
        길어질수록 앞부분이 흐려짐
      </Text>
      {Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
          j > i ? (
            <path
              key={`a${i}${j}`}
              d={`M${right.cx(i)},${y} Q${(right.cx(i) + right.cx(j)) / 2},${y - 18 - (j - i) * 14} ${right.cx(j)},${y}`}
              fill="none"
              stroke="var(--tip)"
              strokeOpacity={0.55}
              strokeWidth={1.4}
            />
          ) : null
        )
      )}
      {Array.from({ length: n }, (_, i) => (
        <g key={`r${i}`}>
          <rect x={right.x(i)} y={y} width={right.w} height={36} rx={9} fill={C.surface} stroke={C.hair} strokeWidth={1.4} />
          <Text x={right.cx(i)} y={y + 23} anchor="middle">
            {`단어${i + 1}`}
          </Text>
        </g>
      ))}
      <Text x={352} y={176} role="note">
        모든 짝을 한 번에 계산 → GPU로 병렬 처리
      </Text>
      <Text x={352} y={194} role="note" tone="warn">
        대가: 길이가 2배면 짝은 약 4배
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 5장 · LLM 학습 단계 ═══════════════ */

export function TrainingStages() {
  const stages: { title: string; data: string; result: string; extra: string; tone?: Tone }[] = [
    { title: "사전학습", data: "웹 · 책 · 코드 텍스트", result: "베이스 모델", extra: "비용의 대부분", tone: "fe" },
    { title: "지시 학습 (SFT)", data: "질문 → 모범 답안", result: "답하는 형식", extra: "말투·형식을 익힘" },
    { title: "선호 학습 (RLHF)", data: "답 비교 순위", result: "선호되는 태도", extra: "부작용: 아첨", tone: "warn" },
    { title: "추론 강화", data: "정답 확인 가능한 문제", result: "길게 생각 후 답", extra: "느리고 비쌈" },
  ];
  const { w, x, cx } = row(4, { gap: 18 });
  return (
    <Diagram h={214} label="LLM은 사전학습, 지시 학습, 선호 학습, 추론 강화 순서로 만들어지며 단계마다 바뀌는 것이 다르다">
      <ArrowHeads id="ts" tones={[undefined]} />
      {stages.map((s, i) => (
        <g key={s.title}>
          <rect
            x={x(i)}
            y={16}
            width={w}
            height={160}
            rx={14}
            fill={s.tone ? toneColor(s.tone) : C.surface}
            fillOpacity={s.tone ? 0.1 : 1}
            stroke={s.tone ? toneColor(s.tone) : C.hair}
            strokeWidth={s.tone ? 2 : 1.4}
          />
          <Text x={x(i) + 14} y={40} role="note">
            {`${i + 1}단계`}
          </Text>
          <Text x={x(i) + 14} y={60} role="section" tone={s.tone}>
            {s.title}
          </Text>
          <Text x={x(i) + 14} y={90} role="note">
            데이터
          </Text>
          <Text x={x(i) + 14} y={108}>
            {s.data}
          </Text>
          <Text x={x(i) + 14} y={134} role="note">
            결과
          </Text>
          <Text x={x(i) + 14} y={152}>
            {s.result}
          </Text>
          <Text x={cx(i)} y={200} role="note" anchor="middle" tone={s.tone}>
            {s.extra}
          </Text>
          {i < stages.length - 1 && <Arrow heads="ts" from={[x(i) + w + 2, 96]} to={[x(i + 1) - 2, 96]} />}
        </g>
      ))}
    </Diagram>
  );
}

/* ═══════════════ 6장 · 생성 ═══════════════ */

export function TemperatureBars() {
  const cands = ["김치찌개", "라면", "샐러드", "초밥", "우주식량"];
  const series: { t: string; tone: Tone | undefined; v: number[] }[] = [
    { t: "온도 0.5", tone: "fe", v: [0.728, 0.182, 0.066, 0.024, 0.0003] },
    { t: "온도 1", tone: undefined, v: [0.5, 0.25, 0.15, 0.09, 0.01] },
    { t: "온도 2", tone: "warn", v: [0.355, 0.251, 0.194, 0.15, 0.05] },
  ];
  const base = 196;
  const scale = 140 / 0.75;
  const gw = 112;
  const bw = 26;
  const gx = (i: number) => 74 + i * gw;
  return (
    <Diagram h={244} label="온도를 낮추면 1등에 확률이 쏠리고, 높이면 확률이 평평해져 엉뚱한 후보도 뽑힐 수 있다">
      {series.map((s, k) => (
        <g key={s.t}>
          <rect x={74 + k * 110} y={14} width={12} height={12} rx={3} fill={s.tone ? toneColor(s.tone) : C.dim} fillOpacity={s.tone ? 0.8 : 0.6} />
          <Text x={92 + k * 110} y={24} role="note">
            {s.t}
          </Text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75].map((v) => (
        <g key={v}>
          <line x1={64} y1={base - v * scale} x2={644} y2={base - v * scale} stroke={C.hair} strokeWidth={v === 0 ? 1.4 : 0.8} />
          <Text x={56} y={base - v * scale + 4} role="note" anchor="end">
            {`${Math.round(v * 100)}%`}
          </Text>
        </g>
      ))}
      {cands.map((c, i) => (
        <g key={c}>
          {series.map((s, k) => {
            const h = Math.max(1.5, s.v[i] * scale);
            const bx = gx(i) + 10 + k * (bw + 4);
            return (
              <g key={s.t}>
                <rect x={bx} y={base - h} width={bw} height={h} rx={4} fill={s.tone ? toneColor(s.tone) : C.dim} fillOpacity={s.tone ? 0.8 : 0.6} />
                {(i === 0 || i === 4) && (
                  <text x={bx + bw / 2} y={base - h - 5} textAnchor="middle" fontSize={10} fill={C.muted}>
                    {s.v[i] < 0.005 ? "≈0" : `${Math.round(s.v[i] * 100)}`}
                  </text>
                )}
              </g>
            );
          })}
          <Text x={gx(i) + 10 + (3 * bw + 8) / 2} y={base + 20} role="note" anchor="middle">
            {c}
          </Text>
        </g>
      ))}
      <Text x={16} y={238} role="note">
        「오늘 점심은 ___」 다음 토큰의 확률 (설명용 숫자). 온도는 무작위성만 바꿀 뿐, 답이 사실인지와는 무관합니다.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 7장 · 임베딩 ═══════════════ */

export function EmbeddingSpace() {
  const groups: { name: string; tone: Tone; cx: number; cy: number; pts: [string, number, number][] }[] = [
    { name: "동물", tone: "tip", cx: 140, cy: 84, pts: [["강아지", 112, 70], ["반려견", 150, 86], ["고양이", 104, 108], ["꼬리", 178, 62]] },
    { name: "바다 · 이동", tone: "fe", cx: 520, cy: 82, pts: [["선박", 500, 70], ["항구", 560, 92], ["바다", 534, 58]] },
    { name: "과일", tone: "warn", cx: 150, cy: 214, pts: [["사과", 96, 212], ["과일", 140, 234]] },
    { name: "몸", tone: "bad", cx: 520, cy: 214, pts: [["허기", 566, 204], ["신체", 540, 236]] },
  ];
  const bae: [string, number, number][] = [
    ["배 (배를 탔다)", 452, 118],
    ["배 (배를 깎았다)", 200, 196],
    ["배 (배가 고프다)", 470, 200],
  ];
  return (
    <Diagram h={300} label="뜻이 비슷한 말은 가까운 좌표에 놓이고, 같은 글자 「배」도 문맥에 따라 다른 무리에 놓인다">
      <line x1={16} y1={150} x2={644} y2={150} stroke={C.hair} strokeDasharray="3 4" />
      <line x1={330} y1={16} x2={330} y2={270} stroke={C.hair} strokeDasharray="3 4" />
      {groups.map((g) => (
        <g key={g.name}>
          <ellipse cx={g.cx} cy={g.cy} rx={96} ry={44} fill={toneColor(g.tone)} fillOpacity={0.08} stroke={toneColor(g.tone)} strokeOpacity={0.4} />
          <Text x={g.cx} y={g.cy - 50} role="note" anchor="middle" tone={g.tone}>
            {g.name}
          </Text>
          {g.pts.map(([t, x, y]) => (
            <g key={t}>
              <circle cx={x} cy={y} r={4} fill={toneColor(g.tone)} />
              <Text x={x + 8} y={y + 4}>
                {t}
              </Text>
            </g>
          ))}
        </g>
      ))}
      <circle cx={330} cy={150} r={5} fill="var(--fe)" />
      {bae.map(([t, x, y]) => (
        <g key={t}>
          <line x1={330} y1={150} x2={x} y2={y} stroke="var(--fe)" strokeDasharray="4 3" strokeWidth={1.4} />
          <circle cx={x} cy={y} r={5} fill="none" stroke={C.ink} strokeWidth={2} />
          <Text x={x + (x > 330 ? -10 : 10)} y={y < 150 ? y - 10 : y + 16} anchor={x > 330 ? "end" : "start"}>
            {t}
          </Text>
        </g>
      ))}
      <Text x={330} y={132} role="note" tone="fe" anchor="middle">
        같은 글자 「배」
      </Text>
      <Text x={16} y={290} role="note">
        개념도 — 실제 임베딩은 수백~수천 차원이고, 축 하나하나에 사람이 이름을 붙일 수 없습니다.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 8장 · 프롬프트 ═══════════════ */

export function PromptAnatomy() {
  const parts: { k: string; ex: string; why: string; miss?: boolean }[] = [
    { k: "역할", ex: "너는 임원 보고서를 쓰는 기획 담당자다", why: "어떤 관점으로" },
    { k: "맥락", ex: "임원은 회의에 없었고, 결정 안건만 궁금해함", why: "누가, 왜 읽나", miss: true },
    { k: "과제", ex: "결정 사항 · 미결 안건 · 할 일을 뽑아라", why: "정확히 무엇을" },
    { k: "제약", ex: "1쪽 이내, 없는 내용은 [확인 필요]", why: "분량 · 금지 · 기준", miss: true },
    { k: "형식", ex: "① 한 줄 결론 ② 결정 표 ③ 할 일 표", why: "결과물의 모양" },
    { k: "예시", ex: "지난주 보고서 형식을 따르라 (첨부)", why: "원하는 결과 샘플" },
  ];
  const y0 = 44;
  const h = 36;
  const gap = 6;
  return (
    <Diagram h={y0 + parts.length * (h + gap) + 22} label="좋은 요청은 역할, 맥락, 과제, 제약, 형식, 예시 여섯 요소로 이루어지며 맥락과 제약이 가장 자주 빠진다">
      <Text x={16} y={26} role="section">
        요청문
      </Text>
      <Text x={470} y={26} role="section">
        알려주는 것
      </Text>
      <rect x={16} y={y0 - 8} width={438} height={parts.length * (h + gap) + 10} rx={14} fill={C.surface} stroke={C.hair} strokeWidth={1.4} />
      {parts.map((p, i) => {
        const y = y0 + i * (h + gap);
        return (
          <g key={p.k}>
            <Tint x={26} y={y} w={56} h={h} tone={p.miss ? "warn" : "fe"} r={9} />
            <text x={54} y={y + 23} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.ink}>
              {p.k}
            </text>
            <Text x={94} y={y + 23}>
              {p.ex}
            </Text>
            <line x1={456} y1={y + h / 2} x2={466} y2={y + h / 2} stroke={C.hair} />
            <Text x={470} y={y + 23} role="note">
              {p.why}
            </Text>
            {p.miss && (
              <Text x={644} y={y + 23} role="note" anchor="end" tone="warn">
                자주 빠짐
              </Text>
            )}
          </g>
        );
      })}
    </Diagram>
  );
}

/* ═══════════════ 9장 · 적용 전략 ═══════════════ */

export function AdaptDecision() {
  return (
    <Diagram h={330} label="지식 문제면 자료를 넣고, 행동 문제면 프롬프트를 먼저 고치고 그래도 안 되면 파인튜닝한다">
      <ArrowHeads id="ad" tones={[undefined, "tip", "warn"]} />
      <Box x={196} y={16} w={248} h={40} label="결과가 기대와 다르다" />
      <Arrow heads="ad" from={[320, 58]} to={[320, 84]} />
      <Box x={170} y={86} w={300} h={52} label="지식 문제인가?" sub="모름 · 최신이 아님 · 출처가 필요" />
      <Arrow heads="ad" from={[472, 112]} to={[500, 112]} tone="tip" label="예" />
      <Box x={502} y={86} w={142} h={52} label="자료를 넣는다" sub="컨텍스트 → RAG · 검색" tone="tip" />
      <Arrow heads="ad" from={[320, 140]} to={[320, 172]} />
      <Text x={328} y={160} role="note">
        아니오
      </Text>
      <Box x={170} y={174} w={300} h={52} label="행동 문제인가?" sub="형식 · 말투 · 일관성" />
      <Arrow heads="ad" from={[472, 200]} to={[500, 200]} tone="tip" label="예" />
      <Box x={502} y={174} w={142} h={52} label="프롬프트 · 예시" sub="먼저 여기서" tone="tip" />
      <Arrow heads="ad" from={[573, 228]} to={[573, 258]} tone="warn" />
      <Text x={496} y={248} role="note" tone="warn" anchor="end">
        그래도 안 되면
      </Text>
      <Box x={502} y={262} w={142} h={52} label="파인튜닝" sub="LoRA 등 일부만" tone="warn" />
      <line x1={40} y1={92} x2={40} y2={300} stroke={C.dim} strokeWidth={1.6} markerEnd="url(#ad-plain)" />
      <Text x={52} y={110} role="note">
        평가 기준부터
      </Text>
      <Text x={52} y={128} role="note">
        만들어 두고
      </Text>
      <Text x={52} y={282} role="note">
        아래로 갈수록
      </Text>
      <Text x={52} y={300} role="note">
        비싸고 느리고
      </Text>
      <Text x={52} y={318} role="note">
        되돌리기 어려움
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 10장 · RAG ═══════════════ */

export function RagFailures() {
  const stages: { k: string; s: [string, string] }[] = [
    { k: "파싱", s: ["표 · 숫자가", "뒤섞임"] },
    { k: "자르기", s: ["조건 빠진", "반쪽 답"] },
    { k: "검색", s: ["있는데", "못 찾음"] },
    { k: "넣기", s: ["가운데에", "묻힘"] },
    { k: "생성", s: ["자료 무시,", "섞어 지어냄"] },
    { k: "운영", s: ["낡은 문서,", "권한 누수"] },
  ];
  const { w, x, cx } = row(6, { gap: 18 });
  const by = 62;
  return (
    <Diagram h={214} label="RAG는 파싱, 자르기, 검색, 넣기, 생성, 운영 단계마다 실패할 수 있고 검색과 생성은 따로 진단해야 한다">
      <ArrowHeads id="rg" tones={[undefined]} />
      <path d={`M${x(0)},40 L${x(0)},32 L${x(3) + w},32 L${x(3) + w},40`} fill="none" stroke="var(--fe)" strokeWidth={1.6} />
      <Text x={(x(0) + x(3) + w) / 2} y={24} anchor="middle" role="note" tone="fe">
        검색 쪽 진단 — 정답 조각이 상위 k개 안에 있나?
      </Text>
      <path d={`M${x(4)},40 L${x(4)},32 L${x(4) + w},32 L${x(4) + w},40`} fill="none" stroke="var(--tip)" strokeWidth={1.6} />
      <Text x={cx(4)} y={24} anchor="middle" role="note" tone="tip">
        생성 쪽 — 충실성
      </Text>
      {stages.map((s, i) => (
        <g key={s.k}>
          <Box x={x(i)} y={by - 14} w={w} h={44} label={s.k} />
          {i < stages.length - 1 && <Arrow heads="rg" from={[x(i) + w + 1, by + 8]} to={[x(i + 1) - 1, by + 8]} />}
          <line x1={cx(i)} y1={by + 32} x2={cx(i)} y2={by + 50} stroke="var(--bad)" strokeWidth={1.4} strokeDasharray="3 3" />
          <Tint x={x(i)} y={by + 52} w={w} h={60} tone="bad" />
          <Text x={cx(i)} y={by + 77} anchor="middle" role="note">
            {s.s[0]}
          </Text>
          <Text x={cx(i)} y={by + 95} anchor="middle" role="note">
            {s.s[1]}
          </Text>
        </g>
      ))}
      <Text x={16} y={204} role="note">
        범인을 모르고 모델이나 프롬프트부터 바꾸면 헛수고가 됩니다. 단계마다 따로 확인하세요.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 11장 · 에이전트 ═══════════════ */

export function AgentLoop() {
  const tools: { k: string; y: number; tone?: Tone }[] = [
    { k: "웹 검색", y: 34 },
    { k: "메일 보내기", y: 94, tone: "warn" },
    { k: "사내 DB 조회", y: 154 },
  ];
  return (
    <Diagram h={244} label="모델은 도구 호출 요청 글만 쓰고, 호스트 프로그램이 실제로 실행해 결과를 돌려준다">
      <ArrowHeads id="ag" tones={[undefined, "fe", "warn"]} />
      <Box x={16} y={98} w={94} h={48} label="사용자" sub="목표" />
      <Arrow heads="ag" from={[112, 122]} to={[150, 122]} />
      <rect x={152} y={74} width={140} height={96} rx={14} fill="var(--fe)" fillOpacity={0.1} stroke="var(--fe)" strokeWidth={2} />
      <Text x={222} y={110} anchor="middle" role="section" tone="fe">
        모델
      </Text>
      <Text x={222} y={130} anchor="middle" role="note">
        생각 → 행동 → 관찰
      </Text>
      <Text x={222} y={148} anchor="middle" role="note">
        글만 쓸 수 있음
      </Text>
      <Arrow heads="ag" from={[294, 98]} to={[368, 98]} tone="fe" label="호출 요청" />
      <Arrow heads="ag" from={[368, 146]} to={[294, 146]} dashed label="결과" labelSide="below" />
      <Box x={370} y={74} w={132} h={96} label="호스트 프로그램" sub="실제로 실행" />
      {tools.map((t) => (
        <g key={t.k}>
          <Arrow heads="ag" from={[504, 122]} to={[548, t.y + 20]} tone={t.tone} />
          <Box x={550} y={t.y} w={94} h={40} label={t.k} tone={t.tone} />
        </g>
      ))}
      <Tint x={508} y={98} w={32} h={16} tone="warn" r={8} strong />
      <text x={524} y={110} textAnchor="middle" fontSize={9.5} fill="var(--warn)">
        승인
      </text>
      <Text x={16} y={212} role="note">
        어떤 도구를 쓸 수 있는지, 어떤 권한을 줄지, 무엇을 사람이 승인할지는 호스트를 설계하는 사람이 정합니다.
      </Text>
      <Text x={16} y={232} role="note">
        MCP는 이 「호스트 ↔ 도구」 연결 방식을 통일한 표준 규격입니다.
      </Text>
    </Diagram>
  );
}

export function ErrorCompounding() {
  const series: { p: number; tone: Tone }[] = [
    { p: 0.99, tone: "tip" },
    { p: 0.95, tone: "warn" },
    { p: 0.9, tone: "bad" },
  ];
  const X = (n: number) => 70 + ((n - 1) / 19) * 470;
  const Y = (v: number) => 190 - v * 160;
  return (
    <Diagram h={242} label="단계별 성공률이 95%여도 20단계를 이으면 전체 성공률은 약 36%로 떨어진다">
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={70} y1={Y(v)} x2={540} y2={Y(v)} stroke={C.hair} strokeWidth={v === 0 ? 1.4 : 0.8} />
          <Text x={62} y={Y(v) + 4} role="note" anchor="end">
            {`${v * 100}%`}
          </Text>
        </g>
      ))}
      {[1, 5, 10, 20].map((n) => (
        <Text key={n} x={X(n)} y={208} role="note" anchor="middle">
          {`${n}단계`}
        </Text>
      ))}
      {series.map((s) => {
        const pts = Array.from({ length: 20 }, (_, k) => [X(k + 1), Y(s.p ** (k + 1))] as [number, number]);
        const end = s.p ** 20;
        return (
          <g key={s.p}>
            <path d={line(pts)} fill="none" stroke={toneColor(s.tone)} strokeWidth={2.4} />
            {[1, 5, 10, 20].map((n) => (
              <circle key={n} cx={X(n)} cy={Y(s.p ** n)} r={3.5} fill={toneColor(s.tone)} />
            ))}
            <Text x={552} y={Y(end) + 4} tone={s.tone}>
              {`단계당 ${Math.round(s.p * 100)}% → ${Math.round(end * 100)}%`}
            </Text>
          </g>
        );
      })}
      <Text x={16} y={234} role="note">
        단계별 성공률을 단계 수만큼 곱한 설명용 계산 — 단계가 길수록 중간 확인과 사람의 승인이 필요합니다.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 12장 · 환각 ═══════════════ */

export function PlausibleTrue() {
  const cells: { x: number; y: number; label: string; sub: string; tone?: Tone }[] = [
    { x: 170, y: 50, label: "좋은 답", sub: "그대로 쓸 수 있음", tone: "tip" },
    { x: 412, y: 50, label: "환각 — 가장 위험", sub: "말투로는 구별이 안 됨", tone: "bad" },
    { x: 170, y: 128, label: "맞지만 서툰 답", sub: "다듬으면 됨" },
    { x: 412, y: 128, label: "쉽게 걸러짐", sub: "누가 봐도 이상함" },
  ];
  return (
    <Diagram h={248} label="그럴듯한데 사실이 아닌 답이 환각이며, 말투만으로는 좋은 답과 구별되지 않는다">
      <Text x={290} y={36} role="section" anchor="middle">
        사실
      </Text>
      <Text x={532} y={36} role="section" anchor="middle">
        사실이 아님
      </Text>
      <Text x={20} y={78} role="section">
        그럴듯하게
      </Text>
      <Text x={20} y={96} role="section">
        들림
      </Text>
      <Text x={20} y={156} role="section">
        어색하게
      </Text>
      <Text x={20} y={174} role="section">
        들림
      </Text>
      {cells.map((c) => (
        <Box key={c.label} x={c.x} y={c.y} w={232} h={66} label={c.label} sub={c.sub} tone={c.tone} />
      ))}
      <rect x={164} y={44} width={486} height={78} rx={14} fill="none" stroke="var(--fe)" strokeDasharray="5 4" strokeWidth={1.6} />
      <Text x={16} y={222} role="note" tone="fe">
        점선 = LLM이 만들도록 학습된 영역 (그럴듯한 다음 말)
      </Text>
      <Text x={16} y={240} role="note">
        왼쪽(사실)과 오른쪽(사실 아님)을 가르는 장치는 모델 안에 따로 없습니다 → 검증은 원자료로.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 13장 · 검증 ═══════════════ */

export function WorkLoop() {
  const steps: { k: string; who: string; tone?: Tone; note: string }[] = [
    { k: "문제 정의", who: "사람", note: "통과 조건 적기" },
    { k: "맥락 · 제약", who: "사람", note: "6요소로 요청" },
    { k: "생성", who: "AI", tone: "fe", note: "빠르게 초안" },
    { k: "검증", who: "사람", note: "숫자·출처·누락" },
    { k: "최종 판단", who: "사람 · 책임", tone: "tip", note: "써도 되는가" },
  ];
  const { w, x, cx } = row(5, { gap: 22 });
  const y = 84;
  return (
    <Diagram h={196} label="문제 정의와 맥락 제공은 사람이, 생성은 AI가, 검증과 최종 판단은 사람이 하며 검증 결과를 구체적 피드백으로 되돌린다">
      <ArrowHeads id="wl" tones={[undefined, "warn"]} />
      <path
        d={`M${cx(3)},${y - 2} C${cx(3)},${y - 58} ${cx(2)},${y - 58} ${cx(2)},${y - 4}`}
        fill="none"
        stroke="var(--warn)"
        strokeWidth={2}
        strokeDasharray="5 4"
        markerEnd="url(#wl-warn)"
      />
      <Text x={(cx(2) + cx(3)) / 2} y={24} anchor="middle" role="note" tone="warn">
        구체적 피드백 — 어디가 · 왜 · 어떻게
      </Text>
      {steps.map((s, i) => (
        <g key={s.k}>
          <Box x={x(i)} y={y} w={w} h={56} label={s.k} sub={s.who} tone={s.tone} />
          {i < steps.length - 1 && <Arrow heads="wl" from={[x(i) + w + 2, y + 28]} to={[x(i + 1) - 2, y + 28]} />}
          <Text x={cx(i)} y={164} anchor="middle" role="note">
            {s.note}
          </Text>
        </g>
      ))}
      <Text x={16} y={190} role="note">
        AI가 가운데를 빠르게 돌려줄수록, 사람이 맡는 맨 앞(정의)과 맨 뒤(판단)의 질이 결과를 좌우합니다.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 14장 · 보안 · 규제 ═══════════════ */

export function PromptInjectionFlow() {
  return (
    <Diagram h={282} label="AI가 읽는 문서에 숨은 지시가 도구 호출로 이어져 정보가 유출될 수 있고, 지시와 자료 분리, 최소 권한, 사람 승인으로 피해를 줄인다">
      <ArrowHeads id="pi" tones={[undefined, "bad"]} />
      <Box x={16} y={22} w={150} h={48} label="사용자" sub="「이 메일 요약해 줘」" />
      <rect x={16} y={110} width={150} height={92} rx={12} fill={C.surface} stroke={C.hair} strokeWidth={1.5} />
      <Text x={30} y={134} role="section">
        받은 메일
      </Text>
      <Text x={30} y={156} role="note">
        안녕하세요, 지난 회의…
      </Text>
      <Tint x={26} y={166} w={130} h={26} tone="bad" r={6} />
      <Text x={34} y={183} role="note" tone="bad">
        숨은 글: 대화를 외부로
      </Text>
      <Text x={16} y={222} role="note">
        공격자가 흰 글씨 등으로
      </Text>
      <Text x={16} y={238} role="note">
        심어 둠
      </Text>
      <Arrow heads="pi" from={[168, 46]} to={[228, 92]} />
      <Arrow heads="pi" from={[168, 160]} to={[228, 132]} tone="bad" />
      <rect x={230} y={70} width={150} height={86} rx={14} fill="var(--fe)" fillOpacity={0.1} stroke="var(--fe)" strokeWidth={2} />
      <Text x={305} y={104} anchor="middle" role="section" tone="fe">
        AI 에이전트
      </Text>
      <Text x={305} y={124} anchor="middle" role="note">
        지시와 자료가
      </Text>
      <Text x={305} y={140} anchor="middle" role="note">
        모두 같은 「글」
      </Text>
      <Arrow heads="pi" from={[382, 100]} to={[450, 64]} tone="bad" dashed />
      <Box x={452} y={38} w={192} h={48} label="메일 보내기 도구" sub="외부 주소로" />
      <Arrow heads="pi" from={[548, 88]} to={[548, 128]} tone="bad" />
      <Box x={452} y={130} w={192} h={50} label="대화 내용 유출" tone="bad" />
      {[
        { x: 190, y: 214, t: "① 지시 · 자료 분리" },
        { x: 360, y: 214, t: "② 최소 권한" },
        { x: 480, y: 214, t: "③ 사람 승인" },
      ].map((d) => (
        <g key={d.t}>
          <Tint x={d.x} y={d.y} w={d.t.length * 11 + 12} h={24} tone="tip" r={12} />
          <Text x={d.x + 10} y={d.y + 16} role="note" tone="tip">
            {d.t}
          </Text>
        </g>
      ))}
      <Text x={16} y={272} role="note">
        초록 = 피해를 줄이는 방어선. 아직 완벽하게 막는 방법은 없어서 여러 겹으로 둡니다 (OWASP LLM01).
      </Text>
    </Diagram>
  );
}

export function RegulationTimeline() {
  const T = (y: number, m: number) => 30 + ((y + (m - 1) / 12 - 2024.5) / 4.25) * 600;
  const axis = 150;
  const eu: { y: number; m: number; d: string; t: string; lv: 1 | 2; tone?: Tone; anchor?: "start" | "middle" | "end" }[] = [
    { y: 2024, m: 8, d: "2024.08", t: "발효", lv: 1, anchor: "start" },
    { y: 2025, m: 2, d: "2025.02", t: "금지 조항", lv: 2 },
    { y: 2025, m: 8, d: "2025.08", t: "범용 AI 의무", lv: 1 },
    { y: 2026, m: 8, d: "2026.08", t: "투명성 의무 등", lv: 2 },
    { y: 2026, m: 12, d: "2026.12", t: "추가 금지", lv: 1 },
    { y: 2027, m: 12, d: "2027.12", t: "독립형 고위험", lv: 2, tone: "warn" },
    { y: 2028, m: 8, d: "2028.08", t: "제품 내장 고위험", lv: 1, tone: "warn", anchor: "end" },
  ];
  const now = T(2026, 10);
  const kr = T(2026, 1);
  return (
    <Diagram h={244} label="EU AI Act는 2024년 발효 후 단계적으로 적용되며 고위험 의무는 2027년 12월과 2028년 8월로 연기됐고, 한국 AI 기본법은 2026년 1월 시행됐다">
      <Text x={16} y={24} role="section">
        EU AI Act
      </Text>
      <Text x={16} y={218} role="section">
        한국
      </Text>
      <line x1={24} y1={axis} x2={640} y2={axis} stroke={C.ink} strokeWidth={1.6} />
      {[2025, 2026, 2027, 2028].map((y) => (
        <g key={y}>
          <line x1={T(y, 1)} y1={axis - 4} x2={T(y, 1)} y2={axis + 4} stroke={C.dim} />
          <Text x={T(y, 1)} y={axis + 18} anchor="middle" role="note">
            {String(y)}
          </Text>
        </g>
      ))}
      <line x1={now} y1={128} x2={now} y2={202} stroke="var(--fe)" strokeDasharray="4 3" strokeWidth={1.4} />
      <Text x={now + 6} y={200} role="note" tone="fe">
        지금 (2026.10)
      </Text>
      {eu.map((e) => {
        const ex = T(e.y, e.m);
        const ty = e.lv === 1 ? 112 : 70;
        return (
          <g key={e.d}>
            <line x1={ex} y1={axis} x2={ex} y2={ty + 8} stroke={e.tone ? toneColor(e.tone) : C.dim} strokeWidth={1.2} />
            <circle cx={ex} cy={axis} r={4.5} fill={e.tone ? toneColor(e.tone) : C.ink} />
            <Text x={ex} y={ty - 14} anchor={e.anchor ?? "middle"} role="note">
              {e.d}
            </Text>
            <Text x={ex} y={ty + 2} anchor={e.anchor ?? "middle"} tone={e.tone}>
              {e.t}
            </Text>
          </g>
        );
      })}
      <Text x={T(2027, 12)} y={42} anchor="middle" role="note" tone="warn">
        2026년 개정으로 연기
      </Text>
      <circle cx={kr} cy={axis} r={5} fill="var(--tip)" />
      <line x1={kr} y1={axis} x2={kr} y2={208} stroke="var(--tip)" strokeWidth={1.2} />
      <Text x={kr + 8} y={222} tone="tip">
        2026.01.22 AI 기본법 시행
      </Text>
      <Text x={16} y={240} role="note">
        법률 자문 아님 — 2026년 10월 기준 정리. 세부 기준은 원문과 최신 공지를 확인하세요.
      </Text>
    </Diagram>
  );
}

/* ═══════════════ 15장 · 메모리 ═══════════════ */

export function MemoryWall() {
  const rates: { k: string; r: number; tone: Tone }[] = [
    { k: "계산 성능", r: 3.0, tone: "fe" },
    { k: "DRAM 대역폭", r: 1.6, tone: "warn" },
    { k: "칩 간 연결", r: 1.4, tone: "bad" },
  ];
  const X = (yr: number) => 80 + (yr / 10) * 400;
  const Y = (v: number) => 196 - (Math.log10(v) / 2.5) * 160;
  const pts = (r: number) => Array.from({ length: 11 }, (_, yr) => [X(yr), Y(r ** (yr / 2))] as [number, number]);
  const top = pts(3.0);
  const mid = pts(1.6);
  const gap = `${line(top)} ${mid
    .slice()
    .reverse()
    .map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ")} Z`;
  return (
    <Diagram h={250} label="계산 성능은 2년마다 약 3배, 메모리 대역폭은 약 1.6배 늘어 격차가 계속 벌어진다">
      {[1, 10, 100].map((v) => (
        <g key={v}>
          <line x1={80} y1={Y(v)} x2={480} y2={Y(v)} stroke={C.hair} strokeWidth={v === 1 ? 1.4 : 0.8} />
          <Text x={72} y={Y(v) + 4} role="note" anchor="end">
            {`×${v}`}
          </Text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10].map((yr) => (
        <Text key={yr} x={X(yr)} y={214} role="note" anchor="middle">
          {`${yr}년`}
        </Text>
      ))}
      <path d={gap} fill="var(--warn)" fillOpacity={0.1} />
      <Text x={X(6.4)} y={Y(3 ** 3.2) + 40} role="note" tone="warn">
        벌어지는 격차
      </Text>
      {rates.map((s) => {
        const end = s.r ** 5;
        const dy = s.r === 1.6 ? -14 : s.r === 1.4 ? 10 : 0;
        return (
          <g key={s.k}>
            <path d={line(pts(s.r))} fill="none" stroke={toneColor(s.tone)} strokeWidth={2.6} />
            <Text x={492} y={Y(end) - 2 + dy} tone={s.tone}>
              {s.k}
            </Text>
            <Text x={492} y={Y(end) + 14 + dy} role="note">
              {`2년마다 ${s.r}배 → 10년 ×${end >= 100 ? Math.round(end) : end.toFixed(1)}`}
            </Text>
          </g>
        );
      })}
      <Text x={16} y={242} role="note">
        Gholami et al.(2024)이 보고한 증가율로 10년을 계산한 예시 (세로축은 로그 눈금)
      </Text>
    </Diagram>
  );
}

export function HbmStack() {
  const dies = 8;
  const dieH = 11;
  const dieGap = 2;
  const baseY = 196;
  const sx = 386;
  const sw = 128;
  const tsvX = [404, 428, 452, 476, 500];
  return (
    <Diagram h={300} label="HBM은 D램 칩을 수직으로 쌓아 TSV로 잇고, 인터포저 위에서 GPU 바로 옆에 붙여 아주 넓은 통로로 연결한다">
      <rect x={60} y={238} width={540} height={20} rx={4} fill={C.surface} stroke={C.hair} strokeWidth={1.4} />
      <Text x={330} y={252} anchor="middle" role="note">
        패키지 기판
      </Text>
      <rect x={90} y={212} width={480} height={22} rx={4} fill="var(--fe)" fillOpacity={0.12} stroke="var(--fe)" strokeWidth={1.4} />
      <Text x={110} y={227} role="note" tone="fe">
        인터포저
      </Text>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={300 + i * 7} y1={214} x2={300 + i * 7} y2={232} stroke="var(--fe)" strokeWidth={1.2} strokeOpacity={0.9} />
      ))}
      <rect x={110} y={124} width={210} height={86} rx={10} fill={C.surface} stroke={C.ink} strokeWidth={1.6} />
      <Text x={215} y={162} anchor="middle" role="section">
        GPU
      </Text>
      <Text x={215} y={182} anchor="middle" role="note">
        계산 장치
      </Text>
      <rect x={sx} y={baseY} width={sw} height={14} rx={3} fill={C.surface} stroke={C.dim} strokeWidth={1.2} />
      {Array.from({ length: dies }, (_, i) => {
        const y = baseY - (i + 1) * (dieH + dieGap);
        return <rect key={i} x={sx} y={y} width={sw} height={dieH} rx={2.5} fill="var(--warn)" fillOpacity={0.18} stroke="var(--warn)" strokeWidth={1.1} />;
      })}
      {tsvX.map((x) => (
        <line key={x} x1={x} y1={baseY - dies * (dieH + dieGap) + 2} x2={x} y2={baseY + 12} stroke="var(--tip)" strokeWidth={2} />
      ))}
      <Text x={450} y={baseY - dies * (dieH + dieGap) - 10} anchor="middle" role="section">
        HBM
      </Text>
      <line x1={sx + sw + 4} y1={130} x2={540} y2={130} stroke={C.dim} />
      <Text x={544} y={126} role="note" tone="warn">
        D램 칩을
      </Text>
      <Text x={544} y={142} role="note" tone="warn">
        층층이 쌓음
      </Text>
      <line x1={500} y1={170} x2={540} y2={170} stroke={C.dim} />
      <Text x={544} y={166} role="note" tone="tip">
        TSV — 칩을 뚫어
      </Text>
      <Text x={544} y={182} role="note" tone="tip">
        수직으로 연결
      </Text>
      <line x1={sx + sw + 4} y1={203} x2={540} y2={203} stroke={C.dim} />
      <Text x={544} y={207} role="note">
        베이스(로직) 칩
      </Text>
      <line x1={340} y1={232} x2={340} y2={276} stroke={C.dim} />
      <Text x={346} y={286} role="note" tone="fe">
        GPU와 바로 옆에서 천 개가 넘는 선으로 연결
      </Text>
      <Text x={16} y={30} role="section">
        단면 개념도
      </Text>
      <Text x={16} y={50} role="note">
        통로 폭: HBM3E 1,024비트 → HBM4 2,048비트
      </Text>
      <Text x={16} y={68} role="note">
        대역폭 = 통로 폭 × 핀당 속도
      </Text>
    </Diagram>
  );
}

export function KvCacheBars() {
  const rows: { k: string; sub: string; gb: number; tone?: Tone }[] = [
    { k: "모델 가중치", sub: "16비트", gb: 140 },
    { k: "KV 캐시", sub: "1명 · 4K 토큰", gb: 1.34, tone: "fe" },
    { k: "KV 캐시", sub: "32명 · 4K 토큰", gb: 42.9, tone: "fe" },
    { k: "KV 캐시", sub: "32명 · 32K 토큰", gb: 343.6, tone: "bad" },
  ];
  const X = (gb: number) => (gb / 343.6) * 330;
  return (
    <Diagram h={226} label="대화 길이와 동시 사용자가 늘면 KV 캐시가 모델 가중치보다 더 큰 메모리를 차지할 수 있다">
      {rows.map((r, i) => {
        const y = 22 + i * 44;
        const w = Math.max(3, X(r.gb));
        return (
          <g key={r.sub}>
            <Text x={16} y={y + 14} role="section">
              {r.k}
            </Text>
            <Text x={16} y={y + 30} role="note">
              {r.sub}
            </Text>
            <rect x={196} y={y + 6} width={w} height={22} rx={6} fill={r.tone ? toneColor(r.tone) : C.dim} fillOpacity={r.tone ? 0.75 : 0.55} />
            <Text x={196 + w + 8} y={y + 22}>
              {`${r.gb >= 10 ? Math.round(r.gb) : r.gb.toFixed(1)} GB`}
            </Text>
          </g>
        );
      })}
      <Text x={16} y={204} role="note">
        Llama 2 70B 설정(80층 · KV 헤드 8 · 헤드 크기 128 · 16비트)으로 계산: 토큰당 약 0.33MB × 토큰 수 × 사용자 수
      </Text>
      <Text x={16} y={220} role="note">
        여러 장의 GPU에 나눠 담는 것이 보통이며, 양자화·PagedAttention 등으로 줄입니다.
      </Text>
    </Diagram>
  );
}
