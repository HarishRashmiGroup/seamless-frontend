import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { Box, Button, Image, Spinner } from "@chakra-ui/react";
import { addDays } from "date-fns";
import { ChevronLeft, ChevronRight, CloudDownloadIcon } from "lucide-react";
import axios from "axios";
import FullScreenLoader from "./FullScreenLoader";


const Dashboard = () => {
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    // const handleStartDate = (diff) => {
    //     setSelectedDates(([start, end]) => [addDays(start, diff), end]);
    // }
    const handleStartDate = (diff) => {
        setSelectedDates(([start, end]) => [addDays(start, diff), addDays(start, diff)]);
    }
    const [token, setToken] = useState(window.localStorage.getItem('token'));

    // const handleEndDate = (diff) => {
    //     setSelectedDates(([start, end]) => [start, addDays(end, diff)]);
    // }
    const handleEndDate = (diff) => {
        setSelectedDates(([start, end]) => [addDays(end, diff), addDays(end, diff)]);
    }
    const [tableData, setTableData] = useState([]);

    async function downloadExcel() {
        try {
            setIsDownloading(true);
            const response = await axios.get(`https://seamless-backend-nz7d.onrender.com/hourly/dashboard?startDate=${selectedDates[0].toLocaleDateString("en-CA")}&endDate=${selectedDates[1].toLocaleDateString("en-CA")}&downloadRequest=true`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `production_report_${Date.now()}.xlsx`;
            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(url);
            document.body.removeChild(link);

            console.log('Download successful.');
        } catch (error) {
            console.error('Download failed:', error.message);
        } finally {
            setIsDownloading(false);
        }
    };
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
        <Box position={'relative'} minH={'100vh'}>
            <Box mt={2} gap={2} pb={3} borderBottom={'1px solid #e2e8f0'} justifyContent={["center", "space-around", "center", "right", "right"]} display={'flex'}>
                {/* <Button
                    onClick={() => downloadExcel()}
                    isLoading={isDownloading}>
                    {!isDownloading && <CloudDownloadIcon></CloudDownloadIcon>}
                    {isDownloading && <Spinner size="sm" />}
                </Button> */}
                <Button onClick={() => handleStartDate(-1)}><ChevronLeft></ChevronLeft></Button>
                {/* <Button display={["none", "block", "block"]} disabled={selectedDates[0]?.getTime() === selectedDates[1]?.getTime()} onClick={() => handleStartDate(1)}><ChevronRight></ChevronRight></Button> */}
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
                {/* <Button display={["none", "block", "block"]} disabled={selectedDates[0]?.getTime() === selectedDates[1]?.getTime()} onClick={() => handleEndDate(-1)}><ChevronLeft></ChevronLeft></Button> */}
                <Button onClick={() => handleEndDate(1)}><ChevronRight></ChevronRight></Button>
            </Box >
            {
                isLoading && <FullScreenLoader isLoading={isLoading}/>
            }
            {tableData.length === 0 && <Box w={'full'} justifyContent={'center'} display={'flex'} mt={100}>

                <Image
                    src="https://blackbucks-media.s3.ap-south-1.amazonaws.com/null_light-53585615fd723ba992bd2df7a10d10d1-1739771470996.png"
                    userSelect={'none'}
                    maxH={'50vh'}
                    draggable={false}
                />
            </Box>}
            {tableData.length > 0 && <DataTable borderTop={'1px solid gray'} data={tableData} />}
        </Box>
    );
}
export default Dashboard;