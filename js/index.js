document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".message-container");
  const messageGroup = document.querySelector(".message-group");

  const messages = [
    "Chào Shop! Shop có những cuốn sách về lập trình fix lỗi nào ạ?",
    "Ồ, bên mình hiên tại đang có rất nhiều sách về lập trình fix lỗi.",
    "Thế bạn hãy cho tôi 1 cuốn sách có chi tiết về lập trình fix lỗi và phải dễ hiểu.",
    "Nếu như thế thì mình tư vấn cho bạn 1 cuốn có tên là Mã sạch Robert Martin",
    "Thế nó như thế nào?",
    "Nó có các cách giúp bạn code mà ít khi bị lỗi và nó sẽ tối sản code của bạn lại.",
    "Vậy cuốn đó có giá bao nhiêu.",
    "Nó chỉ có giá từ 100-200.000 đồng thôi.",
    "Umm... Thế thì tôi sẽ mua nó sẽ mua nó.",
    "Cảm ơn bạn rất nhiều!",
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
