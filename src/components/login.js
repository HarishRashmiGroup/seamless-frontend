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
} from "@chakra-ui/react";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bgImage, setBgImage] = useState("/seamless1.jpeg");

  const images = [
    "/seamless1.jpeg",
    "/seamless2.jpeg",
    "/seamless3.jpeg",
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

  const handleLogin = () => {
    if (loginId && password) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Login successful!");
      }, 2000);
    } else {
      alert("Please fill in all fields");
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
          bgOpacity="0.8"
          backdropFilter="blur(10px)"
          borderRadius="lg"
          boxShadow="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6" color="blue.600">
            Rashmi Seamless
          </Text>

          <VStack spacing={4} align="stretch">
            <Box>
              <FormLabel>Login ID</FormLabel>
              <Input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter your login ID"
                bg="whiteAlpha.900"
              />
            </Box>

            <Box>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                bg="whiteAlpha.900"
              />
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
