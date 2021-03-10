function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = (key) => key.startsWith("on"); // on 으로 시작하면 이벤트
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  console.log("------------commitRoot-------------");
  console.log("wipRoot", wipRoot);
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  console.log("commitWork", fiber);
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // effect Tag 별로 처리
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function render(element, container) {
  console.log("render1", element);

  wipRoot = {
    // 난입으로 UI 깨지는 것 방지
    dom: container, // #root
    props: {
      children: [element],
    },
    alternate: currentRoot, // 이전의 커밋 단계에서 DOM에 추가했던 오래된 fiber에 대한 링크
  };
  deletions = [];
  console.log(JSON.stringify(wipRoot));
  nextUnitOfWork = wipRoot; // 난입으로 UI 깨지는 것 방지
  console.log("render", nextUnitOfWork);
}

let nextUnitOfWork = null; // 작업을 더 작은 단위로 나눈 다음, 각각의 단위마다 브라우저가 어떤 작업이 필요한 경우 렌더링 도중에 끼어들 수 있도록 할 것
let currentRoot = null;
let wipRoot = null;
let deletions = null; // 삭제 필요한 Fiber

/*
  재귀 호출이 문제입니다.

  우리가 렌더링을 시작하면, 모든 엘리먼트 트리를 렌더링 하는 것을 마치기 전까지는 이를 멈출 수 없습니다.
  만약 엘리먼트 트리가 크다면 메인 스레드의 동작이 너무 오랫동안 멈출 것입니다.
  그리고 브라우저가 유저의 입력이나 애니메이션을 부드럽게 하는 것에 높은 우선순위를 두고 있다면,
  이 작업들은 렌더링이 끝나기 전까지 대기해야 합니다.
*/

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    console.log("---------------workLoop------------");
    console.log("nextUnitOfWork", nextUnitOfWork, "wipFiber", wipFiber);
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    // 난입으로 UI 깨지는 것 방지
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop); // 지금 리액트는 스케줄러를 이용한다 / 여기서 계속 무한 루프 돌면서 확인한다

// render 함수 내부에 루트 fiber를 생성하고, 이를 nextUnitOfWork로 설정합니다.
// 남은 작업들은 performUnitOfWork 함수에서 일어나는데, 각각의 fiber에서는 다음 3가지 작업을 합니다.
// DOM에 엘리먼트를 추가하기 / 각 엘리먼트의 children에 대해 fiber를 생성하기 / 다음 작업 단위를 선택하기
// fiber는 자식 -> 형제 -> 부모의 형제 순으로 작업 단위를 선택해 간다

function performUnitOfWork(fiber) {
  console.log("----------------performUnitOfWork--------------");
  const isFunctionComponent = fiber.type instanceof Function;
  console.log("fiber", fiber, isFunctionComponent);
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 탐색 자식 형제 부모의 형제 순으로 탐색
  if (fiber.child) {
    console.log("child?");
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
}

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  console.log("updateFunctionComponentfiber", fiber);
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    console.log("--------------setState---------------------");
    console.log("nextUnitOfWork", nextUnitOfWork);
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  console.log("hook insert", wipFiber);
  hookIndex++;
  return [hook.state, setState];
}

function updateHostComponent(fiber) {
  console.log("updateHostComponentfiber", fiber);
  if (!fiber.dom) {
    console.log("dom");
    fiber.dom = createDom(fiber); // 처음 렌더시에는 시작 Container 말곤 사실다 돔이 없는상태
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 오래된 fiber을 새로운 엘리먼트로 재조정
function reconcileChildren(fiber, elements) {
  console.log("-------------Reconciller-------------");
  let index = 0;
  let oldFiber = fiber.alternate && fiber.alternate.child;
  let prevSibling = null;

  // effectTag 붙인 Fiber 만들기
  // 오래된 fiber(wipFiber.alternate)의 자식들(children)과 지금 자식들의 배열을 동시에 순회 하며 비교
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    console.log("fiber", fiber, "oldFiber", oldFiber, "element", element);
    // 오래된 fiber 와 우리가 render 하고싶은 element간의 차이 파악
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      console.log("UPDATE");
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber,
        effectTag: "UPDATE", // 커밋 단계에서 사용할 타입
      };
    }
    if (element && !sameType) {
      console.log("PLACEMENT");
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: "PLACEMENT", // 새로운 DOM노드가 필요한 경우
      };
    }
    if (oldFiber && !sameType) {
      console.log("DELETION");
      oldFiber.effectTag = "DELETION"; // 새로운 fiber 필요 없고 삭제 태그 필요
      deletions.push(oldFiber); // 삭제 배열에 추가
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      console.log(fiber, "insert");
      fiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  render,
  useState,
};

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return Didact.createElement(
    "h1",
    { onClick: () => setState((c) => c + 1) },
    "Count",
    state
  );
}

const element = Didact.createElement(Counter, null);
const container = document.getElementById("root");
Didact.render(element, container);

// 렌더할때 nextUnitOfWork 가 변화하면 requestIdleCallback 이 돌다가 작업할 뷰모델 생기면 거기부터 순회시작
// 순회하면서 리컨실러에서 effect Tag 붙여서 자식 혹은 형제로 붙이면서 Fiber Tree 만든다
// Fiber Tree 완성하면 다시 순회하면서 commit 하며 effect Tag 따라서 DOM 그려낸다
