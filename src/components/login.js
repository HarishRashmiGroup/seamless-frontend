import { useState, useEffect } from "react";
import {
    Button,
    Input,
    FormLabel,
    VStack,
    Box,
    useBreakpointValue,
    Spinner,
    Flex,
    useColorModeValue,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "./PasswordInput";

export default function LoginPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [bgImage, setBgImage] = useState("https://blackbucks-media.s3.ap-south-1.amazonaws.com/Seamless1-1739803270669.jpeg");

    const images = [
        "https://blackbucks-media.s3.ap-south-1.amazonaws.com/Seamless1-1739803270669.jpeg",
        "https://blackbucks-media.s3.ap-south-1.amazonaws.com/Seamless2-1739803344706.jpeg",
        "https://blackbucks-media.s3.ap-south-1.amazonaws.com/Seamless3-1739803378277.jpeg",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBgImage((prev) => {
                const nextIndex = (images.indexOf(prev) + 1) % images.length;
                return images[nextIndex];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const boxWidth = useBreakpointValue({ base: "90%", md: "400px" });
    const formBg = useColorModeValue("white", "gray.700");

    const handleLogin = async () => {
        if (!loginId || !password) {
            alert("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("https://seamless-backend-nz7d.onrender.com/user/log-in", {
                userName: loginId,
                passkey: password,
            });
            if (response.status === 201) {
                localStorage.setItem("token", response.data.token);
                navigate(response.data.path || '/hourly');
            }
        } catch (error) {
            toast({
                title: "Login Failed",
                // description: response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };


    return (
        <Box position="relative" w="100vw" h="100vh" mt="-82px" overflow="hidden">
            <Box
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                bgImage={`url(${bgImage})`}
                bgSize="cover"
                bgPosition="center"
                transition="background 1.5s ease-in-out"
                zIndex="0"
            />

            <Box position="absolute" top="0" left="0" w="full" h="full" bg="blackAlpha.600" zIndex="1" />

            <Flex position="relative" w="full" h="full" align="center" justify="center" zIndex="3">
                <Box
                    w={boxWidth}
                    p={6}
                    bg={formBg}
                    bgopacity="0.8"
                    backdropFilter="blur(10px)"
                    borderRadius="lg"
                    boxShadow="xl"
                    borderWidth="1px"
                    borderColor="whiteAlpha.300"
                >
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6" color="blue.600" userSelect={'none'}>
                        Rashmi Seamless
                    </Text>

                    <VStack spacing={4} align="stretch">
                        <Box>
                            <FormLabel userSelect={'none'}>Login ID</FormLabel>
                            <Input
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                placeholder="Enter your login ID"
                                bg="whiteAlpha.900"
                                onKeyDown={handleKeyDown}
                            />
                        </Box>

                        <Box>
                            <FormLabel userSelect={'none'}>Password</FormLabel>
                            <PasswordInput
                                password={password}
                                setPassword={setPassword}
                                onKeyDown={handleKeyDown} />
                            {/* <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                bg="whiteAlpha.900"
                                onKeyDown={handleKeyDown}
                                onCopy={(e) => e.preventDefault()}
                                onCut={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                            /> */}
                        </Box>

                        <Button
                            colorScheme="blue"
                            onClick={handleLogin}
                            isLoading={isLoading}
                            loadingText="Signing In"
                            spinner={<Spinner size="sm" />}
                        >
                            Sign In
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
}
