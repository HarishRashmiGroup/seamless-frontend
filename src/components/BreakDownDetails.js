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
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { Trash2Icon, CirclePlusIcon } from "lucide-react";
import { useAuth } from "../providers/authProvider";
import axios from "axios";

const BreakdownDetails = ({ breakdownDetails, rootCauses, departments, breakdownTypes, onChange, onAdd, onRemove, needRefresh }) => {
    const user = useAuth();
    const toast = useToast();
    const token = localStorage.getItem('token');

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

    const handleBDSubmit = async (breakdown) => {
        const formData = {
            id: breakdown.id,
            reason: breakdown.reason ?? "",
            typeId: breakdown.typeId ?? "",
            departmentId: breakdown.departmentId ?? "",
            nameOfEquipment: breakdown.nameOfEquipment ?? "",
            rootCauseId: breakdown.rootCauseId,
            tempSolution: breakdown.tempSolution ?? "",
            permanentSolution: breakdown.permanentSolution ?? "",
            actionPlan: breakdown.actionPlan ?? "",
            purchaseIssue: breakdown.purchaseIssue ?? "",
            date: breakdown.date ?? "",
        };
        try {
            const response = await axios.post('https://seamless-backend-nz7d.onrender.com/hourly/breakdown', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (response.status === 201) {
                needRefresh();
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
                title: "Error",
                description: "Not able to approve. Please contact support.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box width="full" bg={'gray.100'} p={1} borderRadius={'md'}>
            <Text userSelect={'none'} fontSize="xl" mb={4} borderBottom={'1px solid gray'}>Breakdown Details</Text>
            {breakdownDetails.map((breakdown, index) => (

                <Box width={"full"} bg={'white'} p={2} mb={1} key={index} borderRadius={'md'}>
                    <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={2}>
                        <Stack direction={{ base: "row", md: "column" }} gap={{ base: "4px", md: "auto" }}>
                            <FormControl isReadOnly={user?.role != 'operator' && breakdown.id}>
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
                                isReadOnly={user?.role != 'operator' && breakdown.id}
                            />
                        </Stack>
                        <FormControl>
                            <FormLabel>Reason of BD</FormLabel>
                            <Textarea
                                name="reason"
                                value={breakdown.reason}
                                onChange={(e) => handleBreakdownChange(index, 'reason', e.target.value)}
                                placeholder="Reason for the Breakdown"
                                minH='84px'
                            />
                        </FormControl>
                    </Stack>
                    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                        <Input
                            maxW={'320'}
                            placeholder="Breakdown Time (Minutes)"
                            value={Number(breakdown.duration)}
                            type="number"
                            disabled
                        />
                        <Select
                            placeholder="Select Type"
                            value={Number(breakdown.typeId) ?? ''}
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
                            value={breakdown.departmentId ?? ''}
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
                    {user?.role !== 'operator' &&
                        (
                            <>
                                <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                                    <FormControl >
                                        <FormLabel>Name of Equipment</FormLabel>
                                        <Input
                                            placeholder="Name of Equipment"
                                            value={breakdown.nameOfEquipment ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'nameOfEquipment', e.target.value)}
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Root Cause</FormLabel>
                                        <Select
                                            placeholder="Root Cause"
                                            value={breakdown.rootCauseId ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'rootCauseId', Number(e.target.value))}
                                            disabled={breakdown.id == null}
                                        >
                                            {rootCauses.map((rc) => (
                                                <option key={rc.id} value={rc.id}>
                                                    {rc.label}
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
                                            value={breakdown.tempSolution ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'tempSolution', e.target.value)}
                                            placeholder="Temporary Solution for the Breakdown"
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Permanent Solution</FormLabel>
                                        <Textarea
                                            name="permanentSolution"
                                            value={breakdown.permanentSolution ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'permanentSolution', e.target.value)}
                                            placeholder="Permanent Solution for the Breakdown"
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                                    <FormControl>
                                        <FormLabel>Action Plan</FormLabel>
                                        <Textarea
                                            name="actionPlan"
                                            value={breakdown.actionPlan ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'actionPlan', e.target.value)}
                                            placeholder="Action Plan"
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Purchase Issue</FormLabel>
                                        <Textarea
                                            name="purchaseIssue"
                                            value={breakdown.purchaseIssue ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'purchaseIssue', e.target.value)}
                                            placeholder="Purchase Issue"
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack direction={{ base: "column", md: "row" }} mt={2} spacing={4}>
                                    <FormControl>
                                        <FormLabel>TDC</FormLabel>
                                        <Input
                                            type="date"
                                            value={breakdown.date ?? ''}
                                            onChange={(e) => handleBreakdownChange(index, 'date', new Date(e.target.value).toISOString().split('T')[0])}
                                            disabled={breakdown.id == null}
                                        />
                                    </FormControl>
                                    <Box width={'full'} height={'auto'} mt={'auto'} display={'flex'} justifyContent={'flex-end'}>
                                        <Button disabled={breakdown.id == null} onClick={() => handleBDSubmit(breakdown)}>
                                            Approve
                                        </Button>
                                    </Box>
                                </Stack>
                            </>
                        )}
                </Box>
            ))}
            <Button
                onClick={onAdd}
                className="bg-teal-500 hover:bg-teal-600 text-white"
                size={'sm'}
                display={user?.role === 'maintenance' ? 'none' : 'auto'}
            >
                <CirclePlusIcon />
            </Button>
        </Box>
    );
};

export default BreakdownDetails;