let modeSwitch_main = document.querySelector('.mode-switch');
modeSwitch_main.addEventListener('click', function () {
    document.documentElement.classList.toggle('light');
    modeSwitch_main.classList.toggle('active');
});

