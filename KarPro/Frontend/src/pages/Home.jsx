import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= VARIANTS ================= */
const footerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const footerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const socialHover = {
  hover: {
    scale: 1.2,
    rotate: 6,
    transition: { type: "spring", stiffness: 300 },
  },
};


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const card = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ================= COMPONENT ================= */

const Home = () => {
  return (
    <div className="bg-black text-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">

        {/* Floating glows */}
        <motion.div
          className="absolute top-[-10rem] left-[-10rem] h-[30rem] w-[30rem] bg-purple-600/20 rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10rem] right-[-10rem] h-[30rem] w-[30rem] bg-cyan-500/20 rounded-full blur-[120px]"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-3xl text-center px-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="inline-block mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-gray-300"
          >
            💸 Smart Expense Tracking
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Split expenses. <br /> Stay stress-free.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-gray-400 text-lg max-w-xl mx-auto"
          >
            Track group expenses, split bills effortlessly, and settle balances
            without awkward conversations.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex justify-center gap-4"
          >
            <Link
              to="/login"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-black hover:scale-105 transition"
            >
              Get Started →
            </Link>

            <button className="rounded-xl border border-white/20 px-8 py-3 text-gray-300 hover:bg-white/5 transition">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= CARDS SECTION (YOYO SCROLL) ================= */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">

          {/* Section Heading */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            variants={item}
            viewport={{ once: false, margin: "-120px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                manage expenses
              </span>
            </h2>
            <p className="mt-4 text-gray-400">
              Designed to keep things simple, transparent, and stress-free.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: false, // 👈 YOYO ENABLED
              margin: "-120px",
            }}
          >
            {[
              {
                icon: "👥",
                title: "Group Expenses",
                desc: "Create groups and track shared expenses with friends or trips.",
              },
              {
                icon: "⚖️",
                title: "Smart Splits",
                desc: "Automatically calculate who owes whom in real time.",
              },
              {
                icon: "💳",
                title: "Easy Settlements",
                desc: "Settle balances quickly and keep everything crystal clear.",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                variants={card}
                whileHover={{ y: -10, scale: 1.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md cursor-pointer"
              >
                <div className="mb-4 text-3xl">{c.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                <p className="text-gray-400">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

       <motion.footer
  className="border-t border-white/10 bg-black"
  variants={footerContainer}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, margin: "-100px" }}   // 👈 YOYO enabled
>
  <div className="max-w-6xl mx-auto px-6 py-16">

    {/* Top */}
    <div className="grid gap-12 md:grid-cols-4">

      {/* Brand */}
      <motion.div variants={footerItem}>
        <h3 className="text-xl font-bold tracking-tight">
          SplitWise<span className="text-purple-400">.</span>
        </h3>
        <p className="mt-4 text-sm text-gray-400 max-w-xs">
          A simple and smart way to track group expenses and settle balances
          without stress.
        </p>
      </motion.div>

      {/* Product */}
      <motion.div variants={footerItem}>
        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
          Product
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          {["Features", "Pricing", "Security", "Roadmap"].map((item) => (
            <li
              key={item}
              className="hover:text-white transition cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Company */}
      <motion.div variants={footerItem}>
        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
          Company
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          {["About", "Careers", "Blog", "Contact"].map((item) => (
            <li
              key={item}
              className="hover:text-white transition cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Social */}
      <motion.div variants={footerItem}>
        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
          Connect
        </h4>
        <div className="flex gap-4">
          {["🐦", "💼", "📸"].map((icon, i) => (
            <motion.div
              key={i}
              variants={socialHover}
              whileHover="hover"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 cursor-pointer"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Bottom */}
    <motion.div
      variants={footerItem}
      className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6"
    >
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} SplitWise. All rights reserved.
      </p>

      <div className="flex gap-6 text-sm text-gray-400">
        <span className="hover:text-white transition cursor-pointer">
          Privacy Policy
        </span>
        <span className="hover:text-white transition cursor-pointer">
          Terms of Service
        </span>
      </div>
    </motion.div>
  </div>
</motion.footer>


    </div>
  );
};

export default Home;
