"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  BarChart3,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  User,
  X,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  name: string;
  email: string;
}

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (data) setProfile(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      glow: "rgba(59, 130, 246, 0.5)",
    },
    {
      name: "New Interview",
      href: "/interview/new",
      icon: PlusCircle,
      color: "from-purple-500 to-pink-500",
      glow: "rgba(168, 85, 247, 0.5)",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      color: "from-orange-500 to-amber-500",
      glow: "rgba(251, 146, 60, 0.5)",
    },
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Error signing out. Please try again.");
      return;
    }
    
    router.push("/");
    router.refresh();
    toast.success("Successfully signed out");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b bg-background/80 backdrop-blur-xl shadow-lg" 
          : "border-b border-transparent bg-background/50 backdrop-blur-md"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            opacity: scrolled ? 0 : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <motion.div
                className="relative w-6 h-6"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
              </motion.div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                GiveMeThatJob
              </span>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Glow effect */}
                  {(hoveredItem === item.href || pathname === item.href) && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `radial-gradient(circle at center, ${item.glow} 0%, transparent 70%)`,
                        filter: "blur(10px)",
                        opacity: 0.5,
                      }}
                      layoutId="nav-glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  
                  <motion.div
                    className={`relative bg-gradient-to-r ${item.color} bg-clip-text`}
                    animate={{
                      opacity: pathname === item.href ? 1 : hoveredItem === item.href ? 0.8 : 0,
                    }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: "transparent", WebkitTextFillColor: "transparent" }} />
                  </motion.div>
                  <item.icon className={`absolute h-4 w-4 ${pathname === item.href || hoveredItem === item.href ? "opacity-0" : "opacity-100"}`} />
                  
                  <span className="relative z-10">{item.name}</span>
                  
                  {pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{
                        background: `linear-gradient(to right, ${item.color})`,
                      }}
                      layoutId="nav-underline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ModeToggle />
          </motion.div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      {profile?.name ? getInitials(profile.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-background/95 border-border/50">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{profile?.name || "Loading..."}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {profile?.email || "Loading..."}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/interview/new" className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>New Interview</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <motion.button 
            className="block md:hidden relative z-10" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <motion.div 
              className="container py-4 flex flex-col gap-2 bg-background/95 backdrop-blur-xl border-t"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                className="border-t my-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}