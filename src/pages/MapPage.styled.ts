import styled from 'styled-components';

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;

  * {
    user-select: none;
    -webkit-user-select: none;
  }

  img {
    -webkit-user-drag: none;
  }
`;

export const Header = styled.header`
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 0;
  pointer-events: none;
`;

export const HeaderItem = styled.div`
  pointer-events: auto;
`;

export const Logo = styled.img`
  width: 97px;
  height: 20px;
  pointer-events: none;
`;

export const Stage = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  touch-action: none;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const ImageGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  will-change: transform;
`;

export const EmptyBooth = styled.div<{ $color: string }>`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: ${({ $color }) => $color};
  pointer-events: none;

  &::after {
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    -webkit-text-stroke: 2px rgba(60, 60, 67, 0.58);
    paint-order: stroke fill;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.22);
  }

  &[data-booth-empty^='A-']::after,
  &[data-booth-empty^='B-']::after,
  &[data-booth-empty^='C-']::after,
  &[data-booth-empty^='D-']::after,
  &[data-booth-empty^='E-']::after,
  &[data-booth-empty^='F-']::after,
  &[data-booth-empty^='G-']::after {
    content: attr(data-booth-empty);
  }
`;

export const ProjectHighlight = styled.div<{ $color: string }>`
  position: absolute;
  z-index: 4;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.96);
  border-radius: 4px;
  background: transparent;
  box-shadow:
    0 0 0 3px ${({ $color }) => $color}ee,
    0 0 10px 4px ${({ $color }) => $color}8a,
    0 0 22px 8px ${({ $color }) => $color}42;
  filter: brightness(1.08);
  pointer-events: none;
`;

/** Overlay layer for fixed-size pills (positioned in Stage screen space). */
export const PillLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;

  > * {
    pointer-events: auto;
  }
`;

export const QrFab = styled.button`
  position: absolute;
  right: 31px;
  bottom: 31px;
  z-index: 6;
  width: 55px;
  height: 50px;
  padding: 0;
  border: none;
  background: none;
  filter: drop-shadow(0 4px 14px rgba(78, 62, 133, 0.55));
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
