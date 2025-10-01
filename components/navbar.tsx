"use client";

import NextImage from "next/image";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

import {
  FacebookIcon,
  InstagramIcon,
  HeartFilledIcon,
} from "@/components/icons";

export const Navbar = () => {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const { user, isAuthenticated, logout } = useAuth();
  
  // State to handle hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <HeroUINavbar 
      maxWidth="xl" 
      position="sticky"
      className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800"
    >
      <NavbarContent className="basis-auto" justify="start">
        <NavbarBrand className="gap-3">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <NextImage
              src={mounted && theme === "dark" ? "/RY-H-blanco.png" : "/RY-H-color.png"}
              alt="Ruedaya Logo"
              width={140}
              height={60}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain max-w-[140px] max-h-[60px]"
              priority
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex basis-auto" justify="center">
        <ul className="flex gap-4 justify-center">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "font-medium text-sm text-foreground hover:text-[#1341ee] transition-colors duration-200"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-auto gap-3"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Facebook" href="#" className="text-gray-400 hover:text-[#1341ee] transition-colors duration-200">
            <FacebookIcon className="w-4 h-4" />
          </Link>
          <Link isExternal aria-label="Instagram" href="#" className="text-gray-400 hover:text-[#1341ee] transition-colors duration-200">
            <InstagramIcon className="w-4 h-4" />
          </Link>
          <ThemeSwitch />
          <Link aria-label="Lista de deseos" href="/favoritos" className="text-[#1341ee] hover:text-[#1341ee]/80 transition-colors duration-200 p-1.5 rounded-md hover:bg-[#1341ee]/10 border border-[#1341ee]/20">
            <HeartFilledIcon className="w-4 h-4" />
          </Link>
        </NavbarItem>
        
        <NavbarItem className="hidden md:flex">
          {(isAuthenticated && user) || session ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user?.name || session?.user?.name || "Usuario"}
                  size="sm"
                  src={user?.avatar || session?.user?.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Conectado como</p>
                  <p className="font-semibold">{user?.email || session?.user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings" as={NextLink} href="/perfil">
                  Mi perfil
                </DropdownItem>
                <DropdownItem key="system" as={NextLink} href="/configuracion">
                  Configuración
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={() => user ? logout() : signOut()}>
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button 
              as={NextLink} 
              href="/auth" 
              className="bg-[#1341ee] text-white hover:bg-[#1341ee]/90"
            >
              Ingresar
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link aria-label="Lista de deseos" href="/favoritos" className="text-[#1341ee] hover:text-[#1341ee]/80 transition-colors duration-200 p-1.5 rounded-md hover:bg-[#1341ee]/10 border border-[#1341ee]/20">
          <HeartFilledIcon className="w-4 h-4" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                as={NextLink}
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
                className="w-full"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
