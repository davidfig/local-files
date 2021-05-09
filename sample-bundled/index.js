(() => {
  // dist/localFiles.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var _port = 9988;
  function dir() {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(`http://localhost:${_port}/dir`);
      const json = yield response.json();
      return json;
    });
  }
  function _post(method, body) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(`http://localhost:${_port}/${method}`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: {"content-type": "application/json"}
      });
      const json = yield response.json();
      return json;
    });
  }
  function load(filename) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield _post("download", {filename});
    });
  }

  // sample-bundled/client.js
  var $ = (query) => document.querySelector(query);
  var showDir = async () => {
    const files = await dir();
    files.forEach((file) => {
      const button = document.createElement("button");
      button.innerHTML = file;
      button.addEventListener("click", async (e) => {
        const data = await load(e.currentTarget.innerText);
        $(".file-results").innerHTML = data.file.replaceAll("\n", "<br>").replaceAll("  ", "&nbsp;&nbsp");
      });
      $(".files").appendChild(button);
    });
  };
  window.onload = showDir;
})();
