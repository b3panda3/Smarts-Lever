'use client';

/**
 * Smarts Lever brand logo that adapts to the color mode.
 * - Light mode: navy/red logo (designed for light backgrounds)
 * - Dark mode:  white/salmon logo (designed for dark backgrounds)
 *
 * Both <img> tags are always rendered and swapped with CSS `dark:` classes,
 * which avoids any hydration mismatch with next-themes.
 */
export function BrandLogo({
  className = 'h-10',
  alt = 'Smarts Lever — Learn Anything, In Your Language',
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <span className="inline-flex items-center leading-none">
      <img
        src="/brand/logo-light.png"
        alt={alt}
        className={`block dark:hidden w-auto ${className}`}
        draggable={false}
      />
      <img
        src="/brand/logo-dark.png"
        alt=""
        aria-hidden="true"
        className={`hidden dark:block w-auto ${className}`}
        draggable={false}
      />
    </span>
  );
}
