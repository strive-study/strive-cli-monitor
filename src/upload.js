// event-type PV EXP CLICK => PV 曝光 点击
export function upload(queryString, options = {}) {
  let img = new Image();
  const { eventType = "PV" } = options;
  let params = `${queryString}&eventType=${eventType}`;
  const src = `http://www.imooc.com?${params}`;
  img.src = src;
  img = null; // 内存释放
  return {
    src,
    data: {
      params,
    },
  };
}


