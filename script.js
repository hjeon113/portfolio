// ============================================
// 메인 기능 코드
// 이 파일은 수정할 필요 없음
// 프로젝트 추가/수정은 projects-data.js에서!
// ============================================

var keys = [];
var sectionStates = { self: false, pro: false, exp: false };

// 시간대별 배경색 설정
function updateBackgroundByTime() {
  var hour = new Date().getHours();
  //var hour = 5;
  var gradient;

  if (hour >= 5 && hour < 9) {
    // 새벽/아침 (5-9시): 블루 → 핑크 → 옐로우
    gradient =
      "linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 60%, rgba(155, 198, 255, 0.6) 72%, rgba(220, 180, 220, 1) 82%, rgba(255, 200, 210, 0.75) 91%, rgba(255, 242, 168, 1) 100%)";
  } else if (hour >= 9 && hour < 17) {
    // 낮 (9-17시): 스카이블루 → 연두 → 옐로우
    gradient =
      "linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 60%, rgba(132, 212, 255, 0.4) 72%, rgba(97, 231, 255, 0.45) 82%, rgba(240, 236, 120, 0.5) 91%, rgba(255, 255, 80, 0.55) 100%)";
  } else if (hour >= 17 && hour < 21) {
    // 저녁 (17-21시): 핑크 → 보라
    gradient =
      "linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 60%, rgba(255, 180, 160, 0.5) 72%, rgba(255, 140, 140, 0.6) 82%, rgba(200, 120, 160, 0.75) 91%, rgba(160, 100, 160, 0.85) 100%)";
  } else {
    // 밤 (21-5시): 피치 → 퍼플
    gradient =
      "linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 60%, rgba(250, 180, 140, 0.5) 72%, rgba(200, 150, 170, 0.6) 82%, rgba(140, 120, 170, 0.75) 91%, rgba(68, 68, 123, 1) 100%)";
  }

  document.documentElement.style.background = gradient;
  document.documentElement.style.backgroundAttachment = "fixed";
}

// ============================================
// Sunset Countdown 기능 (IP 기반, 권한 불필요)
// ============================================
var sunsetData = {
  city: "",
  country: "",
  sunset: null,
  sunrise: null,
  tomorrowSunrise: null,
};

// IP 기반 위치 가져오기 + 일몰 시간 계산
async function initSunsetCountdown() {
  try {
    // 1. IP 기반 위치 가져오기
    var lat, lon;
    try {
      var locationResponse = await fetch("https://ipapi.co/json/");
      var locationData = await locationResponse.json();

      sunsetData.city = locationData.city || "New York";
      sunsetData.country = locationData.country_code || "US";
      lat = locationData.latitude || 40.7128;
      lon = locationData.longitude || -74.006;
    } catch (e) {
      // IP API 실패 시 NYC 기본값
      console.log("IP API failed, using NYC default");
      sunsetData.city = "New York";
      sunsetData.country = "US";
      lat = 40.7128;
      lon = -74.006;
    }

    // 2. 일몰/일출 시간 가져오기
    var sunResponse = await fetch(
      "https://api.sunrise-sunset.org/json?lat=" +
        lat +
        "&lng=" +
        lon +
        "&formatted=0"
    );
    var sunData = await sunResponse.json();

    if (sunData.status === "OK") {
      sunsetData.sunset = new Date(sunData.results.sunset);
      sunsetData.sunrise = new Date(sunData.results.sunrise);

      // 내일 일출/일몰 시간도 가져오기
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split("T")[0];

      var tomorrowResponse = await fetch(
        "https://api.sunrise-sunset.org/json?lat=" +
          lat +
          "&lng=" +
          lon +
          "&date=" +
          tomorrowStr +
          "&formatted=0"
      );
      var tomorrowData = await tomorrowResponse.json();

      if (tomorrowData.status === "OK") {
        sunsetData.tomorrowSunrise = new Date(tomorrowData.results.sunrise);
        sunsetData.tomorrowSunset = new Date(tomorrowData.results.sunset);
      }
    }

    // 첫 업데이트
    updateSunsetDisplay();

    // 1분마다 업데이트
    setInterval(updateSunsetDisplay, 60000);
  } catch (error) {
    console.error("Sunset data error:", error);
    var locationEl = document.getElementById("sunsetLocation");
    if (locationEl) locationEl.textContent = "";
  }
}

// 일몰 카운트다운 표시 업데이트
function updateSunsetDisplay() {
  var locationEl = document.getElementById("sunsetLocation");
  var timeEl = document.getElementById("sunsetTime");
  if (!locationEl || !timeEl || !sunsetData.sunset) return;

  var now = new Date();

  // 위치 표시
  var location = sunsetData.city || "Unknown";
  if (sunsetData.country) {
    location += ", " + sunsetData.country;
  }
  locationEl.textContent = location;

  var diff, hours, minutes, timeText;

  // 현재 시간이 일몰 전인지 후인지 확인
  if (now < sunsetData.sunset) {
    // 일몰 전: 일몰까지 카운트다운
    diff = sunsetData.sunset - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      timeText = hours + "h " + minutes + "m until sunset";
    } else {
      timeText = minutes + "m until sunset";
    }
  } else if (sunsetData.tomorrowSunrise && now < sunsetData.tomorrowSunrise) {
    // 일몰 후 ~ 내일 일출 전: 일출까지 카운트다운
    diff = sunsetData.tomorrowSunrise - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      timeText = hours + "h " + minutes + "m until sunrise";
    } else {
      timeText = minutes + "m until sunrise";
    }
  } else {
    // 새로운 하루 시작 - 내일 일몰 데이터 사용
    if (sunsetData.tomorrowSunset) {
      diff = sunsetData.tomorrowSunset - now;
      hours = Math.floor(diff / (1000 * 60 * 60));
      minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        timeText = hours + "h " + minutes + "m until sunset";
      } else {
        timeText = minutes + "m until sunset";
      }
    } else {
      // 데이터 다시 가져오기
      initSunsetCountdown();
      return;
    }
  }

  timeEl.textContent = timeText;
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  updateBackgroundByTime(); // 배경색 적용
  initSunsetCountdown(); // 일몰 카운트다운 초기화
  setInterval(updateBackgroundByTime, 60000); // 1분마다 체크

  if (typeof projectsData !== "undefined") {
    keys = Object.keys(projectsData);
    generateSidebar();
    generateProjectGrid();
    shuffleProjectCards();
    handleUrl(); // 초기 URL 처리
  } else {
    console.error("projectsData not loaded!");
  }
});

// URL 해시 처리
function handleUrl() {
  var hash = window.location.hash;
  if (hash === "#about") {
    showAbout(true);
  } else if (hash.indexOf("#project/") === 0) {
    var id = hash.replace("#project/", "");
    if (projectsData[id]) {
      showProject(id, true);
    } else {
      showIndex(true);
    }
  } else {
    showIndex(true);
  }
}

// 뒤로가기/앞으로가기 처리
window.addEventListener("popstate", function () {
  handleUrl();
});

// 사이드바 자동 생성
function generateSidebar() {
  var categories = {
    work: { id: "section-pro", stateKey: "pro" },
    self: { id: "section-self", stateKey: "self" },
    exp: { id: "section-exp", stateKey: "exp" },
  };

  for (var cat in categories) {
    var config = sidebarConfig[cat];
    var section = document.getElementById(categories[cat].id);
    if (!section) continue;

    var navList = section.querySelector(".nav-list");
    var toggleBtn = section.querySelector(".toggle-btn");

    // 해당 카테고리 프로젝트 필터링
    var projects = [];
    for (var id in projectsData) {
      if (projectsData[id].category === cat) {
        projects.push({ id: id, data: projectsData[id] });
      }
    }

    // 네비게이션 아이템 생성
    navList.innerHTML = "";
    projects.forEach(function (p, index) {
      var li = document.createElement("li");
      li.className = "nav-item";
      li.setAttribute("data-index", index);
      li.setAttribute("data-project", p.id);

      if (index >= config.showCount) {
        li.classList.add("hidden");
      }

      li.innerHTML =
        p.data.titleEn + '<span class="kr">' + p.data.titleKr + "</span>";

      li.addEventListener("click", function () {
        showProject(this.getAttribute("data-project"));
      });

      navList.appendChild(li);
    });

    // 토글 버튼 표시/숨김
    if (projects.length > config.showCount) {
      toggleBtn.style.display = "block";
    } else {
      toggleBtn.style.display = "none";
    }
  }
}

// 프로젝트 그리드 자동 생성
function generateProjectGrid() {
  var grid = document.querySelector(".project-grid");
  if (!grid) return;

  grid.innerHTML = "";

  for (var id in projectsData) {
    var p = projectsData[id];
    var article = document.createElement("article");
    article.className = "project-card";
    article.setAttribute("data-project", id);

    var thumbnailHtml = "";
    if (p.thumbnail) {
      thumbnailHtml = '<img src="' + p.thumbnail + '" alt="' + p.titleEn + '">';
    }

    article.innerHTML =
      '<div class="project-thumbnail">' +
      thumbnailHtml +
      "</div>" +
      '<div class="project-info">' +
      '<span class="project-title-en">' +
      p.titleEn +
      "</span>" +
      '<span class="project-title-kr">' +
      p.titleKr +
      "</span>" +
      "</div>";

    article.addEventListener("click", function () {
      showProject(this.getAttribute("data-project"));
    });

    grid.appendChild(article);
  }
}

// 토글 섹션
function toggleSection(section) {
  var sectionMap = {
    pro: "section-pro",
    self: "section-self",
    exp: "section-exp",
  };
  var sectionEl = document.getElementById(sectionMap[section]);
  if (!sectionEl) return;

  var items = sectionEl.querySelectorAll(".nav-item[data-index]");
  var btn = sectionEl.querySelector(".toggle-btn");
  var catMap = { pro: "work", self: "self", exp: "exp" };
  var showCount = sidebarConfig[catMap[section]].showCount;

  sectionStates[section] = !sectionStates[section];

  items.forEach(function (item, i) {
    if (i >= showCount) {
      item.classList.toggle("hidden", !sectionStates[section]);
    }
  });

  btn.textContent = sectionStates[section] ? "− Show Less" : "+ Show More";
}

// 모든 비디오 정지
function stopAllVideos() {
  var videos = document.querySelectorAll("video");
  videos.forEach(function (video) {
    video.pause();
    video.currentTime = 0;
  });
}

// 인덱스 보기
function showIndex(skipHistory) {
  stopAllVideos();
  document.getElementById("index-view").style.display = "block";
  document.getElementById("project-detail").classList.remove("active");
  document.getElementById("about-view").classList.remove("active");
  closeMobileMenu();
  window.scrollTo(0, 0);
  if (!skipHistory) {
    history.pushState({ view: "index" }, "", "#");
  }
}

// About 보기
function showAbout(skipHistory) {
  stopAllVideos();
  document.getElementById("index-view").style.display = "none";
  document.getElementById("project-detail").classList.remove("active");
  document.getElementById("about-view").classList.add("active");
  closeMobileMenu();
  window.scrollTo(0, 0);
  if (!skipHistory) {
    history.pushState({ view: "about" }, "", "#about");
  }
}

// 프로젝트 상세 보기
function showProject(id, skipHistory) {
  stopAllVideos();
  var p = projectsData[id];
  if (!p) return;

  var idx = keys.indexOf(id);
  var next = idx < keys.length - 1 ? keys[idx + 1] : keys[0];

  var mediaHtml = p.media
    .map(function (m) {
      // placeholders
      if (m === "full")
        return '<div class="media-item full placeholder"></div>';
      if (m === "placeholder")
        return '<div class="media-item placeholder"></div>';
      if (m === "col2")
        return '<div class="media-item col2 placeholder"></div>';
      if (m === "col3")
        return '<div class="media-item col3 placeholder"></div>';
      if (m === "col4")
        return '<div class="media-item col4 placeholder"></div>';

      // gif: 접두어 체크
      var isGif = m.indexOf("gif:") === 0;
      if (isGif) {
        m = m.replace("gif:", "");
      }

      function getMediaTag(src, asGif) {
        if (src.match(/\.(mp4|webm|mov)$/i)) {
          if (asGif) {
            return (
              '<video src="' +
              src +
              '" autoplay loop muted playsinline></video>'
            );
          }
          return (
            '<video src="' +
            src +
            '" controls playsinline webkit-playsinline onloadeddata="var v=this;setTimeout(function(){v.play()},3000)"></video>'
          );
        }
        return '<img src="' + src + '" alt="">';
      }

      // full width
      if (m.indexOf("full:") === 0) {
        var src = m.replace("full:", "");
        return (
          '<div class="media-item full">' + getMediaTag(src, isGif) + "</div>"
        );
      }
      // 2단 (세로형 등)
      if (m.indexOf("col2:") === 0) {
        var src = m.replace("col2:", "");
        return (
          '<div class="media-item col2">' + getMediaTag(src, isGif) + "</div>"
        );
      }
      // 3단
      if (m.indexOf("col3:") === 0) {
        var src = m.replace("col3:", "");
        return (
          '<div class="media-item col3">' + getMediaTag(src, isGif) + "</div>"
        );
      }
      // 4단
      if (m.indexOf("col4:") === 0) {
        var src = m.replace("col4:", "");
        return (
          '<div class="media-item col4">' + getMediaTag(src, isGif) + "</div>"
        );
      }
      // 기본 2단
      return '<div class="media-item">' + getMediaTag(m, isGif) + "</div>";
    })
    .join("");

  var clientHtml = p.client
    ? '<div class="meta-row"><div class="meta-label">Client</div><div>' +
      p.client +
      "</div></div>"
    : "";
  var advisorHtml = p.advisor
    ? '<div class="meta-row"><div class="meta-label">' +
      (p.category === "work" ? "Art Direction" : "Advisor") +
      "</div><div>" +
      p.advisor +
      "</div></div>"
    : "";
  var collaboratorHtml = p.collaborator
    ? '<div class="meta-row"><div class="meta-label">Collaborator</div><div>' +
      p.collaborator +
      "</div></div>"
    : "";

  var titleHtml = p.titleLink
    ? '<a href="' + p.titleLink + '" target="_blank">' + p.titleEn + "</a>"
    : p.titleEn;

  document.getElementById("project-detail").innerHTML =
    '<div class="detail-content">' +
    mediaHtml +
    "</div>" +
    '<div class="detail-header">' +
    '<div class="detail-title">' +
    "<h1>" +
    titleHtml +
    "</h1>" +
    '<div class="kr">' +
    p.titleKr +
    "</div>" +
    "</div>" +
    '<div class="detail-desc-wrap">' +
    '<p class="detail-desc">' +
    p.descEn +
    "</p>" +
    '<p class="detail-desc">' +
    p.descKr +
    "</p>" +
    "</div>" +
    '<div class="detail-meta">' +
    '<div class="meta-row">' +
    '<div class="meta-label">Date</div>' +
    "<div>" +
    p.date +
    "</div>" +
    "</div>" +
    (p.area
      ? '<div class="meta-row"><div class="meta-label">Work Area</div><div>' +
        p.area +
        "</div></div>"
      : "") +
    (p.medium
      ? '<div class="meta-row"><div class="meta-label">Medium</div><div>' +
        p.medium +
        "</div></div>"
      : "") +
    (p.spec
      ? '<div class="meta-row"><div class="meta-label">Spec</div><div>' +
        p.spec +
        "</div></div>"
      : "") +
    clientHtml +
    advisorHtml +
    collaboratorHtml +
    (p.award
      ? '<div class="meta-row"><div class="meta-label">Award</div><div>' +
        p.award +
        "</div></div>"
      : "") +
    "</div>" +
    "</div>" +
    '<nav class="detail-nav">' +
    '<a onclick="showIndex()">Index</a>' +
    "<a onclick=\"showProject('" +
    next +
    "')\">Next →</a>" +
    "</nav>";

  document.getElementById("index-view").style.display = "none";
  document.getElementById("project-detail").classList.add("active");
  document.getElementById("about-view").classList.remove("active");
  closeMobileMenu();
  window.scrollTo(0, 0);
  if (!skipHistory) {
    history.pushState({ view: "project", id: id }, "", "#project/" + id);
  }
}

// 모바일 메뉴 토글
function toggleMenu() {
  var sidebar = document.getElementById("sidebar");
  var btn = document.getElementById("menuBtn");
  sidebar.classList.toggle("open");
  btn.textContent = sidebar.classList.contains("open") ? "Close" : "Menu";
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
  var sidebar = document.getElementById("sidebar");
  var btn = document.getElementById("menuBtn");
  if (sidebar) sidebar.classList.remove("open");
  if (btn) btn.textContent = "Menu";
}

// 외부 클릭 시 모바일 메뉴 닫기
document.addEventListener("click", function (e) {
  var sidebar = document.getElementById("sidebar");
  var btn = document.getElementById("menuBtn");
  if (
    window.innerWidth <= 768 &&
    sidebar &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== btn
  ) {
    closeMobileMenu();
  }
});

// 프로젝트 카드 셔플
function shuffleProjectCards() {
  var grid = document.querySelector(".project-grid");
  if (!grid) return;

  var cards = Array.from(grid.querySelectorAll(".project-card"));

  for (var i = cards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }

  cards.forEach(function (card) {
    grid.appendChild(card);
  });
}

// 커서 트레일 효과
var lastTrailTime = 0;
var trailInterval = 50;

document.addEventListener("mousemove", function (e) {
  var now = Date.now();
  if (now - lastTrailTime < trailInterval) return;
  lastTrailTime = now;

  var trail = document.createElement("div");
  trail.className = "cursor-trail";
  trail.style.left = e.clientX - 8 + "px";
  trail.style.top = e.clientY - 8 + "px";
  document.body.appendChild(trail);

  setTimeout(function () {
    trail.remove();
  }, 800);
});
