export function getCappedFrameTarget(
  renderedFrame: number,
  requestedFrame: number,
  maxFrameStep?: number,
): number {
  if (renderedFrame < 0 || !maxFrameStep || maxFrameStep <= 0) {
    return requestedFrame;
  }

  const delta = requestedFrame - renderedFrame;
  if (Math.abs(delta) <= maxFrameStep) return requestedFrame;

  return renderedFrame + Math.sign(delta) * maxFrameStep;
}
