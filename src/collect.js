import { upload } from "./upload";
import qs from "qs";
const appearEvent = new CustomEvent("onAppear");
const disappearEvent = new CustomEvent("onDisappear");
let beforeCreateParams; // 参数创建前
let beforeUpload; // 上传前
let afterUpload; //上传后
let onError = () => console.error(error); // 错误处理

// 采集上报信息
function collect(customData, eventType) {
  let appId;
  let pageId;
  let timestamp;
  let ua;
  let currentUrl;
  beforeCreateParams && beforeCreateParams();
  // 采集页面信息：应用和页面信息
  const metaList = document.getElementsByTagName("meta");
  for (let i = 0; i < metaList.length; i++) {
    const meta = metaList[i];
    if (meta.getAttribute("strive-app-id")) {
      appId = meta.getAttribute("strive-app-id");
    }
  }
  const body = document.body;
  pageId = body.getAttribute("strive-page-id");
  if (!appId || !pageId) {
    return;
  }
  // 日志上报：
  //  应用id和页面id
  //  访问时间
  //  UA
  //  当前页面url
  timestamp = new Date().getTime();
  ua = window.navigator.userAgent;
  currentUrl=window.location.href
  console.log(appId, pageId, timestamp, ua);
  const params = {
    appId,
    pageId,
    timestamp,
    ua,
    currentUrl,
    ...customData,
  };

  // 调用日志上报API b
  let queryString = qs.stringify(params);
  if (beforeUpload) {
    queryString = beforeUpload(queryString);
  }
  let url;
  let uploadData;
  try {
    const res = upload(queryString, { eventType });

    url = res.src;
    uploadData = res.data;
  } catch (error) {
    onError && onError(error);
  } finally {
    afterUpload && afterUpload(url, uploadData);
  }
}

export function collectAppear() {
  let ob;
  if (window.StriveCliMonitorObserver) {
    ob = window.StriveCliMonitorObserver;
  } else {
    ob = new IntersectionObserver(function (e) {
      e.forEach((d) => {
        if (d.intersectionRatio > 0) {
          console.log(d.target.className, "appear");
          d.target.dispatchEvent(appearEvent);
        } else {
          d.target.dispatchEvent(disappearEvent);
        }
      });
    }, {});
  }
  let obList = [];
  const appear = document.querySelectorAll("[appear]");
  for (let i = 0; i < appear.length; i++) {
    if (!obList.includes(appear[i])) {
      ob.observe(appear[i]);
      obList.push(appear[i]);
    }
  }
  window.StriveCliMonitorObserverList = obList;

  window.StriveCliMonitorObserver = ob;
}

// 发送pv日志
export function sendPV() {
  collect({}, "PV");
}

// 上报曝光埋点
export function sendExp(data, options) {
  console.log("sendExp");
  collect(data, "EXP");
}

// 上报点击埋点
export function sendClick(data) {
  collect(data, "CLICK");
}

// 自定义上报 => 曝光和点击无法覆盖的场景使用
export function sendCustom(data) {
  collect(data, "CUSTOM");
}

export function registerBeforeCreateParams(fn) {
  beforeCreateParams = fn;
}

export function registerBeforeUpload(fn) {
  beforeUpload = fn;
}

export function registerAfterUpload(fn) {
  afterUpload = fn;
}

export function registerOnError(fn) {
  onError = fn;
}
