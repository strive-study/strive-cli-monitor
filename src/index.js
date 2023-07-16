import {
  sendPV,
  registerBeforeCreateParams,
  registerBeforeUpload,
  registerAfterUpload,
  registerOnError,
  sendExp,
  sendClick,
  sendCustom,
  collectAppear,
} from "./collect";
import { upload } from "./upload";

window.onload = () => {
  collectAppear();
};

window.StriveCliMonitor = {
  upload,
  collectAppear,
  sendExp,
  sendPV,
  sendClick,
  sendCustom,
  registerBeforeCreateParams,
  registerBeforeUpload,
  registerAfterUpload,
  registerOnError,
};
