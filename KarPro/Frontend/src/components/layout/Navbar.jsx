import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { showInfo } from "../../utils/toast";

/* ================= VARIANTS ================= */

// Navbar reveal (smooth + soft)
const navVariants = {
  hidden: {
    y: -60,
    opacity: 0,
    filter: "blur(6px)",
  },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 16,
      delay: 0.4, // cinematic delay
    },
  },
};

// Stagger container
const navContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.6,
    },
  },
};

// Nav item
const navItem = {
  hidden: {
    opacity: 0,
    y: -12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showInfo("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="show"
      className="fixed top-0 left-0 right-0 z-50 h-16
                 bg-blue-950/70 backdrop-blur-xl
                 border-b border-white/10"
    >
      <motion.div
        className="max-w-7xl mx-auto h-full flex items-center justify-between px-6"
        variants={navContainer}
        initial="hidden"
        animate="show"
      >
        {/* Logo */}
        <motion.div
          variants={navItem}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/"
            className="text-lg font-bold tracking-tight
                       bg-gradient-to-r from-white via-gray-200 to-gray-400
                       bg-clip-text text-transparent"
          >
            SplitEase
          </Link>
        </motion.div>

        {/* Actions */}
        <motion.nav
          className="flex items-center gap-6"
          variants={navContainer}
        >
          {user ? (
            <>
              <motion.div
                variants={navItem}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <Link
                  to="/groups"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Groups
                </Link>
              </motion.div>

              <motion.button
                variants={navItem}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleLogout}
                className="text-sm font-medium text-red-400 hover:text-red-500 transition"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                variants={navItem}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
              </motion.div>

              <motion.div
                variants={navItem}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to="/register"
                  className="rounded-full px-5 py-2 text-sm font-semibold
                             bg-white text-black
                             hover:bg-gray-200 transition"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </motion.nav>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
