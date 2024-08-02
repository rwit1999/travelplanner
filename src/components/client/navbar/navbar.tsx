"use client";

import { useAppStore } from "@/store/store";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextNavBar,
} from "@nextui-org/react";
import {
  MdOutlineTravelExplore,
  MdOutlineFlightTakeoff,
  MdOutlineHotel,
} from "react-icons/md";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const Navbar = ({ onOpen }: { onOpen: () => void }) => {
  const { userInfo, logOut } = useAppStore();
  const isLoggedIn = Boolean(userInfo);
  const router = useRouter();

  const handleLogout = async () => {
    // Call the API route to clear the session/cookies
    await fetch('/api/logout', { method: 'GET' });

    // Update the Zustand store to clear the user info
    logOut();

    // Redirect to home page
    router.push('/');
  };

  return (
    <NextNavBar className="bg-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <NavbarBrand>
          <Link
            href="/"
            className="font-bold text-2xl text-blue-600 flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Jetsetgo
            </span>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-8 text-lg">
          <NavbarItem>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MdOutlineTravelExplore size={24} />
              <span>Places</span>
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              href="/search-flights"
              aria-current="page"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MdOutlineFlightTakeoff size={24} />
              <span>Flights</span>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/search-hotels"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MdOutlineHotel size={24} />
              <span>Hotels</span>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" className="flex items-center gap-4">
          <>
            {userInfo && (
              <>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      color="secondary"
                      size="sm"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{userInfo.firstName}</p>
                    </DropdownItem>
                    <DropdownItem key="settings">My Settings</DropdownItem>
                    <DropdownItem key="/my-bookings" onClick={() => router.push('/my-bookings')}>
                      My Bookings
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            )}
            {!userInfo && (
              <>
                <NavbarItem className="hidden lg:flex">
                  <Button
                    onPress={onOpen}
                    color="primary"
                    variant="flat"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Login
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    onPress={onOpen}
                    color="primary"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    variant="flat"
                  >
                    Sign Up
                  </Button>
                </NavbarItem>
              </>
            )}
          </>
        </NavbarContent>
      </div>
    </NextNavBar>
  );
};

export default Navbar;
