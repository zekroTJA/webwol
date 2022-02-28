import styled from "styled-components";

interface Props {
  width?: string;
  height?: string;
  delay?: string | number;
  margin?: string;
}

const SkeletonContainer = styled.div<Props>`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  background-color: #ffffff3d;
  border-radius: 10px;
  opacity: 0;

  @keyframes skeleton {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  animation: skeleton 1.5s ease infinite;
  animation-delay: ${(p) => p.delay};
`;

export const SkeletonTile: React.FC<Props> = ({ delay, ...props }) => {
  return <SkeletonContainer delay={asTime(delay!)} {...props} />;
};

SkeletonTile.defaultProps = {
  width: "100%",
  height: "3em",
  delay: 0,
  margin: "0",
};

function asTime(v: string | number): string {
  if (typeof v === "number") return `${v}s`;
  return v;
}
