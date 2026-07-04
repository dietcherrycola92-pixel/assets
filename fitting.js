/* ==== примерочная ==== */

/* адрес файла с хедерами (данные правятся в headers.json, не тут) */
var FIT_HEADERS_URL = "https://cdn.jsdelivr.net/gh/dietcherrycola92-pixel/assets/headers.json?=v2";

$(function () {
  var box = document.getElementById("fitBox");
  if (!box) return;

  var uid = (typeof UserID !== "undefined" && UserID) ? String(UserID) : null;
  if (!uid) { box.innerHTML = "войди на форум"; return; }

  fetch("/profile.php?id=" + uid)
    .then(function (r) { return r.arrayBuffer(); })
    .then(function (buf) {
      var html = new TextDecoder("windows-1251").decode(buf);
      var doc = new DOMParser().parseFromString(html, "text/html");
      function q(s) { return doc.querySelector(s); }
      function t(el) { return el ? el.textContent.trim() : ""; }

      var name  = t(q("#profile-name strong"))  || t(q("#profile-name"));
      var title = t(q("#profile-title strong")) || t(q("#profile-title"));
      var aEl = q("#pa-avatar img"); var ava = aEl ? aEl.getAttribute("src") : "";
      var hEl = q("#pa-fld1 img");   var hdr = hEl ? hEl.getAttribute("src") : "";
      var money = t(q("#pa-fld3 strong")).replace(/[^0-9]/g, "") || "0";
      var pm = t(q("#pa-posts strong")).match(/[0-9]+/); var posts = pm ? pm[0] : "0";
      var uEl = q("#pa-fld5 .pl up");   var plU = uEl ? uEl.textContent : "";
      var dEl = q("#pa-fld5 .pl down"); var plD = dEl ? dEl.textContent : "";

      box.innerHTML =
        "<div class='post-author'><ul>" +
        "<li class='pa-fld1'><img src='" + hdr + "'></li>" +
        "<li class='pa-author'><a>" + name + "</a></li>" +
        "<li class='pa-title'>" + title + "</li>" +
        "<li class='pa-avatar item2'><img src='" + ava + "'></li>" +
        "<li class='pa-posts'><span class='fld-name'>Сообщений:</span> " + posts + "</li>" +
        "<li class='pa-respect'><span class='fld-name'>Уважение:</span> <span>+0</span></li>" +
        "<li class='pa-fld3'><span class='fld-name'>деньги:</span> " + money + "</li>" +
        "<li class='pa-fld5'><span class='fld-name'>плашка:</span> <div class='pl'><up>" + plU + "</up><down>" + plD + "</down></div></li>" +
        "</ul></div>";

      var clone = box.querySelector(".post-author");
      var a2 = clone.querySelector(".pa-avatar img");
      var h2 = clone.querySelector(".pa-fld1 img");
      var pl = clone.querySelector(".pa-fld5 .pl");
      var u2 = clone.querySelector(".pa-fld5 .pl up");
      var d2 = clone.querySelector(".pa-fld5 .pl down");

      /* поля ввода */
      function on(id, fn) {
        var el = document.getElementById(id);
        if (el) el.addEventListener("input", function () { fn(this.value); });
      }
      on("inAva", function (v) { if (a2 && v) a2.src = v; });
      on("inU",   function (v) { if (u2) u2.textContent = v; });
      on("inD",   function (v) { if (d2) d2.textContent = v; });

      /* магазин хедеров */
      var gridH = document.getElementById("fitHeaders");
      var boxP  = document.getElementById("fitPlates");

      function renderPlates(colors) {
        if (!boxP) return;
        boxP.innerHTML = "";
        colors.forEach(function (col, idx) {
          var c = document.createElement("div");
          c.className = "c";
          c.style.background = col;
          c.onclick = function () {
            var all = boxP.getElementsByClassName("c");
            for (var i = 0; i < all.length; i++) all[i].classList.remove("sel");
            c.classList.add("sel");
            if (pl) pl.style.background = col;
          };
          boxP.appendChild(c);
          if (idx === 0) c.onclick();
        });
      }

      function renderShop(list) {
        if (!gridH) return;
        gridH.innerHTML = "";
        list.forEach(function (H) {
          var d = document.createElement("div");
          d.className = "h";
          d.title = H.name || "";
          d.style.backgroundImage = "url(" + H.img + ")";
          d.onclick = function () {
            var all = gridH.getElementsByClassName("h");
            for (var i = 0; i < all.length; i++) all[i].classList.remove("sel");
            d.classList.add("sel");
            if (h2) h2.src = H.img;
            renderPlates(H.pl || []);
          };
          gridH.appendChild(d);
        });
      }

      /* грузим хедеры из json */
      fetch(FIT_HEADERS_URL)
        .then(function (r) { return r.json(); })
        .then(function (list) { renderShop(list); })
        .catch(function () { if (gridH) gridH.innerHTML = "<span style='color:#b58596'>не удалось загрузить хедеры</span>"; });
    })
    .catch(function () { box.innerHTML = "ошибка загрузки профиля"; });
});
