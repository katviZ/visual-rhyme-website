// Variants shared by sections that want a soft staggered entry on their child
// elements. Apply `staggerContainerProps` to the parent and spread
// `staggerItemProps` onto each child motion element.

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainerProps = {
  variants: staggerContainer,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
};

export const staggerItemProps = {
  variants: staggerItem,
};
