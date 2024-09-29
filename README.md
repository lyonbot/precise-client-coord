# precise-client-coord

[ [npm](https://www.npmjs.com/package/precise-client-coord) | [github](https://github.com/lyonbot/precise-client-coord) | [demo](https://lyonbot.github.io/precise-client-coord/) ]

Get clientX and clientY in double type, not integer.

<p align="center">
  <img src="https://vfiles.gtimg.cn/wuji_dashboard/xy/starter/71a67738.jpg">
</p>

## Usage

```js
import { estimateCoord, resetCoordEstimator } from "precise-client-coord";

window.addEventListener("resize", resetCoordEstimator);
window.addEventListener("mousemove", (e) => {
  const originalClientX = e.clientX;
  const originalClientY = e.clientY;
  const { clientX, clientY } = estimateCoord(e);

  display(clientX, clientY, originalClientX, originalClientY);
});
```
