import { motion } from "framer-motion";

export default function Resources() {
  return (
    <motion.div
      className="container"
      style={{ margin: "auto", width: "60%" }}
      initial={{ opacity: 0, translateY: 0 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <p>Resources</p>
      </div>
    </motion.div>
  );
}
