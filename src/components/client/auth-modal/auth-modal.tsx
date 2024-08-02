"use client";
import { useAppStore } from "@/store/store";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpen?: () => void;
  onOpenChange: () => void;
}) => {
  const [modalType, setModalType] = useState("login");
  const router = useRouter();
  const { setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (onClose: () => void) => {
    try {
      const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, firstName, lastName })
      });
      const data = await response.json();

      if (response.ok) {
        setUserInfo(data.userInfo);
        toast.success('Signup successful!');
        onClose();
        router.push('/');
      } else {
        toast.error(data.message || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred.');
      console.error('Signup failed:', error.message);
    }
  };

  const handleLogin = async (onClose: () => void) => {
    try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        setUserInfo(data.userInfo);
        toast.success('Login successful!');
        onClose();
        
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred.');
      console.error('Login failed:', error.message);
    }
  };

  const switchModalType = () => {
    setModalType(modalType === "login" ? "signup" : "login");
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center space-y-4">
                <Image src="/logo.jpg" alt="logo" height={80} width={80} />
                <span className="text-xl font-bold">Jetsetgo</span>
              </ModalHeader>
              <ModalBody className="flex flex-col space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                {modalType === "signup" && (
                  <>
                    <Input
                      placeholder="First Name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Last Name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full"
                    />
                  </>
                )}
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </ModalBody>
              <ModalFooter className="flex flex-col items-center space-y-4">
                <Button
                  onClick={() =>
                    modalType === "login"
                      ? handleLogin(onClose)
                      : handleSignUp(onClose)
                  }
                  className="w-full py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600"
                >
                  {modalType === "login" ? "Login" : "Sign Up"}
                </Button>
                <p className="text-sm text-gray-600">
                  {modalType === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <Link
                        href="#"
                        onPress={switchModalType}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        Login now
                      </Link>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <Link
                        href="#"
                        onPress={switchModalType}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </p>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </>
  );
};

export default AuthModal;
