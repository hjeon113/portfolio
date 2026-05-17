(function () {
  // ---- 더미 DOM (script.js 의존성) ----
  ["sidebar", "menuBtn"].forEach(function (id) {
    if (!document.getElementById(id)) {
      var el = document.createElement("div");
      el.id = id;
      el.style.display = "none";
      if (id === "sidebar") {
        el.innerHTML =
          '<div class="sidebar-header"></div><div class="header-links"></div><nav>' +
          '<div class="nav-section" id="section-pro"><div class="nav-title"></div><ul class="nav-list"></ul><div class="toggle-btn"></div></div>' +
          '<div class="nav-section" id="section-self"><div class="nav-title"></div><ul class="nav-list"></ul><div class="toggle-btn"></div></div>' +
          '<div class="nav-section" id="section-exp"><div class="nav-title"></div><ul class="nav-list"></ul><div class="toggle-btn"></div></div>' +
          "</nav>";
      }
      document.body.appendChild(el);
    }
  });
  if (!document.querySelector(".mobile-header")) {
    var mh = document.createElement("div");
    mh.className = "mobile-header";
    mh.style.display = "none";
    document.body.appendChild(mh);
  }

  // ---- 로고 클릭: All로 리셋 후 인덱스 ----
  window.resetToAll = function () {
    var allTab = document.querySelector(".f-tab");
    if (allTab && typeof window.filterProjects === "function") {
      window.filterProjects(allTab, "all");
    }
    if (typeof window.showIndex === "function") window.showIndex();
  };

  // ---- filterProjects ----
  window.filterProjects = function (el, cat) {
    document.querySelectorAll(".f-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    el.classList.add("active");

    var cols = Array.from(document.querySelectorAll(".grid-col"));
    if (!cols.length) return;
    var allCards = Array.from(document.querySelectorAll(".project-card"));

    // 원래 column 위치 + column 내 인덱스 최초 1회 기록
    allCards.forEach(function (card) {
      if (card.dataset.origCol === undefined || card.dataset.origCol === "") {
        var parent = card.parentElement;
        var colIdx = cols.indexOf(parent);
        var siblingIdx = parent
          ? Array.from(parent.querySelectorAll(".project-card")).indexOf(card)
          : 0;
        card.dataset.origCol = String(colIdx >= 0 ? colIdx : 0);
        card.dataset.origIdx = String(siblingIdx);
      }
    });

    if (cat === "all") {
      // 원래 column으로 모은 뒤 origIdx 순으로 정렬해서 복원
      var byCol = cols.map(function () { return []; });
      allCards.forEach(function (card) {
        card.style.display = "";
        var orig = parseInt(card.dataset.origCol, 10) || 0;
        byCol[orig].push(card);
      });
      byCol.forEach(function (list, i) {
        list.sort(function (a, b) {
          return (
            parseInt(a.dataset.origIdx, 10) - parseInt(b.dataset.origIdx, 10)
          );
        });
        list.forEach(function (card) {
          cols[i].appendChild(card);
        });
      });
      return;
    }

    // 필터링: 보이는 카드만 masonry(가장 짧은 column에 추가)로 재배치
    var visible = [];
    allCards.forEach(function (card) {
      var hasTag = card.querySelector(".tag-" + cat);
      if (hasTag) {
        card.style.display = "";
        visible.push(card);
      } else {
        card.style.display = "none";
      }
    });
    // detach 후 각 카드를 가장 짧은 column에 차례로 append
    visible.forEach(function (card) {
      if (card.parentElement) card.parentElement.removeChild(card);
    });
    visible.forEach(function (card) {
      var shortest = cols[0];
      cols.forEach(function (col) {
        if (col.offsetHeight < shortest.offsetHeight) shortest = col;
      });
      shortest.appendChild(card);
    });
  };

  // ---- 패널 너비 감지 ----
  window.checkPaneWidths = function () {
    var wrap = document.getElementById("paneLeft");
    var left = document.getElementById("paneLeftScroll");
    var right = document.getElementById("paneRight");
    if (wrap && left) {
      var wrapW = wrap.offsetWidth;
      left.classList.remove("col1", "col2", "col3");
      if (wrapW > 0 && wrapW < 600) left.classList.add("col1");
      else if (wrapW >= 600 && wrapW < 900) left.classList.add("col2");
    }
    if (right) right.classList.toggle("narrow", right.offsetWidth < 600);
  };
  document.addEventListener("mousemove", window.checkPaneWidths);
  window.addEventListener("resize", window.checkPaneWidths);
  setTimeout(window.checkPaneWidths, 200);

  // ---- 카운트다운 동기화 ----
  function syncCountdown() {
    var src = document.getElementById("sunsetTime");
    var loc = document.getElementById("sunsetLocation");
    var text = src ? src.textContent : "";
    var locText = loc ? loc.textContent : "";
    var dst = document.getElementById("rightCountdown");
    var dstLoc = document.getElementById("rightLocation");
    if (dst) dst.textContent = text;
    if (dstLoc) dstLoc.textContent = locText;
    document.querySelectorAll(".overlay-countdown").forEach(function (e) {
      e.textContent = text;
    });
    document.querySelectorAll(".overlay-location").forEach(function (e) {
      e.textContent = locText;
    });
  }

  // ---- OVERLAY 열기/닫기 ----
  function syncOverlayBodyClass() {
    var pd = document.getElementById("project-detail");
    var ao = document.getElementById("about-overlay");
    var bo = document.getElementById("blog-overlay");
    var anyVisible =
      (pd && pd.classList.contains("visible")) ||
      (ao && ao.classList.contains("visible")) ||
      (bo && bo.classList.contains("visible"));
    document.body.classList.toggle("has-overlay-open", !!anyVisible);
  }
  window.__syncOverlayBodyClass = syncOverlayBodyClass;

  function openOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
      el.scrollTop = 0;
      el.classList.add("visible");
    }
    var bg = document.getElementById("bg-gradient");
    if (bg) bg.style.zIndex = "9499";
    // split-layout 숨겨서 오버레이 뒤로 비치지 않게
    var sl = document.getElementById("splitLayout");
    if (sl) sl.style.visibility = "hidden";
    var dw = document.getElementById("detailDrawer");
    if (dw) dw.style.visibility = "hidden";
    syncOverlayBodyClass();
  }

  function closeOverlayById(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("visible");
    var anyOpen = ["about-overlay", "blog-overlay"].some(function (oid) {
      if (oid === id) return false;
      var o = document.getElementById(oid);
      return o && o.classList.contains("visible");
    });
    if (!anyOpen) {
      var bg = document.getElementById("bg-gradient");
      if (bg) bg.style.zIndex = "0";
      // split-layout 복원
      var sl = document.getElementById("splitLayout");
      if (sl) sl.style.visibility = "";
      var dw = document.getElementById("detailDrawer");
      if (dw) dw.style.visibility = "";
    }
    if (typeof clearTrailCanvas === "function") clearTrailCanvas();
    syncOverlayBodyClass();
  }

  window.closeAboutOverlay = function () {
    closeOverlayById("about-overlay");
  };
  window.closeBlogOverlay = function () {
    closeOverlayById("blog-overlay");
  };

  // ---- showAbout / showBlog ----
  window.showAbout = function (skipHistory) {
    if (typeof stopAllVideos === "function") stopAllVideos();
    closeOverlayById("blog-overlay");
    openOverlay("about-overlay");
    if (!skipHistory) history.pushState({ view: "about" }, "", "#about");
  };

  window.showBlog = function () {
    if (typeof stopAllVideos === "function") stopAllVideos();
    closeOverlayById("about-overlay");
    var listEl = document.getElementById("blogOverlayList");
    var postEl = document.getElementById("blogPostView");
    if (listEl) listEl.style.display = "";
    if (postEl) postEl.classList.remove("active");
    renderBlogGrid();
    openOverlay("blog-overlay");
    history.pushState({ view: "blog" }, "", "#blog");
  };

  // ---- OVERLAY DOM 생성 ----
  function createOverlays() {
    if (!document.getElementById("about-overlay")) {
      var aboutOv = document.createElement("div");
      aboutOv.id = "about-overlay";
      aboutOv.className = "fullpage-overlay";
      var existingAbout = document.getElementById("about-view");
      var aboutHTML = existingAbout ? existingAbout.innerHTML : "";
      aboutOv.innerHTML =
        '<div class="overlay-scroll-wrap">' +
        '<div class="about-inner">' +
        '<button class="fp-back fp-back-top" onclick="closeAboutOverlay()">&#8592; Back</button>' +
        aboutHTML +
        "</div>" +
        '<div class="overlay-grad-bar" id="aboutGradBar">' +
        '<div class="fp-footer-info">' +
        '<span class="overlay-countdown"></span>' +
        '<span class="fp-footer-location overlay-location"></span>' +
        "</div>" +
        "</div>" +
        "</div>";
      document.body.appendChild(aboutOv);
    }

    if (!document.getElementById("blog-overlay")) {
      var blogOv = document.createElement("div");
      blogOv.id = "blog-overlay";
      blogOv.className = "fullpage-overlay";
      blogOv.innerHTML =
        '<div class="overlay-scroll-wrap">' +
        '<div id="blogOverlayList" class="blog-overlay-list">' +
        '<button class="fp-back fp-back-top" onclick="closeBlogOverlay()">&#8592; Back</button>' +
        '<div class="blog-grid" id="blogOverlayGrid"></div>' +
        "</div>" +
        '<div id="blogPostView" class="blog-post-view">' +
        '<button class="fp-back fp-back-top" onclick="closeBlogPost()">&#8592; Back</button>' +
        '<div class="blog-post-header">' +
        '<h1 id="blogPostTitle"></h1>' +
        '<p class="post-date" id="blogPostDate"></p>' +
        "</div>" +
        '<div id="blogPostBody"></div>' +
        "</div>" +
        '<div class="overlay-grad-bar" id="blogGradBar">' +
        '<div class="fp-footer-info">' +
        '<span class="overlay-countdown"></span>' +
        '<span class="fp-footer-location overlay-location"></span>' +
        "</div>" +
        "</div>" +
        "</div>";
      document.body.appendChild(blogOv);
    }
  }

  // ---- 블로그 그리드 렌더 ----
  var BLOG_ACTIVE = false; // 블로그 준비되면 true로 변경

  function renderBlogGrid() {
    var grid = document.getElementById("blogOverlayGrid");
    if (!grid) return;
    if (!BLOG_ACTIVE) {
      grid.innerHTML =
        '<div style="padding-top:60px;display:flex;flex-direction:column;gap:8px;">' +
        '<p style="font-size:0.85rem;font-weight:500;color:#000;">In Progress</p>' +
        '<p style="font-size:0.85rem;color:rgba(0,0,0,0.4);line-height:1.6;">Writing in progress.<br>Coming soon.</p>' +
        "</div>";
      return;
    }
    if (!window.blogData || window.blogData.length === 0) {
      grid.innerHTML =
        '<p style="font-size:0.85rem;color:rgba(0,0,0,0.4);padding-top:32px;">Coming soon.</p>';
      return;
    }
    grid.innerHTML = window.blogData
      .map(function (post) {
        var thumbContent = post.thumbnail
          ? '<img src="' + post.thumbnail + '" alt="">'
          : '<div class="blog-card-thumb-placeholder"><span>no image</span></div>';
        return (
          '<div class="blog-card" onclick="openBlogPost(\'' +
          post.id +
          "')\">" +
          '<div class="blog-card-thumb">' +
          thumbContent +
          "</div>" +
          '<p class="blog-card-date">' +
          post.date +
          "</p>" +
          '<p class="blog-card-title">' +
          post.title +
          "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  window.openBlogPost = function (id) {
    var post = (window.blogData || []).find(function (p) {
      return p.id === id;
    });
    if (!post) return;
    var listEl = document.getElementById("blogOverlayList");
    var postEl = document.getElementById("blogPostView");
    if (listEl) listEl.style.display = "none";
    if (postEl) {
      postEl.classList.add("active");
      document.getElementById("blogPostTitle").textContent = post.title;
      document.getElementById("blogPostDate").textContent = post.date;
      var bodyEl = document.getElementById("blogPostBody");
      bodyEl.innerHTML = (post.content || [])
        .map(function (block) {
          if (block.type === "text")
            return '<p class="post-block-text">' + block.value + "</p>";
          if (block.type === "image") {
            var cap = block.caption
              ? "<figcaption>" + block.caption + "</figcaption>"
              : "";
            var imgTag = block.src
              ? '<img src="' + block.src + '" alt="">'
              : '<div style="width:100%;aspect-ratio:16/9;background:#f0f0f0;display:flex;align-items:center;justify-content:center;"><span style="font-size:0.72rem;color:rgba(0,0,0,0.25);">image placeholder</span></div>';
            return (
              '<figure class="post-block-image">' + imgTag + cap + "</figure>"
            );
          }
          return "";
        })
        .join("");
    }
    var ov = document.getElementById("blog-overlay");
    if (ov) ov.scrollTop = 0;
    history.pushState({ view: "blog-post", id: id }, "", "#blog/" + id);
  };

  window.closeBlogPost = function () {
    var listEl = document.getElementById("blogOverlayList");
    var postEl = document.getElementById("blogPostView");
    if (postEl) postEl.classList.remove("active");
    if (listEl) listEl.style.display = "";
    var ov = document.getElementById("blog-overlay");
    if (ov) ov.scrollTop = 0;
    history.pushState({ view: "blog" }, "", "#blog");
  };

  // ---- popstate ----
  window.addEventListener("popstate", function (e) {
    var state = e.state;
    if (!state) {
      closeOverlayById("about-overlay");
      closeOverlayById("blog-overlay");
      return;
    }
    if (state.view === "about") {
      openOverlay("about-overlay");
    } else if (state.view === "blog") {
      closeOverlayById("about-overlay");
      var listEl = document.getElementById("blogOverlayList");
      var postEl = document.getElementById("blogPostView");
      if (listEl) listEl.style.display = "";
      if (postEl) postEl.classList.remove("active");
      openOverlay("blog-overlay");
    } else if (state.view === "blog-post") {
      window.openBlogPost(state.id);
    } else {
      closeOverlayById("about-overlay");
      closeOverlayById("blog-overlay");
    }
  });

  // ESC 키
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var postEl = document.getElementById("blogPostView");
      if (postEl && postEl.classList.contains("active")) {
        window.closeBlogPost();
        return;
      }
      closeOverlayById("about-overlay");
      closeOverlayById("blog-overlay");
    }
  });

  // ---- 언어 토글 ----
  var currentLang = "en";
  window.toggleLang = function () {
    currentLang = currentLang === "en" ? "kr" : "en";
    var btn = document.getElementById("langToggle");
    if (btn) btn.textContent = currentLang === "en" ? "EN" : "KR";
    window.updateLang();
  };
  window.updateLang = function () {
    document.querySelectorAll(".desc-en").forEach(function (el) {
      el.style.display = currentLang === "en" ? "block" : "none";
    });
    document.querySelectorAll(".desc-kr").forEach(function (el) {
      el.style.display = currentLang === "kr" ? "block" : "none";
    });
    document.querySelectorAll(".lang-en").forEach(function (el) {
      el.style.display = currentLang === "en" ? "inline" : "none";
    });
    document.querySelectorAll(".lang-kr").forEach(function (el) {
      el.style.display = currentLang === "kr" ? "inline" : "none";
    });
    document.querySelectorAll(".drawer-title").forEach(function (el) {
      el.style.display = currentLang === "en" ? "block" : "none";
    });
    document.querySelectorAll(".drawer-title-kr").forEach(function (el) {
      el.style.display = currentLang === "kr" ? "block" : "none";
    });
    document.querySelectorAll(".project-card").forEach(function (card) {
      var id = card.getAttribute("data-project");
      if (!id || typeof projectsData === "undefined" || !projectsData[id])
        return;
      var p = projectsData[id];
      var titleEl = card.querySelector(".project-title-en");
      if (titleEl)
        titleEl.textContent = currentLang === "en" ? p.title : p.titleKr;
    });
  };

  // ---- 드로어 토글 ----
  window.toggleDrawer = function () {
    var drawer = document.getElementById("detailDrawer");
    var btn = drawer ? drawer.querySelector(".drawer-btn") : null;
    if (!drawer) return;
    var isOpen = drawer.classList.toggle("open");
    if (btn) btn.textContent = isOpen ? "↓" : "↑";
  };

  // 컨텐츠(이미지) 영역 클릭 시 drawer 닫기
  document.addEventListener("click", function (e) {
    var drawer = document.getElementById("detailDrawer");
    if (!drawer || !drawer.classList.contains("open")) return;
    if (drawer.contains(e.target)) return;
    var content = e.target.closest("#project-detail .detail-content");
    if (!content) return;
    drawer.classList.remove("open");
    var btn = drawer.querySelector(".drawer-btn");
    if (btn) btn.textContent = "↑";
  });


  // ---- :has() 대체: 관련 요소의 class 변화를 관찰해 body에 상태 반영 ----
  function installOverlayObserver() {
    var targets = ["project-detail", "about-overlay", "blog-overlay"];
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(syncOverlayBodyClass);
    targets.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    });
    syncOverlayBodyClass();
  }

  // ---- 초기화 ----
  function init() {
    createOverlays();
    installOverlayObserver();

    setInterval(syncCountdown, 1000);
    window.updateLang();
    var hash = window.location.hash;
    if (hash === "#about") {
      setTimeout(function () {
        openOverlay("about-overlay");
      }, 100);
    } else if (hash.indexOf("#blog/") === 0) {
      var postId = hash.replace("#blog/", "");
      setTimeout(function () {
        window.showBlog();
        window.openBlogPost(postId);
      }, 100);
    } else if (hash === "#blog") {
      setTimeout(function () {
        window.showBlog();
      }, 100);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 50);
    });
  } else {
    setTimeout(init, 50);
  }
})();
