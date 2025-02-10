import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Stack,
    Input,
    Textarea,
    Select,
    IconButton,
    Button,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { Trash2Icon, CirclePlusIcon } from "lucide-react";
import { useAuth } from "../providers/authProvider";
import axios from "axios";

const BreakdownDetails = ({ breakdownDetails, rootCauses, departments, breakdownTypes, onChange, onAdd, onRemove }) => {
    const user = useAuth();
    const [formData, setFormData] = useState({
        reason: breakdownDetails.reason || 'reason',
        type: breakdownDetails.type || "",
        department: breakdownDetails.department || "",
        nameOfEquipement: '',
        tempSolution: '',
        permanentSolution: '',
        actionPlan: '',
        purchaseIssue: '',
        date: '',
    });
    // const breakdownTypes = [
    //     { id: 1, label: 'Process' },
    //     { id: 2, label: 'Low Production' },
    //     { id: 3, label: 'Other' },
    // ];

    // const departments = [
    //     { id: 1, label: 'Production' },
    //     { id: 2, label: 'Tooling' },
    //     { id: 3, label: 'Electrical' },
    //     { id: 4, label: 'Mechanical' },
    //     { id: 5, label: 'Utility' },
    //     { id: 6, label: 'Project' },
    //     { id: 7, label: 'Other' },
    // ];

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return '';
        const start = new Date(`2000/01/01 ${startTime}`);
        const end = new Date(`2000/01/01 ${endTime}`);
        const diff = end - start;
        return Math.round(diff / 60000);
    };

    const handleBreakdownChange = (index, field, value) => {
        const newBreakdowns = [...breakdownDetails];
        newBreakdowns[index][field] = value;

        if (field === 'startTime' || field === 'endTime') {
            const breakdown = newBreakdowns[index];
            if (breakdown.startTime && breakdown.endTime) {
                breakdown.duration = calculateDuration(breakdown.startTime, breakdown.endTime);
            }
        }

        onChange(newBreakdowns);
    };

    const handleBDSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/hourly/breakdown', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (response.status === 201) {
                // toast({
                //     // title: "Form Submitted",
                //     description: response.data.message,
                //     status: "success",
                //     duration: 5000,
                //     isClosable: true,
                // });
            }
        } catch (error) {
            console.error('Error uploading:', error);
            // toast({
            //     title: "Error uploading.",
            //     description: "",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            // });
        }
        console.log("Form Data:", formData);
    };

    return (
        <Box width="full" bg={'gray.100'} p={1} borderRadius={'md'}>
            <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'}>Breakdown Details</Text>
            {breakdownDetails.map((breakdown, index) => (

                <Box width={"full"} bg={'white'} p={2} mb={1} key={index} borderRadius={'md'}>
                    <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={2}>
                        <Stack direction={{ base: "row", md: "column" }} spacing={0.2}>
                            <FormControl>
                                <FormLabel>B.D. Time</FormLabel>
                                <Input
                                    placeholder="From"
                                    value={breakdown.startTime}
                                    onChange={(e) => handleBreakdownChange(index, 'startTime', e.target.value)}
                                    type="time"
                                    required
                                />
                            </FormControl>
                            <Input
                                mt={'auto'}
                                placeholder="To"
                                value={breakdown.endTime}
                                onChange={(e) => handleBreakdownChange(index, 'endTime', e.target.value)}
                                type="time"
                                required
                            />
                        </Stack>
                        <FormControl>
                            <FormLabel>Reason of BD</FormLabel>
                            <Textarea
                                name="reason"
                                value={breakdown.reason}
                                onChange={(e) => handleBreakdownChange(index, 'reason', e.target.value)}
                                placeholder="Reason for the Breakdown"
                            />
                        </FormControl>
                    </Stack>
                    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                        <Input
                            maxW={'300'}
                            placeholder="Breakdown Time (Minutes)"
                            value={Number(breakdown.duration)}
                            type="number"
                            disabled
                        />
                        <Select
                            placeholder="Select Type"
                            value={Number(breakdown.typeId)}
                            onChange={(e) => handleBreakdownChange(index, 'typeId', Number(e.target.value))}
                            required
                        >
                            {breakdownTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Select Department"
                            value={breakdown.departmentId}
                            onChange={(e) => handleBreakdownChange(index, 'departmentId', Number(e.target.value))}
                            required
                        >
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.label}
                                </option>
                            ))}
                        </Select>
                        <IconButton
                            mt={'4px'}
                            aria-label="Remove row"
                            icon={<Trash2Icon />}
                            onClick={() => onRemove(index)}
                            colorScheme="red"
                            size="sm"
                        />
                    </Stack>
                    {user.role != 'operator' && (<>
                        <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                            <FormControl>
                                <FormLabel>Name of Equipment</FormLabel>
                                <Input
                                    placeholder="Name of Equipment"
                                    value={breakdown.nameOfEquipement}
                                    onChange={(e) => setFormData({ ...formData, nameOfEquipement: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Root Cause</FormLabel>
                                <Select
                                    placeholder="Root Cause"
                                    required
                                >
                                    {rootCauses.map((dept) => (
                                        <option key={dept.id} value={dept.label}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                            <FormControl>
                                <FormLabel>Temporary Solution</FormLabel>
                                <Textarea
                                    name="tempSolution"
                                    value={formData.tempSolution}
                                    onChange={(e) => setFormData({ ...formData, tempSolution: e.target.value })}
                                    placeholder="Temporary Solution for the Breakdown"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Permanent Solution</FormLabel>
                                <Textarea
                                    name="permanentSolution"
                                    value={breakdown.permanentSolution}
                                    onChange={(e) => setFormData({ ...formData, permanentSolution: e.target.value })}
                                    placeholder="Permanent Solution for the Breakdown"
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                            <FormControl>
                                <FormLabel>Action Plan</FormLabel>
                                <Textarea
                                    name="actionPlan"
                                    value={breakdown.actionPlan}
                                    onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                                    placeholder="Action Plan"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Purchase Issue</FormLabel>
                                <Textarea
                                    name="purchaseIssue"
                                    value={breakdown.purchaseIssue}
                                    onChange={(e) => setFormData({ ...formData, purchaseIssue: e.target.value })}
                                    placeholder="Purchase Issue"
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                            <FormControl>
                                <FormLabel>TDC</FormLabel>
                                <Input
                                    type="date"
                                    value={breakdown.date}
                                    onChange={(e) => setFormData({ ...formData, permanentSolution: new Date(e.target.value).toLocaleDateString() })}
                                />
                            </FormControl>
                            <Box width={'full'} height={'auto'} mt={'auto'} display={'flex'} justifyContent={'flex-end'}>
                                <Button onClick={handleBDSubmit}>
                                    Approve
                                </Button>
                            </Box>
                        </Stack>
                    </>
                    )}
                </Box>
            ))}
            <Button onClick={onAdd} className="bg-teal-500 hover:bg-teal-600 text-white" size={'sm'}>
                <CirclePlusIcon />
            </Button>
        </Box>
    );
};

export default BreakdownDetails;