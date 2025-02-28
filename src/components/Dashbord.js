import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { Box, Button } from "@chakra-ui/react";
import { addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";


const Dashboard = () => {
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [isLoading, setIsLoading] = useState(false);
    const handleStartDate = (diff) => {
        setSelectedDates(([start, end]) => [addDays(start, diff), end]);
    }
    const [token, setToken] = useState(window.localStorage.getItem('token'));

    const handleEndDate = (diff) => {
        setSelectedDates(([start, end]) => [start, addDays(end, diff)]);
    }
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`https://seamless-backend-nz7d.onrender.com/hourly/dashboard?startDate=${selectedDates[0].toLocaleDateString("en-CA")}&endDate=${selectedDates[1].toLocaleDateString("en-CA")}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token} `
                        }
                    }
                );
                const data = response?.data?.data;
                if (data) {
                    setTableData(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDashboard();
    }, [selectedDates]);

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