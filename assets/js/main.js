(function () {
  var nav = document.getElementById("site-nav");
  var menu = document.querySelector(".menu-btn");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", open ? "false" : "true");
      menu.textContent = open ? "Menu" : "Close";
      nav.classList.toggle("is-open", !open);
    });
  }

  document.querySelectorAll("dialog").forEach(function (d) {
    document.body.appendChild(d);
  });

  function openDialog(id, about) {
    var d = document.getElementById(id);
    if (!d || !d.showModal) return;
    if (about) {
      var sel = d.querySelector('select[name="about"]');
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text === about || sel.options[i].value === about) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
    }
    d.showModal();
    d.scrollTop = 0;
  }

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open]");
    if (opener) {
      var id = opener.getAttribute("data-open");
      if (document.getElementById(id)) {
        e.preventDefault();
        openDialog(id, opener.getAttribute("data-about"));
      }
      return;
    }
    if (e.target.closest("[data-close]")) {
      var dd = e.target.closest("dialog");
      if (dd) dd.close();
      return;
    }
    if (e.target.tagName === "DIALOG") e.target.close();
  });

  function fieldError(input, message) {
    input.setAttribute("aria-invalid", "true");
    var id = input.id + "-error";
    var note = document.getElementById(id);
    if (!note) {
      note = document.createElement("span");
      note.className = "field-error";
      note.id = id;
      input.insertAdjacentElement("afterend", note);
    }
    note.textContent = message;
    var described = (input.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
    if (described.indexOf(id) < 0) described.push(id);
    input.setAttribute("aria-describedby", described.join(" "));
    return id;
  }

  function clearErrors(form) {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.remove();
    });
    var box = form.querySelector(".form-errors");
    if (box) box.remove();
  }

  function validate(form) {
    clearErrors(form);
    var problems = [];
    function need(name, label) {
      var el = form.elements[name];
      if (!el) return;
      var value = (el.value || "").trim();
      if (!value) problems.push({ el: el, label: label, message: "Enter " + label.toLowerCase() + "." });
    }
    need("name", "Your name");
    need("org", "Your organisation");
    var email = form.elements.email;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      problems.push({ el: email, label: "Email", message: "Enter an email address we can reply to." });
    }
    need("role", "Who you are");
    need("about", "What this is about");
    need("message", "A short message");
    var consent = form.elements.consent;
    if (consent && !consent.checked) {
      problems.push({ el: consent, label: "Consent", message: "Confirm we may contact you about this enquiry." });
    }
    if (!problems.length) return true;
    problems.forEach(function (p) { fieldError(p.el, p.message); });
    var box = document.createElement("div");
    box.className = "form-errors";
    box.setAttribute("role", "alert");
    box.setAttribute("tabindex", "-1");
    var title = document.createElement("p");
    title.textContent = "Please correct " + problems.length + (problems.length === 1 ? " item" : " items") + " before sending.";
    var list = document.createElement("ul");
    problems.forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + p.el.id;
      a.textContent = p.label + ": " + p.message;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        p.el.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    box.appendChild(title);
    box.appendChild(list);
    form.insertBefore(box, form.firstChild);
    box.focus();
    return false;
  }

  function lines(data) {
    return [
      "From: " + data.name + (data.title ? ", " + data.title : ""),
      "Organisation: " + data.org,
      "They are a: " + (data.role || ""),
      "Email: " + data.email,
      "Telephone: " + (data.tel || ""),
      "",
      "About: " + (data.about || ""),
      "Location: " + (data.where || ""),
      "Timescale: " + (data.when || ""),
      "",
      "Message:",
      data.message,
      "",
      "Happy to be contacted about this enquiry."
    ].join("\n");
  }

  document.querySelectorAll("form[data-form='homes']").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v.toString(); });
      var subject = "Inkfish Homes enquiry: " + (data.about || "");
      var href = "mailto:admin@inkfishhomes.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines(data));
      var done = form.parentElement.querySelector(".cp-done");
      if (done) {
        form.hidden = true;
        done.hidden = false;
        done.setAttribute("data-mode", "mail");
        var close = done.querySelector("[data-close], a, button");
        if (close) close.focus();
      }
      window.location.href = href;
    });
  });

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".cs").forEach(function (c) {
    var slides = Array.prototype.slice.call(c.querySelectorAll(".cs-slide"));
    var dots = Array.prototype.slice.call(c.querySelectorAll(".cs-dots button"));
    var live = c.querySelector(".cs-live");
    var pauseBtn = c.querySelector(".cs-pause");
    var i = 0;
    var timer = null;
    var paused = reduce;
    var hold = false;

    function go(n, announce) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle("on", on);
        s.hidden = !on;
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach(function (b, k) {
        if (k === i) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
      if (announce && live) {
        var cap = slides[i].querySelector("figcaption");
        live.textContent = cap ? cap.textContent.trim() : "Image " + (i + 1);
      }
    }

    function run() {
      clearInterval(timer);
      if (!paused && !reduce) {
        timer = setInterval(function () {
          if (!hold && !c.closest("[hidden]")) go(i + 1, false);
        }, 6000);
      }
    }

    dots.forEach(function (b, k) {
      b.addEventListener("click", function () { go(k, true); run(); });
    });
    var prev = c.querySelector(".cs-prev");
    var next = c.querySelector(".cs-next");
    if (prev) prev.addEventListener("click", function () { go(i - 1, true); run(); });
    if (next) next.addEventListener("click", function () { go(i + 1, true); run(); });
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "Play" : "Pause";
      pauseBtn.addEventListener("click", function () {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.textContent = paused ? "Play" : "Pause";
        run();
      });
    }
    c.addEventListener("mouseenter", function () { hold = true; });
    c.addEventListener("mouseleave", function () { hold = false; });
    c.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); run(); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); run(); }
    });
    var x0 = null;
    c.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    c.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1), true); run(); }
      x0 = null;
    });
    c.querySelectorAll(".cs-slide img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.alt = "";
        var slide = img.closest(".cs-slide");
        if (slide) slide.classList.add("no-photo");
      });
    });
    go(0, false);
    run();
  });
})();
