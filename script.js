const findChildNodesByTagName = (elem, tagNames) => {
  let children =[elem], result = [];
  //javascriptはすぐにMaximum call stack size exceededするため再帰関数は使わない
  while(children.length) {
    console.log(children);
    node = children.pop();
    if(node.hasChildNodes) {
      subChildren = []
      node.childNodes.forEach((i) => {subChildren.push(i)});
      children = subChildren.concat(children)
    }
    if(tagNames.includes(node.tagName)) {result.push(node);}  
  }
  return result;
}

const createTableText = (numIndent, numIndex, content) => {
  
}

window.onload = () => {
  const allElements =  Array.from(document.body.getElementsByTagName("*"));
  const mainContentIndex = allElements.findIndex(elem => elem.tagName == "DIV" && elem.className == "body");
  const appendixIndex = allElements.findIndex(elem => elem.tagName == "DIV" && elem.className == "back");
  const mainContents = allElements.slice(mainContentIndex, appendixIndex);

  let secIdx = 0, subsecIdx = 0, subsubsecIdx = 0;
  mainContents.forEach(elem => {
    if(elem.tagName == "H2") {
        secIdx++; subsecIdx = 0; subsubsecIdx = 0;
        console.log(`${secIdx} ${elem.textContent}`);
    } else if(elem.tagName == "H3") {
        subsecIdx++; subsubsecIdx = 0;
        console.log(`\t${secIdx}.${subsecIdx} ${elem.textContent}`);
    } else if(elem.tagName == "H4") {
      subsubsecIdx++;
      console.log(`\t\t${secIdx}.${subsecIdx}.${subsubsecIdx} ${elem.textContent}`);
    }
  });

  const appendixContents = allElements.slice(appendixIndex);

  secIdx = 64, subsecIdx = 0, subsubsecIdx = 0;
  appendixContents.forEach(elem => {
    if(elem.tagName == "H2") {
        secIdx++; subsecIdx = 0; subsubsecIdx = 0;
        console.log(`${String.fromCharCode(secIdx)} ${elem.textContent}`);
    } else if(elem.tagName == "H3") {
        subsecIdx++; subsubsecIdx = 0;
        console.log(`\t${String.fromCharCode(secIdx)}.${subsecIdx} ${elem.textContent}`);
    } else if(elem.tagName == "H4") {
      subsubsecIdx++;
      console.log(`\t\t${String.fromCharCode(secIdx)}.${subsecIdx}.${subsubsecIdx} ${elem.textContent}`);
    }
  });
}