// ============================================
// 프로젝트 데이터 파일
// 이 파일만 수정하면 사이드바와 그리드가 자동 업데이트됩니다.
// ============================================
//
// 폴더 구조:
// images/
// ├── digital-religion/
// │   ├── thumb.jpg          ← 썸네일
// │   ├── 01.jpg             ← 상세 이미지
// │   ├── 02.jpg
// │   └── ...
// ├── language-contagion/
// │   ├── thumb.jpg
// │   └── ...
// └── ...
//
// * 이미지는 원본 비율 그대로 표시됩니다
// * 태그는 script.js의 categoryTags에서 관리
//
// ============================================

const projectsData = {
  // ========== Work Experience ==========
  "descente-social": {
    titleEn: "Descente SNS Promotion Design",
    titleKr: "데상트 SNS 프로모션 디자인",
    date: "2025.03-08",
    area: "Social Media, Visual Design",
    areaKr: "소셜 미디어, 비주얼 디자인",
    director: "Soojung Kim",
    directorKr: "김수정",
    collaborator: "",
    descEn:
      "Visuals were created for Descente Korea’s social media, along with content for various digital platforms. The images were adapted from the key visuals of an existing promotional exhibition.",
    descKr:
      "데상트 코리아의 소셜 미디어를 위한 비주얼을 제작하고, 다양한 디지털 플랫폼에 활용되는 콘텐츠를 제작하였다. 기존 기획전의 키 비주얼을 기반으로 SNS 환경에 맞는 이미지를 전개하였다.",
    thumbnail: "images/decente-social/thumb.webp",
    media: [
      "col2:images/decente-social/02-2.webp",
      "col2:images/decente-social/02-1.webp",
      "full:images/decente-social/03-4.webp",
      "col3:images/decente-social/03-1.webp",
      "col3:images/decente-social/03-2.webp",
      "col3:images/decente-social/03-3.webp",
      "gif:col2:images/decente-social/05-1.mp4",
      "gif:col2:images/decente-social/05-2.mp4",
      "full:images/decente-social/06.webp",
      "col2:images/decente-social/04-1.gif",
      "col2:images/decente-social/04-2.gif",
    ],
  },
  /*
  "descente-exhibition": {

    titleEn: "Descente Seasonal Exhibition",
    titleKr: "데상트 시즌 기획전",
    date: "2025.05",
    area: "Exhibition Design, Web Design",
    director: "",
    collaborator: "",
    descEn:
      "Seasonal exhibition design for Descente Korea, featuring curated product showcases and brand storytelling.",
    descKr:
      "데상트 코리아 시즌 기획전 디자인, 큐레이션된 제품 쇼케이스와 브랜드 스토리텔링.",
    thumbnail: "",
    media: [],
  },
  */
  "collection-renewal": {
    titleEn: "The Collection Renewal",
    titleKr: "더 컬렉션 리뉴얼",
    date: "2024.05",
    area: "Brand Identity, Website, SNS Contents, Fashion Assets",
    areaKr: "브랜드 아이덴티티, 웹사이트, SNS 콘텐츠, 패션 에셋",
    director: "",
    collaborator: "",
    descEn:
      "THE COLLECTION is a Seoul-based fashion brand that breaks down the boundaries between art and everyday life, proposing new fashion experiences through experimental design and the creative works of emerging designers. Starting with the brand identity renewal, we planned and designed interview pages capturing the philosophies and design processes of emerging designers, structured detailed pages introducing curated collections, and managed the visual consistency and user experience of the entire website.",
    descKr:
      "THE COLLECTION은 예술과 일상의 경계를 허물고, 실험적인 디자인과 신진 디자이너들의 창의적인 작품을 통해 새로운 패션 경험을 제안하는 서울 기반의 패션 브랜드이다. 브랜드 아이덴티티 리뉴얼을 시작으로, 신진 디자이너들의 철학과 디자인 과정을 담은 인터뷰 페이지를 기획·디자인하며, 큐레이션된 컬렉션을 소개하는 상세 페이지를 구성하고, 전체 웹사이트의 시각적 일관성과 사용자 경험을 관리하고 있다.",
    thumbnail: "images/collection-renewal/thumb.gif",
    media: [
      "col2:images/collection-renewal/04-1.gif",
      "col2:images/collection-renewal/04-2.gif",
      "full:images/collection-renewal/01-1.webp",
      "col2:images/collection-renewal/01-2.webp",
      "col2:images/collection-renewal/01-3.webp",
      "col2:images/collection-renewal/02-1.webp",
      "col2:images/collection-renewal/02-2.webp",
      "col2:images/collection-renewal/02-3.webp",
      "col2:images/collection-renewal/02-4.webp",
      "gif:full:images/collection-renewal/03.mp4",
      "col2:images/collection-renewal/05-2.webp",
      "col2:images/collection-renewal/05-1.webp",
      "col2:images/collection-renewal/05-3.webp",
      "col2:images/collection-renewal/05-4.webp",
      "full:images/collection-renewal/06.webp",
    ],
  },
  "galleria-2023": {
    titleEn: "Galleria 2023 E-Day",
    titleKr: "갤러리아 2023 하반기 E-DAY",
    date: "2023.08",
    area: "Event Design, Visual Identity, Online & Offline banner, Promotion Video, Leaflet",
    areaKr: "이벤트 디자인, 비주얼 아이덴티티, 온·오프라인 배너, 프로모션 영상, 리플릿",
    director: "Junhoe Kim",
    directorKr: "김준회",
    collaborator: "",
    descEn:
      "《Just arrived》 is an exclusive day event for VIP and MASS audiences, presenting Galleria Department Store’s exclusive new arrivals for the second half of 2023 as a new season begins. To visualize the luxurious and richly diverse character of the event, the visual identity employs lettering inspired by prisms and gemstones, along with four distinct colors as its main graphic elements.",
    descKr:
      "《Just arrived》는 2023년 하반기, 새로운 시즌이 시작됨에 따라 갤러리아 백화점만의 독점 신상품들을 선보이는 VIP 및 MASS 대상의 exclusive day 행사이다. 럭셔리하고, 다채로운 상품이 가득한 행사의 특성을 시각화하기 위해 프리즘과 보석을 연상시키는 레터링과 4가지의 컬러를 메인 그래픽 아이덴티티 요소로 활용한다.",
    thumbnail: "images/galleria/thumb.gif",
    media: [
      "col3:images/galleria/02-1.webp",
      "col3:images/galleria/02-2.webp",
      "col3:images/galleria/02-3.webp",
      "gif:col2:images/galleria/01-1.mp4",
      "gif:col2:images/galleria/01-2.mp4",
      "col2:images/galleria/02-4.webp",
      "col2:images/galleria/02-5.webp",
      "full:images/galleria/03.webp",
      "col2:images/galleria/04-1.webp",
      "col2:images/galleria/04-2.webp",
      "full:images/galleria/06.webp",
      "col2:images/galleria/07-1.webp",
      "col2:images/galleria/07-2.webp",
      "full:images/galleria/09.webp",
      "full:images/galleria/05.webp",
      "col2:images/galleria/10-1.webp",
      "col2:images/galleria/10-3.webp",
      "col2:images/galleria/10-2.webp",
      "col2:images/galleria/10-4.webp",
      "full:images/galleria/11.webp",
      "full:images/galleria/08.webp",
    ],
  },
  "iap-residency": {
    titleEn: "IAP Residency 《VITA NOVA_New Life》",
    titleKr: "IAP 레지던시 《비타 노바_새로운 삶》",
    date: "2022",
    area: "Motion Poster, Photography",
    areaKr: "모션 포스터, 사진",
    client:
      '<a href="https://inartplatform.kr/home/home" target="_blank">Incheon Art Platform</a>',
    clientKr:
      '<a href="https://inartplatform.kr/home/home" target="_blank">인천아트플랫폼</a>',
    director:
      'Marvin Kim (<a href="https://spine-press.com/" target="_blank">Spine Press</a>)',
    directorKr:
      '마빈킴 (<a href="https://spine-press.com/" target="_blank">스파인 프레스</a>)',
    collaborator: "",
    descEn:
      "《VITA NOVA_New Life》 begins with the awareness that, as a result of the pandemic, we are now living—and must continue to live—a life fundamentally different from before. It proposes a pause from familiar ways of being, inviting us to look back, observe, and gently engage with our surroundings while questioning what had long been taken for granted. The work expresses the mutable state between before and after creating differently through transformations in title lettering that spreads like liquid, and through the vitality of newly growing vines emerging within it.",
    descKr:
      "《VITA NOVA_New Life》은 현재 우리가 팬데믹으로 인해 이전과 달라진 새로운 삶을 살게 되었고, 살아내야 한다는 사실을 자각하는 것에서 시작한다. 그러므로 더욱이 여태까지의 방식을 멈추어 뒤돌아보고, 주변을 살피고 어루만지면서 당연시했던 것들을 의심해 보자고 제안하는 것이다. 다르게 창작하는 전과 후의 가변적인 상태를 액체가 번지는 듯한 타이틀 레터링의 변화와 그 안에서 새롭게 자라나는 덩쿨의 생동감을 통해 표현한다.",
    thumbnail: "images/vita-nova/thumb.gif",
    media: [
      "full:images/vita-nova/01.mp4",
      "gif:col2:images/vita-nova/03-1.mp4",
      "col2:images/vita-nova/03-2.webp",
      "col3:images/vita-nova/06-1.webp",
      "col3:images/vita-nova/06-2.webp",
      "col3:images/vita-nova/06-3.webp",
      "full:images/vita-nova/04.webp",
      "full:images/vita-nova/08-1.webp",
      "col2:images/vita-nova/07-1.webp",
      "col2:images/vita-nova/07-2.webp",
      "full:images/vita-nova/08-2.webp",
      "full:images/vita-nova/08-3.webp",
    ],
  },
  "jade-sujin-lee": {
    titleEn: "Jade Sujin Lee 《CHANGE OR TRANS-HIKING》",
    titleKr: "이수진 《돌과 유리 하이킹》",
    date: "2022",
    area: "Motion Poster",
    areaKr: "모션 포스터",
    client:
      '<a href="https://jadesujinlee.net/" target="_blank">Jade Sujin Lee</a>, <a href="https://platform-l.org/" target="_blank">Platform-L</a>',
    clientKr:
      '<a href="https://jadesujinlee.net/" target="_blank">이수진</a>, <a href="https://platform-l.org/" target="_blank">플랫폼엘</a>',
    director:
      'Marvin Kim (<a href="https://spine-press.com/" target="_blank">Spine Press</a>)',
    directorKr:
      '마빈킴 (<a href="https://spine-press.com/" target="_blank">스파인 프레스</a>)',
    collaborator: "",
    descEn:
      "《CHANGE OR TRANS-HIKING》 generates sound and resonance through the creation of objects that embody flowing liquids, urban byproducts, moss, plants, and forms with geometric or repetitive rhythms. The work presents a totality of sensory experiences emerging from both solid and fragile textures and concepts, aiming to realize a soundscape as a transcendent habitat that passes through fluid, contemporary ideas flowing between the temporalities of past, present, and future. These fluid concepts between solidity and fragility are expressed through typography composed of expanding lines, along with overlapping glass beads and circular elements that move through and between them.",
    descKr:
      "《돌과 유리 하이킹》은 유동하는 액체와 도시를 떠도는 부산물, 이끼, 식물, 그리고 기하학적이거나 반복적인 율동감을 가진 오브제들을 만들어, 소리와 울림을 파생시킨다. 본 작품은 단단하거나 연약한 질감과 개념을 통해 발생하는 감각의 총체로서, '과거-현재-미래의 시간성 사이에 흐르는 동시대의 유동하는 개념들을 경유하는 초월적인 서식지로서의 소리공간을 구현'하고자 한다. 단단하고 연약한 질감 사이의 유동하는 개념을 늘어나는 라인으로 구성된 타이포와 그 사이를 지나가는 유리 구슬과 원 개체들의 겹침을 통해 표현한다.",
    thumbnail: "images/jade-sujin-lee/thumb.webp",
    media: [
      "col2:images/jade-sujin-lee/01.webp",
      "col2:images/jade-sujin-lee/02.gif",
      "full:images/jade-sujin-lee/03.mp4",
      "col2:images/jade-sujin-lee/04.webp",
      "col2:images/jade-sujin-lee/05.webp",
    ],
  },

  // ========== Self-Initiative Project ==========
  "against-smoothness": {
    titleEn: "Against Smoothness",
    titleKr: "Against Smoothness",
    date: "2026.05",
    medium: "Printed matter, 4 × 46.125 in <br>Video, 1920 × 1080 px",
    advisor: "Diego Kolsky",
    advisorKr: "Diego Kolsky",
    collaborator: "",
    descEn:
      "Against Smoothness is a thesis research project exploring what happens to perception when the smoothness of algorithmic interfaces is interrupted. Algorithmic interfaces are designed to keep behavioral data extraction invisible to the user. This research asks whether designed friction can restore the awareness that smoothness suppresses.\n\nThe thesis pamphlet is printed on a four-inch wide strip of paper wound around a cylindrical core — a scroll you have to physically unwind to read. Friction As Interface extends the thesis into a physical prototype: a rotary encoder knob replaces finger scrolling on an Instagram feed. As speed increases, the LED shifts from green to red, the content blurs, and the algorithm's reasoning appears as text overlays — making visible what the smooth interface was built to conceal.",
    descKr:
      "Against Smoothness는 알고리즘 인터페이스의 smoothness가 중단되었을 때 인식에 어떤 일이 일어나는지를 탐구하는 thesis research 프로젝트입니다. 알고리즘 인터페이스는 행동 데이터 추출을 사용자에게 보이지 않게 만들도록 설계되어 있습니다. 이 연구는 설계된 마찰이 smoothness가 억제하는 인식을 되살릴 수 있는지를 묻습니다.\n\nthesis 팜플렛은 가로 4인치의 종이 띠를 원통형 코어에 감은 두루마리 형태로, 직접 펼쳐야 읽을 수 있습니다. Friction As Interface는 thesis를 물리적 프로토타입으로 구현한 실험입니다. 로터리 엔코더 노브가 인스타그램 피드의 스크롤링을 대체하며, 속도가 빨라질수록 LED가 초록에서 빨간색으로 바뀌고 콘텐츠가 흐려지면서 알고리즘의 논리가 텍스트로 드러납니다.",
    thumbnail: "images/against-smoothness/thumb.webp",
    media: [
       "full:images/against-smoothness/01.webp",
       "col3:images/against-smoothness/02-1.webp",
       "col3:images/against-smoothness/02-2.webp",
       "col3:images/against-smoothness/02-3.webp",
       "col3:images/against-smoothness/03-1.webp",
       "col3:images/against-smoothness/03-2.webp",
       "col3:images/against-smoothness/03-3.webp",
       "iframe:https://www.youtube.com/embed/0NkJ9Ya6Btk::Experiment Video",
    ],
  },
  "other-islands": {
    titleEn: "Other islands Book Fair 2026 (Proposal)",
    titleKr: "아더 아일랜즈 북페어 2026 (제안안)",
    date: "2025.11",
    area: "Visual Identity, Graphic Design, Typography",
    areaKr: "비주얼 아이덴티티, 그래픽 디자인, 타이포그래피",
    advisor: "",
    collaborator: "Seulgi Choi, Chiho Ye",
    collaboratorKr: "최슬기, 예치호",
    descEn:
      "Other Islands Book Fair 2026 is a project that visualizes the book fair as a temporary gathering and exchange, using *Bird Migration* as a metaphor for movement, connection, and return. Inspired by the routes and traces of migratory birds, the visual system is built from modular dot forms that express both individuality and collectivity through repetition, variation, and motion. A nature-derived color palette and a flexible logo structure reinforce this concept, while the identity is applied across posters, signage, motion graphics, social media, and merchandise to convey the rhythm of convergence and dispersal that defines the book fair experience.",
    descKr:
      "Other Islands Book Fair 2026은 ‘Bird Migration’을 이동과 모임, 교류의 은유로 삼아, 서로 다른 장소에서 출발한 창작자와 관람자가 한 시점에 모여 경험을 나누고 다시 각자의 공동체로 돌아가는 북페어의 성격을 시각화한 프로젝트이다. 철새의 이동 경로와 흔적에서 착안한 도트 형태의 그래픽 시스템은 개별성과 집단성을 동시에 드러내며, 반복과 변주, 움직임을 통해 연결과 교환의 과정을 표현한다. 자연에서 가져온 컬러 팔레트와 유연한 로고 구조는 이러한 개념을 강화하며, 포스터, 사인, 모션, 소셜 미디어, 머천다이즈 등 다양한 매체 전반에 적용되어 일시적으로 형성되는 집합과 다시 흩어지는 북페어의 리듬을 하나의 일관된 비주얼 언어로 전달한다.",
    thumbnail: "images/other-island/thumb.gif",
    media: [
      //"gif:full:images/other-island/01-2.mp4",
      "full:images/other-island/01-1.gif",
      "gif:full:images/other-island/01-3.mp4",
      "gallery:images/other-island/03-1.webp|images/other-island/03-2.webp|images/other-island/03-3.webp|images/other-island/03-4.webp|images/other-island/03-5.webp|images/other-island/03-6.webp|images/other-island/03-7.webp|images/other-island/03-8.webp|images/other-island/03-9.webp|images/other-island/03-10.webp|images/other-island/03-11.webp|images/other-island/03-12.webp|images/other-island/03-13.webp",
      "col2:images/other-island/04-1.webp",
      "col2:images/other-island/04-2.webp",
      "full:images/other-island/02-1.webp",
      "col3:images/other-island/02-2.webp",
      "col3:images/other-island/02-3.webp",
      "col3:images/other-island/02-4.webp",
      "col2:images/other-island/05-1.webp",
      "col2:images/other-island/05-2.gif",
      "gif:col3:images/other-island/06-1.mp4",
      "gif:col3:images/other-island/06-2.mp4",
      "gif:col3:images/other-island/06-3.mp4",
      "full:images/other-island/07.webp",
      "full:images/other-island/08-1.webp",
      "col2:images/other-island/08-2.webp",
      "col2:images/other-island/08-3.webp",
    ],
  },
  "digital-religion": {
    titleEn: "Digital Religion Bible",
    titleKr: "디지털 종교 교리서",
    date: "2022.02",
    area: "Editorial Design",
    areaKr: "에디토리얼 디자인",
    spec: 'Printed matter, 170 × 240 mm (6.7 × 9.45 in), 206p, Swiss binding<br><a href="https://youtube.com/watch?v=6_3Rf9nbGs8&feature=youtu.be" target="_blank">Audio book</a>, 00:13:23',
    specKr: '인쇄물, 170 × 240 mm (6.7 × 9.45 in), 206p, 스위스 바인딩<br><a href="https://youtube.com/watch?v=6_3Rf9nbGs8&feature=youtu.be" target="_blank">오디오북</a>, 00:13:23',
    advisor: "Namoo Kim",
    advisorKr: "김나무",
    collaborator: "Gyeoryei Lee, Minjeong Kim",
    collaboratorKr: "이겨례, 김민정",
    descEn:
      "Within the metaverse—a digital panopticon formed by a convergence of desires—humans gradually lose their imagination through image-based control and indoctrination. This work takes the form of a digital religious doctrine that adopts the sequential structure of a book, positioning the reader as a disciple who experiences its images. Based on Maslow’s hierarchy of needs, the imagery is organized into eight stages; as the stages progress, the images increasingly overlap, visualizing a system of control that suppresses critical thinking and enforces the passive consumption of images. In the physical book, captions appear beneath each image, while in the audiobook these captions are replaced by sound. Image and sound correspond on a one-to-one basis, and as visual overlap intensifies, layers of sound also accumulate, reinforcing a state of sensory overload and control.",
    descKr:
      "욕구의 집합체인 메타버스라는 디지털 파놉티콘 속에서 인간은 이미지에 의한 통제와 세뇌를 통해 점차 상상력을 상실한다. 이 작업은 순차적으로 읽는 책의 형식을 활용한 디지털 종교 교리서로, 독자가 신도의 위치에서 이미지를 경험하도록 설계되었다. 이미지는 매슬로우의 욕구 이론을 기반으로 한 8단계 구조로 구성되며, 단계가 진행될수록 이미지의 중첩이 심화되어 비판적 사고를 차단하고 이미지를 수동적으로 받아들이게 되는 통제의 과정을 시각화한다. 또한 물리적인 책에서 이미지 하단에 텍스트로 제시되던 자막은 오디오북에서는 사운드로 대체되며, 이미지와 소리는 1:1로 대응하고 중첩이 증가할수록 소리 역시 겹쳐지며 감각적 과잉과 통제의 상태를 강화한다.",
    thumbnail: "images/digital-religion/thumb.webp",
    media: [
      "col2:images/digital-religion/01.webp",
      "col2:images/digital-religion/02.webp",
      "full:images/digital-religion/06.webp",
      "col2:images/digital-religion/03.webp",
      "col2:images/digital-religion/04.webp",
      "full:images/digital-religion/05.mp4",
      "images/digital-religion/08.webp",
      "images/digital-religion/07.webp",
    ],
  },
  "language-contagion": {
    titleEn: "Language Contagion",
    titleKr: "언어전염",
    date: "2022.02",
    area: "Coding, Editorial Design",
    areaKr: "코딩, 에디토리얼 디자인",
    spec: "Interactive Website<br>Printed matter, 249 × 390 mm (9.8 × 15.3 in), Risograph on paper, Two-sided",
    specKr: "인터랙티브 웹사이트<br>인쇄물, 249 × 390 mm (9.8 × 15.3 in), 종이 리소그래프, 양면",
    advisor: "Namoo Kim",
    advisorKr: "김나무",
    collaborator: "Seungkyu Han",
    collaboratorKr: "한승규",
    descEn:
      "Language Contagion aims to stimulate imagination by dismantling the form of language as a social rule, creating new meanings within the immune structure of everyday systems. This work takes the form of an interactive web project based on a step-by-step process that borrows from the life cycle of an actual virus. To become infected by language is to introduce an error into the system. As external elements infiltrate an existing structure, the community becomes contaminated, allowing new perspectives and languages to emerge. This process moves participants away from passively consuming content and opens up the possibility of actively perceiving and identifying meaning.",
    descKr:
      "언어 전염은 사회의 규칙인 언어의 형태를 해체함으로써, 면역력 있는 일상의 체계 속에서 새로운 의미를 창조하고, 이를 통해 상상력을 자극하는 것을 목표로 한다. 이 작업은 실제 바이러스의 생활사를 차용한 단계별 과정을 기반으로 한 인터랙티브 웹 형식의 작업이다. 언어 전염이 된다는 것은 시스템에 오류가 발생하는 것이다. 외부적 요소가 체계 안으로 침입 됨으로써 공동체는 오염되고 새로운 시각과 언어가 발견된다. 이는 수동적으로 컨텐츠를 받아들이는 것에서 벗어나, 스스로 인지하고 식별할 수 있는 가능성을 열어준다.",
    thumbnail: "images/language-contagion/thumb.webp",
    media: [
      "full:images/language-contagion/01-1.gif",
      "full:images/language-contagion/01-2.webp",
      "gif:full:images/language-contagion/01-3.mp4",
      "full:images/language-contagion/07.webp",
      "full:images/language-contagion/02.webp",
      "col2:images/language-contagion/04.webp",
      "col2:images/language-contagion/05.webp",
      "full:images/language-contagion/06.webp",
    ],
  },
  palindrome: {
    titleEn: "Palindrome s emordnilaP",
    titleKr: "회문-문회",
    date: "2024.11",
    area: "Motion Graphic, Typography, Graphic Design",
    areaKr: "모션 그래픽, 타이포그래피, 그래픽 디자인",
    spec: "Single-channel video, 00:01:45 <br>Printed matter, 160 × 140 mm (6.3 × 5.5 in), 94p, Screw binding <br>Virtual object, 500 × 350 × 500 mm (19.6 × 13.7 × 19.6 in)",
    specKr: "싱글 채널 비디오, 00:01:45 <br>인쇄물, 160 × 140 mm (6.3 × 5.5 in), 94p, 스크류 바인딩 <br>가상 오브제, 500 × 350 × 500 mm (19.6 × 13.7 × 19.6 in)",
    advisor: "",
    collaborator: "",
    descEn:
      "A palindrome is a linguistic system that reads the same forward and backward, extending across words, phrases, sentences, and even paragraphs. Depending on the direction of reading, different elements are perceived as identical structures, producing distinct visual forms and unique auditory experiences. A key characteristic of palindromes is their symmetry and simultaneity: centered around a middle letter or a space, the forward and backward directions mirror and overlap at the same time. The way identical letters are slightly rearranged and read as different sounds evokes the sense of polyphonic music. Based on these qualities, this project visualizes the alphabet as musical notes and proposes a method of forming symmetrical structures through movement. By analyzing palindromes through six classification systems, the project explores possibilities beyond linguistic expression, including expansion from 2D to 3D, layers of sound, and the recontextualization of visual elements. These explorations are documented and expressed through an archive of texts, videos, and printed media.",
    descKr:
      "회문은 앞뒤로 동일하게 읽히는 언어 체계로, 단어·구·문장·문단 등 다양한 단위로 확장되며, 읽는 방향에 따라 서로 다른 요소가 같은 구조로 인식되는 시각적 형상과 독특한 청각적 현상을 만들어낸다. 특히 중심의 글자나 공백을 기준으로 형성되는 대칭성과 동시성은 회문의 핵심 특징으로, 동일한 글자들이 조금씩 다른 배열과 발음으로 중첩되며 다성음악과 유사한 감각을 형성한다. 이 프로젝트는 이러한 회문의 구조를 바탕으로 알파벳을 음악적 음표처럼 시각화하고, 움직임을 통해 대칭적인 구조를 형성하는 방식을 제안한다. 또한 회문을 6가지 분류 체계로 나누어 분석하며, 언어적 표현을 넘어 2D에서 3D로의 확장, 음향적 중첩, 시각적 요소의 새로운 맥락화 가능성을 탐구하고, 이를 문서·영상·프린트 매체로 아카이빙한다.",
    thumbnail: "images/palindrome/thumb.gif",
    media: [
      "col2:images/palindrome/01-1.webp",
      "col2:images/palindrome/01-2.webp",
      "full:images/palindrome/01-3.webp",
      "gif:full:images/palindrome/01-4.mp4",
      "col2:images/palindrome/02-1.webp",
      "col2:images/palindrome/02-2.mp4",
      "col2:images/palindrome/02-3.webp",
      "col2:images/palindrome/02-4.webp",
      "gif:col3:images/palindrome/03-1.mp4",
      "col3:images/palindrome/03-2.webp",
      "col3:images/palindrome/03-3.webp",
      "full:images/palindrome/03-4.webp",
      "col2:images/palindrome/04-1.webp",
      "col2:images/palindrome/04-2.webp",
      "gif:col3:images/palindrome/05-1.mp4",
      "col3:images/palindrome/05-2.webp",
      "col3:images/palindrome/05-3.webp",
      "col2:images/palindrome/05-4.webp",
      "col2:images/palindrome/05-5.webp",
      "col2:images/palindrome/06-1.webp",
      "col2:images/palindrome/06-2.mp4",
      "full:images/palindrome/07.webp",
    ],
  },
  imoa: {
    titleEn: "Intangible Museum Of Art (I-MOA)",
    titleKr: "아이모아",
    date: "2022.02",
    area: "Motion Graphics, Video, Branding, Editorial Design",
    areaKr: "모션 그래픽, 영상, 브랜딩, 에디토리얼 디자인",
    advisor: "Seon-A Lim",
    advisorKr: "임선아",
    collaborator: "Hyuntaek Oh",
    collaboratorKr: "오현택",
    award:
      '<a href="https://www.cqjournal.com/gallery/67/gallery/oh-hyeon-taek-83511-01" target="_blank">Creative quarterly Issue 67</a>, Graphic design, Finalist',
    awardKr:
      '<a href="https://www.cqjournal.com/gallery/67/gallery/oh-hyeon-taek-83511-01" target="_blank">Creative Quarterly Issue 67</a>, 그래픽 디자인, 파이널리스트',
    descEn:
      "I-MOA is a virtual museum where imaginative individuals exchange breaths of inspiration with one another. Its core artworks exist only in the digital realm, and the platform itself operates exclusively online, based on a concept that merges NFT technology with the structure of a museum. The three pillars of I-MOA—viewers, creators, and buyers—actively engage within the museum, accumulating data through their interactions. This data becomes a form of “digital pigment,” feeding back into the system and serving as inspiration for the creation of new artworks.",
    descKr:
      "I-MOA(아이모아)는 상상하는 사람들이 영감의 호흡을 주고받는 가상의 미술관이다. 주 작품은 디지털 세계에만 존재하는 아트워크이고, 플랫폼은 온라인 상에만 존재하며, NFT 기술과 미술관을 합성한 개념을 기반으로 한다. I-MOA(아이모아)의 3가지 축인 관람자, 창작자, 구매자는 미술관에서 활발히 활동하며 데이터를 쌓고, 그것은 일종의 데이터 안료가 되어 새로운 창작물의 영감을 제공한다.",
    thumbnail: "images/imoa/thumb.gif",
    media: [
      "full:images/imoa/01.gif",
      "full:images/imoa/04.webp",
      "col3:images/imoa/05-1.gif",
      "gif:col3:images/imoa/05-4.mp4",
      "col3:images/imoa/05-2.gif",
      "full:images/imoa/06.webp",
      "col2:images/imoa/07-1.webp",
      "col2:images/imoa/07-2.webp",
      "col2:images/imoa/08-1.webp",
      "col2:images/imoa/08-4.webp",
      "col2:images/imoa/10-1.webp",
      "col2:images/imoa/10-2.webp",
      "col2:images/imoa/11-1.webp",
      "col2:images/imoa/11-2.webp",
    ],
  },
  ilmin: {
    titleEn: "Ilmin Museum of Art Rebranding (Proposal)",
    titleKr: "일민미술관 리브랜딩 (제안안)",
    date: "2020.06",
    area: "Motion Graphics, Video, Branding, Editorial Design",
    areaKr: "모션 그래픽, 영상, 브랜딩, 에디토리얼 디자인",
    spec: "Printed matter, 297 × 210 mm (11.7 × 8.3 in), 110p, Pur binding",
    specKr: "인쇄물, 297 × 210 mm (11.7 × 8.3 in), 110p, PUR 바인딩",
    advisor: "Namoo Kim",
    advisorKr: "김나무",
    collaborator: "Gyeoryei Lee, Seoyoon Byun",
    collaboratorKr: "이겨례, 변서윤",
    descEn:
      "This project is a virtual rebranding of Ilmin Museum of Art. Conceived as a space for dialogue where organic communication can unfold, the diverse perspectives within the museum generate multiple interpretations and give rise to new paradigms. To encompass this process, the project adopts the symbolic and visual aspects of parentheses, demonstrating how the questions posed through Ilmin Museum of Art can be understood through multiple interpretations and contexts.",
    descKr:
      "일민미술관을 가상으로 리브랜딩 한 프로젝트이다. 유기적 소통이 가능한 대화의 장인, 일민미술관 속 여러 시각들은 다양한 해석들이 되어 새로운 패러다임을 생성한다. 이 프로세스를 포괄하는 개념으로 ‘괄호’의 기호적, 시각적 측면을 가져와 일민미술관을 통해 제시된 질문에 대한 각각의 해석들이 여러 맥락으로 이해될 수 있다는 것을 보여준다.",
    thumbnail: "images/ilmin/thumb.webp",
    media: [
      "full:images/ilmin/01.webp",
      "col2:images/ilmin/04-1.webp",
      "col2:images/ilmin/04-2.webp",
      "full:images/ilmin/06-1.webp",
      "full:images/ilmin/06-6.webp",
      "col3:images/ilmin/06-2.webp",
      "col3:images/ilmin/06-4.webp",
      "col3:images/ilmin/06-5.webp",
      "full:images/ilmin/03.gif",
      "full:images/ilmin/07-1.webp",
      "col2:images/ilmin/07-2.webp",
      "col2:images/ilmin/07-3.webp",
      "full:images/ilmin/10.webp",
      "col2:images/ilmin/09.webp",
      "col2:images/ilmin/08.webp",
    ],
  },
  "running-back": {
    titleEn: "Running Back Again",
    titleKr: "회문 사전",
    date: "2020.01",
    area: "Editorial Design",
    areaKr: "에디토리얼 디자인",
    spec: "Printed matter, 210 × 148 mm (8.3 × 5.8 in), 216p, Hardcover book with Swiss binding",
    specKr: "인쇄물, 210 × 148 mm (8.3 × 5.8 in), 216p, 스위스 바인딩 하드커버 북",
    advisor: "Hyunho Choi",
    advisorKr: "최현호",
    collaborator: "",
    descEn:
      "A palindrome is a word, sentence, or sequence of characters that reads the same forward and backward. Expanding from words to phrases, sentences, and entire paragraphs, various forms of palindromes create visual structures in which different elements are read as identical depending on the direction of reading, giving rise to intriguing auditory phenomena. This Palindrome Dictionary archives the diversity of the palindromic system.",
    descKr:
      "회문은 거꾸로 읽어도 제대로 읽는 것과 같은 단어, 문장, 문자열을 말한다. 단어에서 구, 문장, 문단 등으로 확장되는 다양한 종류의 회문은 시작하는 방향성에 따라 다른 것들이 같게 읽히는 시각적 형상과 그로 인해 발생하는 흥미로운 청각적 현상을 느낄 수 있다. 이 회문사전은 회문이라는 체계의 다양성을 아카이브한다.",
    thumbnail: "images/running-back/thumb.webp",
    media: [
      "full:images/running-back/01.webp",
      "col3:images/running-back/03-1.webp",
      "col3:images/running-back/03-2.webp",
      "col3:images/running-back/03-3.webp",
      "col4:images/running-back/09-1.webp",
      "col4:images/running-back/09-2.webp",
      "col4:images/running-back/09-3.webp",
      "col4:images/running-back/09-4.webp",
      "full:images/running-back/10.webp",
      "full:images/running-back/08.webp",
      "col2:images/running-back/02.webp",
      "col2:images/running-back/05.webp",
      "full:images/running-back/04.webp",
    ],
  },

  // ========== Experiment ==========
  
  "hype-slider": {
    titleEn: "Hype Slider",
    titleLink: "https://hjeon113.github.io/HypeSlider/",
    titleKr: "하입 슬라이더",
    date: "2026.02",
    medium: "",
    advisor: "Diego Kolsky",
    advisorKr: "Diego Kolsky",
    collaborator: "",
    descEn:
      "The text <i>Rise Above the Hype</i> examines how emerging technologies such as AI are shaped by cycles of hype—an amplified state of expectation driven by repetition, speed, and collective attention. In these cycles, anticipation accelerates faster than our ability to critically engage, reducing the distance needed for reflection and judgment. The text suggests that the issue lies not in the technology itself, but in how we perceive, adopt, and respond to it. From this text, I selected seven sentences that capture this condition. Hype Slider is an interactive work built on these fragments. As the slider moves, the text becomes compressed and intensified until it begins to collapse. This process translates the mechanics of hype into a visual experience, where repetition and acceleration overwhelm meaning and erode interpretive distance.",
    descKr:
      "〈Rise Above the Hype〉는 AI와 같은 새로운 기술이 하이프의 흐름 속에서 형성되는 방식을 다룬다. 여기서 하이프는 반복, 속도, 그리고 집단적 관심에 의해 기대가 과도하게 증폭되는 상태를 의미한다. 이러한 흐름 속에서 우리는 비판적으로 사고할 시간보다 더 빠르게 반응하게 되고, 해석과 판단을 위한 거리를 점점 잃게 된다. 이 글은 문제를 기술 자체가 아니라, 그것을 인식하고 받아들이는 우리의 태도에서 찾는다. 이 텍스트에서 이러한 상태를 드러내는 7개의 문장을 선별했다. Hype Slider는 이 문장들을 기반으로 한 인터랙티브 작업이다. 슬라이더를 움직일수록 텍스트는 점점 압축되고 증폭되다가 결국 형태가 붕괴된다. 이 과정은 하이프의 작동 방식이 어떻게 의미를 압도하고 해석의 거리를 사라지게 만드는지를 시각적으로 드러낸다.",
    thumbnail: "images/hypeslider/thumb.gif",
    media: [
      "iframe:https://hjeon113.github.io/HypeSlider/::Move the hype slider to interact",
      "col3:images/hypeslider/01-1.webp",
      "col3:images/hypeslider/01-2.webp",
      "col3:images/hypeslider/01-3.webp",
      "full:images/hypeslider/02.webp",
      "full:images/hypeslider/03.webp",
      "full:images/hypeslider/04.webp",
      "full:images/hypeslider/05.webp",
      "full:images/hypeslider/06.webp",
      "full:images/hypeslider/07.webp",
      "full:images/hypeslider/08.webp",
    ],
  },
  "gesture-archive": {
    titleEn: "Gesture Archive",
    titleLink: "https://hjeon113.github.io/handDrawing/",
    titleKr: "제스쳐 아카이브",
    date: "2025.12",
    medium: "p5.js, ml5.js",
    advisor:
      '<a href="https://www.mattiacasalegno.net/" target="_blank">Mattia Casalegno</a>',
    advisorKr:
      '<a href="https://www.mattiacasalegno.net/" target="_blank">Mattia Casalegno</a>',
    collaborator: "",
    descEn:
      "Gesture Archive is a web-based drawing system that translates hand movements into lines, dots, and visual traces through real-time tracking. Participants perform gestures with the intention of forming specific shapes, yet the system does not interpret meaning—it records only movement data such as speed, direction, and tremor. As a result, the marks that appear on the screen diverge from the intended image, revealing how digital systems perceive and process human expression differently. Gesture Archive treats this mismatch not as an error but as a generative condition, exploring how gestures transform through computational processes to produce new visual forms beyond original intention.",
    descKr:
      "Gesture Archive는 손의 움직임을 실시간으로 추적해 선과 점, 흔적으로 변환하는 웹 기반 드로잉 시스템이다. 사용자는 특정 형태를 그리려는 의도를 가지고 제스처를 수행하지만, 시스템은 그 의미를 해석하지 않고 오직 속도, 방향, 떨림 같은 움직임의 데이터만을 기록한다. 그 결과 화면에 남는 흔적은 의도한 이미지와 어긋나며, 이 간극은 디지털 시스템이 인간의 표현을 어떻게 다르게 인식하고 처리하는지를 드러낸다. Gesture Archive는 이러한 어긋남을 오류가 아닌 생성적 조건으로 바라보며, 제스처가 시스템의 계산 과정을 거치며 변형되는 과정에서, 기존의 의도와는 다른 새로운 시각적 형태가 만들어질 가능성을 탐구한다.",
    thumbnail: "images/gesture-archive/thumb.webp",
    media: [
      "full:images/gesture-archive/01.mp4",
      "col2:images/gesture-archive/03-1.webp",
      "col2:images/gesture-archive/03-2.webp",
      "full:images/gesture-archive/04.webp",
      "gif:col2:images/gesture-archive/02-1.mp4",
      "gif:col2:images/gesture-archive/02-2.mp4",
    ],
  },
  scroll: {
    titleEn: "City of frames",
    titleLink: "",
    titleKr: "프레임의 세계",
    date: "2025.12",
    medium: "p5.js",
    advisor: "Anna Fangan Xu",
    advisorKr: "Anna Fangan Xu",
    collaborator: "",
    descEn:
      'City of Frames is an interactive web-based project that reframes scrolling as a unit of time rather than a neutral interface gesture. Set in a speculative city where time progresses in frames instead of seconds, the project translates users’ scrolling speed and rhythm into shifts in temporal flow and visual state. As users read and navigate the interactive book through scrolling, their gestures are continuously captured as data and transformed into visual traces. The project consists of two connected websites: an interactive book and a scroll-data visualization. When both sites are opened simultaneously, the scrolling actions performed in the interactive book are reflected in real time on the visualization page, making the act of reading inseparable from its data footprint. By linking interaction and representation, City of Frames examines how attention, speed, and continuous movement are structured and normalized within digital environments.<br><a href="https://city-of-frames.onrender.com/" target="_blank">→ Interactive Book</a><br><a href="https://city-of-frames.onrender.com/timestamp.html" target="_blank">→ Visualization of Interaction</a>',
    descKr:
      'City of Frames는 스크롤이라는 일상적인 디지털 제스처를 ‘시간을 구성하는 단위’로 전환하는 인터랙티브 웹 기반 프로젝트다. 시간은 초나 분이 아닌 프레임 단위로 흐르는 가상의 도시를 배경으로, 사용자의 스크롤 속도와 리듬이 도시의 시간 진행과 시각적 상태를 직접적으로 변화시킨다. 관객은 스크롤을 통해 서사를 읽는 동시에, 자신의 인터랙션이 데이터로 기록되고 시각적 흔적으로 변환되는 과정을 경험하게 된다. 이 프로젝트는 인터랙티브 북과 스크롤 데이터 시각화를 각각 다른 웹페이지로 구성하였으며, 두 사이트를 동시에 열어 인터랙티브 북을 탐색할 경우 사용자의 스크롤 행위가 데이터 시각화 페이지에 실시간으로 반영된다. 이를 통해 읽기 행위와 그에 수반되는 제스처가 분리되지 않고 하나의 시간적 시스템으로 작동함을 드러내며, 디지털 환경에서 주의(attention), 속도, 지속적인 움직임이 어떻게 구조화되는지를 탐구한다.<br><a href="https://city-of-frames.onrender.com/" target="_blank">→ Interactive Book</a><br><a href="https://city-of-frames.onrender.com/timestamp.html" target="_blank">→ Visualization of Interaction</a>',
    thumbnail: "images/scroll/thumb.webp",
    media: [
      "full:images/scroll/01.webp",
      "full:images/scroll/02.mp4",
      "full:images/scroll/03.webp",
    ],
  },
  "digital-error": {
    titleEn: "Discrepancy of Red",
    titleKr: "빨간색의 불일치",
    date: "2024.12",
    medium: "Resin, Acrylic Plate with Color Sheet, PLA Filament",
    mediumKr: "레진, 컬러시트 아크릴 플레이트, PLA 필라멘트",
    area: "Installation, Sculpture",
    areaKr: "설치, 조형",
    advisor: "",
    collaborator: "",
    descEn:
      "Images and content in the digital world are inevitably transmitted through analog devices, and in this process, unintended errors arise due to differences in time, context, and technology between the sender and the receiver. Because each viewer perceives images through their own filters and modes of recognition, the sender’s intention can never be fully understood. Although everyone believes they understand the image, complete understanding is ultimately impossible. This work visualizes such perceptual gaps and distortions through displays made of transparent resin. While every display outputs the same #FF0000 color, the color perceived by the viewer subtly differs depending on each device’s rendering capability. Through this, the work highlights the inevitable distortion that occurs as digital data passes through analog systems.",
    descKr:
      "디지털 세계의 이미지와 콘텐츠는 반드시 아날로그 디바이스를 통해 전달되며, 이 과정에서 전송자와 수신자의 시간, 상황, 그리고 기술적 차이로 인해 의도하지 않은 오류가 필연적으로 발생한다. 사람들은 각자 다른 인식과 필터를 통해 이미지를 바라보기 때문에, 전송자의 의도를 정확히 이해하는 것은 불가능하다. 모두가 이미지를 이해한다고 믿지만, 그 의미를 완벽하게 공유하는 일은 언제나 어긋난다. 이 작업은 이러한 인식의 차이와 왜곡을 투명한 레진으로 구현된 디스플레이를 통해 시각화한다. 모든 디스플레이는 동일한 #FF0000 컬러를 송출하지만, 실제로 인지되는 색은 각 기기의 구현 방식에 따라 미묘하게 달라진다. 이를 통해 디지털 데이터가 아날로그를 거쳐 전달되는 과정에서 발생하는 불가피한 왜곡과 간극을 드러내고자 한다.",
    thumbnail: "images/digital-error/thumb.webp",
    media: [
      "full:images/digital-error/01.webp",
      "col2:images/digital-error/02-1.webp",
      "col2:images/digital-error/02-2.webp",
      "full:images/digital-error/03.webp",
      "col2:images/digital-error/04-1.webp",
      "col2:images/digital-error/04-2.webp",
    ],
  },
  "question-imagination": {
    titleEn: "Questions for people with imagination malnutrition",
    titleKr: "상상력 결핍의 사람들에게 던지는 질문",
    date: "2023.03",
    medium: "",
    area: "Editorial Design, Motion Graphic",
    areaKr: "에디토리얼 디자인, 모션 그래픽",
    advisor: "Namoo Kim",
    advisorKr: "김나무",
    collaborator: "",
    descEn:
      "In an era of information overload, we are gradually losing the ability to think for ourselves. Drawing from four books — Metaverse (by Sang-kyun Kim), The Blank Slate (by Steven Pinker), Sapiens (by Yuval Noah Harari), and Imagination and Gaston Bachelard (by Myung-hee Hong) — four team members investigated what qualities remain uniquely human in a world increasingly shaped by technology and automation. The resulting publication takes the form of an editorial experiment: a series of open-ended questions with no right answers and no fixed direction, designed to provoke reflection and reawaken an imagination that has long gone unused.",
    descKr:
      "정보 과잉의 시대, 우리는 점점 스스로 사고하는 능력을 잃어가고 있다. 4권의 책 — 메타버스(김상균), 빈 서판(스티븐 핑커), 사피엔스(유발 노아 하라리), 상상력과 가스통 바슐라르(홍명희) — 를 바탕으로 4명의 팀원이 기술과 자동화가 지배하는 세계 속에서 인간만이 가질 수 있는 고유한 특성이 무엇인지를 탐구하였다. 그 결과물은 에디토리얼 실험의 형태로, 정답도 정해진 방향도 없는 열린 질문들을 통해 사고를 자극하고 오랫동안 사용되지 않은 상상력을 다시 깨우고자 기획되었다.",
    thumbnail: "images/question-imagination/thumb.gif",
    media: [
      "full:images/question-imagination/01.mp4",
      "full:images/question-imagination/02.webp",
      "col2:images/question-imagination/03-1.webp",
      "col2:images/question-imagination/03-2.webp",
      "full:images/question-imagination/04.webp",
    ],
  },
};
