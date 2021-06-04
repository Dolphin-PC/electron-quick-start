// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const url =
  "https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=10%20&keyword=";

const url2 =
  "&confmKey=devU01TX0FVVEgyMDIxMDYwMTIxNDEyNjExMTIzMjk=&resultType=json";

let $button = document.querySelector(".button");
let $inputText = document.querySelector(".input");
let $resultText = document.querySelector(".resultText");

$button.addEventListener("click", async () => {
  if ($inputText.value == "") return alert("한 글자 이상 입력해주세요.");

  const result = await fetch(url + $inputText.value + url2);
  const data = await result.json();

  console.log(data.results);

  if (data.results.common.errorMessage != "정상")
    return ($resultText.innerText = data.results.common.errorMessage);

  if (data.results.juso.length > 0) {
    let content = "<ul>";

    data.results.juso.map((juso) => (content += `<li>${juso.roadAddr}</li>`));
    content += "</ul>";

    $resultText.innerHTML = content;
  } else {
    $resultText.innerText = "변환에 실패했습니다.";
  }
});
