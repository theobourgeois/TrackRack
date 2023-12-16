import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import withMT from "@material-tailwind/react/utils/withMT";
import { withUt } from "uploadthing/tw";

module.exports = withMT(withUt({
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config));
