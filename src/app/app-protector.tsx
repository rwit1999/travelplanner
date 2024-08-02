"use client";

import { useAppStore } from "@/store/store";
import axios from "axios";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AppProtector = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { userInfo, setUserInfo } = useAppStore();
  useEffect(() => {
    if (!userInfo) {
      const getUserInfo = async () => {
        const response = await axios.get('/api/auth/me');
        if (response.data.userInfo) {
          setUserInfo(response.data.userInfo);
          console.log(userInfo);
          
        }
      };
      getUserInfo();
    }
  }, [pathName, userInfo, setUserInfo, router]);

  return null;
};

export default AppProtector;