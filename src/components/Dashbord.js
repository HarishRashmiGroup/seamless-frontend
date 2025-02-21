import { useState } from "react";
import DataTable from "./DataTable";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { Box, Button } from "@chakra-ui/react";
import { addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Dashboard = () => {
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const handleStartDate = (diff) => {
        setSelectedDates(([start, end]) => [addDays(start, diff), end]);
    }

    const handleEndDate = (diff) => {
        setSelectedDates(([start, end]) => [start, addDays(end, diff)]);
    }
    const tableData = [{
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    },
    {
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    },
    {
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    },
    {
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    },
    {
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    },
    {
        machine: "HOT MILL-1",
        status:
            [
                'A', 'B', 'C'
            ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-2",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long. This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL-3",
        status: [
            'A', 'B', 'C'
        ],
        dia: "110",
        hollowSize: "114.30*8.56",
        avgWtPerPc: "131.05",
        targetRunningHr: "18",
        actualRunningHr: "14.45",
        standardProduction: "108.00",
        actualProduction: "84",
        lossMT: "24.00",
        targetProductionNos: "824",
        actualProductionNos: "641",
        reason: "This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        solution: "This is the solution to the problem mentioned, with significant details and examples.This is a detailed reason explaining the problem in the process, which could be very long.This is a detailed reason explaining the problem in the process, which could be very long.",
        targetPcsPerHr: "45.79",
        actualPcsPerHr: "44.36",
        lossPcsPerHr: "1.43",
        efficiencyPercentage: "96.89",
        remarks: "Additional remarks can go here and might be lengthy too.",
    },
    {
        machine: "HOT MILL SubTotal",
        status: [

        ],
        dia: "",
        hollowSize: "",
        avgWtPerPc: "",
        targetRunningHr: "",
        actualRunningHr: "",
        standardProduction: "",
        actualProduction: "1001",
        lossMT: "24",
        targetProductionNos: "82424",
        actualProductionNos: "64156",
        reason: "",
        solution: "",
        targetPcsPerHr: "",
        actualPcsPerHr: "",
        lossPcsPerHr: "",
        efficiencyPercentage: "",
        remarks: "",
    }
    ];

    return (
        <>
            <Box mt={2} gap={2} pb={3} borderBottom={'1px solid #e2e8f0'} justifyContent={["center", "space-around", "center", "right", "right"]} display={'flex'}>
                <Button display={["none", "block", "block"]} onClick={() => handleStartDate(-1)}><ChevronLeft></ChevronLeft></Button>
                <Button display={["none", "block", "block"]} disabled={selectedDates[0]?.getTime() === selectedDates[1]?.getTime()} onClick={() => handleStartDate(1)}><ChevronRight></ChevronRight></Button>
                <RangeDatepicker
                    selectedDates={selectedDates}
                    onDateChange={setSelectedDates}
                    configs={{
                        dateFormat: "dd MMM yyyy",
                    }}
                    propsConfigs={{
                        inputProps: {
                            size: "sm",
                            w: "210px",
                            border: "1px solid",
                            borderColor: "gray.300",
                            _hover: { borderColor: "gray.400" },
                            _focus: { borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }
                        }
                    }}
                />
                <Button display={["none", "block", "block"]} disabled={selectedDates[0]?.getTime() === selectedDates[1]?.getTime()} onClick={() => handleEndDate(-1)}><ChevronLeft></ChevronLeft></Button>
                <Button display={["none", "block", "block"]} onClick={() => handleEndDate(1)}><ChevronRight></ChevronRight></Button>
            </Box >
            <DataTable borderTop={'1px solid gray'} data={tableData} />
        </>
    );
}
export default Dashboard;