import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Button,
    IconButton,
    Tooltip,
    useMediaQuery,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const DataTable = ({ data }) => {
    const [expanded, setExpanded] = useState({});
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const tableRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalText, setModalText] = useState("");
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollLeft = tableRef.current.scrollLeft;
            const scrollWidth = tableRef.current.scrollWidth;
            const clientWidth = tableRef.current.clientWidth;

            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
        };

        const tableContainer = tableRef.current;
        tableContainer.addEventListener("scroll", handleScroll);

        return () => {
            tableContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const openModal = (text) => {
        setModalText(text);
        onOpen();
    };

    const toggleExpand = (rowIndex, field) => {
        const key = `${rowIndex}-${field}`;
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const scrollTable = (direction) => {
        if (tableRef.current) {
            const scrollAmount = direction === "left" ? -150 : 150;
            tableRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const renderExpandableText = (text, rowIndex, field) => {
        if (!text) return "-";
        const key = `${rowIndex}-${field}`;
        const isExpanded = expanded[key];
        const shouldShowButton = text.length > 50;

        return (
            <Box maxW="300px" h={'auto'} overflowX={"auto"}>
                <Text
                    noOfLines={isExpanded ? undefined : 2}
                    wordBreak="break-word"
                >
                    {text}
                </Text>
                {shouldShowButton && (
                    <Button
                        variant="link"
                        colorScheme="blue"
                        size="sm"
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     toggleExpand(rowIndex, field);
                        // }}

                        onClick={() => openModal(text)}
                    >
                        {isExpanded ? "See Less" : "See More"}
                    </Button>
                )}
            </Box>
        );
    };

    const headers = [
        "Machine", "Shift", "Avg Wt Per Pc",
        "Target Running Hr", "Actual Running Hr", "Standard Production",
        "Actual Production", "Loss MT", "Target Production Nos",
        "Actual Production Nos", "Target Pc Per Hr", "Actual Pc Per Hr",
        "Efficiency Percentage", "Reason"
    ];
    const formula = {
        "Machine": "Machine",
        "Shift": "Shifts Running",
        "Avg Wt Per Pc": "Actual Production*1000 / Actual Production Nos",
        "Target Running Hr": "Target Running Hours",
        "Actual Running Hr": "Actual Running Hours",
        "Standard Production": "Avg Wt Per Pc * TargetRunnig Hr * Target Pcs Per Hr / 1000",
        "Actual Production": "Actual Production",
        "Loss MT": "Standard Production - Actual Production",
        "Target Production Nos": "Target Pcs Per Hr * Target Running Hr",
        "Actual Production Nos": "Actual Production Nos",
        "Target Pc Per Hr": "6000 / Avg Wt Per Pc",
        "Actual Pc Per Hr": "Actual Production Nos / Actual Running Hr",
        "Los Pcs Per Hr": "Target Pcs Per Hr - Actual Pc Per Hr",
        "Reason": "Reason",
    };

    return (
        <Box position="relative">
            <Box
                position="fixed"
                left="0"
                top="50%"
                transform="translateY(-50%)"
                zIndex={21}
            >
                <IconButton
                    onClick={() => scrollTable("left")}
                    icon={<ChevronLeftIcon />}
                    aria-label="Scroll left"
                    bg="white"
                    boxShadow="lg"
                    borderRadius="full"
                    isDisabled={isAtStart}
                />
            </Box>

            {/* Scrollable Table */}
            <Box overflowX="auto" >
                <TableContainer ref={tableRef}>
                    <Table variant="striped" colorScheme="gray">
                        <Thead position="sticky" top={0} bg="white" zIndex={20}>
                            <Tr>
                                {headers.map((header, index) => (
                                    <Tooltip
                                        key={header}
                                        label={formula[header]}
                                        placement="bottom"
                                    >
                                        <Th
                                            position={!isMobile && index === 0 ? "sticky" : "static"}
                                            left={!isMobile && index === 0 ? 0 : "auto"}
                                            zIndex={!isMobile && index === 0 ? 10 : 1}
                                            bg="white"
                                            borderRight="1px solid"
                                            cursor={'pointer'}
                                            borderColor="gray.200"
                                        >
                                            {header}
                                        </Th>
                                    </Tooltip>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((d, rowIndex) => (
                                <Tr key={rowIndex}>
                                    {d.shift === 'A' && (
                                        <Td
                                            rowSpan={3}
                                            position={!isMobile ? "sticky" : "static"}
                                            left={!isMobile ? 0 : "auto"}
                                            bg="white"
                                            zIndex={!isMobile ? 10 : 1}
                                        >
                                            {d.machine}
                                        </Td>
                                    )}
                                    {d.shift === 'subtotal' && (
                                        <Td
                                            position={!isMobile ? "sticky" : "static"}
                                            left={!isMobile ? 0 : "auto"}
                                            bg="white"
                                            zIndex={!isMobile ? 10 : 1}
                                        >
                                        </Td>
                                    )}
                                    <Td>
                                        <Text key={d.machine}>{d.shift}</Text>
                                    </Td>
                                    <Td>{d.avgWtPerPc === "0" ? "" : d.avgWtPerPc}</Td>
                                    <Td>{d.targetRunningHr === "0.00" ? '': d.targetRunningHr}{d.targetRunningHr !== "0.00" ? ' hrs' : ''}</Td>
                                    <Td>{d.actualRunningHr == "0.00" ? "" : d.actualRunningHr}{d.actualRunningHr != "0.00" ? ' hrs' : ''}</Td>
                                    <Td>{d.standardProduction !== "0.00" ? d.standardProduction : ""}</Td>
                                    <Td>{d.actualProduction === "0.00" ? "" : d.actualProduction}</Td>
                                    <Td>{d.lossMT === "0.00" ? "" : d.lossMT}</Td>
                                    <Td>{d.targetProductionNos === "0" ? "" : d.targetProductionNos}</Td>
                                    <Td>{d.actualProductionNos === "0" ? "" : d.actualProductionNos}</Td>
                                    <Td>{isNaN(d.targetPcsPerHr) ? "" : d.targetPcsPerHr}</Td>
                                    <Td>{d.actualPcsPerHr === "0.00" ? "" : d.actualPcsPerHr}</Td>
                                    <Td>{isNaN(d.efficiencyPercentage) ? "" : d.efficiencyPercentage}{!isNaN(d.efficiencyPercentage) ? ' %' : '-'}</Td>
                                    <Td>{renderExpandableText(d.reason, rowIndex, "reason")}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Box ></Box>

            {/* Right Scroll Button */}
            <Box
                position="fixed"
                right="0"
                top="50%"
                transform="translateY(-50%)"
                zIndex={10}
            >
                <IconButton
                    onClick={() => scrollTable("right")}
                    icon={<ChevronRightIcon />}
                    aria-label="Scroll right"
                    bg="white"
                    boxShadow="lg"
                    borderRadius="full"
                    disabled={isAtEnd}
                />
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Full Text</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{modalText}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default DataTable;
