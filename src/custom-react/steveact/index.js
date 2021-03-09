const createTestElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  console.log("----------createElement---------");
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTestElement(child)
      ),
    },
  };
};

let wipRoot = null;
let currentRoot = null;
let delegation = null;
let nextUnitOfWork = null;

const createDom = (fiber) => {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  return dom;
};

const reconcileChildren = (fiber, children) => {
  console.log("--------reconcileChildren--------");
  console.log(fiber, children);
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  while (index < children.length || oldFiber != null) {
    const childEl = children[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;
    let newFiber = null;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE", // 커밋 단계에서 사용할 타입
      };
    } else if (!sameType && childEl) {
      console.log("DELETION");
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT", // 새로운 DOM노드가 필요한 경우
      };
    }
    if (oldFiber && !sameType) {
      console.log("DELETION");
      oldFiber.effectTag = "DELETION"; // 새로운 fiber 필요 없고 삭제 태그 필요
      deletions.push(oldFiber); // 삭제 배열에 추가
    }
  }
};

const updateHostComponent = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  console.log(fiber.props);
  reconcileChildren(fiber, fiber.props.children);
};

const performUnitOfWork = (fiber) => {
  updateHostComponent(fiber);
  return false;
};

const workLoop = (deadLine) => {
  console.log("-------------workLoop----------");
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    console.log("hi");
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadLine.timeRemaining() < 1;
  }

  //   requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

const render = (element, root) => {
  console.log("----------render-----------");
  wipRoot = {
    dom: root,
    props: { children: [element] },
    alternate: currentRoot,
  };
  delegation = [];
  nextUnitOfWork = wipRoot;
};

export default {
  createElement,
  render,
};
