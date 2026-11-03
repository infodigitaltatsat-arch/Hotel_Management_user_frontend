
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { navigationLinks } from "../../data/navigation";

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-serif text-2xl text-white">
                D
              </span>

              <span>
                <span className="block font-serif text-xl font-semibold text-white">
                  Digital Tatsat
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  Hotel & Retreat
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Thoughtful hospitality, comfortable stays, and memorable
              experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="mb-5 text-sm font-semibold text-white">
              Explore
            </h2>

            <ul className="space-y-3">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/rooms"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Book a room
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h2 className="mb-5 text-sm font-semibold text-white">
              Get in touch
            </h2>

            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>Hotel address will be added here</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-blue-400" />
                <span>Contact number will be added here</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-blue-400" />
                <span>Email will be added here</span>
              </li>
            </ul>
          </div>

          {/* Booking CTA */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">
              Your next stay
            </h2>

            <p className="mb-5 text-sm leading-7 text-slate-400">
              Find a room that suits your trip and make your stay comfortable.
            </p>

            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-blue-500 hover:bg-blue-600"
            >
              Explore rooms
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Haven Hotel & Retreat. All rights
            reserved.
          </p>

          <p>Made for a comfortable stay.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
