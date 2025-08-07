/**
 * 标题动态变化
 * 为了避免PJAX出现的变量重复定义和事件重复绑定需要先判断是否已经加载
 */
if (typeof ywwTitle === 'undefined') {
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
}
