// interlude-hook.js
(function(){
  const params = new URLSearchParams(location.search);
  const date = params.get("date"); // expects YYYY-MM-DD
  if(!date) return;
  const start = new Date("2025-11-05T00:00:00-05:00");
  const cur = new Date(date + "T00:00:00-05:00");
  const day = Math.floor((cur - start)/(1000*60*60*24)) + 1;

  const interludes = {
    7:  { label:"🍯 Sabrina", url:"/jar/interludes/sabrina.html" },
    14: { label:"🌙 Janet",   url:"/jar/interludes/janet.html" },
    21: { label:"⚡ Eminem",  url:"/jar/interludes/eminem.html" },
    28: { label:"☀️ Emma",   url:"/jar/interludes/emma.html" },
    35: { label:"🔥 Doechii", url:"/jar/interludes/doechii.html" },
    38: { label:"🐝 Hot To Go!", url:"/jar/interludes/hottogo.html" }
  };

  const mount = document.getElementById("interlude-hook") || document.body;
  if (interludes[day]) {
    const box = document.createElement("div");
    box.style.margin = "16px 0";
    box.innerHTML = `<a href="${interludes[day].url}" style="color:#ffd36b;text-decoration:none;border:1px solid #333;padding:8px 12px;border-radius:8px;display:inline-block;">Interlude Today → ${interludes[day].label}</a>`;
    mount.prepend(box);
  }
  if (day===42){
    const flare = document.createElement("div");
    flare.style.margin = "16px 0";
    flare.innerHTML = `<a href="/jar/victory/illumina1.html" style="color:#ffd36b;text-decoration:none;border:1px solid #333;padding:8px 12px;border-radius:8px;display:inline-block;">☀️ Victory Song</a>`;
    (document.getElementById("interlude-hook") || document.body).prepend(flare);
  }
})();
