// ============================================
// 메인 기능 코드
// 이 파일은 수정할 필요 없음
// 프로젝트 추가/수정은 projects-data.js에서!
// ============================================

var keys = [];
var sectionStates = { self: false, pro: false, exp: false };

// 시간대별 배경색 설정 - 실시간 하늘 색상
var weatherData = {
  cloudCover: 0, // 0-100
  isRaining: false,
  isSnowing: false,
  weatherCode: 0,
  loaded: false,
};

// 날씨 정보 가져오기 (Open-Meteo, 무료/키불필요)
async function fetchWeather(lat, lon) {
  try {
    var response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&current=cloud_cover,precipitation,weather_code",
    );
    var data = await response.json();
    if (data.current) {
      weatherData.cloudCover = data.current.cloud_cover || 0;
      weatherData.weatherCode = data.current.weather_code || 0;
      weatherData.isRaining =
        (data.current.precipitation || 0) > 0 ||
        (weatherData.weatherCode >= 51 && weatherData.weatherCode <= 67) ||
        (weatherData.weatherCode >= 80 && weatherData.weatherCode <= 82);
      weatherData.isSnowing =
        (weatherData.weatherCode >= 71 && weatherData.weatherCode <= 77) ||
        (weatherData.weatherCode >= 85 && weatherData.weatherCode <= 86);
      weatherData.loaded = true;
    }
  } catch (e) {
    console.log("Weather API failed, using clear sky");
    weatherData.loaded = false;
  }
}

// 색상 보간 함수
function lerpColor(color1, color2, t) {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t),
    Math.round(color1[1] + (color2[1] - color1[1]) * t),
    Math.round(color1[2] + (color2[2] - color1[2]) * t),
  ];
}

// 날씨에 따른 색상 조정
function applyWeatherEffect(color, opacity) {
  var cloud = weatherData.cloudCover / 100;
  var rain = weatherData.isRaining ? 0.3 : 0;

  // 흐림: 회색으로 혼합
  var gray = [180, 180, 190];
  var adjusted = lerpColor(color, gray, cloud * 0.5 + rain);

  // 비오면 더 어둡게
  if (weatherData.isRaining) {
    adjusted = adjusted.map((c) => Math.round(c * 0.85));
    opacity = Math.min(opacity + 0.15, 1);
  }

  return { color: adjusted, opacity: opacity };
}

// 실시간 하늘 그라디언트 계산
function updateBackgroundByTime() {
  var now = new Date();
  var bgEl = document.getElementById("bg-gradient");

  // 일출/일몰 데이터가 없으면 배경 적용 안 함 (흰색 유지)
  if (!sunsetData.sunset || !sunsetData.sunrise) {
    return;
  }

  var result = calculateRealtimeSkyGradient(now);
  var gradient = result.gradient;
  var bottomBrightness = result.brightness;

  // bg-gradient div가 있으면 그걸 사용, 없으면 html에 직접 적용
  if (bgEl) {
    bgEl.style.background = gradient;
  } else {
    document.documentElement.style.transition = "background 1s ease";
    document.documentElement.style.background = gradient;
    document.documentElement.style.backgroundAttachment = "fixed";
  }

  // 배경 밝기에 따라 회색 텍스트 색상 동적 조절 - 비활성화 (항상 검정)
  document.documentElement.style.setProperty("--text-light", "#000");
}

// 실시간 하늘 색상 계산
function calculateRealtimeSkyGradient(now) {
  var sunrise = sunsetData.sunrise;
  var sunset = sunsetData.sunset;
  var tomorrowSunrise = sunsetData.tomorrowSunrise;

  // 시간대 정의 (분 단위)
  var sunriseTime = sunrise.getTime();
  var sunsetTime = sunset.getTime();
  var nowTime = now.getTime();

  // 각 phase의 색상 정의 [R, G, B]
  var colors = {
    // 밤 (깊은 네이비)
    nightTop: [30, 30, 60],
    nightMid: [50, 60, 100],
    nightBottom: [40, 45, 80],

    // 새벽 (일출 전) - 핑크/오렌지
    dawnTop: [100, 140, 180],
    dawnMid: [255, 180, 150],
    dawnBottom: [255, 200, 140],

    // 일출 - 골든아워
    sunriseTop: [180, 220, 255],
    sunriseMid: [255, 220, 180],
    sunriseBottom: [255, 240, 170],

    // 낮 - 맑은 하늘
    dayTop: [135, 206, 250],
    dayMid: [175, 230, 255],
    dayBottom: [255, 250, 200],

    // 일몰 전 - 골든아워
    goldenTop: [200, 220, 250],
    goldenMid: [255, 200, 150],
    goldenBottom: [255, 220, 130],

    // 일몰 - 핑크/오렌지
    sunsetTop: [255, 150, 120],
    sunsetMid: [255, 130, 140],
    sunsetBottom: [200, 100, 130],

    // 황혼 - 퍼플
    duskTop: [120, 100, 160],
    duskMid: [150, 100, 150],
    duskBottom: [100, 80, 130],
  };

  var phase, progress;
  var topColor, midColor, bottomColor;
  var topOp, midOp, bottomOp;

  // 일출 90분 전
  var dawnStart = sunriseTime - 90 * 60 * 1000;
  // 일출 후 60분
  var morningEnd = sunriseTime + 60 * 60 * 1000;
  // 일몰 90분 전
  var goldenStart = sunsetTime - 90 * 60 * 1000;
  // 일몰 후 60분
  var duskEnd = sunsetTime + 60 * 60 * 1000;

  if (nowTime < dawnStart) {
    // 깊은 밤 (자정 ~ 새벽)
    phase = "night";
    topColor = colors.nightTop;
    midColor = colors.nightMid;
    bottomColor = colors.nightBottom;
    topOp = 0.6;
    midOp = 0.75;
    bottomOp = 1;
  } else if (nowTime < sunriseTime) {
    // 새벽 (일출 90분 전 ~ 일출)
    progress = (nowTime - dawnStart) / (sunriseTime - dawnStart);
    topColor = lerpColor(colors.nightTop, colors.dawnTop, progress);
    midColor = lerpColor(colors.nightMid, colors.dawnMid, progress);
    bottomColor = lerpColor(colors.nightBottom, colors.dawnBottom, progress);
    topOp = 0.5 + progress * 0.3;
    midOp = 0.6 + progress * 0.2;
    bottomOp = 0.8 + progress * 0.2;
  } else if (nowTime < morningEnd) {
    // 일출 후 (일출 ~ 일출+60분)
    progress = (nowTime - sunriseTime) / (morningEnd - sunriseTime);
    topColor = lerpColor(colors.sunriseTop, colors.dayTop, progress);
    midColor = lerpColor(colors.sunriseMid, colors.dayMid, progress);
    bottomColor = lerpColor(colors.sunriseBottom, colors.dayBottom, progress);
    topOp = 0.4 + progress * 0.1;
    midOp = 0.5;
    bottomOp = 0.7 - progress * 0.2;
  } else if (nowTime < goldenStart) {
    // 낮
    phase = "day";
    topColor = colors.dayTop;
    midColor = colors.dayMid;
    bottomColor = colors.dayBottom;
    topOp = 0.4;
    midOp = 0.45;
    bottomOp = 0.5;
  } else if (nowTime < sunsetTime) {
    // 골든아워 (일몰 90분 전 ~ 일몰)
    progress = (nowTime - goldenStart) / (sunsetTime - goldenStart);
    topColor = lerpColor(colors.goldenTop, colors.sunsetTop, progress);
    midColor = lerpColor(colors.goldenMid, colors.sunsetMid, progress);
    bottomColor = lerpColor(colors.goldenBottom, colors.sunsetBottom, progress);
    topOp = 0.5 + progress * 0.2;
    midOp = 0.55 + progress * 0.2;
    bottomOp = 0.6 + progress * 0.3;
  } else if (nowTime < duskEnd) {
    // 황혼 (일몰 ~ 일몰+60분)
    progress = (nowTime - sunsetTime) / (duskEnd - sunsetTime);
    topColor = lerpColor(colors.sunsetTop, colors.duskTop, progress);
    midColor = lerpColor(colors.sunsetMid, colors.duskMid, progress);
    bottomColor = lerpColor(colors.sunsetBottom, colors.duskBottom, progress);
    topOp = 0.7 - progress * 0.1;
    midOp = 0.75;
    bottomOp = 0.9;
  } else {
    // 밤
    if (tomorrowSunrise) {
      var nightDuration = tomorrowSunrise.getTime() - 90 * 60 * 1000 - duskEnd;
      progress = Math.min((nowTime - duskEnd) / nightDuration, 1);
      topColor = lerpColor(colors.duskTop, colors.nightTop, progress);
      midColor = lerpColor(colors.duskMid, colors.nightMid, progress);
      bottomColor = lerpColor(colors.duskBottom, colors.nightBottom, progress);
    } else {
      topColor = colors.nightTop;
      midColor = colors.nightMid;
      bottomColor = colors.nightBottom;
    }
    topOp = 0.6;
    midOp = 0.75;
    bottomOp = 1;
  }

  // 날씨 효과 적용
  var topAdjusted = applyWeatherEffect(topColor, topOp);
  var midAdjusted = applyWeatherEffect(midColor, midOp);
  var bottomAdjusted = applyWeatherEffect(bottomColor, bottomOp);

  // 모바일 여부 체크 - 모바일에서는 그라디언트 더 위에서 시작
  var isMobile = window.innerWidth <= 768;
  var whiteEnd = isMobile ? "40%" : "60%";
  var colorStart = isMobile ? "55%" : "75%";
  var colorMid = isMobile ? "78%" : "88%";

  // 하단 색상 밝기 계산 (0~255)
  var bc = bottomAdjusted.color;
  var brightness = (bc[0] * 299 + bc[1] * 587 + bc[2] * 114) / 1000;

  // 그라디언트 생성
  var gradient =
    "linear-gradient(to bottom, " +
    "#ffffff 0%, " +
    "#ffffff " +
    whiteEnd +
    ", " +
    "rgba(" +
    topAdjusted.color.join(",") +
    "," +
    topAdjusted.opacity.toFixed(2) +
    ") " +
    colorStart +
    ", " +
    "rgba(" +
    midAdjusted.color.join(",") +
    "," +
    midAdjusted.opacity.toFixed(2) +
    ") " +
    colorMid +
    ", " +
    "rgba(" +
    bottomAdjusted.color.join(",") +
    "," +
    bottomAdjusted.opacity.toFixed(2) +
    ") 100%)";

  return { gradient: gradient, brightness: brightness };
}

// ============================================
// Sunset Countdown 기능 (IP 기반, 권한 불필요)
// ============================================
var sunsetData = {
  city: "",
  country: "",
  lat: null,
  lon: null,
  sunset: null,
  sunrise: null,
  tomorrowSunrise: null,
};

// 날씨 코드를 텍스트로 변환
function getWeatherText(code) {
  if (code === 0) return "Clear";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rainy";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Snowy";
  if (code >= 95 && code <= 99) return "Stormy";
  return "Clear";
}

// 날짜 포맷 (YYMMDD)
function getDateText() {
  var now = new Date();
  var yy = String(now.getFullYear()).slice(-2);
  var mm = String(now.getMonth() + 1).padStart(2, "0");
  var dd = String(now.getDate()).padStart(2, "0");
  return yy + mm + dd;
}

// IP 기반 위치 가져오기 + 일몰 시간 계산
async function initSunsetCountdown() {
  // 초기 로딩 표시
  var timeEl = document.getElementById("sunsetTime");
  if (timeEl) timeEl.textContent = "Loading...";

  try {
    // 1. IP 기반 위치 가져오기
    var lat, lon;
    try {
      var locationResponse = await fetch(
        "https://ip-api.com/json/?fields=city,countryCode,lat,lon",
      );
      var locationData = await locationResponse.json();

      sunsetData.city = locationData.city || "New York";
      sunsetData.country = locationData.countryCode || "US";
      lat = locationData.lat || 40.7128;
      lon = locationData.lon || -74.006;
    } catch (e) {
      // IP API 실패 시 NYC 기본값
      console.log("IP API failed, using NYC default");
      sunsetData.city = "New York";
      sunsetData.country = "US";
      lat = 40.7128;
      lon = -74.006;
    }

    // lat, lon 저장
    sunsetData.lat = lat;
    sunsetData.lon = lon;

    // 위치 정보 먼저 표시
    var locationEl = document.getElementById("sunsetLocation");
    if (locationEl) {
      var location = sunsetData.city || "Unknown";
      if (sunsetData.country) {
        location += ", " + sunsetData.country;
      }
      locationEl.textContent = location;
    }

    // 2. 일몰/일출 시간 가져오기
    var sunResponse = await fetch(
      "https://api.sunrise-sunset.org/json?lat=" +
        lat +
        "&lng=" +
        lon +
        "&formatted=0",
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
          "&formatted=0",
      );
      var tomorrowData = await tomorrowResponse.json();

      if (tomorrowData.status === "OK") {
        sunsetData.tomorrowSunrise = new Date(tomorrowData.results.sunrise);
        sunsetData.tomorrowSunset = new Date(tomorrowData.results.sunset);
      }

      // 3. 날씨 정보 가져오기
      await fetchWeather(lat, lon);

      // 4. 날짜 + 날씨 + 그라디언트 동시에 표시
      var timeEl = document.getElementById("sunsetTime");
      if (timeEl && weatherData.loaded) {
        var dateText = getDateText();
        var weatherText = getWeatherText(weatherData.weatherCode);
        timeEl.textContent = dateText + " " + weatherText;
      }
      updateBackgroundByTime();

      // 5. 3초 후 카운트다운으로 전환
      setTimeout(function () {
        updateSunsetDisplay();
        // 1초마다 카운트다운 업데이트
        setInterval(updateSunsetDisplay, 1000);
      }, 3000);

      // 6. 30초마다 배경 업데이트
      setInterval(updateBackgroundByTime, 30000);
    }

    // 30분마다 날씨 업데이트
    setInterval(function () {
      if (sunsetData.lat && sunsetData.lon) {
        fetchWeather(sunsetData.lat, sunsetData.lon);
      }
    }, 1800000);
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

  var diff, hours, minutes, seconds, timeText;

  // 오늘의 sunrise, sunset
  var todaySunrise = sunsetData.sunrise;
  var todaySunset = sunsetData.sunset;
  var tomorrowSunrise = sunsetData.tomorrowSunrise;
  var tomorrowSunset = sunsetData.tomorrowSunset;

  // 현재 시간 기준으로 판단
  if (now < todaySunrise) {
    // 아직 일출 전 (새벽): 일출까지 카운트다운
    diff = todaySunrise - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((diff % (1000 * 60)) / 1000);
    timeText = hours + "h " + minutes + "m " + seconds + "s until sunrise";
  } else if (now < todaySunset) {
    // 일출 후 ~ 일몰 전 (낮): 일몰까지 카운트다운
    diff = todaySunset - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((diff % (1000 * 60)) / 1000);
    timeText = hours + "h " + minutes + "m " + seconds + "s until sunset";
  } else if (tomorrowSunrise && now < tomorrowSunrise) {
    // 일몰 후 ~ 내일 일출 전 (밤): 일출까지 카운트다운
    diff = tomorrowSunrise - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((diff % (1000 * 60)) / 1000);
    timeText = hours + "h " + minutes + "m " + seconds + "s until sunrise";
  } else if (tomorrowSunset) {
    // 내일 일출 후: 내일 일몰까지 카운트다운
    diff = tomorrowSunset - now;
    hours = Math.floor(diff / (1000 * 60 * 60));
    minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((diff % (1000 * 60)) / 1000);
    timeText = hours + "h " + minutes + "m " + seconds + "s until sunset";
  } else {
    // 데이터 다시 가져오기
    initSunsetCountdown();
    return;
  }

  timeEl.textContent = timeText;
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  // 로딩 시 배경 흰색으로 리셋 (캐시된 이전 그라디언트 제거)
  var bgEl = document.getElementById("bg-gradient");
  if (bgEl) {
    bgEl.style.background = "#ffffff";
  } else {
    document.documentElement.style.background = "#ffffff";
  }

  initSunsetCountdown(); // 일몰 카운트다운 초기화 (배경도 여기서 적용)

  if (typeof projectsData !== "undefined") {
    keys = Object.keys(projectsData);
    generateSidebar();
    generateProjectGrid();
    shuffleProjectCards();
    handleUrl(); // 초기 URL 처리
  } else {
    console.error("projectsData not loaded!");
  }

  // 화면 크기 변경 시 그라디언트 업데이트 (모바일/데스크탑 전환)
  var resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      updateBackgroundByTime();
    }, 100);
  });
});

// bfcache에서 복원될 때도 흰색으로 리셋 후 다시 초기화
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    var bgEl = document.getElementById("bg-gradient");
    if (bgEl) {
      bgEl.style.background = "#ffffff";
    } else {
      document.documentElement.style.background = "#ffffff";
    }
    var timeEl = document.getElementById("sunsetTime");
    if (timeEl) timeEl.textContent = "Loading...";
    initSunsetCountdown();
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

  // 날짜+날씨 다시 표시 후 3초 뒤 카운트다운
  var timeEl = document.getElementById("sunsetTime");
  if (timeEl && weatherData && weatherData.loaded) {
    var dateText = getDateText();
    var weatherText = getWeatherText(weatherData.weatherCode);
    timeEl.textContent = dateText + " " + weatherText;
    setTimeout(function () {
      updateSunsetDisplay();
    }, 3000);
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
              '" autoplay loop muted playsinline preload="metadata"></video>'
            );
          }
          return (
            '<video src="' +
            src +
            '" controls playsinline webkit-playsinline preload="metadata"></video>'
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

// 커서 트레일 효과 - 날씨에 따라 변화
var lastTrailTime = 0;
var trailInterval = 50;

function getTrailStyle() {
  // 눈
  if (weatherData.isSnowing) {
    return "snow";
  }
  // 비
  if (weatherData.isRaining) {
    return "rain";
  }
  // 흐림 (구름 60% 이상)
  if (weatherData.cloudCover > 60) {
    return "cloudy";
  }
  // 맑음
  return "sunny";
}

document.addEventListener("mousemove", function (e) {
  // 모바일에서는 커서 트레일 비활성화
  if (window.innerWidth <= 768) return;

  var now = Date.now();
  if (now - lastTrailTime < trailInterval) return;
  lastTrailTime = now;

  var trail = document.createElement("div");
  trail.className = "cursor-trail " + getTrailStyle();
  trail.style.left = e.clientX - 8 + "px";
  trail.style.top = e.clientY - 8 + "px";
  document.body.appendChild(trail);

  setTimeout(function () {
    trail.remove();
  }, 800);
});

// ============================================
// Lightbox 기능 (이미지/비디오 네비게이션 포함)
// ============================================

var lightboxItems = []; // {src, type: 'img' | 'video'}
var currentLightboxIndex = 0;
var touchStartX = 0;
var touchEndX = 0;

function openLightbox(src, type) {
  var lightbox = document.getElementById("lightbox");

  // 현재 상세 페이지의 모든 이미지와 비디오 수집
  lightboxItems = [];
  var mediaElements = document.querySelectorAll(
    "#project-detail .media-item img, #project-detail .media-item video",
  );
  mediaElements.forEach(function (item) {
    if (item.tagName === "IMG") {
      lightboxItems.push({ src: item.src, type: "img" });
    } else if (item.tagName === "VIDEO") {
      lightboxItems.push({ src: item.src, type: "video" });
    }
  });

  // 클릭한 미디어의 인덱스 찾기
  currentLightboxIndex = lightboxItems.findIndex(function (item) {
    return item.src === src;
  });
  if (currentLightboxIndex === -1) currentLightboxIndex = 0;

  if (lightbox) {
    createDots();
    showCurrentMedia();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    updateArrowVisibility();
    updateDots();
  }
}

function createDots() {
  var dotsContainer = document.getElementById("lightbox-dots");
  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";
  for (var i = 0; i < lightboxItems.length; i++) {
    var dot = document.createElement("span");
    dot.className = "lightbox-dot";
    dot.setAttribute("data-index", i);
    dot.onclick = function (e) {
      e.stopPropagation();
      var index = parseInt(this.getAttribute("data-index"));
      currentLightboxIndex = index;
      showCurrentMedia();
      updateArrowVisibility();
      updateDots();
    };
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  var dots = document.querySelectorAll(".lightbox-dot");
  dots.forEach(function (dot, index) {
    if (index === currentLightboxIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function showCurrentMedia() {
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxVideo = document.getElementById("lightbox-video");
  var current = lightboxItems[currentLightboxIndex];

  if (!current) return;

  if (current.type === "img") {
    lightboxImg.src = current.src;
    lightboxImg.style.display = "block";
    if (lightboxVideo) {
      lightboxVideo.style.display = "none";
      lightboxVideo.pause();
    }
  } else {
    if (lightboxVideo) {
      lightboxVideo.src = current.src;
      lightboxVideo.style.display = "block";
      lightboxVideo.play();
    }
    lightboxImg.style.display = "none";
  }
}

function closeLightbox(e) {
  // 이미지, 비디오, 화살표, dots 클릭 시에는 닫지 않음
  if (
    e &&
    (e.target.tagName === "IMG" ||
      e.target.tagName === "VIDEO" ||
      e.target.classList.contains("lightbox-prev") ||
      e.target.classList.contains("lightbox-next") ||
      e.target.classList.contains("lightbox-dot"))
  ) {
    return;
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxVideo = document.getElementById("lightbox-video");
  if (lightbox) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    if (lightboxVideo) {
      lightboxVideo.pause();
    }
  }
}

function prevLightboxImage(e) {
  if (e) e.stopPropagation();
  if (currentLightboxIndex > 0) {
    currentLightboxIndex--;
    showCurrentMedia();
    updateArrowVisibility();
    updateDots();
  }
}

function nextLightboxImage(e) {
  if (e) e.stopPropagation();
  if (currentLightboxIndex < lightboxItems.length - 1) {
    currentLightboxIndex++;
    showCurrentMedia();
    updateArrowVisibility();
    updateDots();
  }
}

function updateArrowVisibility() {
  var prevBtn = document.querySelector(".lightbox-prev");
  var nextBtn = document.querySelector(".lightbox-next");

  if (prevBtn) {
    prevBtn.style.display = currentLightboxIndex > 0 ? "block" : "none";
  }
  if (nextBtn) {
    nextBtn.style.display =
      currentLightboxIndex < lightboxItems.length - 1 ? "block" : "none";
  }
}

// ESC 키로 라이트박스 닫기, 화살표 키로 이미지 이동
document.addEventListener("keydown", function (e) {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox || !lightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    prevLightboxImage(e);
  } else if (e.key === "ArrowRight") {
    nextLightboxImage(e);
  }
});

// 모바일 스와이프 지원
document.addEventListener(
  "touchstart",
  function (e) {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

document.addEventListener(
  "touchend",
  function (e) {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true },
);

function handleSwipe() {
  var swipeThreshold = 50;
  var diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 왼쪽으로 스와이프 → 다음 이미지
      nextLightboxImage();
    } else {
      // 오른쪽으로 스와이프 → 이전 이미지
      prevLightboxImage();
    }
  }
}

// 상세 페이지 이미지/비디오 클릭 이벤트 (이벤트 위임)
document.addEventListener("click", function (e) {
  var mediaItem = e.target.closest(".media-item");
  if (!mediaItem) return;

  if (e.target.tagName === "IMG") {
    openLightbox(e.target.src, "img");
  } else if (e.target.tagName === "VIDEO") {
    openLightbox(e.target.src, "video");
  }
});

// 이미지 우클릭 방지
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
    e.preventDefault();
    return false;
  }
});
