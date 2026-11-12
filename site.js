/*
  naiyu.im-site — 简版双语作品集逻辑（原创）
  - 语言优先级：合法 ?lang=zh|en → 已存偏好 → 浏览器语言（zh 前缀为 zh，其余 en）→ zh
  - 切换语言同步 html lang、更新 query 并保留其他合法参数；项目名保持原文不翻译
  - 文案来自实施包 §4.2 已核验的 README 概括；不写真实姓名、个人贡献指标或未证实的产品能力
  - 待批准的发布候选：PTO Design Lab 正式地址；仅在目标上线核验后发布此作品集
*/
(function () {
  'use strict';

  var KEY_LANG = 'naiyu.im-site:lang';
  var KEY_THEME = 'naiyu.im-site:theme';

  var memory = {};
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v == null ? (memory[k] || null) : v; } catch (e) { return memory[k] || null; } },
    set: function (k, v) { memory[k] = v; try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var STRINGS = {
    zh: {
      htmlLang: 'zh-CN',
      skip: '跳到项目',
      tagline: '面向 AI Infra 工具链的体验设计与原型。',
      projectsTitle: '项目',
      github: 'GitHub',
      themeToDark: '切换到深色主题',
      themeToLight: '切换到浅色主题',
      githubProfile: 'GitHub 个人主页',
      roleOwner: '设计与实现',
      roleContrib: '贡献',
      openLocal: '本地预览',
      localOnly: '站点筹备中，当前只在本地整合预览中打开',
      page: '页面'
    },
    en: {
      htmlLang: 'en',
      skip: 'Skip to projects',
      tagline: 'Experience design and prototyping for AI infrastructure tools.',
      projectsTitle: 'Projects',
      github: 'GitHub',
      themeToDark: 'Switch to dark theme',
      themeToLight: 'Switch to light theme',
      githubProfile: 'GitHub profile',
      roleOwner: 'Design & build',
      roleContrib: 'Contribution',
      openLocal: 'Local preview',
      localOnly: 'Site in preparation; opens in the local integration preview only',
      page: 'Page'
    }
  };

  // 项目名保持原文；中英简介来自对各仓库 README 的概括。
  var PROJECTS = [
    {
      name: 'PTO Design Lab',
      role: 'owner',
      zh: 'AI Infra 工具链的业务研究、体验设计与交互原型。',
      en: 'Research, experience design, and interactive prototypes for AI infrastructure tools.',
      page: 'https://wangnaiyu.github.io/pto-design-lab/',
      cover: 'lab'
    },
    {
      name: 'PTO Swimlane',
      role: 'owner',
      zh: '在 Codex 中上传泳道文件，查询任务与依赖，辅助性能分析。',
      en: 'Upload swimlane traces in Codex and inspect tasks and dependencies for performance analysis.',
      github: 'https://github.com/wangnaiyu/pto-swimlane',
      cover: 'swimlane'
    },
    {
      name: 'PTO Agent Workbench',
      role: 'owner',
      zh: '面向 PTO 算子设计、调试与调优的会话和运行工作台。',
      en: 'A session and run workbench for PTO operator design, debugging, and optimization.',
      github: 'https://github.com/wangnaiyu/pto-agent-workbench',
      cover: 'workbench'
    },
    {
      name: 'compute-graph-viewer',
      role: 'contrib',
      zh: '面向算子开发、计算图与执行泳道的可视化工作台。',
      en: 'A visualization workbench for operator development, computation graphs, and execution swimlanes.',
      page: 'https://yinyucheng0601.github.io/compute-graph-viewer/launch-v2.html',
      github: 'https://github.com/yinyucheng0601/compute-graph-viewer',
      cover: 'graph'
    }
  ];

  var SVG = 'http://www.w3.org/2000/svg';
  function s(tag, attrs) {
    var n = document.createElementNS(SVG, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  /* 原创几何封面：简单图形示意，不使用任何外部素材 */
  function cover(kind) {
    var svg = s('svg', { viewBox: '0 0 120 90', 'aria-hidden': 'true', focusable: 'false' });
    svg.appendChild(s('rect', { width: '120', height: '90', fill: 'var(--surface-2)' }));
    var ink = 'var(--ink)';
    if (kind === 'lab') {
      [[18, 20, 60], [18, 38, 84], [18, 56, 44]].forEach(function (r, i) {
        svg.appendChild(s('rect', { x: String(r[0]), y: String(r[1]), width: String(r[2]), height: '8', rx: '4', fill: ink, opacity: String(0.9 - i * 0.25) }));
      });
      svg.appendChild(s('circle', { cx: '92', cy: '62', r: '11', fill: 'none', stroke: ink, 'stroke-width': '2.5' }));
    } else if (kind === 'swimlane') {
      for (var i = 0; i < 4; i++) {
        var y = 18 + i * 16;
        svg.appendChild(s('line', { x1: '14', y1: String(y + 4), x2: '106', y2: String(y + 4), stroke: ink, 'stroke-width': '1', opacity: '.25' }));
        svg.appendChild(s('rect', { x: String(16 + i * 14), y: String(y), width: String(34 + (i % 2) * 26), height: '9', rx: '4.5', fill: ink, opacity: String(0.85 - i * 0.15) }));
      }
    } else if (kind === 'workbench') {
      svg.appendChild(s('rect', { x: '14', y: '16', width: '34', height: '58', rx: '6', fill: ink, opacity: '.25' }));
      svg.appendChild(s('rect', { x: '54', y: '16', width: '52', height: '26', rx: '6', fill: ink, opacity: '.85' }));
      svg.appendChild(s('rect', { x: '54', y: '48', width: '52', height: '26', rx: '6', fill: ink, opacity: '.45' }));
    } else {
      var nodes = [[26, 24], [26, 64], [60, 44], [96, 26], [96, 62]];
      [[0, 2], [1, 2], [2, 3], [2, 4]].forEach(function (e) {
        svg.appendChild(s('line', { x1: String(nodes[e[0]][0]), y1: String(nodes[e[0]][1]), x2: String(nodes[e[1]][0]), y2: String(nodes[e[1]][1]), stroke: ink, 'stroke-width': '1.8', opacity: '.4' }));
      });
      nodes.forEach(function (n, i) { svg.appendChild(s('circle', { cx: String(n[0]), cy: String(n[1]), r: i === 2 ? '9' : '6.5', fill: ink, opacity: i === 2 ? '.9' : '.6' })); });
    }
    return svg;
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'className') n.className = attrs[k];
      else n.setAttribute(k, attrs[k] === true ? '' : String(attrs[k]));
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function extIcon() {
    var svg = s('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
    svg.appendChild(s('path', { d: 'M7 17 17 7M8 7h9v9' }));
    return svg;
  }

  /* ---------- 语言 ---------- */
  function validLang(v) { return v === 'zh' || v === 'en' ? v : null; }
  function detectLang() {
    var p = new URLSearchParams(window.location.search);
    var fromQuery = validLang(p.get('lang'));
    if (fromQuery) return fromQuery;
    var saved = validLang(store.get(KEY_LANG));
    if (saved) return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    if (!nav) return 'zh';
    return /^zh\b|^zh-/i.test(nav) ? 'zh' : 'en';
  }

  var lang = 'zh';

  function applyLang(next, push) {
    lang = next;
    var t = STRINGS[lang];
    document.documentElement.setAttribute('lang', t.htmlLang);
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t[n.getAttribute('data-i18n')]; });
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.querySelector('a[href="https://github.com/wangnaiyu"]').setAttribute('aria-label', t.githubProfile);
    paintTheme();
    renderProjects();
    var p = new URLSearchParams(window.location.search);   // 保留其他合法参数
    p.set('lang', lang);
    try { history[push ? 'pushState' : 'replaceState'](null, '', window.location.pathname + '?' + p.toString()); } catch (e) {}
  }

  function renderProjects() {
    var t = STRINGS[lang];
    var list = document.getElementById('projectList');
    while (list.firstChild) list.removeChild(list.firstChild);
    PROJECTS.forEach(function (p) {
      var links = el('div', { className: 'project__links' });
      if (p.local) {
        links.appendChild(el('a', { className: 'btn btn--primary', href: p.local, target: '_blank', rel: 'noopener noreferrer', text: t.openLocal }));
        links.appendChild(el('span', { className: 'note', text: t.localOnly }));
      }
      if (p.page) links.appendChild(el('a', { className: 'btn', href: p.page, target: '_blank', rel: 'noopener noreferrer' }, [el('span', { text: t.page }), extIcon()]));
      if (p.github) links.appendChild(el('a', { className: 'btn', href: p.github, target: '_blank', rel: 'noopener noreferrer' }, [el('span', { text: t.github }), extIcon()]));
      var media = el('div', { className: 'project__cover' });
      media.appendChild(cover(p.cover));
      list.appendChild(el('li', { className: 'project' }, [
        media,
        el('div', null, [
          el('p', { className: 'project__role', text: p.role === 'owner' ? t.roleOwner : t.roleContrib }),
          el('h3', { className: 'project__name', text: p.name }),
          el('p', { className: 'project__desc', text: p[lang] }),
          links
        ])
      ]));
    });
  }

  /* ---------- 主题 ---------- */
  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }
  function paintTheme() {
    var btn = document.getElementById('themeToggle');
    var dark = effectiveTheme() === 'dark';
    btn.setAttribute('aria-label', dark ? STRINGS[lang].themeToLight : STRINGS[lang].themeToDark);
    btn.querySelector('[data-icon="moon"]').hidden = dark;
    btn.querySelector('[data-icon="sun"]').hidden = !dark;
  }

  function start() {
    var saved = store.get(KEY_THEME);
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
    document.getElementById('themeToggle').addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set(KEY_THEME, next);
      paintTheme();
    });
    if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', paintTheme);

    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-lang');
        if (next === lang) return;
        store.set(KEY_LANG, next);
        applyLang(next, true);
      });
    });
    window.addEventListener('popstate', function () { applyLang(detectLang(), false); });
    applyLang(detectLang(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
