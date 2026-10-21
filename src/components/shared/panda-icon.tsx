import Image from "next/image";

interface PandaIconProps {
  size?: number;
  className?: string;
}

/**
 * Icône mascotte panda officielle de RZPan'Da.
 */
export function PandaIcon({ size = 32, className }: PandaIconProps) {
  return (
    <Image
      src="/rzpanda-icon.png"
      alt="Mascotte RZPan'Da"
      width={size}
      height={size}
      className={`object-contain ${className || ""}`}
      style={{ width: size, height: size }}
    />
  );
}
