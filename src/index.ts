

interface MouseEventLike {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
}

const CAP = 20
function windowed() {
  let values = new Array<number>(CAP);
  let index = 0;

  function sample(x: number) {
    if (index < out.N) out.sum -= values[index];
    out.sum += x;

    values[index] = x;
    index = (index + 1) % CAP;
    if (out.N !== CAP) out.N++;
  }

  function reset() {
    index = 0;
    out.N = 0;
    out.sum = 0;
  }

  const out = {
    sample,
    reset,
    N: 0,
    sum: 0,
  }
  return out;
}

function makeEstimator() {
  const X = windowed();
  const Y = windowed();
  const XX = windowed();
  const XY = windowed();

  // y = a + bx, where y = clientValue, x = screenValue
  let a = 0, b = 0

  let prevClientValue = 0, prevScreenValue = 0;
  function sample(clientValue: number, screenValue: number) {
    if (Math.abs(clientValue - prevClientValue) < 4 || Math.abs(screenValue - prevScreenValue) < 4) return;
    prevClientValue = clientValue;
    prevScreenValue = screenValue;

    X.sample(screenValue);
    Y.sample(clientValue);
    XX.sample(screenValue * screenValue);
    XY.sample(clientValue * screenValue);

    const N = X.N
    const c = (N * XX.sum - X.sum ** 2)

    a = (XX.sum * Y.sum - X.sum * XY.sum) / c;
    b = (N * XY.sum - X.sum * Y.sum) / c;
  }

  function reset() {
    X.reset();
    Y.reset();
    XX.reset();
    XY.reset();
    a = 0;
    b = 0;
  }

  return {
    sample,
    reset,
    convert: (screenValue: number, fallbackValue: number) => !b ? fallbackValue : (a + b * screenValue),
  }
}

const xEstimator = makeEstimator();
const yEstimator = makeEstimator();

export function resetCoordEstimator() {
  xEstimator.reset();
  yEstimator.reset();
}

export function estimateCoord(e: MouseEventLike): { clientX: number, clientY: number } {
  // since we can't use mozInnerScreenX and mozInnerScreenY, 
  // simply compute with window.innerWidth and window.outerWidth

  xEstimator.sample(e.clientX, e.screenX);
  yEstimator.sample(e.clientY, e.screenY);

  return {
    clientX: xEstimator.convert(e.screenX, e.clientX),
    clientY: yEstimator.convert(e.screenY, e.clientY),
  }
}