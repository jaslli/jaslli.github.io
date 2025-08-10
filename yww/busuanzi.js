(function () {
    'use strict';

    // 配置项
    const CONFIG = {
        // 统计项名称列表
        STATISTICS: ["site_pv", "page_pv", "site_uv", "page_uv"],
        // API地址，请根据实际情况修改
        API_URL: "https://blog.yww52.com/busuanzi/api",
        // localStorage中存储身份标识的key
        LOCALSTORAGE_KEY: "bsz-id",
        // busuanzi的元素容器和元素值前缀
        ITEM_VALUE_PREFIX: "busuanzi_value_",
        ITEM_CONTAINER_PREFIX: "busuanzi_container_",
        // 请求超时时间（毫秒）
        REQUEST_TIMEOUT: 5000,
        // 重试次数
        RETRY_COUNT: 3
    };

    /**
     * DOM Ready 检测函数
     *
     * @param {Function} callback - DOM准备完成后执行的回调函数
     */
    function domReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            // DOM已经准备完成，立即执行
            callback();
        }
    }

    /**
     * 创建带超时的fetch请求
     *
     * @param {string} url      请求URL
     * @param {object} options  fetch选项
     * @param {number} timeout  超时时间
     * @returns {Promise}       fetch Promise
     */
    function fetchWithTimeout(url, options, timeout) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    /**
     * 保存用户身份标识
     * @param {string} userId - 用户身份标识
     */
    function saveUserId(userId) {
        try {
            if (userId && userId !== "") {
                localStorage.setItem(CONFIG.LOCALSTORAGE_KEY, userId);
            }
        } catch (error) {
            console.warn('无法保存到localStorage:', error);
        }
    }

    /**
     * 获取或生成用户身份标识
     * @returns {string|null} 用户身份标识
     */
    function getUserId() {
        try {
            return localStorage.getItem(CONFIG.LOCALSTORAGE_KEY);
        } catch (error) {
            console.warn('无法访问localStorage:', error);
            return null;
        }
    }

    /**
     * 隐藏所有统计容器（出错时调用）
     */
    function hideStatistics() {
        CONFIG.STATISTICS.forEach(item => {
            try {
                const containerElement = document.getElementById(CONFIG.ITEM_CONTAINER_PREFIX + item);
                if (containerElement) {
                    containerElement.style.display = "none";
                }
            } catch (error) {
                console.warn(`隐藏统计项 ${item} 时出错:`, error);
            }
        });
    }

    /**
     * 发送统计请求
     *
     * @param {number} retryCount - 剩余重试次数
     */
    function fetchStatistics(retryCount = CONFIG.RETRY_COUNT) {
        // 构建请求头
        const headers = new Headers();
        headers.append("X-Referer", window.location.href);

        const userId = getUserId();
        if (userId) {
            headers.append("Authorization", userId);
        }

        // 发送超时请求
        fetchWithTimeout(CONFIG.API_URL, {
            method: "GET",
            headers: headers
        }, CONFIG.REQUEST_TIMEOUT)
            // 请求成功处理
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // 保存响应头中的身份标识
                const bszId = response.headers.get("Authorization");
                if (bszId) {
                    saveUserId(bszId);
                }

                return response.json();
            })
            // 成功数据处理
            .then(data => {
                // 遍历每项统计数据，然后进行更改
                CONFIG.STATISTICS.forEach(item => {
                    try {
                        // 更新统计数值
                        const valueElement = document.getElementById(CONFIG.ITEM_VALUE_PREFIX + item);
                        if (valueElement) {
                            valueElement.innerHTML = data[item] || 0;
                        }

                        // 显示统计容器
                        const containerElement = document.getElementById(CONFIG.ITEM_CONTAINER_PREFIX + item);
                        if (containerElement) {
                            containerElement.style.display = "inline";
                        }
                    } catch (error) {
                        console.warn(`更新统计项 ${item} 时出错:`, error);
                    }
                });
            })
            .catch(error => {
                console.error('busuanzi统计请求失败:', error);

                // 重试机制
                if (retryCount > 0) {
                    console.log(`正在重试... 剩余重试次数: ${retryCount}`);
                    setTimeout(() => {
                        fetchStatistics(retryCount - 1);
                    }, 1000); // 1秒后重试
                } else {
                    console.error('所有重试都失败，隐藏统计显示');
                    hideStatistics();
                }
            });
    }

    // 等待DOM准备完成后初始化
    domReady(fetchStatistics);

})();