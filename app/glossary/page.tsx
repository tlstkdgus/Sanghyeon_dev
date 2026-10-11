import Link from "next/link";

export const metadata = {
  title: "용어집",
  description:
    "Web3(gas, nonce, MEV, TVL)와 AI(토큰, 어텐션, RAG, 환각, KV 캐시)에서 자주 나오는 용어 정리.",
};

const web3Terms: [string, string][] = [
  ["ABI", "Application Binary Interface. 컨트랙트의 함수 시그니처를 기술한 JSON. Web3의 OpenAPI 명세에 해당."],
  ["Airdrop", "초기 사용자에게 토큰을 무상 배포하는 것. 마케팅이자 탈중앙화 수단."],
  ["AMM", "Automated Market Maker. 오더북 없이 x·y=k 같은 수식으로 가격을 결정하는 교환 방식."],
  ["Bridge", "체인 간 자산 이동 장치. 잠긴 자금 풀이 표적이 되어 보안상 가장 취약한 지점."],
  ["Composability", "조합 가능성. 허가 없이 다른 프로토콜 위에 쌓아 올릴 수 있는 성질. \"돈의 레고\"."],
  ["DA (Data Availability)", "데이터 가용성. 롤업 데이터를 누구나 받아볼 수 있음을 보장하는 것."],
  ["dApp", "Decentralized Application. 스마트 컨트랙트를 백엔드로 쓰는 앱."],
  ["EOA", "Externally Owned Account. 개인키로 제어되는 일반 지갑 계정. 컨트랙트 계정과 대비."],
  ["Faucet", "테스트넷 코인을 무료로 나눠주는 서비스. 개발 시작에 필수."],
  ["Finality", "최종성. 거래가 되돌려질 수 없게 확정되는 상태. 이더리움 PoS는 약 12.8분."],
  ["Flash Loan", "같은 트랜잭션 안에서 빌리고 갚는 무담보 대출. 차익거래와 공격 양쪽에 쓰임."],
  ["Gas", "EVM 연산 비용 단위. 수수료 = gasUsed × (baseFee + priorityFee)."],
  ["Gwei", "10⁻⁹ ETH. 가스 가격을 표기하는 단위."],
  ["Impermanent Loss", "비영구적 손실. AMM에 유동성을 공급했을 때 발생 가능한 기회비용 손실."],
  ["Mempool", "아직 블록에 포함되지 않은 대기 트랜잭션 저장소. 공개돼 있어 MEV의 원인이 됨."],
  ["MEV", "Maximal Extractable Value. 거래 순서를 조작해 추출하는 가치. 샌드위치 공격 등."],
  ["Multisig", "여러 개의 서명이 있어야 실행되는 지갑. 팀 자금 관리의 표준 (예: Safe)."],
  ["Nonce", "계정의 트랜잭션 순번. 재전송 공격 방지와 순서 보장에 사용."],
  ["Oracle", "체인 밖 데이터(가격 등)를 온체인으로 가져오는 장치. Chainlink가 대표."],
  ["Rug Pull", "개발자가 유동성을 빼고 잠적하는 사기 유형."],
  ["Sequencer", "L2에서 거래 순서를 정하는 주체. 대부분 아직 중앙화돼 있어 탈중앙화 과제로 남음."],
  ["Slashing", "PoS에서 부정행위를 한 검증자의 예치금을 몰수하는 벌칙."],
  ["Slippage", "예상 체결가와 실제 체결가의 차이. 스왑 UI에서 허용치를 설정."],
  ["TVL", "Total Value Locked. 프로토콜에 예치된 총 자산 가치. 규모 비교 지표."],
  ["Wei", "ETH의 최소 단위. 1 ETH = 10¹⁸ wei. 코드에서는 항상 wei(bigint)로 계산."],
];

const aiTerms: [string, string][] = [
  ["Agent (에이전트)", "목표를 받아 스스로 계획하고 도구를 호출하며 여러 단계를 수행하는 AI. 생각 → 행동 → 관찰을 반복합니다."],
  ["Attention (어텐션)", "각 토큰이 문장의 다른 토큰들에 얼마나 주목할지 비율을 정해 정보를 섞는 계산. 트랜스포머의 핵심."],
  ["Backpropagation (역전파)", "출력의 오차를 뒤에서 앞으로 거슬러 올라가며 각 가중치의 책임 몫을 계산하는 방법."],
  ["Base model (베이스 모델)", "사전학습만 마친 모델. 문서를 이어 쓰는 데 능하지만 질문에 답하는 형식은 아직 모릅니다."],
  ["Benchmark (벤치마크)", "모델들이 함께 치르는 공통 시험(예: MMLU). 포화·오염·업무와의 차이라는 한계가 있습니다."],
  ["Chain-of-Thought (단계별 사고)", "답 전에 중간 풀이 과정을 쓰게 해 추론 정확도를 높이는 프롬프트 기법."],
  ["Chunking (청킹)", "RAG에서 긴 문서를 검색 단위의 조각으로 자르는 일. 검색 품질을 크게 좌우합니다."],
  ["Context window (컨텍스트 윈도우)", "모델이 한 번에 다룰 수 있는 입력+출력 토큰의 최대치. 책상 넓이에 해당."],
  ["Contrastive learning (대조 학습)", "짝이 맞는 쌍은 가깝게, 무관한 쌍은 멀게 배치하도록 학습하는 방식. 문장 임베딩을 만드는 주된 방법."],
  ["Data leakage (데이터 누수)", "테스트 정보가 학습에 섞여 점수가 부풀려지는 문제. 벤치마크 오염도 같은 종류."],
  ["Decode (디코드)", "답을 한 토큰씩 생성하는 단계. 토큰마다 가중치를 다시 읽어야 해서 메모리 대역폭이 병목."],
  ["Distillation (증류)", "큰 모델의 출력을 작은 모델이 따라 배우게 해 작고 싼 모델을 만드는 기법."],
  ["Embedding (임베딩)", "단어·문장·이미지를 뜻이 비슷하면 가까운 좌표(벡터)로 바꾼 것."],
  ["F1 score", "정밀도와 재현율의 조화평균. 둘 중 하나만 높으면 낮게 나옵니다."],
  ["Few-shot (퓨샷)", "요청에 입력·정답 예시 몇 개를 보여주고 그 패턴을 따르게 하는 방식. 가중치는 바뀌지 않습니다."],
  ["Fine-tuning (파인튜닝)", "이미 학습된 모델을 추가 데이터로 더 학습시켜 행동을 바꾸는 일. 새 지식 주입에는 비효율적일 수 있습니다."],
  ["Gradient descent (경사하강법)", "손실이 줄어드는 방향으로 가중치를 조금씩 옮기는 학습 방법. 한 걸음의 크기가 학습률."],
  ["Hallucination (환각)", "사실이 아닌 내용을 그럴듯하게 단정하는 현상. 없앨 수 없어 과정으로 관리합니다."],
  ["HBM (고대역폭 메모리)", "D램을 수직으로 쌓아 TSV로 잇고 GPU 옆에 붙여 데이터 통로를 크게 넓힌 메모리."],
  ["Hyperparameter (하이퍼파라미터)", "학습 전에 사람이 정하는 설정. 학습률, 에포크 수 등."],
  ["Inference (추론)", "학습된 모델로 새 입력에 답을 내는 단계. 사용자가 쓸 때마다 일어납니다."],
  ["Knowledge cutoff (지식 컷오프)", "학습 데이터를 모은 시점. 그 이후의 일은 모델이 모릅니다."],
  ["KV cache (KV 캐시)", "앞 토큰들의 키·밸류를 저장해 재계산을 피하는 메모리. 대화 길이와 동시 사용자 수에 비례해 커집니다."],
  ["LLM (대규모 언어 모델)", "방대한 텍스트로 다음 토큰 예측을 학습한, 글을 생성하는 대형 신경망."],
  ["LLM-as-a-judge", "LLM을 채점관으로 쓰는 자동 평가. 위치 편향·장황함 선호·자기 선호가 있습니다."],
  ["LoRA", "원래 가중치는 고정하고 작은 보정 부품만 학습하는 효율적 파인튜닝 방법."],
  ["Loss function (손실 함수)", "예측이 정답과 얼마나 다른지를 숫자 하나로 나타낸 것. 학습은 이 값을 줄이는 일."],
  ["MCP (Model Context Protocol)", "AI 앱(클라이언트)과 외부 도구·자료(서버)를 잇는 표준 연결 규격."],
  ["Overfitting (과적합)", "학습 데이터는 잘 맞히지만 새 데이터에서 성능이 떨어지는 상태. 기출 답만 외운 학생."],
  ["Parameter (파라미터)", "학습으로 정해지는 가중치·편향 값. 모델 크기를 말할 때 세는 단위."],
  ["Precision (정밀도)", "양성이라고 한 것 중 실제 양성의 비율. 경보를 얼마나 믿을 수 있는가."],
  ["Prefill (프리필)", "입력 전체를 한꺼번에 읽어 들이는 단계. 계산이 병목."],
  ["Pre-training (사전학습)", "방대한 텍스트로 다음 토큰을 맞히며 언어와 지식을 익히는 첫 학습 단계. 자기지도학습."],
  ["Prompt injection (프롬프트 인젝션)", "입력이나 AI가 읽는 자료 속 지시로 모델의 행동을 조작하는 공격. OWASP LLM Top 10의 1번."],
  ["Quantization (양자화)", "숫자를 더 적은 비트로 표현해 모델을 작게 만드는 기술. 정확도를 일부 내줍니다."],
  ["RAG (검색 증강 생성)", "질문에 맞는 문서를 찾아 프롬프트에 넣고 그것을 근거로 답하게 하는 구조."],
  ["Reasoning model (추론 모델)", "답 전에 긴 사고 과정을 생성하도록 강화학습된 모델. 어려운 문제에 강하지만 느리고 비쌉니다."],
  ["Recall (재현율)", "실제 양성 중 잡아낸 비율. 얼마나 놓치지 않는가."],
  ["RLHF", "사람의 답 비교로 채점 모델을 만들고, 그 점수가 높아지도록 강화학습하는 방법."],
  ["Self-attention (셀프 어텐션)", "같은 문장 안의 토큰끼리 서로를 쳐다보는 어텐션."],
  ["Self-supervised learning (자기지도학습)", "정답을 데이터 자체에서 만들어 배우는 방식. 가려둔 다음 단어 맞히기 등."],
  ["SFT (지도 미세조정)", "질문 → 모범 답안 쌍으로 추가 학습해 답하는 형식을 익히게 하는 단계. 지시 학습이라고도 합니다."],
  ["Sycophancy (아첨)", "사실보다 사용자 의견에 맞춰 주는 경향. 선호 학습의 부작용으로 생길 수 있습니다."],
  ["Temperature (온도)", "확률 분포를 뾰족하게(낮음) 또는 평평하게(높음) 만드는 생성 설정. 사실 정확도와는 무관."],
  ["Token (토큰)", "모델이 처리하는 텍스트의 단위. 요금·길이 제한·속도를 모두 토큰으로 셉니다."],
  ["Tokenizer (토크나이저)", "글을 토큰 조각으로 자르고 번호를 붙이는 장치. 요즘은 주로 서브워드(BPE) 방식."],
  ["Tool calling (도구 호출)", "모델이 정해진 형식의 호출 요청을 쓰면 호스트 프로그램이 실행하고 결과를 돌려주는 방식."],
  ["Top-p (nucleus sampling)", "확률 높은 순으로 더해 p에 이를 때까지의 후보만 남겨 그중에서 고르는 방식."],
  ["Transformer (트랜스포머)", "셀프 어텐션으로 모든 토큰을 동시에 처리하는 신경망 구조. 2017년 제안, 지금 LLM의 뼈대."],
  ["TSV (실리콘 관통 전극)", "칩에 미세한 구멍을 뚫어 위아래로 쌓은 칩들을 직접 연결하는 기술. HBM의 핵심."],
];

const sections: { slug: string; name: string; terms: [string, string][] }[] = [
  { slug: "web3", name: "Web3", terms: web3Terms },
  { slug: "ai", name: "AI · ML", terms: aiTerms },
];

export default function GlossaryPage() {
  return (
    <main className="mx-auto max-w-[75rem] px-5 pb-16 sm:px-8">
      <header className="py-16 sm:py-24">
        <p className="text-caption font-medium text-ink-dim">부록</p>
        <h1 className="mt-4 text-[2.5rem] font-medium leading-[1.02] tracking-[-0.05em] text-ink sm:text-display-lg">
          용어집
        </h1>
        <p className="mt-6 max-w-[42ch] text-body-lg text-ink-muted">
          읽다가 막히는 단어가 나오면 여기서 찾아보세요. Ctrl+F로 검색하면
          빠릅니다.
        </p>
        <nav className="mt-8 flex flex-wrap gap-2.5">
          {sections.map((sec) => (
            <a
              key={sec.slug}
              href={`#${sec.slug}`}
              className="rounded-pill bg-surface-1 px-4 py-2 text-button font-medium text-ink transition-colors hover:bg-surface-2"
            >
              {sec.name} · {sec.terms.length}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-16">
        {sections.map((sec) => (
          <section key={sec.slug} id={sec.slug} className="scroll-mt-24">
            <div className="mb-6 flex items-baseline gap-4">
              <h2 className="text-display-md text-ink">{sec.name}</h2>
              <Link
                href={`/${sec.slug}`}
                className="text-caption text-ink-dim transition-colors hover:text-ink"
              >
                주제 목차 →
              </Link>
            </div>
            <dl className="max-w-[52rem] overflow-hidden rounded-lg border border-hairline">
              {sec.terms.map(([term, def]) => (
                <div
                  key={term}
                  className="grid gap-x-6 gap-y-1 border-b border-hairline-soft bg-surface-1 px-5 py-4 last:border-b-0 sm:grid-cols-[13rem_1fr]"
                >
                  <dt className="font-mono text-body-sm text-ink">{term}</dt>
                  <dd className="text-body-sm text-ink-muted">{def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
