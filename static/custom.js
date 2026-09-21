// 全局液态玻璃雨滴/雨丝动画 (Glass Raindrops & Falling Raindrops)
(function() {
  function initRain() {
    let canvas = document.getElementById('rain-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'rain-canvas';
      canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 99999;';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    
    // 1. 落下的大向倾斜雨丝 (Falling Rain Lines)
    const streakCount = 100;
    const streaks = [];
    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        x: Math.random() * (width + 300),
        y: Math.random() * height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 10 + 14,
        opacity: Math.random() * 0.35 + 0.15,
        width: Math.random() * 1.5 + 0.8
      });
    }

    // 2. 附着在玻璃窗上的液态雨滴 (Liquid Glass Raindrops & Beads)
    const glassDropCount = 50;
    const glassDrops = [];
    for (let i = 0; i < glassDropCount; i++) {
      glassDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1.5,
        speed: Math.random() * 0.8 + 0.2, // 缓慢沿玻璃滑落
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.01,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // A. 绘制下落雨丝
      for (let i = 0; i < streakCount; i++) {
        const s = streaks[i];
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length * 0.25, s.y + s.length);
        ctx.strokeStyle = `rgba(180, 220, 255, ${s.opacity})`;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        s.y += s.speed;
        s.x -= s.speed * 0.25;
        
        if (s.y > height) {
          s.y = -s.length;
          s.x = Math.random() * (width + 300);
        }
      }

      // B. 绘制玻璃上的液态折射雨滴 (Liquid Glass Drops)
      for (let i = 0; i < glassDropCount; i++) {
        const g = glassDrops[i];
        g.wobble += g.wobbleSpeed;
        const offsetX = Math.sin(g.wobble) * 0.5;

        // 液态雨滴本体
        ctx.beginPath();
        ctx.arc(g.x + offsetX, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${g.opacity * 0.6})`;
        ctx.fill();
        
        // 高光点 (Glass Highlight)
        ctx.beginPath();
        ctx.arc(g.x + offsetX - g.r * 0.3, g.y - g.r * 0.3, g.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${g.opacity * 0.95})`;
        ctx.fill();

        // 液态水滴下滑逻辑
        g.y += g.speed;
        if (Math.random() < 0.01) {
          g.speed = Math.random() * 2 + 0.5;
        } else if (g.speed > 0.8) {
          g.speed *= 0.95;
        }

        if (g.y > height) {
          g.y = -10;
          g.x = Math.random() * width;
        }
      }

      requestAnimationFrame(draw);
    }
    
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRain);
  } else {
    initRain();
  }
})();

// 解决深色模式切换卡顿与逻辑失效：改为即时双态切换，同时动态切换昼夜双壁纸
(function() {
  function syncBanner(isDark) {
    const bannerImg = document.querySelector('#header img');
    if (bannerImg) {
      bannerImg.src = isDark ? '/images/banner_dark.webp' : '/images/banner_light.webp';
    }
  }

  function fixDarkMode() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.dark-mode-btn') || 
                  e.target.closest('#nav-moon-btn') || 
                  e.target.closest('#nav-sun-btn') || 
                  e.target.closest('#nav-circle-half-stroke-btn');
      if (btn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newDark = !isCurrentlyDark;
        
        if (newDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          btn.id = 'nav-moon-btn';
          localStorage.setItem('dark_mode', 'true');
        } else {
          document.documentElement.removeAttribute('data-theme');
          btn.id = 'nav-sun-btn';
          localStorage.setItem('dark_mode', 'false');
        }

        syncBanner(newDark);
        
        document.body.dispatchEvent(
          new CustomEvent('reimu:theme-set', {
            detail: { isDark: newDark, mode: newDark ? 'true' : 'false' }
          })
        );
      }
    }, true);

    // 页面初次载入或 PJAX 切换后同步对应昼夜壁纸
    const currentIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
    syncBanner(currentIsDark);
    document.addEventListener('pjax:complete', () => {
      syncBanner(document.documentElement.getAttribute('data-theme') === 'dark');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixDarkMode);
  } else {
    fixDarkMode();
  }
})();

// ============================================================
// 全局悬浮灵动微光音频胶囊（对手机深度优化、非圆形灵动胶囊、点击 100% 极速响应、全天候后台播放）
// ============================================================
(function() {
  function initMiniPlayer() {
    if (document.getElementById('rainlight-music-player')) return;

    if (!document.getElementById('rlp-core-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'rlp-core-styles';
      styleTag.textContent = `
        #rainlight-music-player {
          position: fixed !important;
          top: 60px;
          left: 16px;
          z-index: 999999 !important;
          display: inline-flex !important;
          align-items: center !important;
          background: rgba(15, 23, 42, 0.9) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1.5px solid rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45), 0 0 12px rgba(56, 189, 248, 0.22) !important;
          border-radius: 20px !important;
          height: 35px !important;
          padding: 0 12px !important;
          box-sizing: border-box !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          cursor: pointer !important;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
          max-width: calc(100vw - 28px) !important;
        }

        :root:not([data-theme="dark"]) #rainlight-music-player {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(37, 99, 235, 0.4) !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12), 0 0 10px rgba(37, 99, 235, 0.15) !important;
        }

        #rainlight-music-player:hover {
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.5), 0 0 18px rgba(56, 189, 248, 0.4) !important;
          border-color: #38bdf8 !important;
        }

        /* 3 根跳动发光音频频谱条 */
        .rlp-equalizer {
          display: flex !important;
          align-items: flex-end !important;
          gap: 2.5px !important;
          height: 16px !important;
          width: 15px !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
        }
        .rlp-eq-bar {
          width: 3px !important;
          background: #38bdf8 !important;
          border-radius: 2px !important;
          height: 4px !important;
          transition: height 0.2s ease !important;
        }
        :root:not([data-theme="dark"]) .rlp-eq-bar {
          background: #2563eb !important;
        }
        .playing .rlp-eq-bar:nth-child(1) { animation: rlp-eq-1 0.75s ease-in-out infinite alternate !important; }
        .playing .rlp-eq-bar:nth-child(2) { animation: rlp-eq-2 0.55s ease-in-out infinite alternate !important; }
        .playing .rlp-eq-bar:nth-child(3) { animation: rlp-eq-3 0.85s ease-in-out infinite alternate !important; }

        @keyframes rlp-eq-1 { from { height: 4px; } to { height: 16px; } }
        @keyframes rlp-eq-2 { from { height: 15px; } to { height: 5px; } }
        @keyframes rlp-eq-3 { from { height: 6px; } to { height: 14px; } }

        /* 折叠态文字徽标 */
        .rlp-mini-label {
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: 0.08em !important;
          color: #38bdf8 !important;
          margin-left: 7px !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          white-space: nowrap !important;
        }
        :root:not([data-theme="dark"]) .rlp-mini-label {
          color: #2563eb !important;
        }

        /* 展开态控制面板 */
        .rlp-panel {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          margin-left: 8px !important;
          white-space: nowrap !important;
        }

        #rainlight-music-player.is-collapsed .rlp-panel {
          display: none !important;
        }
        #rainlight-music-player:not(.is-collapsed) .rlp-mini-label {
          display: none !important;
        }

        .rlp-title-wrap {
          max-width: 140px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        .rlp-title {
          font-size: 12.5px !important;
          font-weight: 700 !important;
          color: #60a5fa !important;
          line-height: 1 !important;
        }
        :root:not([data-theme="dark"]) .rlp-title {
          color: #1e3a8a !important;
        }

        .rlp-controls {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .rlp-btn {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          padding: 2px !important;
          font-size: 14px !important;
          cursor: pointer !important;
          color: #94a3b8 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          line-height: 1 !important;
          transition: transform 0.15s ease, color 0.15s ease !important;
        }
        .rlp-btn:hover {
          color: #38bdf8 !important;
          transform: scale(1.2) !important;
        }
        :root:not([data-theme="dark"]) .rlp-btn:hover {
          color: #2563eb !important;
        }
        .rlp-btn-play {
          font-size: 16px !important;
          color: #38bdf8 !important;
          font-weight: bold !important;
        }
        :root:not([data-theme="dark"]) .rlp-btn-play {
          color: #2563eb !important;
        }
        .rlp-btn-close {
          font-size: 13px !important;
          color: #94a3b8 !important;
          margin-left: 2px !important;
          padding: 2px 5px !important;
          border-radius: 4px !important;
          line-height: 1 !important;
        }
        .rlp-btn-close:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.15) !important;
        }

        /* 手机端专用适配 */
        @media (max-width: 768px) {
          #rainlight-music-player {
            top: 54px !important;
            left: 10px !important;
            height: 33px !important;
            padding: 0 10px !important;
          }
          .rlp-title-wrap {
            max-width: 95px !important;
          }
        }
      `;
      document.head.appendChild(styleTag);
    }

    const container = document.createElement('div');
    container.id = 'rainlight-music-player';
    container.className = 'is-collapsed';
    container.title = '点击展开音乐播放器';
    container.innerHTML = `
      <div class="rlp-equalizer" id="rlp-eq" title="点击展开/收起播放器">
        <span class="rlp-eq-bar"></span>
        <span class="rlp-eq-bar"></span>
        <span class="rlp-eq-bar"></span>
      </div>
      <span class="rlp-mini-label" id="rlp-label">BGM</span>
      <div class="rlp-panel" id="rlp-panel">
        <div class="rlp-title-wrap">
          <span class="rlp-title" id="rlp-title">扫描音乐中...</span>
        </div>
        <div class="rlp-controls">
          <button class="rlp-btn" id="rlp-prev" title="上一首">⏮</button>
          <button class="rlp-btn rlp-btn-play" id="rlp-toggle" title="播放/暂停">▶</button>
          <button class="rlp-btn" id="rlp-next" title="下一首">⏭</button>
          <button class="rlp-btn rlp-btn-close" id="rlp-close" title="收起胶囊">✕</button>
        </div>
      </div>
      <audio id="rlp-audio" preload="auto"></audio>
    `;
    document.body.appendChild(container);

    const audio = document.getElementById('rlp-audio');
    const eq = document.getElementById('rlp-eq');
    const titleEl = document.getElementById('rlp-title');
    const toggleBtn = document.getElementById('rlp-toggle');
    const prevBtn = document.getElementById('rlp-prev');
    const nextBtn = document.getElementById('rlp-next');
    const closeBtn = document.getElementById('rlp-close');

    let playlist = [];
    let currentIndex = 0;
    let isRandom = true;

    // 播放列表加载
    function loadPlaylist() {
      if (window.__LOCAL_PLAYLIST__ && Array.isArray(window.__LOCAL_PLAYLIST__) && window.__LOCAL_PLAYLIST__.length > 0) {
        playlist = window.__LOCAL_PLAYLIST__;
        currentIndex = Math.floor(Math.random() * playlist.length);
        updateTrack(false);
        return;
      }
      fetch('/mp3/playlist.json?t=' + Date.now())
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            playlist = data;
            currentIndex = Math.floor(Math.random() * playlist.length);
            updateTrack(false);
          } else {
            titleEl.textContent = 'static/mp3 暂无歌曲';
          }
        })
        .catch(() => {
          playlist = [
            { title: "Lofi Rain Study", src: "/mp3/Lofi Rain Study.mp3" },
            { title: "Until Then - Night Chill", src: "/mp3/Until Then - Night Chill.mp3" }
          ];
          currentIndex = 0;
          updateTrack(false);
        });
    }

    // MediaSession 系统控制集成
    function updateMediaSession(track) {
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title || 'RainLight 治愈之声',
            artist: 'RainLight 博客电台',
            album: 'Lofi & Ambient Collection',
            artwork: [
              { src: '/avatar/avatar.jpg', sizes: '512x512', type: 'image/jpeg' }
            ]
          });
          navigator.mediaSession.setActionHandler('play', () => audio.play().catch(() => {}));
          navigator.mediaSession.setActionHandler('pause', () => audio.pause());
          navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
          navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
        } catch(e) {}
      }
    }

    function updateTrack(play = true) {
      if (!playlist.length) return;
      const track = playlist[currentIndex];
      audio.src = track.src;
      titleEl.textContent = track.title;
      titleEl.title = track.title;
      updateMediaSession(track);
      if (play) {
        audio.play().catch(() => {});
      }
    }

    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }

    function nextTrack() {
      if (!playlist.length) return;
      if (isRandom && playlist.length > 1) {
        let nextIdx = Math.floor(Math.random() * playlist.length);
        while (nextIdx === currentIndex) {
          nextIdx = Math.floor(Math.random() * playlist.length);
        }
        currentIndex = nextIdx;
      } else {
        currentIndex = (currentIndex + 1) % playlist.length;
      }
      updateTrack(true);
    }

    function prevTrack() {
      if (!playlist.length) return;
      if (isRandom && playlist.length > 1) {
        nextTrack();
      } else {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        updateTrack(true);
      }
    }

    audio.addEventListener('play', () => {
      container.classList.add('playing');
      toggleBtn.textContent = '⏸';
    });

    audio.addEventListener('pause', () => {
      container.classList.remove('playing');
      toggleBtn.textContent = '▶';
    });

    audio.addEventListener('ended', () => nextTrack());
    audio.addEventListener('error', () => setTimeout(nextTrack, 1500));

    // 核心交互：纯净原生点击委托，彻底根除一切锁死 bug
    function toggleFold(force) {
      const isFolded = container.classList.contains('is-collapsed');
      const target = typeof force === 'boolean' ? force : !isFolded;
      if (target === isFolded) return;
      container.classList.toggle('is-collapsed', target);
      container.title = target ? '点击展开音乐播放器' : '点击收起播放器';
      localStorage.setItem('rlp_player_collapsed', target ? 'true' : 'false');
    }

    // 点胶囊本体展开/折叠
    container.addEventListener('click', (e) => {
      // 内部控制按钮由自身逻辑处理，不触发折叠
      if (e.target.closest('.rlp-btn')) return;
      toggleFold();
    });

    // 控制按钮绑定
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevTrack();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextTrack();
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFold(true);
    });

    // 记忆折叠状态（默认折叠）
    if (localStorage.getItem('rlp_player_collapsed') !== 'false') {
      toggleFold(true);
    } else {
      toggleFold(false);
    }

    loadPlaylist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiniPlayer);
  } else {
    initMiniPlayer();
  }
})();

