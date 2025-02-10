import DataTable from "./DataTable";
import Navbar from "./Navbar";

export const Dashboard = () => {
    const tableData = [{
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
        machine: "HOT MEAL-1",
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
        machine: "HOT MEAL-2",
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
        machine: "HOT MEAL-3",
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
        machine: "HOT MEAL SubTotal",
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
            <Navbar />
            <DataTable data={tableData} />
        </>
    );
}
export default Dashboard;