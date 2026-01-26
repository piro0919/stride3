import { routing } from "./routing";
import { createNavigation } from "next-intl/navigation";

export const { getPathname, Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
