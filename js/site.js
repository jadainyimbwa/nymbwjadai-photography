(function () {
  const D = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- dropdown menu (every page) ---------- */
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.innerHTML =
    "<nav>" +
    D.series.map((s) => '<a href="' + s.page + '"><span>' + s.num + "</span>" + s.title + "</a>").join("") +
    '<a href="about.html"><span>—</span>Information</a></nav>';
  const header = document.querySelector(".site-header");
  header.after(menu);

  const btn = document.querySelector("[data-menu]");
  const misc = document.createElement("a");
  misc.href = "miscellaneous.html";
  misc.textContent = "Miscellaneous";
  misc.className = "header-link" + (location.pathname.endsWith("miscellaneous.html") ? " active" : "");
  header.insertBefore(misc, btn);
  const setMenu = (on) => {
    menu.classList.toggle("open", on);
    btn.textContent = on ? "Close" : "Menu";
  };
  const closeMenu = () => setMenu(false);
  btn.addEventListener("click", () => {
    if (window.matchMedia("(hover: hover)").matches) setMenu(true);
    else setMenu(!menu.classList.contains("open"));
  });
  // hover to open on devices with a mouse (touch devices keep tap-to-toggle)
  if (window.matchMedia("(hover: hover)").matches) {
    let timer;
    const keep = () => clearTimeout(timer);
    const leave = () => { keep(); timer = setTimeout(closeMenu, 250); };
    btn.addEventListener("mouseenter", () => { keep(); setMenu(true); });
    [btn, header, menu].forEach((el) => {
      el.addEventListener("mouseenter", keep);
      el.addEventListener("mouseleave", leave);
    });
  }
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });

  
/* ---------- gallery viewer ---------- */
const key = document.body.dataset.series;

/* ---------- homepage: project selection ---------- */
if (key === "home") {
  const list = $("#series-list");

  list.innerHTML = D.series.map((s, n) => {
    const cover = s.cover || s.images[0];

    return `
      <a class="project-card" href="${s.page}">
        <div class="project-image-wrap">
          <img
            src="${cover}"
            alt="${s.title}"
            loading="${n === 0 ? "eager" : "lazy"}"
          >
        </div>

        <div class="project-caption">
          <span>${s.num}</span>
          <span>${s.title}</span>
        </div>
      </a>
    `;
  }).join("");

  return;
}

const series = key === "misc" ? D.misc : D.series[Number(key)];

  if (!series) {
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    return;
  }

  const imgs = series.images;
  const photo = $("#photo");
  const count = $("#count");
  const grid = $("#grid");
  const toggle = $("#toggle");
  let i = Math.max(0, Math.min(imgs.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));

  grid.innerHTML = imgs
    .map((src, n) => '<button data-i="' + n + '" aria-label="Open image ' + (n + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>')
    .join("");

  function show(n) {
    i = (n + imgs.length) % imgs.length;
    photo.style.opacity = 0;
    setTimeout(() => { photo.src = imgs[i]; }, 150);
    count.textContent = pad(i + 1) + " / " + pad(imgs.length);
    history.replaceState(null, "", "#" + (i + 1));
    new Image().src = imgs[(i + 1) % imgs.length]; // preload next
    if (typeof lb !== "undefined" && lb.classList.contains("open")) lbImg.src = imgs[i];
  }
  photo.addEventListener("load", () => { photo.style.opacity = 1; });

  function setOverview(on) {
    document.body.classList.toggle("overview", on);
    toggle.textContent = on ? "Close Overview" : "Overview";
  }

  $(".prev").addEventListener("click", () => show(i - 1));
  $(".next").addEventListener("click", () => show(i + 1));
  toggle.addEventListener("click", () => setOverview(!document.body.classList.contains("overview")));
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    setOverview(false);
    show(Number(b.dataset.i));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); setOverview(false); }
    else if (e.key === "ArrowLeft") show(i - 1);
    else if (e.key === "ArrowRight") show(i + 1);
  });


  // swipe on touch screens
  let x0 = null;
  $(".stage").addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  $(".stage").addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });

  // full-screen view
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
 
  photo.style.cursor = "zoom-in";
  photo.addEventListener("click", () => {
    lbImg.src = imgs[i];
    lb.classList.add("open");
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lb.classList.remove("open");
  });

  if (key === "misc") setOverview(true);

  show(i);
})();
