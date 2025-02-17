import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Grid,
    GridItem,
    Text,
    VStack,
    Skeleton,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    HStack,
    useToast,
    FormControl,
    Select,
    useBreakpointValue,
    Input,
    Image,
    Icon,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, FilesIcon, } from "lucide-react";
import FullScreenLoader from "./FullScreenLoader";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ShiftReport = () => {
    const isValidDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [operatorInfo, setOperatorInfo] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [machines, setMachines] = useState([]);
    const [machineId, setMachineId] = useState(parseInt(searchParams.get('machineId')) || 1);
    const [shiftLetter, setShiftLetter] = useState(searchParams.get('shiftLetter') || 'A');
    const toast = useToast();
    const [date, setDate] = useState(isValidDate(searchParams.get('date')) ? searchParams.get('date') : new Date().toISOString().split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);

    const [initialValues] = useMemo(() => {
        const machineParam = searchParams.get('machineId');
        const dateParam = searchParams.get('date');
        const shiftParam = searchParams.get('shiftLetter');

        const validDate = dateParam && !isNaN(new Date(dateParam).getTime())
            ? dateParam
            : new Date().toISOString().split('T')[0];

        return [{
            machineId: machineParam || 1,
            date: validDate,
            shiftLetter: shiftParam || 'A',
        }];
    }, [searchParams]);

    const changeDate = (days) => {
        const currentDate = date ? new Date(date) : new Date();
        currentDate.setDate(currentDate.getDate() + days);
        setDate(currentDate.toISOString().split("T")[0]);
    };

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${String(minutes).padStart(2, "0")}${period}`;
    }

    const fetchMachines = async () => {
        try {
            const response = await axios.get('https://seamless-backend-nz7d.onrender.com/basic/machines');

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
    const fetchShiftReport = () => {
        setIsLoading(true);
        fetch(`https://seamless-backend-nz7d.onrender.com/hourly/shift?date=${date}&machineId=${machineId}&shift=${shiftLetter}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data.list);
                if (data.list.length > 0) {
                    setOperatorInfo(data.list[0]);
                }
            })
            .catch((error) => toast({
                title: "Error",
                description: error?.response?.data?.message || "Something is not good.",
                status: "error",
                duration: 5000,
                isClosable: true,
            }))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    useEffect(() => {
        const validDate = date && !isNaN(new Date(date).getTime())
            ? date
            : new Date().toISOString().split('T')[0];
        setSearchParams({
            machineId: machineId,
            date: validDate,
            shiftLetter: shiftLetter
        });
        if (validDate != date) { setDate(validDate); return; };
        setOperatorInfo(null);
        fetchShiftReport()
    }, [machineId, shiftLetter, date])

    // if (!operatorInfo) return <Skeleton height="400px" />;
    // if (!operatorInfo) return <FullScreenLoader isLoading={!operatorInfo} />;
    const totalStdProd = data?.reduce((sum, item) => sum + (item.stdProdPerHr || 0), 0);
    const totalActProd = data?.reduce((sum, item) => sum + (item.actProdPerHr || 0), 0);
    const totalDiff = data?.reduce((sum, item) => sum + (item.difference || 0), 0);
    const totalRunningMins = data?.reduce((sum, item) => sum + (item.runningMints || 0), 0);
    const totalBreakdownDuration = data?.reduce(
        (sum, item) => sum + item.breakdowns?.reduce((bSum, bd) => bSum + (bd.duration || 0), 0),
        0
    );

    return (
        <Box p={4}>
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
                {!isMobile && (<FormControl isRequired maxW={'sm'}>
                    <Select
                        bg={'white'}
                        maxW={'sm'}
                        placeholder="Select Shift"
                        value={shiftLetter}
                        onChange={(e) => setShiftLetter(e.target.value)}
                        name="shiftLetter"
                    >
                        <option key='A' value='A'>
                            Shift A
                        </option>
                        <option key='B' value='B'>
                            Shift B
                        </option>
                        <option key='C' value='C'>
                            Shift C
                        </option>
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
            {isMobile && <HStack mb={4}>
                <FormControl isRequired maxW={'sm'}>
                    <Select
                        bg={'white'}
                        maxW={'sm'}
                        placeholder="Select Shift"
                        value={shiftLetter}
                        onChange={(e) => setShiftLetter(e.target.value)}
                        name="shiftLetter"
                    >
                        <option key='A' value='A'>
                            Shift A
                        </option>
                        <option key='B' value='B'>
                            Shift B
                        </option>
                        <option key='C' value='C'>
                            Shift C
                        </option>
                    </Select>
                </FormControl>
            </HStack>}
            {isLoading && <FullScreenLoader isLoading={isLoading} />}
            {!operatorInfo && <Box w={'full'} justifyContent={'center'} display={'flex'} mt={100}>

                <Image
                    src="https://blackbucks-media.s3.ap-south-1.amazonaws.com/null_light-53585615fd723ba992bd2df7a10d10d1-1739771470996.png"
                    userSelect={'none'}
                    maxH={'50vh'}
                    draggable={false}
                />
            </Box>}
            {operatorInfo && (<>
                <Card mb={6}>
                    <CardBody>
                        <Grid templateColumns= "repeat(3, 1fr)" gap={6}>
                            <GridItem>
                                <VStack align="start" spacing={1}>
                                    <Heading size="sm">Operator</Heading>
                                    <Text >{operatorInfo.operatorName}</Text>
                                    <Text >{operatorInfo.operatorPhoneNo}</Text>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack align="start" spacing={1}>
                                    <Heading size="sm">Shift Incharge</Heading>
                                    <Text>{operatorInfo.shiftIncharge}</Text>
                                    <Text fontSize="sm" color="gray.600">{operatorInfo.shiftInchargePhoneNo}</Text>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack align="start" spacing={1}>
                                    <Heading size="sm">Shift Supervisor</Heading>
                                    <Text>{operatorInfo.shiftSuperVisor}</Text>
                                    <Text fontSize="sm" color="gray.600">{operatorInfo.shiftSuperVisorPhoneNo}</Text>
                                </VStack>
                            </GridItem>
                        </Grid>
                    </CardBody>
                </Card>

                <Box overflowX="auto">
                    <Table size="md">
                        <Thead>
                            <Tr>
                                <Th minW="150px">Interval</Th>
                                <Th>Dia</Th>
                                <Th minW="150px">OD <span fontSize={10}>x</span> WT x L</Th>
                                <Th>Standard<br /> Prod/hr</Th>
                                <Th>Actual<br /> Prod/hr</Th>
                                <Th>Diff</Th>
                                <Th>Running<br /> Mins</Th>
                                <Th minW="200px">B.D Interval</Th>
                                <Th>Duration</Th>
                                <Th>Reason</Th>
                                {/* <Th minW="350px">Permanent Solution</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.breakdowns.length > 0 ? (
                                        item.breakdowns.map((breakdown, bdIndex) => (
                                            <Tr key={`${index}-${bdIndex}`}>
                                                {bdIndex === 0 && (
                                                    <>
                                                        <Td rowSpan={item.breakdowns.length}>
                                                            {item.interval}
                                                        </Td>
                                                        <Td rowSpan={item.breakdowns.length}>
                                                            {item.diaDetails?.map((d, idx) => (
                                                                <span key={idx}>
                                                                    {d.diameter}
                                                                    {idx !== item.diaDetails.length - 1 && <br />}
                                                                </span>
                                                            ))}
                                                        </Td>
                                                        <Td rowSpan={item.breakdowns.length}>
                                                            {item.diaDetails?.map((d, idx) => (
                                                                <span key={idx}>
                                                                    {d.od} * {d.thickness} * {d.length}
                                                                    {idx !== item.diaDetails.length - 1 && <br />}
                                                                </span>
                                                            ))}
                                                        </Td>
                                                        <Td rowSpan={item.breakdowns.length}>{item.stdProdPerHr}</Td>
                                                        <Td rowSpan={item.breakdowns.length}>{item.actProdPerHr}</Td>
                                                        <Td rowSpan={item.breakdowns.length}>{item.difference}</Td>
                                                        <Td rowSpan={item.breakdowns.length}>{item.runningMints}</Td>
                                                    </>
                                                )}
                                                <Td>
                                                    {`${formatTime(breakdown.startTime)} - ${formatTime(breakdown.endTime)}`}
                                                </Td>
                                                <Td>
                                                    {breakdown.duration}
                                                </Td>
                                                <Td>
                                                    <Button size="xs" m={0} p={1} onClick={() => { setModalData(breakdown); setIsOpen(true); }}><FilesIcon color="blue" /></Button>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td>
                                                {item.interval}
                                            </Td>
                                            <Td>
                                                {item.diaDetails?.map((d, idx) => (
                                                    <span key={idx}>
                                                        {d.diameter}
                                                        {idx !== item.diaDetails.length - 1 && <br />}
                                                    </span>
                                                ))}
                                            </Td>
                                            <Td>
                                                {item.diaDetails?.map((d, idx) => (
                                                    <span key={idx}>
                                                        {d.od} * {d.length} * {d.thickness}
                                                        {idx !== item.diaDetails.length - 1 && <br />}
                                                    </span>
                                                ))}
                                            </Td>
                                            <Td>{item.stdProdPerHr}</Td>
                                            <Td>{item.actProdPerHr}</Td>
                                            <Td>{item.difference}</Td>
                                            <Td>{item.runningMints}</Td>
                                            <Td colSpan={4}>No breakdowns</Td>
                                        </Tr>
                                    )}
                                </React.Fragment>
                            ))}
                            <Tr fontWeight="bold" bg="gray.100">
                                <Td colSpan={3}>Total</Td>
                                <Td>{totalStdProd} pcs</Td>
                                <Td>{totalActProd} pcs</Td>
                                <Td>{totalDiff} pcs</Td>
                                <Td>{totalRunningMins} Min</Td>
                                <Td colSpan={1}></Td>
                                <Td>{totalBreakdownDuration} Min</Td>
                                <Td colSpan={2}></Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </>
            )}
            {modalData && (
                <Modal size={'4xl'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader borderBottom={"1px solid gray"}>Breakdown Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text><strong>Reason:</strong> {modalData.reason}</Text>
                            <Text mt={3}><strong>Permanent Solution:</strong> {modalData.permanentSolution || "N/A"}</Text>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </Box>
    );
};

export default ShiftReport;
