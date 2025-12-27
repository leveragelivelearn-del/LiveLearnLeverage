"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../theme-toggle";
import Logo from "../logo";


const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Models", href: "/models" },
  { name: "Blog", href: "/blog" },
];

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme } = useTheme();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Logic: Transparent ONLY on Home page when at the top.
  // Everywhere else (or when scrolled), use the solid look.
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  const textColorClass = !isTransparent ? "text-foreground" : "text-white";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        !isTransparent
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-2" // Solid look (Scrolled OR Not Home)
          : "bg-transparent border-transparent py-6" // Transparent look (Home & Top)
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">

        {/* Logo */}
        <div className="flex items-center gap-6 z-20">
          <div className={cn("transition-all duration-300", !isTransparent ? "" : "brightness-0 invert")}>
            <Logo />
          </div>
        </div>

        {/* Desktop Navigation in Rounded Bar */}
        <nav
          className={cn(
            "hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2",
            "px-2 py-1.5 rounded-full transition-all duration-300",
            !isTransparent
              ? "bg-background/50 border border-border shadow-sm" // Solid Pill
              : "bg-white/10 border border-white/20 backdrop-blur-md shadow-lg" // Glassy Pill
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-bold tracking-widest uppercase transition-all duration-300 relative group px-5 py-2.5 rounded-full",
                textColorClass,
                pathname === item.href
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          ))}


        </nav>

        {/* Right side - Auth, Theme & User Menu */}
        <div className="flex items-center gap-4 z-20">
          <div className="hidden md:block">
            <div className={!isTransparent ? "" : "[&_button]:text-white"}>
              <ThemeToggle />
            </div>
          </div>

          {status === "loading" ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted/20 animate-pulse" />
            </div>
          ) : session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "hidden md:flex items-center rounded-full transition-all focus-visible:ring-0 focus-visible:ring-offset-0 px-2",
                      !isTransparent ? "hover:bg-accent/50" : "hover:bg-white/10 text-white"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {getInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2">
                  <DropdownMenuLabel className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {getInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(session.user?.role === "admin" ||
                    session.user?.role === "editor") && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/models" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Content
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("rounded-full", !isTransparent ? "" : "text-white hover:bg-white/10")}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          {getInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Button
                variant={!isTransparent ? "default" : "outline"}
                size="sm"
                onClick={() => router.push("/login")}
                className={cn(
                  "hidden md:flex items-center gap-2 transition-all",
                  !isTransparent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "border-white text-white hover:bg-white hover:text-black bg-transparent"
                )}
              >
                <User className="h-4 w-4" />
                Login
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/login")}
                className={cn("md:hidden", !isTransparent ? "" : "text-white hover:bg-white/10")}
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={!isTransparent ? "" : "text-white hover:bg-white/10"}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t my-3 pt-3">
                    <ThemeToggle />
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}