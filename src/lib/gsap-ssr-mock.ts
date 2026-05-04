const noop = () => {};
const noopReturnsThis = function (this: unknown) { return this; };

const gsap: Record<string, unknown> = {
  registerPlugin: noop,
  to: noop,
  from: noop,
  fromTo: noop,
  set: noop,
  timeline: () => ({
    to: noopReturnsThis,
    from: noopReturnsThis,
    fromTo: noopReturnsThis,
    set: noopReturnsThis,
    add: noopReturnsThis,
    play: noopReturnsThis,
    pause: noopReturnsThis,
    kill: noop,
  }),
  context: () => ({ revert: noop, kill: noop }),
  utils: { toArray: () => [], selector: () => () => [] },
  ticker: { add: noop, remove: noop },
  core: { globals: noop },
};

export default gsap;
