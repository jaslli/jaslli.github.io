/**
 * 首次加载
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * 标题动态变化
     */
    let ywwTitle = document.title;
    let ywwtitleTime;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.innerHTML = '<link rel="icon"/>';
            document.title = 'aya 崩溃啦';
            clearTimeout(ywwtitleTime);
        } else {
            document.innerHTML = '<link rel="icon"/>';
            document.title = 'ya 又好了';
            ywwtitleTime = setTimeout(function() {
                document.title = ywwTitle;
            }, 2000);
        }
    });

    /**
     * 检测开发者工具打开
     */
    let devtools = {
        open: false,
        orientation: null
    };
    const threshold = 160;

    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // 使用主题自带的Snackbar提示
                btf.snackbarShow('检测到您正在使用开发者工具，请不要做坏事哦！', true, 3000);
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    /**
     * 打印欢迎语
     */
    console.info("%c yww %c 欢迎来到我的博客！", "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #8EC5FC; font-weight: bold;", "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #CD9DFA; font-weight: bold;");

});
