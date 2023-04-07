document.addEventListener("keydown", async function (event) {
  if (event.ctrlKey) {
    let text = window.getSelection().toString();
    if (text) {
      let translatedText = await translateText(text);

      document.execCommand("insertHTML", false, translatedText);
    }
  }
});

document.addEventListener("keydown", async function (event) {
  if (event.ctrlKey && event.keyCode === 81) {
    const modalContent = `
      <div class="modal-chicken-trans">
        <div class="modal-content-chicken-trans">
          <div class="modal-header-chicken-trans">
          <h2>Chicken Tránlate</h2>
          <h4>Chỉ cần bôi đen đoạn văn bản rồi nhấn Ctrl là được, thay đổi ngôn ngữ<br>nhấn tổ hợp Ctrl+Q. Cho mấy con gà sài chứ người pro ai đâu sài ba cái này.</h4>
          </div>
          <div>
          <span>Ngôn ngữ đầu vào</span>
          <select name="language-in" id="language-in">
            ${tl.map(
              (item) => `<option value="${item.code}">${item.name}</option>`
            )}
          </select>
          <span>Ngôn ngữ đầu ra</span>
          <select name="language-out" id="language-out">
            ${tl.map(
              (item) => `<option value="${item.code}">${item.name}</option>`
            )}
          </select>
          </div>
          <button id="submit-chicken-trans" class="button-chicken-trans">Submit</button>
          <button id="cancel-chicken-trans" class="button-chicken-trans">Cancel</button>
          <div class="footer-chicken-trans">
            <p>Created by Huỳnh Quốc Bảo
            <br>
            Góp ý xin gửi mail đến esdridz@gmail.com</p>
            </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalContent);
    showModal();
    const languegeIn = await new Promise((resolve, reject) => {
      chrome.storage.sync.get(["languageIn"], function (result) {
        const languageIn = result.languageIn || "vi";
        resolve(languageIn);
      });
    });
    document.getElementById("language-in").value = languegeIn;
    const languegeOut = await new Promise((resolve, reject) => {
      chrome.storage.sync.get(["languageOut"], function (result) {
        const languageOut = result.languageOut || "en";
        resolve(languageOut);
      });
    });
    document.getElementById("language-out").value = languegeOut;
  }
});

function showModal() {
  const modal = document.querySelector(".modal-chicken-trans");
  // when press button submit set value in storage
  document
    .getElementById("submit-chicken-trans")
    .addEventListener("click", () => {
      const languageIn = document.getElementById("language-in").value;
      chrome.storage.sync.set({ languageIn }, function () {});
      const languageOut = document.getElementById("language-out").value;
      chrome.storage.sync.set({ languageOut }, function () {});
      // close modal
      modal.style.display = "none";
    });
  // when press button cancel close modal
  document
    .getElementById("cancel-chicken-trans")
    .addEventListener("click", () => {
      modal.style.display = "none";
    });

  // Hiển thị modal
  modal.style.position = "fixed";
  modal.style.zIndex = "1";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "white";
  modal.style.border = "1px solid #888";
  modal.style.padding = "10px";
  modal.style.display = "block";
  // design modal content
  const modalContent = document.querySelector(".modal-content-chicken-trans");
  modalContent.style.position = "relative";
  modalContent.style.backgroundColor = "#fefefe";
  modalContent.style.margin = "auto";
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.width = "90%";
  modalContent.style.height = "50%";
  modalContent.style.display = "flex";
  modalContent.style.flexDirection = "column";
  modalContent.style.justifyContent = "space-between";
  modalContent.style.alignItems = "center";
  // chữ màu đen
  modalContent.style.color = "#000";
  // design modal header
  const modalHeader = document.querySelector(".modal-header-chicken-trans");
  // padding between các thẻ bên trong bằng 8px
  modalHeader.style.padding = "8px";
  modalHeader.style.width = "100%";
  modalHeader.style.height = "100px";
  modalHeader.style.display = "flex";
  modalHeader.style.flexDirection = "column";
  modalHeader.style.justifyContent = "center";
  modalHeader.style.alignItems = "center";

  // chữ màu đen
  modalHeader.style.color = "#000";
  const languageIn = document.getElementById("language-in");
  languageIn.style.width = "100%";
  languageIn.style.height = "30px";
  languageIn.style.margin = "10px 0";
  languageIn.style.padding = "0 10px";
  languageIn.style.fontSize = "16px";
  languageIn.style.border = "1px solid #888";
  const languageOut = document.getElementById("language-out");
  languageOut.style.width = "100%";
  languageOut.style.height = "30px";
  languageOut.style.margin = "10px 0";
  languageOut.style.padding = "0 10px";
  languageOut.style.fontSize = "16px";
  languageOut.style.border = "1px solid #888";
  // design modal footer
  const modalFooter = document.querySelector(".footer-chicken-trans");
  modalFooter.style.margin = "10px 0";
  modalFooter.style.padding = "0 10px";
  modalFooter.style.fontSize = "14px";
  modalFooter.style.border = "1px solid #888";
  modalFooter.style.display = "flex";
  modalFooter.style.flexDirection = "column";
  modalFooter.style.justifyContent = "space-between";
  modalFooter.style.alignItems = "center";

  // design modal button submit
  const modalButtonSubmit = document.getElementById("submit-chicken-trans");
  modalButtonSubmit.style.backgroundColor = "#4CAF50";
  modalButtonSubmit.style.width = "100%";
  modalButtonSubmit.style.height = "30px";
  modalButtonSubmit.style.margin = "10px 0";
  modalButtonSubmit.style.padding = "0 10px";
  modalButtonSubmit.style.fontSize = "16px";
  modalButtonSubmit.style.border = "1px solid #888";
  modalButtonSubmit.style.cursor = "pointer";
  modalButtonSubmit.style.color = "#fff";
  const modalButtonCancel = document.getElementById("cancel-chicken-trans");
  modalButtonCancel.style.backgroundColor = "#f44336";
  modalButtonCancel.style.width = "100%";
  modalButtonCancel.style.height = "30px";
  modalButtonCancel.style.margin = "10px 0";
  modalButtonCancel.style.padding = "0 10px";
  modalButtonCancel.style.fontSize = "16px";
  modalButtonCancel.style.border = "1px solid #888";
  modalButtonCancel.style.cursor = "pointer";
  modalButtonCancel.style.color = "#fff";

  // Xử lý sự kiện khi người dùng nhấn vào bất kỳ đâu bên ngoài cửa sổ modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

var tl = [
  { code: "vi", name: "Vietnamese" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "pt", name: "Portuguese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
  { code: "el", name: "Greek" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
  { code: "sk", name: "Slovak" },
  { code: "bg", name: "Bulgarian" },
  { code: "uk", name: "Ukrainian" },
  { code: "ca", name: "Catalan" },
  { code: "iw", name: "Hebrew" },
  { code: "fa", name: "Persian" },
  { code: "hy", name: "Armenian" },
  { code: "ka", name: "Georgian" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
];

async function translateText(input) {
  const languegeIn = await new Promise((resolve, reject) => {
    chrome.storage.sync.get(["languageIn"], function (result) {
      const languageIn = result.languageIn || "vi";
      resolve(languageIn);
    });
  });
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["languageOut"], function (result) {
      const languageOut = result.languageOut || "en";
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${languegeIn}&tl=${languageOut}&dt=t&q=${encodeURIComponent(
        input
      )}`;
      const httpClient = new XMLHttpRequest();
      httpClient.open("GET", url, false);
      httpClient.send(null);
      const res = httpClient.responseText;
      const jsonData = JSON.parse(res);
      const translationItems = jsonData[0];
      let translation = "";
      for (let i = 0; i < translationItems.length; i++) {
        const translationLineObject = translationItems[i];
        const translationLineString = translationLineObject[0];
        translation += translationLineString;
      }
      resolve(translation);
    });
  });
}
