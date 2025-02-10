import React, { useState, useEffect } from 'react';
import { LayoutDashboardIcon, LogOut, Menu } from 'lucide-react';
import {
    Box,
    Flex,
    Text,
    Button,
    Icon,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    Image
} from '@chakra-ui/react';

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <Box
            bg="#333"
            px={4}
            // py={3}
            shadow="md"
            position="fixed"
            top={isVisible ? 0 : "-90px"}
            left={0}
            right={0}
            zIndex={1000}
            height="85px"   
            transition="top 0.3s"
            alignItems={'center'}
        >
            <Flex alignItems="center" justifyContent="space-between">
                {/* Hamburger Menu for Mobile */}
                <Icon
                    as={Menu}
                    w={6}
                    h={6}
                    color="white"
                    display={{ base: "block", md: "none" }}
                    onClick={onOpen}
                    cursor="pointer"
                />

                {/* Logo in the Center */}
                {/* <Text
                    fontSize="xl"
                    fontWeight=""
                    color="white"
                    textAlign="center"
                    flex="1"
                    userSelect={'none'}
                >
                    Rashmi Seamless
                </Text> */}
                <Image
                    src='https://blackbucks-media.s3.ap-south-1.amazonaws.com/Rashmi%20group%20logo%20White%20Bar-1738846415526.png'
                    alt="Rashmi Seamless Logo"
                    maxWidth={ "170px" } 
                    height="auto" 
                    objectFit="contain"
                    display="block" 
                    mx="auto" 
                    userSelect={'none'}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    // mt={-3}
                />
                
                {/* Logout Button Hidden on Mobile */}
                <Button
                    leftIcon={<Icon as={LogOut} w={5} h={5} />}
                    colorScheme="red"
                    variant="solid"
                    onClick={() => alert('Logout clicked!')}
                    display={{ base: "none", md: "flex" }}
                >
                    Logout
                </Button>
            </Flex>

            {/* Drawer for Mobile Menu */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Rashmi Seamless</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <Button
                                leftIcon={<Icon as={LogOut} w={5} h={5} />}
                                colorScheme="red"
                                variant="solid"
                                onClick={() => alert('Logout clicked!')}
                            >
                                Logout
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navbar;
