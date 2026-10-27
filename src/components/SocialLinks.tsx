import { Facebook, Linkedin } from "lucide-react";
import { FACEBOOK_URL, LINKEDIN_URL } from "@/lib/social";

interface Props {
  /** "icons" = round icon buttons; "buttons" = labelled "Follow" buttons */
  variant?: "icons" | "buttons";
  className?: string;
}

const SocialLinks = ({ variant = "icons", className = "" }: Props) => {
  const links = [
    { name: "LinkedIn", href: LINKEDIN_URL, Icon: Linkedin },
    { name: "Facebook", href: FACEBOOK_URL, Icon: Facebook },
  ];

  if (variant === "buttons") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
        {links.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon className="h-4 w-4" /> Follow us on {name}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`SDM Technology on ${name}`}
          title={name}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
