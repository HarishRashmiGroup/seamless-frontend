import React, { useState, useEffect } from 'react';
import { ClipboardPlusIcon, Clock, LayoutDashboardIcon, LogOut, Menu, WrenchIcon, X } from 'lucide-react';
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
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

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
            <Flex alignItems="center" justifyContent="space-between" height="full">
                {/* Logo on the Left */}
                <Flex display={{ base: "flex", md: "none" }}></Flex>
                <Image
                    src='https://blackbucks-media.s3.ap-south-1.amazonaws.com/Rashmi%20group%20logo%20White%20Bar-1738846415526.png'
                    alt="Rashmi"
                    maxWidth="170px"
                    objectFit="contain"
                    cursor={'pointer'}
                    onClick={() => navigate('/')}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                />

                {/* Navigation Buttons */}
                <Flex gap={4} display={{ base: "none", md: "flex" }}>
                    <Button leftIcon={<Icon as={LayoutDashboardIcon} w={5} h={5} />} colorScheme={location.pathname === '/' ? "blue" : "gray"} variant="solid" onClick={() => navigate('/')}>Dashboard</Button>
                    <Button leftIcon={<Icon as={WrenchIcon} w={5} h={5} />} colorScheme={location.pathname === '/maintenance' ? "blue" : "gray"} variant="solid" onClick={() => navigate('/maintenance')}>Maintenance</Button>
                    <Button leftIcon={<Icon as={ClipboardPlusIcon} w={5} h={5} />} colorScheme={location.pathname === '/hourly' ? "blue" : "gray"} variant="solid" onClick={() => navigate('/hourly')}>Hourly Report</Button>
                    <Button leftIcon={<Icon as={Clock} w={5} h={5} />} colorScheme={location.pathname === '/shift-report' ? "blue" : "gray"} variant="solid" onClick={() => navigate('/shift-report')}>Shift Report</Button>
                    <Button leftIcon={<Icon as={LogOut} w={5} h={5} />} colorScheme="red" variant="solid" onClick={() => alert('Logging out...')}>Logout</Button>
                </Flex>
                <Icon
                    as={isOpen ? X : Menu}
                    w={6}
                    h={6}
                    color="white"
                    display={{ base: "block", md: "none" }}
                    onClick={onOpen}
                    cursor="pointer"
                />
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
                                leftIcon={<Icon as={LayoutDashboardIcon} w={5} h={5} />}
                                colorScheme={location.pathname === '/' ? "blue" : "gray"}
                                variant="solid"
                                onClick={() => navigate('/')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                leftIcon={<Icon as={WrenchIcon} w={5} h={5} />}
                                colorScheme={location.pathname === '/maintenance' ? "blue" : "gray"}
                                variant="solid"
                                onClick={() => navigate('/maintenance')}
                            >
                                Maintenance
                            </Button>
                            <Button
                                leftIcon={<Icon as={ClipboardPlusIcon} w={5} h={5} />}
                                colorScheme={location.pathname === '/hourly' ? "blue" : "gray"}
                                variant="solid"
                                onClick={() => navigate('/hourly')}
                            >
                                Hourly Report
                            </Button>
                            <Button
                                leftIcon={<Icon as={Clock} w={5} h={5} />}
                                colorScheme={location.pathname === '/shift-report' ? "blue" : "gray"}
                                variant="solid"
                                onClick={() => navigate('/shift-report')}
                            >
                                Shift Report
                            </Button>
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
