function getSoundtrack(vrPackage) {
  const music = vrPackage?.shareMeta?.backgroundMusic ?? vrPackage?.share_meta?.backgroundMusic;
  if (typeof music?.url !== "string" || !music.url.trim()) return null;

  try {
    const url = new URL(music.url, document.baseURI);
    const isLocalHttp = url.protocol === "http:" && url.origin === window.location.origin;
    if ((url.protocol !== "https:" && !isLocalHttp) || url.username || url.password) return null;
    return {
      url: url.href,
      title: [music.title, music.credit].filter((item) => typeof item === "string" && item.trim()).join(" · "),
      projectId: vrPackage.projectId || vrPackage.project_id,
      versionId: vrPackage.versionId || vrPackage.version_id,
    };
  } catch {
    return null;
  }
}

export function createVrBackgroundMusic() {
  const controls = new Set();
  let soundtrack = null;
  let audio = null;
  let playbackFailed = false;

  function updateControls() {
    const playing = Boolean(audio && !audio.paused && !playbackFailed);
    const label = playbackFailed ? "背景音乐加载失败，点击重试" : "背景音乐";
    for (const button of controls) {
      button.hidden = !soundtrack;
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", label);
      button.textContent = playbackFailed ? "重试" : "音乐";
      button.title = soundtrack?.title ? `${label} · ${soundtrack.title}` : label;
    }
  }

  function pause() {
    audio?.pause();
    updateControls();
  }

  async function toggle() {
    if (!soundtrack) return;
    if (audio && !audio.paused && !playbackFailed) {
      pause();
      return;
    }

    if (!audio) {
      const player = new Audio();
      player.preload = "none";
      player.loop = true;
      player.volume = 0.35;
      for (const event of ["play", "pause", "error"]) {
        player.addEventListener(event, () => {
          if (audio !== player) return;
          if (event === "error") playbackFailed = true;
          updateControls();
        });
      }
      player.src = soundtrack.url;
      audio = player;
    }

    const player = audio;
    playbackFailed = false;
    if (player.error) player.load();
    try {
      await player.play();
    } catch (error) {
      if (audio === player && error?.name !== "AbortError") playbackFailed = true;
    }
    updateControls();
  }

  return {
    attach(button) {
      if (!button) return;
      controls.add(button);
      button.addEventListener("click", toggle);
      updateControls();
    },
    setPackage(vrPackage) {
      const next = getSoundtrack(vrPackage);
      const sameTrack = soundtrack?.url === next?.url
        && soundtrack?.projectId === next?.projectId
        && soundtrack?.versionId === next?.versionId;
      if (!sameTrack && audio) {
        const oldAudio = audio;
        audio = null;
        oldAudio.pause();
        oldAudio.removeAttribute("src");
        oldAudio.load();
      }
      if (!sameTrack) playbackFailed = false;
      soundtrack = next;
      updateControls();
    },
    pause,
  };
}
