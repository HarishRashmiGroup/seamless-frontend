import { Fragment, useEffect, useMemo, useState } from "react";
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
    Spinner,
    Tooltip,
} from '@chakra-ui/react';
import { CirclePlusIcon, Trash2Icon } from "lucide-react";
import BreakdownDetails from "./BreakDownDetails";
import { useAuth } from "../providers/authProvider";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "./FullScreenLoader";
import CustomSelect from "./CustomSelect";

export const HourlyProductionForm = () => {
    const toast = useToast();
    const { user, setUser } = useAuth();
    const [input, setInput] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [shiftLoading, setShiftLoading] = useState(false);
    const [machineLoading, setMachineLoading] = useState(false);
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
    const [token, setToken] = useState(localStorage.getItem('token'));

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
        runTime: 60,
        diaDetails: [{ diameter: '', nos: '', thickness: '', length: '' }],
        breakdownDetails: [],
        stdProdPerHr: '',
        actProdPerHr: '',
        runningMints: '',
        stdProdMTPerHr: '',
        actProdMTPerHr: '',
        mpm: '',
    });

    // Function to calculate standard production in MT based on machine type and MPM
    const calculateStdProdMTPerHr = (machineId, mpm, actProdMTPerHr, actProdPerHr, stdProdPerHr) => {
        // For machines 20 and 21, use MPM-based calculation
        if ([20, 21, '20', '21'].includes(Number(machineId)) && mpm) {
            const factor = Number(machineId) === 20 ? 1.8 : 2.1;
            return (Number(mpm) * 6 * factor).toFixed(3);
        }
        // For other machines with actual production data, calculate based on actuals and standard
        else if (actProdPerHr && actProdMTPerHr && stdProdPerHr) {
            return ((actProdMTPerHr / actProdPerHr) * stdProdPerHr).toFixed(3);
        }
        // Return current value if no calculation possible
        return '';
    };

    const handleChange = (e) => {
        console.log(e)
        const { name, value } = e.target;
        let updates = { [name]: value };

        // If mpm or machineId changes for machines 20 or 21, recalculate stdProdMTPerHr
        if (name === 'mpm' || (name === 'machineId' && [20, 21, '20', '21'].includes(Number(value)))) {
            const machineId = name === 'machineId' ? value : formData.machineId;
            const mpm = name === 'mpm' ? value : formData.mpm;

            if ([20, 21, '20', '21'].includes(Number(machineId)) && mpm) {
                const stdProdMTPerHr = calculateStdProdMTPerHr(machineId, mpm);
                updates.stdProdMTPerHr = stdProdMTPerHr;
            }
        }

        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const calculateWeight = (nos, diameter, length, thickness) => {
        return ((diameter - thickness) * thickness * 0.02467 * length * nos) / 1000;
    };
    const calculateWeightHotMill = (nos, diameter, length) => {
        return (Math.PI * diameter * diameter * 7.85 * nos * length) / 4000000;
    }

    const calculateOutputLength = (dia, wt, length, outputDia, outputWt) => {
        const PI = Math.PI;
        const hollowArea = (dia - wt) * wt * PI;
        const finalArea = (outputDia - outputWt) * outputWt * PI;
        const elongation = hollowArea / finalArea;
        return (length - 0.81) * elongation;
    };

    const calculateStandardProduction = (pipes, machineCapacityKg = 6000, efficiency = 0.98) => {
        let totalPcs = 0;
        let totalWeightedWeight = 0;

        pipes.forEach(pipe => {
            const { mt, pcs } = pipe;
            const avgWeight = (mt * 1000) / pcs;
            totalPcs += pcs;
            totalWeightedWeight += avgWeight * pcs;
        });

        const avgCombinedWeight = totalWeightedWeight / totalPcs;
        const standardPcs = (machineCapacityKg * efficiency) / avgCombinedWeight;
        return Math.round(standardPcs);
    };

    const handleDiaDetailsChange = (index, field, value) => {
        const newDiaDetails = [...formData.diaDetails];
        newDiaDetails[index][field] = value;

        const dia = Number(newDiaDetails[index]['diameter']);
        const wl = Number(newDiaDetails[index]['thickness']);
        const len = Number(newDiaDetails[index]['length']);
        const outDia = Number(newDiaDetails[index]['outputDiameter']);
        const outWt = Number(newDiaDetails[index]['outputThickness']);

        if ([dia, wl, len, outDia, outWt].every(n => !isNaN(n) && n > 0)) {
            const outLen = calculateOutputLength(dia, wl, len, outDia, outWt);
            newDiaDetails[index]['outputLength'] = outLen.toFixed(2);
        }

        let totalPcs = 0;
        let totalWeight = 0;

        const pipeSummaries = [];

        newDiaDetails.forEach(d => {
            const pcs = Number(d.nos);
            const dia = Number(d.diameter);
            const wt = Number(d.thickness);
            const len = Number(d.length);

            if ([pcs, dia, len].every(n => !isNaN(n) && n > 0)) {
                const weight = ['1', '2', '3', 1, 2, 3].includes(formData.machineId) ? calculateWeightHotMill(pcs, dia, len) : calculateWeight(pcs, dia, len, wt);
                totalPcs += pcs;
                totalWeight += weight;
                pipeSummaries.push({ pcs, mt: weight });
            }
        });

        let standardProductionPerHrPcs = null;

        if ([1, 3, '1', '3'].includes(formData.machineId)) {
            standardProductionPerHrPcs = calculateStandardProduction(pipeSummaries);
        }
        if ([2, '2'].includes(formData.machineId)) {
            standardProductionPerHrPcs = calculateStandardProduction(pipeSummaries, 4000);
        }

        // Calculate the updated values
        const updatedValues = {
            diaDetails: newDiaDetails,
            actProdPerHr: totalPcs,
            actProdMTPerHr: totalWeight.toFixed(3),
        };

        // Only update stdProdPerHr if it was calculated
        if (standardProductionPerHrPcs) {
            updatedValues.stdProdPerHr = standardProductionPerHrPcs;
        }

        // After updating actProdPerHr and actProdMTPerHr, recalculate stdProdMTPerHr if needed
        const machineId = formData.machineId;
        if (![20, 21, '20', '21'].includes(Number(machineId)) && updatedValues.actProdPerHr > 0) {
            updatedValues.stdProdMTPerHr = calculateStdProdMTPerHr(
                machineId,
                formData.mpm,
                updatedValues.actProdMTPerHr,
                updatedValues.actProdPerHr,
                updatedValues.stdProdPerHr || formData.stdProdPerHr
            );
        }
        if ([20, 21, '20', '21'].includes(Number(machineId)) && formData.stdProdMTPerHr) {
            updatedValues.stdProdPerHr = (formData.stdProdMTPerHr * updatedValues.actProdPerHr * 0.93 / (updatedValues.actProdMTPerHr)).toFixed(3);
        }

        setFormData(prev => ({
            ...prev,
            ...updatedValues
        }));
    };


    const addDiaDetailsLine = () => {
        setFormData((prev) => ({
            ...prev,
            diaDetails: [...prev.diaDetails, { diameter: '', nos: '', thickness: '', length: '', outputDiameter: '', outputLength: '', outputThickness: '' }],
        }));
    };

    const removeDiaDetailsLine = (index) => {
        const newDiaDetails = formData.diaDetails.filter((_, i) => i !== index);
        const totalPcs = newDiaDetails.reduce((sum, d) => {
            const nos = Number(d.nos);
            return sum + (isNaN(nos) ? 0 : nos);
        }, 0);

        const totalWeight = newDiaDetails.reduce((sum, d) => {
            const nos = Number(d.nos);
            const diameter = Number(d.diameter);
            const thickness = Number(d.thickness);
            const length = Number(d.length);

            if (!isNaN(nos) && !isNaN(diameter) && !isNaN(length) &&
                nos > 0 && diameter > 0 && length > 0) {
                if (['1', '2', '3', 1, 2, 3].includes(formData.machineId)) return sum + calculateWeightHotMill(nos, diameter, length);
                if (!isNaN(thickness) || thickness == 0) return sum;
                return sum + calculateWeight(nos, diameter, length, thickness);
            }
            return sum;
        }, 0);

        const updatedValues = {
            diaDetails: newDiaDetails,
            actProdPerHr: totalPcs,
            actProdMTPerHr: totalWeight.toFixed(3),
        };

        // Recalculate stdProdMTPerHr based on new values
        if (![20, 21, '20', '21'].includes(Number(formData.machineId)) && totalPcs > 0) {
            updatedValues.stdProdMTPerHr = calculateStdProdMTPerHr(
                formData.machineId,
                formData.mpm,
                updatedValues.actProdMTPerHr,
                updatedValues.actProdPerHr,
                formData.stdProdPerHr
            );
        }

        if ([20, 21, '20', '21'].includes(Number(formData.machineId)) && formData.stdProdMTPerHr) {
            updatedValues.stdProdPerHr = (formData.stdProdMTPerHr * updatedValues.actProdPerHr * 0.93 / (updatedValues.actProdMTPerHr)).toFixed(3);
        }

        setFormData((prev) => ({
            ...prev,
            ...updatedValues
        }));
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
        setIsSaving(true);
        try {
            // const response = await axios.post(formData.id ? `http://localhost:3001/hourly/prod/${formData.id}` : 'http://localhost:3001/hourly/prod', formData, {
            const response = await axios.post(formData.id ? `https://seamless-backend-nz7d.onrender.com/hourly/prod/${formData.id}` : 'https://seamless-backend-nz7d.onrender.com/hourly/prod', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (response.status === 201) {
                setFormData(prevData => ({
                    ...prevData,
                    ...response.data.formData
                }));
                toast({
                    title: "Hourly Report Submitted",
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
        } finally {
            setIsSaving(false);
        }
    };

    const fetchMachines = async () => {
        try {
            setMachineLoading(true);
            const response = await axios.get('https://seamless-backend-nz7d.onrender.com/basic/machines',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
                duration: 1000,
                isClosable: true,
            });
        } finally {
            setMachineLoading(false);
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
            setShifts([]);
            setShiftLoading(true);
            const shift = shiftLetter || formData.shiftLetter;
            const shiftId = shift ? undefined : Number(formData.shiftId)
            const response = await axios.post('https://seamless-backend-nz7d.onrender.com/basic/shifts', {
                shift,
                shiftId,
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
                duration: 1000,
                isClosable: true,
            });
        } finally {
            setShiftLoading(false);
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
            // const response = await axios.get(`http://localhost:3001/hourly/prod?machineId=${machineId}&date=${date}&shiftId=${shiftId}`,
            const response = await axios.get(`https://seamless-backend-nz7d.onrender.com/hourly/prod?machineId=${machineId}&date=${date}&shiftId=${shiftId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                const data = response.data;
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
        if (shifts.length === 0)
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
        if (formData.machineId && formData.date && formData.shiftId)
            fetchProductionData(formData.machineId, formData.date, formData.shiftId);
    }, [formData.machineId, formData.date, formData.shiftId]);

    return (
        <Box maxWidth="1000px" margin="auto">
            <FullScreenLoader isLoading={isLoading} />
            <form onSubmit={handleSubmit}>
                <VStack spacing={6}>

                    {/* Machine and Shift Details */}
                    <Box width="full" p={6} bg={'gray.100'} borderRadius={'md'}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'} >Machine and Shift Details <span style={{ fontSize: '16px', color: 'red' }}>*</span></Text>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Machine</FormLabel>
                                {/* <Select
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
                                </Select> */}
                                <CustomSelect
                                    borderRadius="md"
                                    borderColor="#cccccc"
                                    size="md"
                                    bg="gray.50"
                                    name='machineId'
                                    isLoading={machineLoading}
                                    value={formData.machineId}
                                    defaultOption={{ value: '', label: 'Select Machine' }}
                                    onChange={(e) => handleChange(e)}
                                    iconColor="#3182ce"
                                    _hover={{ borderColor: '#3182ce' }}
                                    _focus={{ borderColor: '#3182ce' }}
                                    options={[
                                        { value: '', label: 'Select Machine' },
                                        ...machines?.map(machine => ({ value: machine.id, label: machine.label }))
                                    ]}
                                />
                            </FormControl>
                            <HStack width={'full'}>
                                <FormControl isRequired>
                                    <FormLabel userSelect={'none'}>Shift</FormLabel>
                                    <Select
                                        bg={'white'}
                                        placeholder="Select Shift"
                                        value={selectedShift}
                                        onChange={handleShiftChange}
                                        disabled={shiftLoading}
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
                                        disabled={shiftLoading}
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
                            {[20, 21].includes(Number(formData.machineId)) &&
                                <FormControl isRequired>
                                    <FormLabel>Meter per Minute</FormLabel>
                                    <Input
                                        bg={'white'}
                                        name="mpm"
                                        value={formData.mpm}
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        onChange={handleChange}
                                        autoComplete="false"
                                    />
                                </FormControl>
                            }
                            <FormControl>
                                <FormLabel userSelect={'none'}>Run Time(mint)</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="runTime"
                                    value={formData.runTime}
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChange}
                                    autoComplete="false"
                                />
                            </FormControl>

                        </Stack>
                    </Box>
                    {/* Operator Details */}
                    <Box width="full" bg={'gray.100'} p={6} borderRadius={'md'}>
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
                            <FormControl>
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
                            <FormControl>
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
                            <FormControl>
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
                    <Box width="full" position={'relative'} bg={'gray.100'} borderRadius={'md'} p={6}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'} >Dia Details <span style={{ fontSize: '16px', color: 'red' }}>*</span></Text>
                        {formData.diaDetails.map((detail, index) => (
                            <Fragment key={index}>
                                <Stack p={1} mt={index != 0 ? 4 : 'auto'} direction={{ base: "column", md: "row" }} spacing={4} mb={1}>
                                    <FormControl isRequired>
                                        <FormLabel>Dia(mm)</FormLabel>
                                        <Input
                                            bg={'white'}
                                            placeholder="Diameter"
                                            value={detail.diameter ?? ''}
                                            onChange={(e) => handleDiaDetailsChange(index, 'diameter', e.target.value)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl isRequired={!['1', '2', '3', 1, 2, 3].includes(formData.machineId)}>
                                        <FormLabel>WT(mm)</FormLabel>
                                        <Input
                                            bg={'white'}
                                            placeholder="Thickness"
                                            value={detail.thickness ?? ''}
                                            onChange={(e) => handleDiaDetailsChange(index, 'thickness', e.target.value)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Length(Mtr)</FormLabel>
                                        <Input
                                            bg={'white'}
                                            placeholder="Length"
                                            value={detail.length ?? ''}
                                            onChange={(e) => handleDiaDetailsChange(index, 'length', e.target.value)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Pcs</FormLabel>
                                        <Input
                                            bg={'white'}
                                            placeholder="No of Pcs"
                                            value={detail.nos ?? ''}
                                            onChange={(e) => handleDiaDetailsChange(index, 'nos', e.target.value)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            required
                                        />
                                    </FormControl>
                                    <IconButton
                                        mt={{ base: '4px', md: '36px' }}
                                        aria-label="Remove row"
                                        icon={<Trash2Icon />}
                                        onClick={() => removeDiaDetailsLine(index)}
                                        colorScheme="red"
                                        size="sm"
                                        disabled={index == 0}
                                    />
                                </Stack>
                                {formData.machineId && Number(formData.machineId) >= 8 && Number(formData.machineId) <= 19 &&
                                    <Stack p={1} direction={{ base: "column", md: "row" }} spacing={4} mb={1}>
                                        <FormControl isRequired>
                                            <FormLabel>Output Dia(mm)</FormLabel>
                                            <Input
                                                bg={'white'}
                                                placeholder="Diameter"
                                                value={detail.outputDiameter ?? ''}
                                                onChange={(e) => handleDiaDetailsChange(index, 'outputDiameter', e.target.value)}
                                                type="number"
                                                onWheel={(e) => e.target.blur()}
                                                required
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Output WT(mm)</FormLabel>
                                            <Input
                                                bg={'white'}
                                                placeholder="Thickness"
                                                value={detail.outputThickness ?? ''}
                                                onChange={(e) => handleDiaDetailsChange(index, 'outputThickness', e.target.value)}
                                                type="number"
                                                onWheel={(e) => e.target.blur()}
                                                required
                                            />
                                        </FormControl>
                                        <Tooltip label="Auto Calculated Field">
                                            <FormControl isRequired>
                                                <FormLabel>Output Length(Mtr)</FormLabel>
                                                <Input
                                                    bg={'white'}
                                                    placeholder="Length"
                                                    value={detail.outputLength ?? ''}
                                                    onChange={(e) => handleDiaDetailsChange(index, 'outputLength', e.target.value)}
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    required
                                                />
                                            </FormControl>
                                        </Tooltip>
                                        <FormControl >
                                            <FormLabel display={'none'}>Pcs</FormLabel>
                                            <Input
                                                display={'none'}
                                            />
                                        </FormControl>
                                        <IconButton
                                            mt={{ base: '4px', md: '36px' }}
                                            aria-label="Remove row"
                                            icon={<Trash2Icon opacity={0} />}
                                            onClick={() => removeDiaDetailsLine(index)}
                                            size="sm"
                                            opacity={0}
                                            h={0}
                                            p={0}
                                            disabled={true}
                                        />
                                    </Stack>
                                }
                            </Fragment>
                        ))}
                        <Button onClick={addDiaDetailsLine} className="bg-teal-500 hover:bg-teal-600 text-white" size={'sm'}>
                            <CirclePlusIcon />
                        </Button>
                    </Box>

                    {/* Production Details */}
                    <Box width="full " bg={'gray.100'} p={6} borderRadius={'md'}>
                        <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'}>Production Details</Text>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={4}>
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
                            <Tooltip label="Auto Calculated Field" hasArrow>
                                <FormControl isRequired isReadOnly>
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
                            </Tooltip>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel userSelect={'none'}>Standard Production/HR(MT)</FormLabel>
                                <Input
                                    bg={'white'}
                                    name="stdProdMTPerHr"
                                    type="number"
                                    value={formData.stdProdMTPerHr ?? null}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <Tooltip label="Auto Calculated Field" hasArrow>
                                <FormControl isRequired>
                                    <FormLabel userSelect={'none'}>Actual Production/HR(MT)</FormLabel>
                                    <Input
                                        bg={'white'}
                                        name="actProdMTPerHr"
                                        type="number"
                                        value={formData.actProdMTPerHr ?? ''}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Tooltip>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>

                            <Tooltip label="Auto Calculated Field" hasArrow>
                                <FormControl isReadOnly>
                                    <FormLabel userSelect={'none'}>Difference(nos)</FormLabel>
                                    <Input
                                        bg={'white'}
                                        name="Difference(nos)"
                                        type="number"
                                        value={(formData.stdProdPerHr * (formData.runTime ? (formData.runTime / 60) : 1) - formData.actProdPerHr).toFixed(2) ?? ''}

                                    />
                                </FormControl>
                            </Tooltip>
                            <Tooltip label="Auto Calculated Field" hasArrow>
                                <FormControl isReadOnly>
                                    <FormLabel userSelect={'none'}>Difference(MT)</FormLabel>
                                    <Input
                                        bg={'white'}
                                        name="Difference(MT)"
                                        type="number"
                                        value={(formData.stdProdMTPerHr * (formData.runTime ? (formData.runTime / 60) : 1) - formData.actProdMTPerHr).toFixed(3) ?? ''}
                                    />
                                </FormControl>
                            </Tooltip>
                            <Tooltip label="Auto Calculated Field" hasArrow>
                                <FormControl isReadOnly>
                                    <FormLabel userSelect={'none'}>Running Mins</FormLabel>
                                    <Input
                                        bg={'white'}
                                        name="runningMints"
                                        type="number"
                                        value={formData.runningMints ?? ''}

                                    />
                                </FormControl>
                            </Tooltip>
                        </Stack>
                    </Box>

                    <Box width="full" bg={'gray.100'} p={6} borderRadius={'md'}>
                        <BreakdownDetails
                            width="full"
                            breakdownDetails={formData.breakdownDetails}
                            onChange={(newBreakdowns) => setFormData(prev => ({ ...prev, breakdownDetails: newBreakdowns }))}
                            onAdd={addBreakdownDetailsLine}
                            onRemove={removeBreakdownDetailsLine}
                            departments={departments}
                            rootCauses={rootCauses}
                            setRootCauses={setRootCauses}
                            breakdownTypes={types}
                            needRefresh={needRefresh}
                        />
                    </Box>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        mt={6}
                        display={user?.role === 'maintenance' ? 'none' : user?.role === 'operator' && formData.id ? 'none' : 'auto'}
                        isLoading={isSaving}
                        loadingText=""
                        spinner={<Spinner size="sm" />}
                    >
                        {formData.id ? "Update Production Data" : "Record Production Data"}
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default HourlyProductionForm;