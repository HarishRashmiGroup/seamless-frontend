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
import { ChevronLeftCircle, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useAuth } from "../providers/authProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const MaintenancePage = () => {
    const user = useAuth();
    const toast = useToast();
    const navigate = useNavigate()
    const shifts = ['A', 'B', 'C'];
    const [machines, setMachines] = useState([]);
    const [aShifts, setAShifts] = useState([]);
    const [bShifts, setBShifts] = useState([]);
    const [cShifts, setCSHifts] = useState([]);
    const [machineId, setMachineId] = useState(1);


    const isMobile = useBreakpointValue({ base: true, md: false });

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const changeDate = (days) => {
        const currentDate = date ? new Date(date) : new Date();
        currentDate.setDate(currentDate.getDate() + days);
        setDate(currentDate.toISOString().split("T")[0]);
    };

    const [activeSlots, setActiveSlots] = useState(
        // shifts.reduce((shiftAcc, shift) => ({
        //     ...shiftAcc,
        //     [shift]: timeSlots.reduce((slotAcc, slot) => ({
        //         ...slotAcc,
        //         [slot]: Math.random() > 0.5
        //     }), {})
        // }), {})
        [], []
    );

    const handleClick = (shiftId) => {
        navigate(`/hourly?machine=${machineId}&date=${date}&shift=${Number(shiftId)}`);
    };

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const fetchShifts = async (shiftLetter) => {
        try {
            const response = await axios.post('http://https://seamless-backend-nz7d.onrender.com/basic/shifts', {
                shift: shiftLetter,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                if (response.data) {
                    if (shiftLetter === 'A') {
                        setAShifts(prev => [...response.data]);
                    } else if (shiftLetter === 'B') {
                        setBShifts(prev => [...response.data]);
                    } else if (shiftLetter === 'C') {
                        setCSHifts(prev => [...response.data]);
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
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await axios.get('http://https://seamless-backend-nz7d.onrender.com/basic/machines');

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

    useEffect(() => {
        fetchMachines();
        fetchShifts('A');
        fetchShifts('B');
        fetchShifts('C');
    }, [])

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
                    {!isMobile && (<FormControl isRequired maxW={'sm'}>
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
                    </FormControl>)}
                    <Button p={0.5} onClick={() => changeDate(1)}><ChevronRightIcon /></Button>
                </HStack>
                {isMobile && <HStack mb={4}>
                    <FormControl isRequired >
                        <Select
                            bg={'white'}
                            placeholder="Select Machine"
                            value={machineId}
                            onChange={(e) => setMachineId(e.target.value)}
                            name="machineId"
                        >
                            {machines.map((machine) => (
                                <option key={machine.id} value={machine.id}>
                                    {machine.label}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </HStack>}

                <VStack spacing={8} align="stretch">
                    {shifts.map((shift) => {
                        const timeSlots = shift === 'A' ? aShifts : shift === 'B' ? bShifts : cShifts;
                        return (
                            <Box key={shift}>
                                <Text textAlign="left" fontSize="xl" mb={4}>
                                    Shift {shift}
                                </Text>
                                <SimpleGrid
                                    columns={{ base: 2, sm: 2, md: 4 }}
                                    spacing={3}
                                >
                                    {timeSlots.map((slot) => (
                                        <Button
                                            key={`${shift}-${slot.id}`}
                                            bg={activeSlots[shift]?.[slot] ? "green.200" : "yellow.200"}
                                            variant={activeSlots[shift]?.[slot] ? "solid" : "outline"}
                                            size="sm"
                                            height="auto"
                                            py={2}
                                            whiteSpace="normal"
                                            onClick={() => handleClick(slot.id)}
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