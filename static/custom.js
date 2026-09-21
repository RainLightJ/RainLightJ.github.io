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
// ============================================================
// 全局悬浮黑胶小圆环音乐播放器（无歌词、上下结构、自动遍历 static/mp3、全天候后台播放）
// ============================================================
(function() {
  function initMiniPlayer() {
    if (document.getElementById('rainlight-music-player')) return;

    // 自主注入播放器专属样式（彻底解决浏览器本地 CSS 缓存导致样式不生效的恶疾）
    if (!document.getElementById('rlp-core-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'rlp-core-styles';
      styleTag.textContent = `
        #rainlight-music-player {
          position: fixed !important;
          top: 70px;
          left: 24px;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          background: rgba(15, 23, 42, 0.92) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1.6px solid rgba(56, 189, 248, 0.55) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 14px rgba(56, 189, 248, 0.25) !important;
          border-radius: 36px !important;
          padding: 4px 14px 4px 5px !important;
          user-select: none !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          cursor: grab !important;
          touch-action: none !important;
          transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.15s ease, padding 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s ease !important;
        }
        #rainlight-music-player.is-collapsed {
          padding: 4px !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          width: 52px !important;
          height: 52px !important;
          box-sizing: border-box !important;
          justify-content: center !important;
        }
        #rainlight-music-player.is-collapsed:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.7), 0 6px 20px rgba(0, 0, 0, 0.45) !important;
        }
        #rainlight-music-player:active { cursor: grabbing !important; }
        #rainlight-music-player.dragging {
          cursor: grabbing !important;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.6), 0 0 22px rgba(56, 189, 248, 0.45) !important;
          transform: scale(1.03) !important;
        }
        :root:not([data-theme="dark"]) #rainlight-music-player {
          background: rgba(255, 255, 255, 0.96) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15), 0 0 12px rgba(56, 189, 248, 0.15) !important;
        }
        .rlp-disc-wrapper {
          position: relative !important;
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
        }
        .rlp-ring-pulse {
          position: absolute !important;
          inset: -2px !important;
          border-radius: 50% !important;
          border: 2px solid rgba(56, 189, 248, 0.65) !important;
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.35) !important;
          pointer-events: none !important;
          transition: all 0.3s ease !important;
        }
        .playing .rlp-ring-pulse {
          animation: rlp-pulse-ring 2.4s ease-in-out infinite !important;
          border-color: #38bdf8 !important;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.8), inset 0 0 5px rgba(56, 189, 248, 0.3) !important;
        }
        @keyframes rlp-pulse-ring {
          0%, 100% { box-shadow: 0 0 8px rgba(56, 189, 248, 0.4), inset 0 0 4px rgba(56, 189, 248, 0.2); transform: scale(1); }
          50% { box-shadow: 0 0 16px rgba(56, 189, 248, 0.85), inset 0 0 8px rgba(56, 189, 248, 0.4); transform: scale(1.04); }
        }
        .rlp-vinyl {
          position: relative !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          background: radial-gradient(circle, #1e293b 0%, #090d16 100%) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .rlp-vinyl-grooves {
          position: absolute !important;
          inset: 1px !important;
          border-radius: 50% !important;
          background: repeating-radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.08) 1px, transparent 2px, transparent 4px) !important;
          pointer-events: none !important;
        }
        .rlp-vinyl-center {
          position: relative !important;
          width: 15px !important;
          height: 15px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #1d4ed8, #38bdf8) !important;
          box-shadow: 0 0 6px rgba(56, 189, 248, 0.8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 2 !important;
        }
        .rlp-vinyl-spindle {
          width: 5px !important;
          height: 5px !important;
          border-radius: 50% !important;
          background: #0f172a !important;
          border: 1px solid rgba(255, 255, 255, 0.7) !important;
        }
        .playing .rlp-vinyl { animation: rlp-spin 5.5s linear infinite !important; }
        @keyframes rlp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .rlp-content {
          margin-left: 10px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 3px !important;
          transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.35s ease !important;
          overflow: hidden !important;
          max-width: 210px !important;
        }
        .rlp-content.collapsed {
          max-width: 0 !important;
          margin-left: 0 !important;
          opacity: 0 !important;
          pointer-events: none !important;
          display: none !important;
        }
        .rlp-title {
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #60a5fa !important;
          display: block !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          line-height: 1.25 !important;
        }
        :root:not([data-theme="dark"]) .rlp-title { color: #1e3a8a !important; }
        .rlp-controls {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }
        .rlp-btn {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 1px 3px !important;
          font-size: 15px !important;
          cursor: pointer !important;
          color: #94a3b8 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          line-height: 1 !important;
          transition: color 0.15s ease, transform 0.15s ease !important;
          border-radius: 4px !important;
        }
        .rlp-btn:hover {
          color: #38bdf8 !important;
          transform: scale(1.2) !important;
        }
        :root:not([data-theme="dark"]) .rlp-btn:hover { color: #2563eb !important; }
        .rlp-btn-play {
          font-size: 17px !important;
          color: #38bdf8 !important;
          font-weight: bold !important;
        }
        :root:not([data-theme="dark"]) .rlp-btn-play { color: #2563eb !important; }
        .rlp-btn.active {
          color: #38bdf8 !important;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.7) !important;
        }
        :root:not([data-theme="dark"]) .rlp-btn.active { color: #2563eb !important; }
      `;
      document.head.appendChild(styleTag);
    }

    // 1. 创建黑胶圆环播放器容器（上下结构：上层歌名，下层控制栏）
    const container = document.createElement('div');
    container.id = 'rainlight-music-player';
    container.innerHTML = `
      <div class="rlp-disc-wrapper" id="rlp-disc" title="点击展开/收拢播放器">
        <div class="rlp-ring-pulse"></div>
        <div class="rlp-vinyl">
          <div class="rlp-vinyl-grooves"></div>
          <div class="rlp-vinyl-center">
            <div class="rlp-vinyl-spindle"></div>
          </div>
        </div>
      </div>
      <div class="rlp-content" id="rlp-content">
        <div class="rlp-title-wrap">
          <span class="rlp-title" id="rlp-title">扫描音乐库中...</span>
        </div>
        <div class="rlp-controls">
          <button class="rlp-btn" id="rlp-prev" title="上一首" style="background:transparent!important;border:none!important;color:#94a3b8!important;cursor:pointer!important;font-size:15px!important;">⏮</button>
          <button class="rlp-btn rlp-btn-play" id="rlp-toggle" title="播放/暂停" style="background:transparent!important;border:none!important;color:#38bdf8!important;cursor:pointer!important;font-size:17px!important;">▶</button>
          <button class="rlp-btn" id="rlp-next" title="下一首" style="background:transparent!important;border:none!important;color:#94a3b8!important;cursor:pointer!important;font-size:15px!important;">⏭</button>
          <button class="rlp-btn rlp-btn-collapse" id="rlp-collapse" title="收起播放器" style="background:transparent!important;border:none!important;color:#94a3b8!important;cursor:pointer!important;font-size:13px!important;margin-left:2px!important;">◀</button>
        </div>
      </div>
      <audio id="rlp-audio" preload="auto"></audio>
    `;
    document.body.appendChild(container);

    const audio = document.getElementById('rlp-audio');
    const disc = document.getElementById('rlp-disc');
    const titleEl = document.getElementById('rlp-title');
    const toggleBtn = document.getElementById('rlp-toggle');
    const prevBtn = document.getElementById('rlp-prev');
    const nextBtn = document.getElementById('rlp-next');
    const collapseBtn = document.getElementById('rlp-collapse');
    const content = document.getElementById('rlp-content');

    let playlist = [];
    let currentIndex = 0;
    let isRandom = true;

    // 2. 自由拖拽与位置持久化记忆 (Pointer Events + setPointerCapture 彻底解决只能拖一次的问题)
    let isDragging = false;
    let hasMoved = false;
    let activePointerId = null;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    // 恢复上次保存的拖动位置（确保不遮挡顶部导航栏）
    const savedPos = localStorage.getItem('rlp_player_pos');
    if (savedPos) {
      try {
        const { left, top } = JSON.parse(savedPos);
        const maxL = Math.max(0, window.innerWidth - 80);
        const maxT = Math.max(0, window.innerHeight - 60);
        const safeTop = Math.max(65, Math.min(top, maxT));
        const safeLeft = Math.max(12, Math.min(left, maxL));
        container.style.left = `${safeLeft}px`;
        container.style.top = `${safeTop}px`;
      } catch(e) {}
    } else {
      container.style.left = '24px';
      container.style.top = '70px';
    }

    // 阻断原生 HTML5 文本/图片拖拽抢占事件
    container.addEventListener('dragstart', (e) => e.preventDefault());

    // 手机端专属丝滑触控拖拽支持：精准区分拖拽与点击，彻底解决缩起后打不开的恶疾
    container.addEventListener('touchstart', (e) => {
      if (e.target.closest('.rlp-btn')) return;

      const touch = e.touches[0];
      isDragging = true;
      hasMoved = false;
      activePointerId = 'touch';
      startX = touch.clientX;
      startY = touch.clientY;

      const rect = container.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      container.classList.add('dragging');
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || activePointerId !== 'touch') return;

      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        hasMoved = true;
        // 真正发生拖拽时才拦截浏览器滚动
        if (e.cancelable) e.preventDefault();
      }

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const maxLeft = Math.max(0, window.innerWidth - container.offsetWidth - 6);
      const maxTop = Math.max(0, window.innerHeight - container.offsetHeight - 6);

      newLeft = Math.max(6, Math.min(newLeft, maxLeft));
      newTop = Math.max(6, Math.min(newTop, maxTop));

      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!isDragging || activePointerId !== 'touch') return;
      onPointerEnd({ pointerId: 'touch' });
    });

    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // 触控已由 touchstart 专门托管
      if (e.target.closest('.rlp-btn')) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      isDragging = true;
      hasMoved = false;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;

      const rect = container.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      try {
        container.setPointerCapture(e.pointerId);
      } catch(_) {}
      container.classList.add('dragging');
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDragging || e.pointerId !== activePointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        hasMoved = true;
      }

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const maxLeft = Math.max(0, window.innerWidth - container.offsetWidth - 8);
      const maxTop = Math.max(0, window.innerHeight - container.offsetHeight - 8);

      newLeft = Math.max(8, Math.min(newLeft, maxLeft));
      newTop = Math.max(8, Math.min(newTop, maxTop));

      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    });

    function onPointerEnd(e) {
      if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
      isDragging = false;
      activePointerId = null;
      container.classList.remove('dragging');

      try {
        if (container.hasPointerCapture && e.pointerId && container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      } catch(_) {}

      if (hasMoved) {
        // 保存最新拖放位置
        const rect = container.getBoundingClientRect();
        localStorage.setItem('rlp_player_pos', JSON.stringify({
          left: Math.round(rect.left),
          top: Math.round(rect.top)
        }));
        setTimeout(() => { hasMoved = false; }, 120);
      } else {
        // 未发生拖拽移动 -> 判定为绝对点击！
        if (container.classList.contains('is-collapsed')) {
          toggleFold(false);
        }
      }
    }

    container.addEventListener('pointerup', onPointerEnd);
    container.addEventListener('pointercancel', onPointerEnd);

    // 3. 动态读取本地音频（优先使用 Hugo 模板自动遍历的结果，无需手动维护列表）
    function loadPlaylist() {
      if (window.__LOCAL_PLAYLIST__ && Array.isArray(window.__LOCAL_PLAYLIST__) && window.__LOCAL_PLAYLIST__.length > 0) {
        playlist = window.__LOCAL_PLAYLIST__;
        currentIndex = Math.floor(Math.random() * playlist.length);
        updateTrack(false);
        return;
      }

      // 备用降级方案：请求 /mp3/playlist.json
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

    // 4. 后台持久播放核心：MediaSession API 系统级媒体接入
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
      disc.classList.add('playing');
      toggleBtn.textContent = '⏸';
    });

    audio.addEventListener('pause', () => {
      disc.classList.remove('playing');
      toggleBtn.textContent = '▶';
    });

    // 原生音频结束事件驱动：后台自动切歌绝不停止！
    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // 播放异常时自动跳下一首，保障后台播放不断流
    audio.addEventListener('error', () => {
      setTimeout(nextTrack, 1500);
    });

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

    function toggleFold(force) {
      const isCurrentlyFolded = container.classList.contains('is-collapsed');
      const target = typeof force === 'boolean' ? force : !isCurrentlyFolded;
      if (target === isCurrentlyFolded) return; // 状态幂等保护，防止连续重复触发
      container.classList.toggle('is-collapsed', target);
      content.classList.toggle('collapsed', target);
      container.title = target ? '点击展开音乐播放器' : '';
      disc.title = target ? '点击展开音乐播放器' : '点击收起播放器';
      localStorage.setItem('rlp_player_collapsed', target ? 'true' : 'false');
    }

    // 1. 点击控制栏收起按钮直接折叠（同时支持 click 与 touch）
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFold(true);
      });
      collapseBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        toggleFold(true);
      });
    }

    // 2. 容器级点击统一拦截分发（电脑鼠标与手机触控双重保险）
    container.addEventListener('click', (e) => {
      // 内部操作按钮（上一曲、播放暂停、下一曲、折叠按钮）已自行处理，跳过
      if (e.target.closest('.rlp-btn')) return;

      // 如果本次操作是实际大幅拖拽移动，则忽略点击
      if (hasMoved) return;

      // 无论点到唱片本体、发光环、中心轴心还是小圆盘边框：
      // 如果当前是折叠状态，一律平滑张开展开！
      if (container.classList.contains('is-collapsed')) {
        e.stopPropagation();
        toggleFold(false);
        return;
      }

      // 如果当前是展开状态，点击左侧黑胶圆盘区域则执行折叠收起
      if (e.target.closest('#rlp-disc')) {
        toggleFold(true);
      }
    });

    // 记忆并恢复上次的折叠收纳状态
    if (localStorage.getItem('rlp_player_collapsed') === 'true') {
      toggleFold(true);
    }

    loadPlaylist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiniPlayer);
  } else {
    initMiniPlayer();
  }
})();

