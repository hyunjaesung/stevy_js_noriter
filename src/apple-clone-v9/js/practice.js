(() => {
  let yOffset = 0; // window.pageYOffset
  let prevScrollHeight = 0; // 현재 스크롤 위치 보다 이전에 위차한 섹션들의 높이 합
  let currentScene = 0; // 현재 활성화된 Scene idx

  const sceneInfo = [
    {
      //0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배
      scrollHeight: 0, // 높이는 나중에 함수로 처리, 화면 크기가 가변적이기 때문에
      obj: {
        container: document.querySelector("#scroll-section-0")
      }
    },
    {
      //1
      type: "normal",
      heightNum: 5, // 브라우저 높이의 5배
      scrollHeight: 0, // 높이는 나중에 함수로 처리, 화면 크기가 가변적이기 때문에
      obj: {
        container: document.querySelector("#scroll-section-1")
      }
    },
    {
      //2
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배
      scrollHeight: 0, // 높이는 나중에 함수로 처리, 화면 크기가 가변적이기 때문에
      obj: {
        container: document.querySelector("#scroll-section-2")
      }
    },
    {
      //3
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배
      scrollHeight: 0, // 높이는 나중에 함수로 처리, 화면 크기가 가변적이기 때문에
      obj: {
        container: document.querySelector("#scroll-section-3")
      }
    }
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    sceneInfo.forEach(info => {
      info.scrollHeight = info.heightNum * window.innerHeight;
      info.obj.container.style.height = `${info.scrollHeight}px`;
    });

    let totalScrollHeight = 0;
    yOffset = window.pageYOffset;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function scrollLoop() {
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    } else if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    // 이전 까지 scene 높이를 합한것 보다 yOffset이 크면 해당 Scene 시작된 것
    scrollLoop();
  });
})();
