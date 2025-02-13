import React, { useState, useCallback } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Button,
    Textarea,
    useToast,
    Stack,
} from '@chakra-ui/react';
import {
    MultiSelect
} from 'chakra-multiselect';

const ProductionForm = () => {
    const [formData, setFormData] = useState({
        machine: 'HOT MILL1',
        status: [],
        dia: '',
        hollowSize: '',
        avgWtPerPc: '',
        targetRunningHr: '',
        actualRunningHr: '',
        standardProduction: '',
        actualProduction: '',
        lossMT: '',
        targetProductionNos: '',
        actualProductionNos: '',
        reason: '',
        solution: '',
        targetPcsPerHr: '',
        actualPcsPerHr: '',
        lossPcsPerHr: '',
        efficiencyPercentage: '',
        remarks: ''
    });

    const [editedFields, setEditedFields] = useState({
        avgWtPerPc: false,
        standardProduction: false,
        lossMT: false,
        targetProductionNos: false,
        targetPcsPerHr: false,
        actualPcsPerHr: false,
        lossPcsPerHr: false,
        efficiencyPercentage: false
    });

    const toast = useToast();

    const calculateValues = useCallback(() => {
        const {
            targetRunningHr,
            actualRunningHr,
            actualProduction,
            actualProductionNos,
            avgWtPerPc,
            targetPcsPerHr,
            standardProduction,
            actualPcsPerHr,
            efficiencyPercentage,
            lossPcsPerHr,
            lossMT,
            targetProductionNos
        } = formData;

        const safeParseFloat = (value) => value ? parseFloat(value) : 0;

        const calcAvgWtPerPc = editedFields.avgWtPerPc
            ? safeParseFloat(avgWtPerPc)
            : (actualProduction && actualProductionNos
                ? safeParseFloat(actualProduction) * 1000 / safeParseFloat(actualProductionNos)
                : 0);

        const calcTargetPcsPerHr = editedFields.targetPcsPerHr
            ? safeParseFloat(targetPcsPerHr)
            : (calcAvgWtPerPc > 0 ? 6000 / calcAvgWtPerPc : 0);

        const calcStandardProduction = editedFields.standardProduction
            ? safeParseFloat(standardProduction)
            : (calcAvgWtPerPc && targetRunningHr
                ? calcAvgWtPerPc * safeParseFloat(targetRunningHr) * calcTargetPcsPerHr / 1000
                : 0);

        const calcActualPcsPerHr = editedFields.actualPcsPerHr
            ? safeParseFloat(actualPcsPerHr)
            : (actualRunningHr && actualProductionNos
                ? safeParseFloat(actualProductionNos) / safeParseFloat(actualRunningHr)
                : 0);

        const calcLossPcsPerHr = editedFields.lossPcsPerHr
            ? safeParseFloat(lossPcsPerHr)
            : (calcTargetPcsPerHr - calcActualPcsPerHr);

        const calcEfficiencyPercentage = editedFields.efficiencyPercentage
            ? safeParseFloat(efficiencyPercentage)
            : (calcTargetPcsPerHr > 0
                ? (calcActualPcsPerHr / calcTargetPcsPerHr) * 100
                : 0);

        const calcLossMT = editedFields.lossMT
            ? safeParseFloat(lossMT)
            : (calcStandardProduction - safeParseFloat(actualProduction));

        const calcTargetProductionNos = editedFields.targetProductionNos
            ? safeParseFloat(targetProductionNos)
            : (targetRunningHr ? safeParseFloat(targetRunningHr) * calcTargetPcsPerHr : 0);

        setFormData(prev => ({
            ...prev,
            avgWtPerPc: calcAvgWtPerPc.toFixed(2),
            targetPcsPerHr: calcTargetPcsPerHr.toFixed(2),
            standardProduction: calcStandardProduction.toFixed(2),
            actualPcsPerHr: calcActualPcsPerHr.toFixed(2),
            lossPcsPerHr: calcLossPcsPerHr.toFixed(2),
            efficiencyPercentage: calcEfficiencyPercentage.toFixed(2),
            lossMT: calcLossMT.toFixed(2),
            targetProductionNos: calcTargetProductionNos.toFixed(0)
        }));

        setEditedFields(prev => {
            const resetFields = { ...prev };
            Object.keys(resetFields).forEach(key => {
                if (!formData[key]) resetFields[key] = false;
            });
            return resetFields;
        });
    }, [formData, editedFields]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const calculatedFields = [
            'avgWtPerPc', 'standardProduction', 'lossMT',
            'targetProductionNos', 'targetPcsPerHr',
            'actualPcsPerHr', 'lossPcsPerHr', 'efficiencyPercentage'
        ];

        if (calculatedFields.includes(name)) {
            setEditedFields(prev => ({
                ...prev,
                [name]: value.trim() !== ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const calculatedFields = [
            'avgWtPerPc', 'standardProduction', 'lossMT',
            'targetProductionNos', 'targetPcsPerHr',
            'actualPcsPerHr', 'lossPcsPerHr', 'efficiencyPercentage'
        ];
        calculateValues();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateValues();
        toast({
            title: "Form Submitted",
            description: "",
            status: "success",
            duration: 3000,
            isClosable: true
        });
    };

    return (
        <Box p={6} maxWidth="1000px" margin="auto">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Machine</FormLabel>
                        <Input
                            name="machine"
                            value={formData.machine}
                            isDisabled
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <MultiSelect
                            options={[
                                { value: 'Not Run', label: 'NotRun' },
                                { value: 'A', label: 'A' },
                                { value: 'B', label: 'B' },
                                { value: 'C', label: 'C' }
                            ]}
                            value={formData.status}
                            onChange={(val) => setFormData(prev => ({
                                ...prev,
                                status: val
                            }))}
                        />
                    </FormControl>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl>
                            <FormLabel>Dia</FormLabel>
                            <Input
                                name="dia"
                                type="number"
                                value={formData.dia}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Hollow Size (OD x WT x L)</FormLabel>
                            <Input
                                name="hollowSize"
                                value={formData.hollowSize}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl isReadOnly>
                            <FormLabel>Avg Weight per Piece</FormLabel>
                            <Input
                                name="avgWtPerPc"
                                type="number"
                                value={formData.avgWtPerPc}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onWheel={(e) => e.target.blur()}
                                borderColor={editedFields.avgWtPerPc ? 'yello.500' : undefined}
                                disabled
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Target Running Hours</FormLabel>
                            <Input
                                name="targetRunningHr"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.targetRunningHr}
                                onChange={handleChange}
                                onBlur={calculateValues}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl>
                            <FormLabel>Actual Running Hours</FormLabel>
                            <Input
                                name="actualRunningHr"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.actualRunningHr}
                                onChange={handleChange}
                                onBlur={calculateValues}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Actual Production (MT)</FormLabel>
                            <Input
                                name="actualProduction"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.actualProduction}
                                onChange={handleChange}
                                onBlur={calculateValues}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl>
                            <FormLabel>Standard Production (MT)</FormLabel>
                            <Input
                                name="standardProduction"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.standardProduction}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                borderColor={editedFields.standardProduction ? 'yellow.500' : undefined}
                            />
                        </FormControl>
                        <FormControl isReadOnly>
                            <FormLabel>Loss in MT</FormLabel>
                            <Input
                                name="lossMT"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.lossMT}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // borderColor={editedFields.lossMT ? 'red.500' : undefined}
                                disabled
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl>
                            <FormLabel>Target Production (Nos)</FormLabel>
                            <Input
                                name="targetProductionNos"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.targetProductionNos}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                borderColor={editedFields.targetProductionNos ? 'yellow.500' : undefined}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Actual Production (Nos)</FormLabel>
                            <Input
                                name="actualProductionNos"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.actualProductionNos}
                                onChange={handleChange}
                                onBlur={calculateValues}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl>
                            <FormLabel>Target Pieces/Hour</FormLabel>
                            <Input
                                name="targetPcsPerHr"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.targetPcsPerHr}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                borderColor={editedFields.targetPcsPerHr ? 'yellow.500' : undefined}
                            />
                        </FormControl>
                        <FormControl isReadOnly>
                            <FormLabel>Actual Pieces/Hour</FormLabel>
                            <Input
                                name="actualPcsPerHr"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.actualPcsPerHr}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // borderColor={editedFields.actualPcsPerHr ? 'red.500' : undefined}
                                disabled
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction={{ base: "column", md: "row" }} spacing={4} width="full">
                        <FormControl isReadOnly>
                            <FormLabel>Loss Pieces/Hour</FormLabel>
                            <Input
                                name="lossPcsPerHr"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.lossPcsPerHr}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // borderColor={editedFields.lossPcsPerHr ? 'red.500' : undefined}
                                disabled
                            />
                        </FormControl>
                        <FormControl isReadOnly>
                            <FormLabel>Efficiency %</FormLabel>
                            <Input
                                name="efficiencyPercentage"
                                type="number"
                                onWheel={(e) => e.target.blur()}
                                value={formData.efficiencyPercentage}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                borderColor={editedFields.efficiencyPercentage ? 'yellow.500' : undefined}
                                disabled
                            />
                        </FormControl>
                    </Stack>

                    <FormControl>
                        <FormLabel>Reason</FormLabel>
                        <Textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter reason with formatting"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Solution</FormLabel>
                        <Textarea
                            name="solution"
                            value={formData.solution}
                            onChange={handleChange}
                            placeholder="Enter solution with formatting"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Remarks</FormLabel>
                        <Textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Enter remarks with formatting"
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        type="submit"
                        width="full"
                    >
                        Submit Production Data
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default ProductionForm;