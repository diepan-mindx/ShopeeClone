document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".message-container");
  const messageGroup = document.querySelector(".message-group");

  const messages = [
    "Xin chào bro!",
    "Bạn khỏe không?",
    "Mình ổn, cảm ơn nhé!",
    "Bro đang làm gì đó?",
    "Mình đang code chút bro ạ.",
    "Hay quá nhỉ!",
    "Code web à?",
    "Đúng rồi, mình đang làm web.",
    "Tuyệt vời!",
    "Thành công nhé bro!",
    "Cảm ơn bro nhiều nha!",
  ];

  // Render tất cả tin nhắn
  messages.forEach((msg, i) => {
    const el = document.createElement("div");
    el.className = "message" + (i % 2 === 0 ? " sent" : "");
    el.textContent = msg;
    messageGroup.appendChild(el);
  });

  const SPEED = 40; // px/giây
  const PAUSE = 2000; // ms

  let containerH = container.offsetHeight;
  let groupH = messageGroup.scrollHeight;
  let y = containerH;
  let last = performance.now();
  let isPaused = false;
  let pauseEnd = 0;

  function loop(now) {
    const dt = now - last;
    last = now;

    if (isPaused) {
      if (now >= pauseEnd) {
        // hết pause → reset xuống dưới và tiếp tục chạy
        y = containerH;
        isPaused = false;
      }
      requestAnimationFrame(loop);
      return;
    }

    // cuộn lên
    y -= (SPEED * dt) / 1000;
    messageGroup.style.transform = `translateY(${y}px)`;

    // nếu cuộn hết
    if (y <= -groupH) {
      isPaused = true;
      pauseEnd = now + PAUSE;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame((t) => {
    last = t;
    loop(t);
  });

  window.addEventListener("resize", () => {
    containerH = container.offsetHeight;
    groupH = messageGroup.scrollHeight;
  });
});
