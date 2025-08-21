document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitButton = document.getElementById('submit-button');
    const nameField = document.getElementById('name-field');
    const rememberMeSection = document.getElementById('remember-me-section');
    const loginForm = document.getElementById('login-form');

    let isLogin = true;

    toggleButton.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = "Đăng Nhập";
            formSubtitle.textContent = "Chào mừng bạn trở lại, vui lòng đăng nhập để tiếp tục.";
            submitButton.textContent = "Đăng Nhập";
            toggleButton.textContent = "Đăng ký ngay!";
            nameField.classList.add('hidden');
            rememberMeSection.classList.remove('hidden');
        } else {
            formTitle.textContent = "Đăng Ký";
            formSubtitle.textContent = "Hãy đăng ký để tham gia cùng chúng tôi!";
            submitButton.textContent = "Đăng Ký";
            toggleButton.textContent = "Đăng nhập ngay!";
            nameField.classList.remove('hidden');
            rememberMeSection.classList.add('hidden');
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        // In a real application, you would send data to a server for authentication.
        // After successful authentication, you would redirect the user.

        // Redirect to the admin dashboard page.
        window.location.href = 'home.html';
    });
});
