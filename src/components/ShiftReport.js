import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { FilesIcon } from "lucide-react";

const ShiftReport = () => {
    const [data, setData] = useState([]);
    const [operatorInfo, setOperatorInfo] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${String(minutes).padStart(2, "0")}${period}`;
    }

    useEffect(() => {
        fetch("https://seamless-backend-nz7d.onrender.com/hourly/shift?date=2025-02-14&machineId=1&shift=A")
            .then((response) => response.json())
            .then((data) => {
                setData(data.list);
                if (data.list.length > 0) {
                    setOperatorInfo(data.list[0]);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    if (!operatorInfo) return <Skeleton height="400px" />;
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
            {/* Personnel Info Card */}
            <Card mb={6}>
                <CardHeader>
                    <Heading size="md">Shift Personnel Details</Heading>
                </CardHeader>
                <CardBody>
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                        <GridItem>
                            <VStack align="start" spacing={1}>
                                <Heading size="sm">Operator</Heading>
                                <Text>{operatorInfo.operatorName}</Text>
                                <Text fontSize="sm" color="gray.600">{operatorInfo.operatorPhoneNo}</Text>
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

            {/* Production Table */}
            <Box overflowX="auto">
                <Table size="md">
                    <Thead>
                        <Tr>
                            <Th minW="150px">Interval</Th>
                            <Th>Dia</Th>
                            <Th minW="200px">OD <span fontSize={10}>x</span> WT x L</Th>
                            <Th>Std Prod/hr</Th>
                            <Th>Act Prod/hr</Th>
                            <Th>Diff</Th>
                            <Th>Running Mins</Th>
                            <Th minW="200px">B.D Interval</Th>
                            <Th>Duration</Th>
                            <Th>Reason & Sol</Th>
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
                                                                {d.diameter} * {d.length} * {d.thickness}
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
                                            <Td display={'flex'} justifyContent={'center'}>
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
                                                    {d.diameter} * {d.length} * {d.thickness}
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
