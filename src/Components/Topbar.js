"use client"
import React from "react";
import {  Navbar,   NavbarBrand,   NavbarContent,   NavbarItem,   NavbarMenuToggle,  NavbarMenu,  NavbarMenuItem} from "@nextui-org/navbar";
import {Button} from "@nextui-org/button"
import {Link} from "@nextui-org/link";
import { GoHomeFill } from "react-icons/go";
import { BiSun,BiMoon } from "react-icons/bi";
import {Switch} from "@nextui-org/switch";
import {useTheme} from "next-themes";

export default function Topbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <Navbar shouldHideOnScroll>
      <NavbarContent justify="start">
        <NavbarItem>
          <Button isIconOnly as={Link} color="primary" href="/" variant="flat">
            <GoHomeFill />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
        <Switch
            isSelected={theme === "dark"} 
            onValueChange={toggleTheme}
            defaultSelected
            size="md"
            color="success"
            startContent={<BiSun />}
            endContent={<BiMoon />}
          >
          </Switch>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
