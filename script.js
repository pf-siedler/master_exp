const idxNum2text = (indexNums, sep = ".") => indexNums.join([separator = sep]);

const createListElement = (indexNums, content, childUlId = "") => {
  const text = content.slice(content.indexOf(' ') + 1);
  const liElement = document.createElement("li");
  liElement.innerHTML = idxNum2text(indexNums) + ": "+ text;
  return liElement
}

const generateToC = (parentListElement, node, indexNums, contentTagNumber, childClassNumber) => {
  const childUlId = "ul" + idxNum2text(indexNums, "");

  if(contentTagNumber > 1) {
    const content = node.getElementsByTagName("H" + contentTagNumber)[0].textContent;
    parentListElement.appendChild(createListElement(indexNums, content, childUlId));
  }

  if(childClassNumber <= 3) {
    const childSections = Array.from(node.getElementsByClassName("div" + childClassNumber));
    const ListElement = document.createElement("ul");
    ListElement.id = childUlId;
    childSections.forEach((n, idx) => {
      generateToC(ListElement, n, [...indexNums, idx + 1], contentTagNumber + 1, childClassNumber + 1);
      parentListElement.appendChild(ListElement);
    });
  }
}

const collectDefinition = (mainNode) => {
  const regDefinition = new RegExp("\\[Definition\\:", "g");
  const defPassages = Array.from(mainNode.getElementsByTagName("p")).filter(elem => regDefinition.test(elem.textContent));
  const defWords = [];
  defPassages.forEach(passage => {
    const words = Array.from(passage.getElementsByTagName("b")).filter(elem => elem.parentElement.tagName != "A");
    words.forEach(word => {
      const idxRow = {};
      const w = word.innerHTML;
      const wordId = `def-${w.replace(/\s+/g, '')}`;
      word.id = wordId;
      const idxDef = document.createElement("a");
      idxDef.innerHTML = w;
      idxDef.href = `#${wordId}`;
      idxRow.def = idxDef;
      idxRow.usage = [];
      const usage = Array.from(mainNode.getElementsByTagName("*")).filter(elem => elem.textContent.includes(w) && elem.name != `def-${w}`);
      const usageId = n => `usg${n}-${w.replace(/\s+/g, '')}`;
      let numUsage = 0;
      usage.forEach(elem => {
        if(elem.id.includes("usg") || elem.id.includes("def")) return;
        elem.id = usageId(numUsage);
        const refElement = document.createElement("a");
        refElement.innerHTML = `[${numUsage+1}]`;
        refElement.href = `#${usageId(numUsage)}`;
        idxRow.usage.push(refElement);
        numUsage++;
      });
      defWords.push(idxRow);
    });
  });

  return defWords;
}

window.onload = () => {
  const mainNode = document.getElementsByClassName("body")[0];
  const ToCElement = document.createElement("ul");
  generateToC(ToCElement, mainNode, [], 1, 1);

  const appendixNode = document.getElementsByClassName("back")[0];
  const appendixToCElement = document.createElement("ul");
  generateToC(appendixToCElement, appendixNode, [], 1, 1);

  const ToC = document.createElement("div");
  ToC.innerHTML = "<H2>Generated Table of Contents</H2>";
  ToC.appendChild(ToCElement);
  ToC.appendChild(document.createElement("hr"));
  ToC.appendChild(appendixToCElement);

  document.body.insertBefore(ToC, document.body.firstChild);


  // ========= create index ==================

  const defWords = collectDefinition(mainNode);
  defWords.sort((item1, item2) => item1.def.innerHTML.toUpperCase() > item2.def.innerHTML.toUpperCase() ? 1: -1);

  const indexTable = document.createElement("table");
  indexTable.innerHTML = "<tr><th>Defined Word</th><th>Usage</th></tr>";
  defWords.forEach(row => {
    const tr = document.createElement("tr");
    const defTd = document.createElement("td");
    defTd.appendChild(row.def);
    const usgTd = document.createElement("td");
    row.usage.forEach(u => usgTd.appendChild(u));
    tr.appendChild(defTd);
    tr.appendChild(usgTd);
    indexTable.appendChild(tr);
  });
  document.body.insertBefore(indexTable, document.body.firstChild);
}