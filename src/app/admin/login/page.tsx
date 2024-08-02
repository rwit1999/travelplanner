'use client'
import { useAppStore } from "@/store/store";
import { ADMIN_API_ROUTES } from "@/utils";
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@nextui-org/react";
import { SHA256 } from "crypto-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { userInfo } from "os";
import React, { useState } from "react";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUserInfo} =useAppStore()
    const router = useRouter()

    const handleLogin = async () => {
        console.log(SHA256(password).toString());
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if(data.userInfo){
                setUserInfo(data.userInfo)
                router.push('/admin')
            }
        } catch (error:any) {
            console.error('Login failed:', error.message);
        }
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/bg-main.jpg")',
                height: "100vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Card style={{ maxWidth: 400, width: "100%", padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}>
                <CardHeader style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <div>
                        <Image src="/logo.jpg" alt="logo" width={60} height={60} />
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0.5rem" }}>Admin Login</span>
                </CardHeader>
                <CardBody style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                </CardBody>
                <CardFooter style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleLogin} color="primary" style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", fontWeight: "bold" }}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
