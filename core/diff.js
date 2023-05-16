const propertyList = ['checked', 'value', 'selected'];

const updateAttributes = (oldNode, newNode) => {
  if (oldNode.tagName === newNode.tagName) {
    // 어트리뷰트 검사
    if (!(oldNode instanceof Text) && !(newNode instanceof Text)) {
      // 어트리뷰트 수정
      for (const { name, value } of [...newNode.attributes]) {
        if (value !== oldNode.getAttribute(name)) oldNode.setAttribute(name, value);
      }
      // 어트리뷰트 삭제
      for (const { name } of [...oldNode.attributes]) {
        if (newNode.getAttribute(name) === undefined || newNode.getAttribute(name) === null)
          oldNode.removeAttribute(name);
      }
    }

    // 프로퍼티 검사
    for (const prop of propertyList) {
      if (oldNode[prop] !== newNode[prop]) oldNode[prop] = newNode[prop];
    }
  }
};

const diff = (oldNode, newNode, parent = null) => {
  if (parent) {
    // 노드 추가
    if (!oldNode && newNode) return parent.appendChild(newNode);
    // 노드 삭제
    if (oldNode && !newNode) return parent.removeChild(oldNode);

    // 텍스트 노드일 때
    if (oldNode instanceof Text && newNode instanceof Text) {
      if (oldNode.nodeValue.trim() === '') return;
      if (oldNode.nodeValue !== newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
      return;
    }

    // 요소 노드 타입이 다를 때
    if (oldNode.tagName !== newNode.tagName) {
      parent.replaceChild(newNode, oldNode);
      return;
    }

    updateAttributes(oldNode, newNode);
  }

  const oldChildren = [...oldNode.childNodes];
  const newChildren = [...newNode.childNodes];

  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    diff(oldChildren[i], newChildren[i], oldNode);
  }
};

export default diff;
