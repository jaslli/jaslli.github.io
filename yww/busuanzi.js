(function () {
    // 统计项名称列明
    const STATISTICS = ["site_pv", "page_pv", "site_uv", "page_uv"];
    // 定义API地址，请自行修改
    const API_URL = "https://blog.yww52.com/busuanzi/api";
    // localStorage中存储身份标识的key
    const LOCALSTORAGE_KEY = "bsz-id";
    // busuanzi的元素容器和元素值前缀
    const ITEM_VALUE = "busuanzi_value_";
    const ITEM_CONTAINER = "busuanzi_container_";

    /**
     * 获取所有统计数据
     */
    const fetchData = function () {
        // 构建请求头
        const headers = new Headers();
        headers.append("X-Referer", window.location.href);
        let bszId = localStorage.getItem(LOCALSTORAGE_KEY);
        if (bszId) {
            headers.append("Authorization", bszId);
        }

        // 使用fetch发送请求
        fetch(API_URL, {
            method: "GET",
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // 获取响应头中的身份标识
                bszId = response.headers.get("Authorization");
                // 如果响应头中有身份标识，则保存到localStorage
                if (bszId && bszId !== "") {
                    localStorage.setItem(LOCALSTORAGE_KEY, bszId);
                }
                return response.json();
            })
            .then(data => {
                STATISTICS.forEach(item => {
                    // 查找对应统计项的页面元素
                    let element = document.getElementById(ITEM_VALUE + item);
                    if (element) {
                        element.innerHTML = data[item];
                    }
                    // 查找统计容器元素，使其显形，去除隐藏
                    let container = document.getElementById(ITEM_CONTAINER + item);
                    if (container) {
                        container.style.display = "inline";
                    }
                });
            })
            .catch(error => {
                console.error('busuanzi请求获取数据接口失败:', error);
            });
    };

    // 发送请求
    fetchData();

})();
