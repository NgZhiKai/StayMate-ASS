import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function DropdownWrapper({ isOpen, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 mt-3 z-50"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}