import { useEffect, useMemo, useState } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Button,
    Textarea,
    Stack,
    HStack,
    Text,
    Select,
    useToast,
    RadioGroup,
    Radio,
    IconButton,
} from '@chakra-ui/react';
import { CirclePlusIcon, Trash2Icon } from "lucide-react";
import BreakdownDetails from "./BreakDownDetails";
import { useAuth } from "../providers/authProvider";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const HourlyProductionForm = () => {
    const toast = useToast();
    const user = useAuth();
    const [input, setInput] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [initialValues] = useMemo(() => {
        const machineParam = searchParams.get('machine');
        const dateParam = searchParams.get('date');
        const shiftParam = searchParams.get('shift');

        const validDate = dateParam && !isNaN(new Date(dateParam).getTime())
            ? dateParam
            : new Date().toISOString().split('T')[0];

        return [{
            machineId: machineParam || '',
            date: validDate,
            shiftId: shiftParam || '',
        }];
    }, [searchParams]);
    const [running, setRunning] = useState(true);
    const [machines, setMachines] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [rootCauses, setRootCauses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [types, setTypes] = useState([]);

    const [formData, setFormData] = useState({
        id: null,
        operatorName: '',
        operatorPhoneNo: '',
        shiftIncharge: '',
        shiftInchargePhoneNo: '',
        shiftSuperVisor: '',
        shiftSuperVisorPhoneNo: '',
        machineId: initialValues.machineId,
        shiftId: initialValues.shiftId,
        shiftLetter: initialValues.shiftLetter,
        date: '',
        status: true,
        diaDetails: [{ diameter: '', thickness: '', length: '' }],
        breakdownDetails: [],
        stdProdPerHr: '',
        actProdPerHr: '',
        runningMints: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDiaDetailsChange = (index, field, value) => {
        const newDiaDetails = [...formData.diaDetails];
        newDiaDetails[index][field] = value;
        setFormData((prev) => ({ ...prev, diaDetails: newDiaDetails }));
    };

    const addDiaDetailsLine = () => {
        setFormData((prev) => ({
            ...prev,
            diaDetails: [...prev.diaDetails, { diameter: '', thickness: '', length: '' }],
        }));
    };

    const removeDiaDetailsLine = (index) => {
        const newDiaDetails = formData.diaDetails.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, diaDetails: newDiaDetails }));
    };

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return '';
        const start = new Date(`2000/01/01 ${startTime}`);
        const end = new Date(`2000/01/01 ${endTime}`);
        const diff = end - start;
        return Math.round(diff / 60000);
    };

    const handleBreakdownDetailsChange = (index, field, value) => {
        const newBreakdownDetails = [...formData.breakdownDetails];
        newBreakdownDetails[index][field] = value;
        if (field === 'startTime' || field === 'endTime') {
            const breakdown = newBreakdownDetails[index];
            if (breakdown.startTime && breakdown.endTime) {
                breakdown.duration = calculateDuration(breakdown.startTime, breakdown.endTime);
            }
        }
        setFormData((prev) => ({ ...prev, breakdownDetails: newBreakdownDetails }));
    };

    const addBreakdownDetailsLine = () => {
        setFormData((prev) => ({
            ...prev,
            breakdownDetails: [...prev.breakdownDetails, { id: null, startTime: null, duration: null, endTime: null, reason: null, typeId: null, departmentId: null, rootCauseId: null, tempSolution: null, permanentSolution: null, actionPlan: null, date: null, purchaseIssue: null, nameOfEquipment: null }],
        }));
    };

    const removeBreakdownDetailsLine = (index) => {
        const newBreakdownDetails = formData.breakdownDetails.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, breakdownDetails: newBreakdownDetails }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(formData.id ? `https://seamless-backend-nz7d.onrender.com/hourly/prod/${formData.id}` : 'https://seamless-backend-nz7d.onrender.com/hourly/prod', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
                setFormData(prevData => ({
                    ...prevData,
                    ...response.data.formData
                }));
                toast({
                    // title: "Form Submitted",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error uploading:', error);
            toast({
                title: "Error uploading.",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

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

    const fetchBDDropdowns = async () => {
        try {
            const response = await axios.get('https://seamless-backend-nz7d.onrender.com/basic/bd');

            if (response.status === 200) {
                setRootCauses(response.data.rootCauses);
                setDepartments(response.data.departments);
                setTypes(response.data.types);
            } else {
                throw new Error("Unexpected response causes");
            }
        } catch (error) {
            // toast({
            //     title: "Error",
            //     description: error?.response?.data?.message || "Failed to fetch machines",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            // });
        }
    };

    const fetchShifts = async (shiftLetter) => {
        try {
            const response = await axios.post('https://seamless-backend-nz7d.onrender.com/basic/shifts', {
                shift: formData.shiftLetter,
                shiftId: isNaN(Number(initialValues.shiftId)) ? undefined : Number(initialValues.shiftId) || undefined
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                if (selectedShift === '' && formData.shiftId && response.data[0]) {
                    setSelectedShift(response.data[0].shift)
                }
                setShifts(response.data);
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

    const handleShiftChange = (e) => {
        const shiftLetter = e.target.value;
        setFormData(prev => ({
            ...prev,
            shiftLetter: shiftLetter,
            shiftId: ''
        }));
        setSelectedShift(shiftLetter);
    };


    const fetchProductionData = async (machineId, date, shiftId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://seamless-backend-nz7d.onrender.com/hourly/prod?machineId=${machineId}&date=${date}&shiftId=${shiftId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(prevData => ({
                    ...prevData,
                    ...data
                }));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch production data",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const needRefresh = () => {
        fetchProductionData(formData.machineId, formData.date, formData.shiftId);
    }

    useEffect(() => {
        fetchMachines();
        fetchBDDropdowns();
    }, []);


    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            machineId: initialValues.machineId,
            date: initialValues.date,
            shiftId: initialValues.shiftId,
        }));
        fetchShifts();
    }, [initialValues]);

    useEffect(() => {
        fetchShifts(formData.shiftLetter);
    }, [formData.shiftLetter]);

    useEffect(() => {
        setSearchParams({
            machine: formData.machineId,
            date: formData.date,
            shift: formData.shiftId
        });
        fetchProductionData(formData.machineId, formData.date, formData.shiftId);
    }, [formData.machineId, formData.date, formData.shiftId]);

    return (
        <Box p={6} maxWidth="1000px" margin="auto">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6}>

                    {/* Machine and Shift Details */}
                    <Box width="full " bg={'gray.100'} p={1} borderRadius={'md'}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'} >Machine and Shift Details <span style={{ fontSize: '16px', color: 'red' }}>*</span></Text>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Machine</FormLabel>
                                <Select
                                    bg={'white'}
                                    placeholder="Select Machine"
                                    value={formData.machineId}
                                    onChange={(e) => handleChange(e)}
                                    name="machineId"
                                >
                                    {machines.map((machine) => (
                                        <option key={machine.id} value={machine.id}>
                                            {machine.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <HStack width={'full'}>
                                <FormControl isRequired>
                                    <FormLabel userSelect={'none'}>Shift</FormLabel>
                                    <Select
                                        bg={'white'}
                                        placeholder="Select Shift"
                                        value={selectedShift}
                                        onChange={handleShiftChange}
                                    >
                                        <option value="A">Shift A</option>
                                        <option value="B">Shift B</option>
                                        <option value="C">Shift C</option>
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Time</FormLabel>
                                    <Select
                                        bg={'white'}
                                        placeholder={formData.shiftLetter ? `Time for ${formData.shiftLetter} shift` : 'Select shift first'}
                                        value={formData.shiftId}
                                        onChange={(e) => handleChange(e)}
                                        name="shiftId"
                                    >
                                        {shifts.map((shift) => (
                                            <option key={shift.id} value={shift.id}>
                                                {shift.label}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </HStack>
                        </Stack>

                        {/* Date and Status */}
                        <Stack p={1} direction={{ base: "column", md: "row" }} spacing={4} width="full">
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Date</FormLabel>
                                <Input
                                    bg={'white'}
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel userSelect={'none'}>Machine running status</FormLabel>
                                <RadioGroup h={'full'} mt={'16px'} value={running ? "true" : "false"} onChange={(e) => setRunning(e === "true" ? true : false)}>
                                    <HStack gap={6}>
                                        <Radio cursor={'pointer'} value="true">Run</Radio>
                                        <Radio cursor={'pointer'} value="false">Not Run</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Box>
                    {/* Operator Details */}
                    <Box width="full" bg={'gray.100'} p={1} borderRadius={'md'}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'}>Basic Details</Text>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Operator Name</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="operatorName"
                                    value={formData.operatorName}
                                    onChange={handleChange}
                                    autoComplete="false"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Operator Phone No</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="operatorPhoneNo"
                                    type="number"
                                    value={formData.operatorPhoneNo}
                                    onChange={handleChange}
                                    onWheel={(e) => e.target.blur()}
                                    autoComplete="false"
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Shift Incharge</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="shiftIncharge"
                                    value={formData.shiftIncharge}
                                    onChange={handleChange}
                                    autoComplete="false"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Shift Incharge Phone No.</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="shiftInchargePhoneNo"
                                    value={formData.shiftInchargePhoneNo}
                                    onChange={handleChange}
                                    onWheel={(e) => e.target.blur()}
                                    type="number"
                                    autoComplete="false"
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Shift Supervisor</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="shiftSuperVisor"
                                    value={formData.shiftSuperVisor}
                                    onChange={handleChange}
                                    autoComplete="false"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Shift Supervisor PhoneNo</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="shiftSuperVisorPhoneNo"
                                    value={formData.shiftSuperVisorPhoneNo}
                                    onChange={handleChange}
                                    onWheel={(e) => e.target.blur()}
                                    type="number"
                                    autoComplete="false"
                                />
                            </FormControl>
                        </Stack>
                    </Box>

                    {/* Dia Details */}
                    <Box width="full" bg={'gray.100'} borderRadius={'md'} p={1}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'} >Dia Details <span style={{ fontSize: '16px', color: 'red' }}>*</span></Text>
                        {formData.diaDetails.map((detail, index) => (
                            <Stack p={1} key={index} direction={{ base: "column", md: "row" }} spacing={4} mb={1}>
                                <Input
                                    bg={'white'}
                                    placeholder="Diameter"
                                    value={detail.diameter ?? ''}
                                    onChange={(e) => handleDiaDetailsChange(index, 'diameter', e.target.value)}
                                    type="number"
                                    required
                                />
                                <Input
                                    bg={'white'}
                                    placeholder="Thickness"
                                    value={detail.thickness ?? ''}
                                    onChange={(e) => handleDiaDetailsChange(index, 'thickness', e.target.value)}
                                    type="number"
                                    required
                                />
                                <Input
                                    bg={'white'}
                                    placeholder="Length"
                                    value={detail.length ?? ''}
                                    onChange={(e) => handleDiaDetailsChange(index, 'length', e.target.value)}
                                    type="number"
                                    required
                                />
                                <IconButton
                                    mt={'4px'}
                                    aria-label="Remove row"
                                    icon={<Trash2Icon />}
                                    onClick={() => removeDiaDetailsLine(index)}
                                    colorScheme="red"
                                    size="sm"
                                    disabled={index == 0}
                                />
                            </Stack>
                        ))}
                        <Button onClick={addDiaDetailsLine} className="bg-teal-500 hover:bg-teal-600 text-white" size={'sm'}>
                            <CirclePlusIcon />
                        </Button>
                    </Box>

                    {/* Production Details */}
                    <Box width="full " bg={'gray.100'} p={1} borderRadius={'md'}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'}>Production Details</Text>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Standard Production/HR(nos)</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="stdProdPerHr"
                                    type="number"
                                    value={formData.stdProdPerHr ?? ''}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Actual Production/HR(nos)</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="actProdPerHr"
                                    type="number"
                                    value={formData.actProdPerHr ?? ''}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>
                            <FormControl disabled>
                                <FormLabel userSelect={'none'}>Difference</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="Difference"
                                    type="number"
                                    value={(formData.stdProdPerHr - formData.actProdPerHr) ?? ''}
                                    disabled
                                />
                            </FormControl>
                            <FormControl disabled>
                                <FormLabel userSelect={'none'}>Running Mins</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="runningMints"
                                    type="number"
                                    value={formData.runningMints ?? ''}
                                    disabled
                                />
                            </FormControl>
                        </Stack>
                    </Box>

                    <Box width="full" bg={'gray.100'} p={1} borderRadius={'md'}>
                        <BreakdownDetails
                            width="full"
                            breakdownDetails={formData.breakdownDetails}
                            onChange={(newBreakdowns) => setFormData(prev => ({ ...prev, breakdownDetails: newBreakdowns }))}
                            onAdd={addBreakdownDetailsLine}
                            onRemove={removeBreakdownDetailsLine}
                            departments={departments}
                            rootCauses={rootCauses}
                            breakdownTypes={types}
                            needRefresh={needRefresh}
                        />
                    </Box>

                    {/* Submit Button */}
                    <Button type="submit" colorScheme="blue" width="full" mt={6} display={user.role === 'maintenance' ? 'none' : 'auto'} isLoading={isLoading}>
                        {formData.id ? "Update" : "Record"} Production Data
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default HourlyProductionForm;