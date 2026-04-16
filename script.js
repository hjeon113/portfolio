// ============================================
// 메인 기능 코드
// 이 파일은 수정할 필요 없음
// 프로젝트 추가/수정은 projects-data.js에서!
// ============================================

var keys = [];

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
    // 첫 적용 시 transition 없이 즉시 적용
    if (!window._bgFirstApply) {
      bgEl.style.transition = "none";
      bgEl.style.background = gradient;
      bgEl.offsetHeight; // force reflow
      bgEl.style.transition = "";
      window._bgFirstApply = true;
    } else {
      bgEl.style.background = gradient;
    }
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

    // API 실패 시에도 기본 일출/일몰로 그라디언트 적용
    if (!sunsetData.sunset || !sunsetData.sunrise) {
      var today = new Date();
      // NYC 기준 대략적인 일출 6:30, 일몰 19:30
      sunsetData.sunrise = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 30);
      sunsetData.sunset = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 30);
      var tmr = new Date(today);
      tmr.setDate(tmr.getDate() + 1);
      sunsetData.tomorrowSunrise = new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), 6, 30);
      sunsetData.tomorrowSunset = new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), 19, 30);
      updateBackgroundByTime();
      setInterval(updateBackgroundByTime, 30000);
    }
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
  window._bgFirstApply = false;
  var bgEl = document.getElementById("bg-gradient");
  if (bgEl) {
    bgEl.style.background = "#ffffff";
  } else {
    document.documentElement.style.background = "#ffffff";
  }

  initSunsetCountdown(); // 일몰 카운트다운 초기화 (배경도 여기서 적용)

  if (typeof projectsData !== "undefined") {
    keys = Object.keys(projectsData);
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
    window._bgFirstApply = false;
    initSunsetCountdown();
    // bfcache 복원 시 autoplay 비디오 재시작
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      v.play().catch(function () {});
    });
  }
});

// 인앱 브라우저 autoplay 차단 우회: 첫 터치/스크롤 시 모든 멈춘 비디오 재생
(function () {
  function playAllPaused() {
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      if (v.paused) {
        v.muted = true;
        v.play().catch(function () {});
      }
    });
    // 한 번만 실행
    document.removeEventListener("touchstart", playAllPaused, true);
    document.removeEventListener("touchend", playAllPaused, true);
    document.removeEventListener("scroll", playAllPaused, true);
    document.removeEventListener("click", playAllPaused, true);
  }
  document.addEventListener("touchstart", playAllPaused, true);
  document.addEventListener("touchend", playAllPaused, true);
  document.addEventListener("scroll", playAllPaused, true);
  document.addEventListener("click", playAllPaused, true);
})();

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


// 프로젝트 그리드 자동 생성
function generateProjectGrid() {
  var grid = document.querySelector(".project-grid");
  if (!grid) return;

  grid.innerHTML = "";
  var gridCols = [];
  for (var c = 0; c < 3; c++) {
    var gcol = document.createElement("div");
    gcol.className = "grid-col";
    grid.appendChild(gcol);
    gridCols.push(gcol);
  }
  var randomIdx = 0;

  var categoryTags = {
    "descente-social": [
      ["Graphic", "tag-graphic"],
      ["Motion", "tag-motion"],
    ],
    "descente-exhibition": [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
    ],
    "collection-renewal": [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
      ["Motion", "tag-motion"],
    ],
    "galleria-2023": [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
      ["Motion", "tag-motion"],
    ],
    "iap-residency": [
      ["Graphic", "tag-graphic"],
      ["Motion", "tag-motion"],
    ],
    "jade-sujin-lee": [
      ["Graphic", "tag-graphic"],
      ["Motion", "tag-motion"],
    ],
    "other-islands": [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
      ["Motion", "tag-motion"],
    ],
    "digital-religion": [["Graphic", "tag-graphic"]],
    "language-contagion": [
      ["Graphic", "tag-graphic"],
      ["Experiment", "tag-exp"],
    ],
    palindrome: [
      ["Graphic", "tag-graphic"],
      ["Motion", "tag-motion"],
    ],
    imoa: [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
      ["Motion", "tag-motion"],
    ],
    ilmin: [
      ["Graphic", "tag-graphic"],
      ["Identity", "tag-identity"],
      ["Motion", "tag-motion"],
    ],
    "running-back": [["Graphic", "tag-graphic"]],
    "hype-slider": [["Experiment", "tag-exp"]],
    "gesture-archive": [["Experiment", "tag-exp"]],
    scroll: [["Experiment", "tag-exp"]],
    "digital-error": [["Experiment", "tag-exp"]],
    "question-imagination": [
      ["Graphic", "tag-graphic"],
      ["Motion", "tag-motion"],
    ],
  };

  // 썸네일 비디오 IntersectionObserver
  if ("IntersectionObserver" in window) {
    window._thumbObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            v.play().catch(function () {
              v.addEventListener("canplay", function h() {
                v.removeEventListener("canplay", h);
                v.play().catch(function () {});
              });
            });
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.1 },
    );
  }

  // 고정 프로젝트(상단 순서대로, 2줄 x 3칸) + 나머지 랜덤 셔플
  var pinnedIds = [
    "other-islands",
    "galleria-2023",
    "iap-residency",
    "descente-social",
    "palindrome",
    "hype-slider",
  ];
  var allIds = Object.keys(projectsData);
  var restIds = allIds.filter(function (id) {
    return pinnedIds.indexOf(id) === -1;
  });
  for (var i = restIds.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = restIds[i];
    restIds[i] = restIds[j];
    restIds[j] = tmp;
  }
  var orderedPinned = pinnedIds.filter(function (id) {
    return projectsData[id];
  });
  var ids = orderedPinned.concat(restIds);

  for (var k = 0; k < ids.length; k++) {
    var id = ids[k];
    var p = projectsData[id];
    var article = document.createElement("article");
    article.className = "project-card";
    article.setAttribute("data-project", id);


    var thumbnailHtml = "";
    if (p.thumbnail) {
      if (p.thumbnail.match(/\.(mp4|mov)$/i)) {
        var posterPath = p.thumbnail.replace(/\.(mp4|mov)$/i, ".webp");
        var posterDim = (typeof imageDims !== "undefined") && imageDims[posterPath];
        var thumbWH = posterDim ? ' width="' + posterDim[0] + '" height="' + posterDim[1] + '"' : '';
        thumbnailHtml =
          '<video src="' +
          p.thumbnail +
          '" poster="' +
          posterPath +
          '"' + thumbWH +
          ' autoplay loop muted playsinline webkit-playsinline preload="auto"' +
          ' onloadeddata="this.closest(\'.project-thumbnail\').classList.add(\'loaded\')"></video>';
      } else {
        var thumbDim = (typeof imageDims !== "undefined") && imageDims[p.thumbnail];
        var thumbWH = thumbDim ? ' width="' + thumbDim[0] + '" height="' + thumbDim[1] + '"' : '';
        thumbnailHtml =
          '<img src="' + p.thumbnail + '" alt="' + p.titleEn + '"' + thumbWH +
          ' onload="this.closest(\'.project-thumbnail\').classList.add(\'loaded\')">';
      }
    }

    var tags = categoryTags[id] || [];
    var tagsHtml = tags
      .map(function (t) {
        return '<span class="tag ' + t[1] + '">' + t[0] + "</span>";
      })
      .join("");

    article.innerHTML =
      '<div class="project-thumbnail">' +
      thumbnailHtml +
      "</div>" +
      '<div class="project-card-info">' +
      '<span class="project-title-en">' +
      p.titleEn +
      "</span>" +
      '<div class="project-tags">' +
      tagsHtml +
      "</div>" +
      "</div>";

    article.addEventListener("click", function () {
      showProject(this.getAttribute("data-project"));
    });

    var pinIdx = orderedPinned.indexOf(id);
    if (pinIdx !== -1) {
      gridCols[pinIdx % 3].appendChild(article);
    } else {
      gridCols[randomIdx % 3].appendChild(article);
      randomIdx++;
    }

    var thumbVideo = article.querySelector(".project-thumbnail video");
    if (thumbVideo) {
      thumbVideo.muted = true;
      if (window._thumbObserver) {
        window._thumbObserver.observe(thumbVideo);
      } else {
        thumbVideo.play().catch(function () {
          thumbVideo.addEventListener("canplay", function h() {
            thumbVideo.removeEventListener("canplay", h);
            thumbVideo.play().catch(function () {});
          });
        });
      }
      // 인앱 브라우저(인스타 등)에서 autoplay 차단 시 터치로 강제 재생
      if (thumbVideo.paused) {
        window._pendingVideos = window._pendingVideos || [];
        window._pendingVideos.push(thumbVideo);
      }
    }
  }
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
  var iv = document.getElementById("index-view");
  if (iv) iv.style.display = "block";
  var pd = document.getElementById("project-detail");
  if (pd) {
    pd.classList.remove("active");
    pd.style.display = "none";
  }
  var av = document.getElementById("about-view");
  if (av) av.classList.remove("active");

  // 패널 레이아웃 복원
  var wrap = document.getElementById("paneLeft");
  if (wrap) wrap.style.width = "75%";

  // 왼쪽 패널 스크롤 맨 위로
  var paneLeftScroll = document.getElementById("paneLeftScroll");
  if (paneLeftScroll) paneLeftScroll.scrollTop = 0;
  // 모바일: project-detail visible 제거
  var pd2 = document.getElementById("project-detail");
  if (pd2) pd2.classList.remove("visible");

  // col 클래스 리셋
  if (paneLeftScroll) {
    paneLeftScroll.classList.remove("col1", "col2");
  }

  // 캔버스 잔상 클리어
  if (typeof clearTrailCanvas === "function") clearTrailCanvas();
  document.querySelectorAll(".cursor-trail").forEach(function (el) {
    el.remove();
  });
  var rd = document.getElementById("rightDefault");
  if (rd) rd.style.display = "flex";
  var bv = document.getElementById("blog-view");
  if (bv) bv.style.display = "none";

  // 오버레이 닫기
  var ao = document.getElementById("about-overlay");
  if (ao) ao.classList.remove("visible");
  var bgEl = document.getElementById("bg-gradient");
  if (bgEl) bgEl.style.zIndex = "0";
  var bo = document.getElementById("blog-overlay");
  if (bo) bo.classList.remove("visible");
  // splitLayout visibility 복원 (openOverlay에서 숨긴 것 되돌리기)
  var sl = document.getElementById("splitLayout");
  if (sl) sl.style.visibility = "";
  var ff = document.getElementById("fp-fixed-footer");
  if (ff) ff.classList.remove("visible");
  var obg = document.getElementById("overlay-bg");
  if (obg) obg.classList.remove("visible");
  var bar = document.getElementById("fp-grad-bar");
  if (bar) bar.classList.remove("visible");

  closeMobileMenu();
  window.scrollTo(0, 0);
  if (!skipHistory) {
    history.pushState({ view: "index" }, "", "#");
  }

  // 프로젝트 카드 셔플
  shuffleProjectCards();

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
  var ao = document.getElementById("about-overlay");
  if (ao) {
    ao.scrollTop = 0;
    ao.classList.add("visible");
  }
  var bg = document.getElementById("bg-gradient");
  if (bg) bg.style.zIndex = "9499";
  // split-layout 숨기기
  var sl = document.getElementById("splitLayout");
  if (sl) sl.style.visibility = "hidden";
  if (typeof syncFooterGradient === "function") syncFooterGradient();
  closeMobileMenu();
  if (!skipHistory) {
    history.pushState({ view: "about" }, "", "#about");
  }
}

// 프로젝트 상세 보기
function showProject(id, skipHistory) {
  stopAllVideos();
  var p = projectsData[id];
  if (!p) return;

  var allKeys = Object.keys(projectsData);
  var idx = allKeys.indexOf(id);
  var next = allKeys[idx < allKeys.length - 1 ? idx + 1 : 0];

  // media HTML
  var mediaHtml = (p.media || [])
    .map(function (m) {
      var isGif = m.indexOf("gif:") === 0;
      if (isGif) m = m.replace("gif:", "");

      function mediaTag(src, asGif) {
        var onload = "this.closest('.media-item').classList.add('loaded')";
        if (src.match(/\.(mp4|webm|mov)$/i)) {
          return asGif
            ? '<video src="' +
                src +
                '" autoplay loop muted playsinline preload="auto" onloadeddata="' + onload + '"></video>'
            : '<video src="' +
                src +
                '" controls playsinline preload="auto" onloadeddata="' + onload + '"></video>';
        }
        var dim = (typeof imageDims !== "undefined") && imageDims[src];
        var wh = dim ? ' width="' + dim[0] + '" height="' + dim[1] + '"' : '';
        return '<img src="' + src + '" alt=""' + wh + ' onload="' + onload + '">';
      }

      if (
        m === "full" ||
        m === "placeholder" ||
        m === "col2" ||
        m === "col3" ||
        m === "col4"
      )
        return '<div class="media-item ' + m + ' placeholder"></div>';
      if (m.indexOf("iframe:") === 0) {
        var parts = m.replace("iframe:", "").split("::");
        return (
          '<div class="media-item full media-iframe"><iframe src="' +
          parts[0] +
          '" frameborder="0" allowfullscreen></iframe><p class="iframe-hint"><span>' +
          (parts[1] || "↑ Interact with the project above") +
          "</span></p></div>"
        );
      }
      if (m.indexOf("gallery:") === 0) {
        var gsrcs = m.replace("gallery:", "").split("|");
        var slides = gsrcs
          .map(function (s) {
            return '<div class="gallery-slide">' + mediaTag(s, isGif) + "</div>";
          })
          .join("");
        var dots = gsrcs
          .map(function (_, i) {
            return (
              '<span class="gallery-dot' +
              (i === 0 ? " active" : "") +
              '" data-i="' +
              i +
              '"></span>'
            );
          })
          .join("");
        var chevL =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>';
        var chevR =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
        return (
          '<div class="media-item full gallery loaded" data-count="' +
          gsrcs.length +
          '">' +
          '<div class="gallery-viewport">' +
          '<div class="gallery-track">' +
          slides +
          "</div>" +
          "</div>" +
          '<button class="gallery-arrow prev" aria-label="Previous">' + chevL + "</button>" +
          '<button class="gallery-arrow next" aria-label="Next">' + chevR + "</button>" +
          '<div class="gallery-dots">' +
          dots +
          "</div>" +
          "</div>"
        );
      }
      if (m.indexOf("full:") === 0)
        return (
          '<div class="media-item full">' +
          mediaTag(m.replace("full:", ""), isGif) +
          "</div>"
        );
      if (m.indexOf("col2:") === 0)
        return (
          '<div class="media-item col2">' +
          mediaTag(m.replace("col2:", ""), isGif) +
          "</div>"
        );
      if (m.indexOf("col3:") === 0)
        return (
          '<div class="media-item col3">' +
          mediaTag(m.replace("col3:", ""), isGif) +
          "</div>"
        );
      if (m.indexOf("col4:") === 0)
        return (
          '<div class="media-item col4">' +
          mediaTag(m.replace("col4:", ""), isGif) +
          "</div>"
        );
      return '<div class="media-item">' + mediaTag(m, isGif) + "</div>";
    })
    .join("");

  var titleHtml = p.titleLink
    ? '<a href="' + p.titleLink + '" target="_blank" rel="noopener">' + p.titleEn + "</a>"
    : p.titleEn;
  var titleKrHtml = p.titleLink
    ? '<a href="' + p.titleLink + '" target="_blank" rel="noopener">' + p.titleKr + "</a>"
    : p.titleKr;

  var detail = document.getElementById("project-detail");
  if (!detail) return;

  detail.innerHTML =
    '<div class="detail-content">' +
    mediaHtml +
    "</div>" +
    '<div class="detail-drawer" id="detailDrawer">' +
    '<div class="detail-drawer-toggle" onclick="toggleDrawer()">' +
    '<div class="drawer-title-row">' +
    "<div>" +
    '<h1 class="drawer-title">' +
    titleHtml +
    "</h1>" +
    '<div class="drawer-title-kr kr">' +
    titleKrHtml +
    "</div>" +
    "</div>" +
    '<span class="drawer-btn">↑</span>' +
    "</div>" +
    "</div>" +
    '<div class="detail-drawer-body">' +
    '<p class="detail-desc desc-en">' +
    p.descEn +
    "</p>" +
    '<p class="detail-desc desc-kr">' +
    p.descKr +
    "</p>" +
    '<div class="detail-meta">' +
    (function () {
      function row(labelEn, labelKr, valueEn, valueKr) {
        if (!valueEn && !valueKr) return "";
        var vEn = valueEn || valueKr;
        var vKr = valueKr || valueEn;
        return (
          '<div class="meta-row">' +
          '<div class="meta-label">' +
          '<span class="lang-en">' + labelEn + "</span>" +
          '<span class="lang-kr">' + labelKr + "</span>" +
          "</div>" +
          "<div>" +
          '<span class="lang-en">' + vEn + "</span>" +
          '<span class="lang-kr">' + vKr + "</span>" +
          "</div>" +
          "</div>"
        );
      }
      return (
        row("Date", "날짜", p.date, p.date) +
        row("Work Area", "작업 분야", p.area, p.areaKr) +
        row("Medium", "매체", p.medium, p.mediumKr) +
        row("Spec", "사양", p.spec, p.specKr) +
        row("Client", "클라이언트", p.client, p.clientKr) +
        row("Director", "디렉터", p.director, p.directorKr) +
        row("Advisor", "지도", p.advisor, p.advisorKr) +
        row("Collaborator", "협업", p.collaborator, p.collaboratorKr) +
        row("Award", "수상", p.award, p.awardKr)
      );
    })() +
    "</div>" +
    '<nav class="detail-nav">' +
    '<a onclick="showIndex()" style="cursor:pointer">← Index</a>' +
    "<a onclick=\"showProject('" +
    next +
    '\')" style="cursor:pointer">Next →</a>' +
    "</nav>" +
    "</div>" +
    "</div>";

  // 패널 레이아웃 전환
  var wrap = document.getElementById("paneLeft");
  var leftScroll = document.getElementById("paneLeftScroll");
  if (leftScroll) {
    leftScroll.classList.remove("col1", "col2", "col3");
    leftScroll.classList.add("col1");
  }
  if (wrap) {
    wrap.style.width = "25%";
    wrap.addEventListener("transitionend", function onEnd() {
      wrap.removeEventListener("transitionend", onEnd);
      if (typeof checkPaneWidths === "function") checkPaneWidths();
    });
  }

  // 캔버스 잔상 클리어
  if (typeof clearTrailCanvas === "function") clearTrailCanvas();
  // div 트레일도 제거
  document.querySelectorAll(".cursor-trail").forEach(function (el) {
    el.remove();
  });

  // 오른쪽 패널 뷰 전환
  var rd = document.getElementById("rightDefault");
  if (rd) rd.style.display = "none";
  detail.style.display = "block";
  detail.classList.add("active");
  // 모바일: 풀스크린 오버레이
  if (window.innerWidth <= 768) {
    detail.classList.add("visible");
    detail.scrollTop = 0;
  }
  var bv = document.getElementById("blog-view");
  if (bv) bv.style.display = "none";
  var av = document.getElementById("about-view");
  if (av) av.classList.remove("active");

  var pr = document.getElementById("paneRight");
  if (pr) pr.scrollTop = 0;

  // 언어 상태 적용
  if (typeof updateLang === "function") updateLang();

  initGalleries();

  closeMobileMenu();
  if (!skipHistory) {
    history.pushState({ view: "project", id: id }, "", "#project/" + id);
  }
}

// 갤러리 초기화 (자동재생 + 화살표 + 스와이프)
function initGalleries() {
  var galleries = document.querySelectorAll("#project-detail .gallery");
  galleries.forEach(function (g) {
    var track = g.querySelector(".gallery-track");
    var slides = g.querySelectorAll(".gallery-slide");
    var dots = g.querySelectorAll(".gallery-dot");
    var count = slides.length;
    if (count <= 1) {
      var arrows = g.querySelectorAll(".gallery-arrow");
      arrows.forEach(function (a) { a.style.display = "none"; });
      return;
    }
    var idx = 0;
    var timer = null;
    var INTERVAL = 4000;

    function go(i) {
      idx = (i + count) % count;
      if (track) track.style.transform = "translateX(" + (-idx * 100) + "%)";
      dots.forEach(function (d, n) { d.classList.toggle("active", n === idx); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    g.querySelector(".gallery-arrow.next").addEventListener("click", function () { next(); start(); });
    g.querySelector(".gallery-arrow.prev").addEventListener("click", function () { prev(); start(); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { go(parseInt(d.dataset.i, 10)); start(); });
    });

    // 터치 스와이프 (모바일)
    var tx = 0, ty = 0, tracking = false;
    g.addEventListener("touchstart", function (e) {
      var t = e.touches[0]; tx = t.clientX; ty = t.clientY; tracking = true; stop();
    }, { passive: true });
    g.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - tx;
      var dy = t.clientY - ty;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(); else prev();
      }
      start();
    }, { passive: true });

    // 트랙패드 가로 스와이프 (PC)
    var wheelLock = false;
    g.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaX) < 12) return;
      wheelLock = true;
      if (e.deltaX > 0) next(); else prev();
      start();
      setTimeout(function () { wheelLock = false; }, 600);
    }, { passive: false });

    start();
  });
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

// 프로젝트 카드 셔플 (pinned는 고정, random만 재셔플/재분배)
function shuffleProjectCards() {
  var grid = document.querySelector(".project-grid");
  if (!grid) return;

  var cols = Array.from(grid.querySelectorAll(".grid-col"));
  if (cols.length !== 3) return;

  var pinnedIds = [
    "other-islands",
    "galleria-2023",
    "iap-residency",
    "descente-social",
    "palindrome",
    "hype-slider",
  ];

  var pinnedPerCol = [[], [], []];
  var randomCards = [];
  cols.forEach(function (col, idx) {
    var cards = Array.from(col.querySelectorAll(".project-card"));
    cards.forEach(function (card) {
      var id = card.getAttribute("data-project");
      if (pinnedIds.indexOf(id) !== -1) {
        pinnedPerCol[idx].push(card);
      } else {
        randomCards.push(card);
      }
    });
  });

  // random 셔플
  for (var i = randomCards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = randomCards[i];
    randomCards[i] = randomCards[j];
    randomCards[j] = t;
  }

  // 각 col: pinned 먼저, random은 round-robin
  cols.forEach(function (col, idx) {
    col.innerHTML = "";
    pinnedPerCol[idx].forEach(function (c) {
      col.appendChild(c);
    });
  });
  randomCards.forEach(function (card, idx) {
    cols[idx % 3].appendChild(card);
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

  // 최대 30개 초과 시 가장 오래된 것 제거
  var existing = document.querySelectorAll(".cursor-trail");
  if (existing.length >= 30) existing[0].remove();

  var trail = document.createElement("div");
  trail.className = "cursor-trail " + getTrailStyle();
  trail.style.left = e.clientX - 8 + "px";
  trail.style.top = e.clientY - 8 + "px";
  document.body.appendChild(trail);

  setTimeout(function () {
    trail.remove();
  }, 800);
});

// 이미지 우클릭 방지
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
    e.preventDefault();
    return false;
  }
});

// ============================================
// 우측 패널 캔버스 trail (안지워지고 쌓임)
// ============================================
(function () {
  var canvas, ctx, paneRight;
  var lastDrawTime = 0;

  window.clearTrailCanvas = function () {
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function initCanvas() {
    canvas = document.getElementById("trailCanvas");
    paneRight = document.getElementById("paneRight");
    if (!canvas || !paneRight) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    fadeTick();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 마우스가 멈춘 후 2초부터 서서히 페이드
  function fadeTick() {
    if (canvas && ctx) {
      var rd = document.getElementById("rightDefault");
      var ao = document.getElementById("about-overlay");
      var bo = document.getElementById("blog-overlay");
      var overlayOpen =
        (ao && ao.classList.contains("visible")) ||
        (bo && bo.classList.contains("visible"));
      var projectOpen = rd && rd.style.display === "none" && !overlayOpen;

      if (projectOpen || overlayOpen) {
        // 프로젝트 상세 또는 오버레이일 때 클리어
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // 메인 또는 오버레이: 2초 후 서서히 페이드
        var idle = Date.now() - lastDrawTime;
        if (idle > 2000) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,0.012)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    }
    requestAnimationFrame(fadeTick);
  }

  function drawOnCanvas(e) {
    if (window.innerWidth <= 768) return;
    if (!canvas || !ctx) return;

    var ao = document.getElementById("about-overlay");
    var bo = document.getElementById("blog-overlay");
    var overlayOpen =
      (ao && ao.classList.contains("visible")) ||
      (bo && bo.classList.contains("visible"));
    var rd = document.getElementById("rightDefault");

    if (overlayOpen) return;

    if (rd && rd.style.display === "none") return;
    if (!paneRight) return;
    var rect = paneRight.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right) return;
    if (e.clientY < rect.top || e.clientY > rect.bottom) return;

    lastDrawTime = Date.now();
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.left, rect.top, rect.width, rect.height);
    ctx.clip();
    drawDot(e.clientX, e.clientY);
    ctx.restore();
  }

  function drawDot(x, y) {
    var style = getTrailStyle();
    var ao = document.getElementById("about-overlay");
    var bo = document.getElementById("blog-overlay");
    var onOverlay =
      (ao && ao.classList.contains("visible")) ||
      (bo && bo.classList.contains("visible"));

    if (style === "sunny") {
      var g = ctx.createRadialGradient(x, y, 0, x, y, 10);
      g.addColorStop(0, "rgba(255,200,80,0.8)");
      g.addColorStop(1, "rgba(255,200,80,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rain") {
      ctx.fillStyle = "rgba(100,160,220,0.75)";
      ctx.beginPath();
      ctx.ellipse(x, y, 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "snow") {
      ctx.fillStyle = "rgba(180,210,240,0.85)";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // cloudy — 오버레이(흰 배경)에서는 더 진하게
      var alpha = onOverlay ? 0.25 : 0.45;
      var g2 = ctx.createRadialGradient(x, y, 0, x, y, 12);
      g2.addColorStop(0, "rgba(100,100,110," + alpha + ")");
      g2.addColorStop(1, "rgba(100,100,110,0)");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  document.addEventListener("mousemove", drawOnCanvas);

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(initCanvas, 300);
  });
})();
