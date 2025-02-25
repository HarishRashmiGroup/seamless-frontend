import { useEffect, useState } from "react";
import {
    Box,
    Text,
    Button,
    Container,
    HStack,
    Heading,
    Input,
    SimpleGrid,
    VStack,
    useColorModeValue,
    FormControl,
    useBreakpointValue,
    Select,
    useToast
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useAuth } from "../providers/authProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "./FullScreenLoader";
import { keyframes } from "@emotion/react";

export const MaintenancePage = () => {
    const { user, setUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const shifts = ['A', 'B', 'C'];
    const [machines, setMachines] = useState([]);
    const [aShifts, setAShifts] = useState([]);
    const [bShifts, setBShifts] = useState([]);
    const [cShifts, setCShifts] = useState([]);
    const [machineId, setMachineId] = useState(1);
    const [shiftStatus, setShiftStatus] = useState(new Map());
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);
    const [isColorFetched, setIsColorFetched] = useState(false);

    const isMobile = useBreakpointValue({ base: true, md: false });
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const pulse = keyframes`
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                    `;

    const changeDate = (days) => {
        const currentDate = date ? new Date(date) : new Date();
        currentDate.setDate(currentDate.getDate() + days);
        setDate(currentDate.toISOString().split("T")[0]);
    };

    const getColor = (shiftId) => {
        if (shiftStatus?.has(String(shiftId))) {
            const status = shiftStatus.get(String(shiftId));
            return status === 2 ? "red.200" :
                status === 1 ? "green.200" :
                    status === 0 ? "yellow.200" :
                        "gray.200";
        }
        return "gray.200";
    };

    const getTextColor = (shiftId) => {
        if (shiftStatus?.has(String(shiftId))) {
            const status = shiftStatus.get(String(shiftId));
            return status === 2 ? "text.red.800" :
                status === 1 ? "green.800" :
                    status === 0 ? "yellow.800" :
                        "gray.800";
        }
        return "gray.800";
    };

    const handleClick = (shiftId) => {
        navigate(`/hourly?machine=${machineId}&date=${date}&shift=${Number(shiftId)}`);
    };

    const shiftClick = (shiftLetter) => {
        navigate(`/shift-report?machineId=${machineId}&date=${date}&shiftLetter=${shiftLetter}`);
    };

    const fetchShifts = async (shiftLetter) => {
        try {
            const response = await axios.post('https://seamless-backend-nz7d.onrender.com/basic/shifts', {
                shift: shiftLetter,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                if (response.data) {
                    if (shiftLetter === 'A') {
                        setAShifts(response.data);
                    } else if (shiftLetter === 'B') {
                        setBShifts(response.data);
                    } else if (shiftLetter === 'C') {
                        setCShifts(response.data);
                    }
                }
            } else {
                throw new Error("Failed to fetch shifts");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to fetch shifts",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            // setIsLoading(false);
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await axios.get('https://seamless-backend-nz7d.onrender.com/basic/machines',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                setMachines(response.data);
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something is not good.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const fetchColors = async (machineId, date, token, controller) => {
        const signal = controller.signal;

        try {
            setIsColorFetched(false);
            const response = await axios.get(
                `https://seamless-backend-nz7d.onrender.com/hourly/colors?machineId=${machineId}&date=${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: signal,
                }
            );

            if (response.status === 200) {
                if (!signal.aborted) {
                    if (response.data && response.data.map) {
                        setShiftStatus(new Map(Object.entries(response.data.map)));
                    } else {
                        setShiftStatus(new Map());
                        console.log('aborted');
                    }
                }
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            if (error.code === "ERR_CANCELED") {
                console.log(`Request aborted for machineId: ${machineId} and date: ${date}`);
            } else {
                toast({
                    title: "Error",
                    description: error?.response?.data?.message || "Failed to fetch approved status.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        finally {
            setIsColorFetched(true);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchMachines(),
                fetchShifts('A'),
                fetchShifts('B'),
                fetchShifts('C')
            ]);
            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const flag = date && !isNaN(new Date(date).getTime()) && machineId && !isNaN(Number(machineId));

        if (flag) {
            const controller = new AbortController();
            setShiftStatus(new Map());
            fetchColors(machineId, date, token, controller);
            return () => {
                controller.abort();
            };
        }
    }, [machineId, date, token]);

    if (isLoading) {
        return <FullScreenLoader isLoading={isLoading} />;
    }

    return (
        <Container maxW="6xl" py={8}>
            <Box
                bg={cardBg}
                borderRadius="lg"
                borderWidth="0px"
                borderColor={borderColor}
                p={2}
                shadow="md"
            >
                <HStack justifyContent={'space-between'} mb={4}>
                    <Button p={0.5} onClick={() => changeDate(-1)}><ChevronLeftIcon /></Button>
                    <Input
                        maxW={'sm'}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(new Date(e.target.value).toISOString().split('T')[0])}
                        cursor={'text'}
                    />
                    {!isMobile && (
                        <FormControl isRequired maxW={'sm'}>
                            <Select
                                bg={'white'}
                                maxW={'sm'}
                                placeholder="Select Machine"
                                value={machineId}
                                onChange={(e) => setMachineId(Number(e.target.value))}
                                name="machineId"
                            >
                                {machines.map((machine) => (
                                    <option key={machine.id} value={machine.id}>
                                        {machine.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <Button p={0.5} onClick={() => changeDate(1)}><ChevronRightIcon /></Button>
                </HStack>
                {isMobile && (
                    <HStack mb={4}>
                        <FormControl isRequired >
                            <Select
                                bg={'white'}
                                placeholder="Select Machine"
                                value={machineId}
                                onChange={(e) => setMachineId(Number(e.target.value))}
                                name="machineId"
                            >
                                {machines.map((machine) => (
                                    <option key={machine.id} value={machine.id}>
                                        {machine.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </HStack>
                )}

                <VStack spacing={8} align="stretch">
                    {shifts.map((shift) => {
                        const timeSlots = shift === 'A' ? aShifts : shift === 'B' ? bShifts : cShifts;
                        return (
                            <Box key={shift}>
                                <Text _hover={{ color: "blue.400" }} textAlign="left" fontSize="xl" mb={4} cursor={'pointer'} onClick={() => shiftClick(shift)}>
                                    Shift {shift}
                                </Text>
                                <SimpleGrid
                                    columns={{ base: 2, sm: 2, md: 4 }}
                                    spacing={3}
                                >
                                    {timeSlots.map((slot) => (
                                        <Button
                                            key={`${shift}-${slot.id}`}
                                            bg={getColor(slot.id)}
                                            color={getTextColor(slot.id)}
                                            size="sm"
                                            height="auto"
                                            py={2}
                                            whiteSpace="normal"
                                            onClick={() => handleClick(slot.id)}
                                            animation={!isColorFetched ? `${pulse} 1.5s infinite ease-in-out` : "none"}
                                        >
                                            {slot.label}
                                        </Button>
                                    ))}
                                </SimpleGrid>
                            </Box>
                        )
                    })}
                </VStack>
            </Box>
        </Container>
    );
};

export default MaintenancePage;