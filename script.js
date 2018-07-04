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
}