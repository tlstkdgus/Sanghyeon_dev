/**
 * 사이트 전체의 단일 출처(single source of truth).
 *
 * 주제(Topic) → 챕터(Doc) 2단계 구조입니다.
 * 사이드바, 검색, 이전/다음 네비게이션, generateStaticParams가 전부 이 파일을 읽습니다.
 * 순서·제목·slug는 여기서만 바꾸세요.
 *
 * 챕터를 추가하려면:
 *   1. content/{topic}/{slug}.ts 작성 (Block[] default export)
 *   2. 아래 docs 배열에 항목 추가
 *   3. npm run build 로 정적 경로 생성 확인
 */

export type TopicStatus = "active" | "planned";

export type Topic = {
  slug: string;
  name: string;
  /** 홈 카드 한 줄 요약 */
  tagline: string;
  /** 주제 페이지 도입부 */
  intro: string;
  status: TopicStatus;
  /** 파트 구분. 순서대로 사이드바 그룹이 됩니다. */
  parts: { key: string; name: string }[];
  /** status가 "planned"일 때 주제 페이지에 보여줄 예정 목차 */
  outline?: string[];
};

export type Doc = {
  topic: string;
  slug: string;
  num: number;
  title: string;
  desc: string;
  /** Topic.parts의 key */
  partKey: string;
  minutes: number;
  tags: string[];
};

export const topics: Topic[] = [
  {
    slug: "web3",
    name: "Web3",
    tagline: "블록체인을 아예 모르는 상태에서 시작하는 13장",
    intro:
      "해시 함수부터 wagmi/viem 실전 코드, 2026년 생태계 현황과 비판론까지. 이미 쓰던 도구·패턴에 매핑해 가며 읽습니다.",
    status: "active",
    parts: [
      { key: "p1", name: "블록체인의 원리" },
      { key: "p2", name: "이더리움" },
      { key: "p3", name: "확장성" },
      { key: "p4", name: "프론트엔드 실무" },
      { key: "p5", name: "생태계와 현실" },
    ],
  },
  {
    slug: "data",
    name: "데이터 · 지식 표현",
    tagline: "모델링부터 그래프, 검색, 계보까지",
    intro:
      "테이블을 만들 줄은 아는데 왜 그렇게 만드는지는 설명하기 어려웠던 것들. 데이터에 의미를 붙이는 방법과, 그 의미가 조직 안에서 깨지는 지점을 다룹니다.",
    status: "active",
    parts: [
      { key: "p1", name: "표현과 모델링" },
      { key: "p2", name: "관계와 의미" },
      { key: "p3", name: "검색" },
      // p4(운영과 신뢰 — 계보 · 데이터 계약 · 개인정보)는 아직 챕터가 없습니다.
      // groupedDocs가 빈 파트를 걸러내므로, 등록만 해두고 글이 생기면 docs에 추가합니다.
      { key: "p4", name: "운영과 신뢰" },
    ],
  },
  {
    slug: "backend",
    name: "백엔드 · 인프라",
    tagline: "DB, 네트워크, 컨테이너, 분산 시스템",
    intro:
      "API 너머로 넘어갈 때 매번 막히는 것들. 인덱스가 왜 느려지는지, 컨테이너가 실제로 무엇인지부터.",
    status: "planned",
    parts: [
      { key: "p1", name: "데이터베이스" },
      { key: "p2", name: "네트워크" },
      { key: "p3", name: "배포와 운영" },
      { key: "p4", name: "분산 시스템" },
    ],
    outline: [
      "인덱스는 왜 어떤 쿼리만 빠르게 하는가",
      "트랜잭션 격리 수준과 실제로 겪는 이상 현상",
      "N+1과 커넥션 풀 고갈",
      "TCP 핸드셰이크부터 TLS까지, 요청 하나의 생애",
      "컨테이너는 가상머신이 아니다 — namespace와 cgroup",
      "쿠버네티스: Pod, Service, Ingress의 최소 이해",
      "캐시 무효화 전략과 stale-while-revalidate",
      "CAP와 최종 일관성이 실무에서 뜻하는 것",
    ],
  },
  {
    slug: "cs",
    name: "CS 기초",
    tagline: "OS, 자료구조, 컴파일러, 네트워킹 이론",
    intro:
      "전공으로 배우지 않고 지나쳤지만, 성능 문제를 만날 때마다 발목을 잡는 기초. 실제로 코드에 나타나는 지점 위주로.",
    status: "planned",
    parts: [
      { key: "p1", name: "운영체제" },
      { key: "p2", name: "자료구조와 알고리즘" },
      { key: "p3", name: "언어와 런타임" },
    ],
    outline: [
      "프로세스 · 스레드 · 이벤트 루프의 관계",
      "메모리 계층과 캐시 지역성이 만드는 100배 차이",
      "Big-O를 실제 실행 시간으로 번역하기",
      "해시 테이블이 O(1)이 아닐 때",
      "가비지 컬렉터가 멈추는 순간",
      "컴파일 · 트랜스파일 · JIT의 경계",
      "유니코드, UTF-8, 그리고 문자열 길이라는 거짓말",
    ],
  },
  {
    slug: "ai",
    name: "AI · ML",
    tagline: "학습 원리부터 LLM, RAG, 에이전트, 검증까지 15장",
    intro:
      "AI를 쓰는 것 이상으로 내려가 봅니다. 기계가 예시로 배우는 원리, 토큰과 어텐션, 모델이 만들어지는 단계, 그리고 모델이 왜 틀리고 어떻게 확인하는지까지.",
    status: "active",
    parts: [
      { key: "p1", name: "언어 모델의 원리" },
      { key: "p2", name: "애플리케이션 패턴" },
      { key: "p3", name: "평가와 한계" },
      { key: "p4", name: "하드웨어" },
    ],
    // 검색 계층(역색인 · 벡터 저장소 운영 · 하이브리드 융합)은 data 주제에서 다룹니다.
    // 여기서는 "모델이 데이터를 어떻게 다루는가"만 봅니다.
  },
];

export const docs: Doc[] = [
  {
    topic: "web3",
    slug: "what-is-web3",
    num: 1,
    title: "Web3란 무엇인가",
    desc: "인스타그램 계정이 정지되면 왜 내가 아무것도 못 할까요? 그 답에서 시작하는, 마케팅 수사를 걷어낸 진짜 정의.",
    partKey: "p1",
    minutes: 8,
    tags: ["개념", "입문"],
  },
  {
    topic: "web3",
    slug: "blockchain",
    num: 2,
    title: "블록체인 구조: 해시와 체인",
    desc: "데이터의 \"지문\"을 찍는 해시 함수부터, 페이지를 사슬로 엮는 방법까지. 직접 조작해보며 왜 위조가 불가능한지 확인합니다.",
    partKey: "p1",
    minutes: 12,
    tags: ["실습", "핵심"],
  },
  {
    topic: "web3",
    slug: "consensus",
    num: 3,
    title: "합의 알고리즘과 트릴레마",
    desc: "관리자 없이 수만 대의 컴퓨터가 어떻게 같은 결론에 도달할까요. 전기를 태우는 방식과 돈을 거는 방식, 두 가지 답.",
    partKey: "p1",
    minutes: 9,
    tags: ["개념"],
  },
  {
    topic: "web3",
    slug: "wallet",
    num: 4,
    title: "지갑과 키: 계정의 정체",
    desc: "왜 아무도 내 계정을 뺏을 수 없는지. 열쇠·설계도·계좌번호에 비유해 개인키·시드구문·주소의 관계를 풀어씁니다.",
    partKey: "p1",
    minutes: 10,
    tags: ["보안", "인증"],
  },
  {
    topic: "web3",
    slug: "evm",
    num: 5,
    title: "EVM과 계정 모델",
    desc: "이더리움에 얹힌 \"전 세계가 함께 쓰는 컴퓨터\"는 어떻게 다른가. 일반 지갑과 프로그램 계정의 차이.",
    partKey: "p2",
    minutes: 8,
    tags: ["이더리움"],
  },
  {
    topic: "web3",
    slug: "gas",
    num: 6,
    title: "트랜잭션과 가스",
    desc: '수수료 계산기로 직접 확인하는 2026년 실제 비용. "이더리움은 비싸다"는 이제 틀린 전제입니다.',
    partKey: "p2",
    minutes: 11,
    tags: ["실습", "2026 업데이트"],
  },
  {
    topic: "web3",
    slug: "contracts",
    num: 7,
    title: "스마트 컨트랙트와 ERC 표준",
    desc: "자판기에 비유하면 이해되는 자동 실행 프로그램. \"허가 후 실행\"이라는 번거로운 절차가 왜 생겼는지도 함께.",
    partKey: "p2",
    minutes: 14,
    tags: ["핵심", "표준"],
  },
  {
    topic: "web3",
    slug: "layer2",
    num: 8,
    title: "L2와 롤업, 체인 지형도",
    desc: "계산대가 하나뿐이라 밀리던 문제를 어떻게 풀었는가. 두 가지 롤업 방식과 2026년 체인 지도.",
    partKey: "p3",
    minutes: 12,
    tags: ["확장성", "2026 업데이트"],
  },
  {
    topic: "web3",
    slug: "architecture",
    num: 9,
    title: "Web3 앱 아키텍처와 스택",
    desc: "이런 서비스는 실제로 어떻게 만들어질까요. 기존 웹 개발 지식 중 그대로 쓰이는 것과 새로 필요한 것을 나눠봅니다.",
    partKey: "p4",
    minutes: 11,
    tags: ["프론트엔드", "핵심"],
  },
  {
    topic: "web3",
    slug: "code",
    num: 10,
    title: "실전 코드: wagmi + viem",
    desc: "코드를 몰라도 읽히도록 설명을 먼저 답니다. 설정부터 지갑 연결, 값 읽기/쓰기, 실시간 알림, 서명 로그인까지 8가지.",
    partKey: "p4",
    minutes: 18,
    tags: ["코드", "실무"],
  },
  {
    topic: "web3",
    slug: "solidity",
    num: 11,
    title: "Solidity와 함정 12가지",
    desc: "실제 프로그램 코드가 어떻게 생겼는지, 6천만 달러가 털린 진짜 해킹 사례, 그리고 직접 만들어보고 싶을 때의 학습 순서.",
    partKey: "p4",
    minutes: 16,
    tags: ["코드", "로드맵"],
  },
  {
    topic: "web3",
    slug: "ecosystem",
    num: 12,
    title: "생태계: DeFi · NFT · DAO · 스테이블코인",
    desc: "은행 없이 돈을 빌리고 빌려주는 법부터, 거품이 꺼진 뒤 NFT가 실제로 쓰이는 곳까지. 2026년 검증된 수치와 함께.",
    partKey: "p5",
    minutes: 15,
    tags: ["생태계", "2026 업데이트"],
  },
  {
    topic: "web3",
    slug: "risk",
    num: 13,
    title: "리스크와 비판론",
    desc: '해킹 통계, 사기 유형, 그리고 "이거 사실 연극 아니야?"라는 비판까지. 균형을 위해 반드시 읽어야 할 장.',
    partKey: "p5",
    minutes: 12,
    tags: ["보안", "비판"],
  },

  /* ---------------- data ---------------- */

  {
    topic: "data",
    slug: "data-models",
    num: 1,
    title: "데이터 모델의 계보",
    desc: "데이터베이스가 정보를 정리하는 방식은 왜 여러 가지일까요. 관계형이 오래 버틴 이유부터 시작합니다.",
    partKey: "p1",
    minutes: 10,
    tags: ["개념", "입문"],
  },
  {
    topic: "data",
    slug: "normalization",
    num: 2,
    title: "정규화와, 그것을 깨는 순간",
    desc: "같은 사실을 두 곳에 적어두면 왜 문제가 생기는지, 그리고 일부러 중복을 남겨두는 세 가지 경우.",
    partKey: "p1",
    minutes: 12,
    tags: ["모델링", "핵심"],
  },
  {
    topic: "data",
    slug: "schema-on-read",
    num: 3,
    title: "스키마 온 라이트 vs 스키마 온 리드",
    desc: "옷장 정리에 비유하면 쉬운, \"넣기 전에 정리\"와 \"일단 다 넣기\"의 차이. 2026년 현황과 함께.",
    partKey: "p1",
    minutes: 11,
    tags: ["아키텍처", "2026 업데이트"],
  },
  {
    topic: "data",
    slug: "identifiers",
    num: 4,
    title: "식별자 설계",
    desc: "고유 번호는 한 번 정하면 못 바꿉니다. 이메일을 대표 번호로 쓰면 안 되는 이유부터, 무작위 번호가 검색을 느리게 만드는 이유까지.",
    partKey: "p1",
    minutes: 9,
    tags: ["모델링", "실무"],
  },
  {
    topic: "data",
    slug: "graph-model",
    num: 5,
    title: "그래프 데이터 모델",
    desc: "친구의 친구의 친구를 찾을 때, 표를 이어붙이는 방식과 실제로 선을 따라가는 방식은 왜 이렇게 다를까요.",
    partKey: "p2",
    minutes: 12,
    tags: ["그래프", "핵심"],
  },
  {
    topic: "data",
    slug: "ontology",
    num: 6,
    title: "온톨로지와 지식 그래프",
    desc: "관공서 신청서 양식에 비유하면 쉬운 개념. 저장 규칙과 뭐가 다른지, 그리고 AI에게 왜 중요한지.",
    partKey: "p2",
    minutes: 14,
    tags: ["개념", "RAG"],
  },
  {
    topic: "data",
    slug: "semantic-layer",
    num: 7,
    title: "시맨틱 레이어",
    desc: "회의 때마다 숫자가 안 맞는 이유. 「활성 사용자」 같은 지표의 정의를 한 곳에 고정해두는 법.",
    partKey: "p2",
    minutes: 11,
    tags: ["실무", "협업"],
  },
  {
    topic: "data",
    slug: "keyword-search",
    num: 8,
    title: "키워드 검색은 어떻게 동작하는가",
    desc: "\"글자가 포함됐는지\" 찾는 게 왜 느려지는지부터, \"검색\"과 \"검색했다\"를 같이 찾아주는 한국어만의 난관까지.",
    partKey: "p3",
    minutes: 12,
    tags: ["검색", "한국어"],
  },
  {
    topic: "data",
    slug: "vector-search",
    num: 9,
    title: "임베딩과 벡터 검색",
    desc: "\"강아지\"로 검색해도 \"반려견\" 글을 찾아주는 원리. 정확하지 않아도 되는 이유와, 품번 검색에 약한 이유.",
    partKey: "p3",
    minutes: 13,
    tags: ["검색", "AI"],
  },
  {
    topic: "data",
    slug: "hybrid-search",
    num: 10,
    title: "하이브리드 검색과 리랭킹",
    desc: "점수 기준이 다른 두 검색 결과를 순위만으로 합치는 법. 어디까지 정교하게 만들지는 결국 기다리는 시간과의 거래입니다.",
    partKey: "p3",
    minutes: 10,
    tags: ["검색", "실무"],
  },
  {
    topic: "data",
    slug: "lineage",
    num: 11,
    title: "데이터 계보",
    desc: "\"이 숫자 어디서 나온 거예요?\"에 답하는 법. 식재료 원산지 추적에 비유하면 쉬운, 데이터가 흘러온 길의 기록.",
    partKey: "p4",
    minutes: 11,
    tags: ["운영", "핵심"],
  },
  {
    topic: "data",
    slug: "data-contract",
    num: 12,
    title: "데이터 계약",
    desc: "어느 날 아침 대시보드가 비어 있는 이유. 부품 납품 규격서처럼, 데이터에도 지켜야 할 약속을 못 박아두는 방법.",
    partKey: "p4",
    minutes: 12,
    tags: ["운영", "협업"],
  },
  {
    topic: "data",
    slug: "privacy",
    num: 13,
    title: "개인정보와 데이터 최소화",
    desc: "안 가진 데이터는 유출될 수 없습니다. 개인정보·가명정보·익명정보의 차이와 2026년 바뀐 기준까지. (법률 자문 아님)",
    partKey: "p4",
    minutes: 13,
    tags: ["개인정보", "2026 업데이트"],
  },

  /* ---------------- ai ---------------- */

  {
    topic: "ai",
    slug: "ml-basics",
    num: 1,
    title: "머신러닝: 규칙 대신 예시로 배운다",
    desc: "규칙을 일일이 적어주는 대신 예시를 잔뜩 보여주면 무슨 일이 생길까요. 지도·비지도·강화학습, 과적합, 그리고 정확도 99%가 쓸모없는 경우까지.",
    partKey: "p1",
    minutes: 14,
    tags: ["개념", "입문"],
  },
  {
    topic: "ai",
    slug: "neural-network",
    num: 2,
    title: "신경망은 어떻게 배우는가",
    desc: "틀린 만큼 조금씩 고칩니다. 가중치·손실·경사하강법·역전파를 수식 없이 풀고, 문장을 다루던 옛 방식이 어디서 막혔는지까지.",
    partKey: "p1",
    minutes: 13,
    tags: ["개념", "핵심"],
  },
  {
    topic: "ai",
    slug: "tokenizer",
    num: 3,
    title: "토크나이저와 컨텍스트 윈도우",
    desc: "모델이 실제로 읽는 텍스트의 단위. 같은 내용이 한국어로 쓰면 왜 더 비싸지는지, 긴 대화에서 앞부분을 놓치는 이유까지.",
    partKey: "p1",
    minutes: 12,
    tags: ["핵심", "비용"],
  },
  {
    topic: "ai",
    slug: "transformer",
    num: 4,
    title: "트랜스포머와 어텐션을 수식 없이",
    desc: "문장 속 단어들이 서로를 쳐다보며 뜻을 정하는 방식. 2017년 논문 한 편이 지금의 AI를 만든 이유.",
    partKey: "p1",
    minutes: 13,
    tags: ["핵심", "원리"],
  },
  {
    topic: "ai",
    slug: "llm-training",
    num: 5,
    title: "LLM은 어떻게 만들어지는가",
    desc: "사전학습 → 지시 학습 → 사람 피드백, 그리고 '생각하는 모델'까지. 단계마다 모델의 무엇이 바뀌는지.",
    partKey: "p1",
    minutes: 14,
    tags: ["핵심", "학습"],
  },
  {
    topic: "ai",
    slug: "generation",
    num: 6,
    title: "답은 한 토큰씩 뽑힌다",
    desc: "같은 질문에 답이 매번 다른 이유. 온도·top-p 같은 손잡이, 그리고 모델이 모르는 최신 정보.",
    partKey: "p1",
    minutes: 11,
    tags: ["원리", "실무"],
  },
  {
    topic: "ai",
    slug: "embedding",
    num: 7,
    title: "임베딩은 어떻게 만들어지는가",
    desc: "뜻이 비슷하면 가까운 좌표에 놓이도록 학습시키는 법. 저장과 검색 운영은 데이터 주제 9장에서 이어집니다.",
    partKey: "p2",
    minutes: 11,
    tags: ["임베딩", "원리"],
  },
  {
    topic: "ai",
    slug: "prompting",
    num: 8,
    title: "프롬프트 설계의 원칙",
    desc: "역할·맥락·제약·형식·예시. 단계별로 생각하게 하기부터 일을 쪼개 시키기까지, 효과가 확인된 방법만 추렸습니다.",
    partKey: "p2",
    minutes: 15,
    tags: ["실무", "핵심"],
  },
  {
    topic: "ai",
    slug: "adapt-strategy",
    num: 9,
    title: "프롬프트 · RAG · 파인튜닝 중 무엇을 언제",
    desc: "모델을 다시 학습시키지 않고 풀 수 있는 범위는 생각보다 넓습니다. '지식이 없는 문제'와 '행동이 틀린 문제'를 구분하면 답이 보입니다.",
    partKey: "p2",
    minutes: 11,
    tags: ["설계", "실무"],
  },
  {
    topic: "ai",
    slug: "rag",
    num: 10,
    title: "RAG 파이프라인의 실패 지점들",
    desc: "찾아서 읽고 답하기. 자르기·찾기·답하기 단계마다 어디서 틀어지는지, 그리고 어느 단계가 범인인지 가려내는 법.",
    partKey: "p2",
    minutes: 13,
    tags: ["RAG", "실무"],
  },
  {
    topic: "ai",
    slug: "agents",
    num: 11,
    title: "에이전트, 도구 호출, MCP",
    desc: "대답하는 AI에서 일하는 AI로. 모델이 도구를 '쓰는' 진짜 원리와 표준 연결 규격, 그리고 사고가 커지는 지점.",
    partKey: "p2",
    minutes: 14,
    tags: ["에이전트", "2026 업데이트"],
  },
  {
    topic: "ai",
    slug: "hallucination",
    num: 12,
    title: "환각은 버그가 아니라 성질이다",
    desc: "모르는데도 그럴듯하게 답하는 이유는 고장이 아니라 만들어진 방식에 있습니다. 줄이는 법과 잡아내는 법.",
    partKey: "p3",
    minutes: 12,
    tags: ["한계", "핵심"],
  },
  {
    topic: "ai",
    slug: "evaluation",
    num: 13,
    title: "AI 결과를 검증하는 법",
    desc: "벤치마크 점수의 함정부터, 실제 일에서 AI가 낸 결과물을 확인하는 체크리스트와 고쳐 시키는 법까지.",
    partKey: "p3",
    minutes: 13,
    tags: ["평가", "실무"],
  },
  {
    topic: "ai",
    slug: "ai-safety",
    num: 14,
    title: "보안 · 윤리 · 규제",
    desc: "문서 속에 숨은 지시, 새어 나가는 개인정보, 저작권과 편향, 그리고 2026년 한국·유럽의 AI 법. (법률 자문 아님)",
    partKey: "p3",
    minutes: 14,
    tags: ["보안", "2026 업데이트"],
  },
  {
    topic: "ai",
    slug: "ai-memory",
    num: 15,
    title: "AI는 왜 메모리를 먹는가",
    desc: "계산이 아니라 '데이터 나르기'가 병목입니다. GPU·HBM·KV 캐시로 보는 AI 하드웨어의 진짜 제약.",
    partKey: "p4",
    minutes: 13,
    tags: ["하드웨어", "2026 업데이트"],
  },
];

/* ---------------- 조회 헬퍼 ---------------- */

export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);

export const docsOf = (topicSlug: string) =>
  docs.filter((d) => d.topic === topicSlug).sort((a, b) => a.num - b.num);

export const findDoc = (topicSlug: string, docSlug: string) =>
  docs.find((d) => d.topic === topicSlug && d.slug === docSlug);

/** 같은 주제 안에서의 이전/다음 */
export const neighbors = (topicSlug: string, docSlug: string) => {
  const list = docsOf(topicSlug);
  const i = list.findIndex((d) => d.slug === docSlug);
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
};

/** 사이드바용: 파트별로 묶은 챕터 목록 (빈 파트는 제외) */
export const groupedDocs = (topic: Topic) =>
  topic.parts
    .map((part) => ({
      part,
      items: docsOf(topic.slug).filter((d) => d.partKey === part.key),
    }))
    .filter((g) => g.items.length > 0);

export const minutesOf = (topicSlug: string) =>
  docsOf(topicSlug).reduce((a, d) => a + d.minutes, 0);

export const activeTopics = () => topics.filter((t) => t.status === "active");
