const $fileUpload = document.getElementById("my_file_input");
const $downloadBtn = document.getElementById("download");
const $textInput = document.getElementById("text_input");

let loadFile = [];

$fileUpload.addEventListener("change", function (e) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let data = reader.result;

    let workBook = XLSX.read(data, { type: "binary" });

    workBook.SheetNames.forEach(function (sheetName) {
      console.log("SheetName: " + sheetName);
      let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      console.log(rows);

      loadFile = rows.map(rowChange);
      console.log(loadFile);
    });
  };
  reader.readAsBinaryString(input.files[0]);
});

const rowChange = (R) => {
  return {
    가맹점관리번호: R.가맹점관리번호,
    가맹점기본주소: R.가맹점기본주소,
    우편번호: R.우편번호,
  };
};

$downloadBtn.addEventListener("click", () => {
  //   console.log(AddressSplit($textInput.value));
  let createXLSXFormatObj = [];

  let xlsHeader = ["가맹점관리번호", "가맹점기본주소", "우편번호"];

  // 엑셀 첫 행 (제목)
  createXLSXFormatObj.push(xlsHeader);

  // 엑셀 본문 (내용)
  loadFile.map((file) => {
    let innerRowData = [];
    innerRowData.push(file.가맹점관리번호);
    innerRowData.push(AddressSplit(file.가맹점기본주소));
    innerRowData.push(file.우편번호);

    createXLSXFormatObj.push(innerRowData);
  });

  let fileName = "test.xlsx";
  let sheetName = "sheet1";

  var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(createXLSXFormatObj);

  /* Add worksheet to workbook */
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  /* Write workbook and Download */
  XLSX.writeFile(wb, fileName);
});

var AddressSplit = (addr) => {
  // , . 제거
  //   addr = addr.replace(",", "");
  //   addr = addr.replace(".", "");

  let arr = addr.split(" ");

  // 4 이하의 경우, return
  if (arr.length < 5) return addr;

  let answer = `${arr[0]} ${arr[1]} ${arr[2]} ${arr[3]}`;

  // 5번째 index가 숫자의 경우 추가
  if (!isNaN(arr[4])) return (answer += ` ${arr[4]}`);
  // 5번째 index가 "123-123" 의 경우, 추가
  else if (arr[4].includes("-")) return (answer += ` ${arr[4]}`);
  //   나머지 추가안함
  else return answer;
};
