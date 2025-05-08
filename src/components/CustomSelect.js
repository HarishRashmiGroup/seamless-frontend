import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    List,
    ListItem,
    Input,
    InputGroup,
    InputRightElement,
    useOutsideClick,
    useColorModeValue,
    Icon,
    Spinner
} from "@chakra-ui/react";
import { SearchIcon, ChevronDown, Tally1, X } from "lucide-react";

const CustomSelect = ({
    options = [],
    defaultOption,
    value,
    onChange,
    placeholder = "Select option",
    size = "sm",
    name,
    borderRadius = "md",
    borderColor = "#cccccc",
    iconColor = "#cccccc",
    bg = "white",
    _hover = { borderColor: "#b3b3b3" },
    _focus = { borderColor: "#3182ce" },
    isDisabled = false,
    isLoading = false,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const selectRef = useRef(null);
    const inputRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(0); // Start with 0 instead of 0
    const listRef = useRef(null);

    // Filter options based on search text
    const filteredOptions = searchText.trim() === ""
        ? options
        : options.filter((option) =>
            option.label.toLowerCase().includes(searchText.toLowerCase())
        );

    // Close the dropdown when clicking outside
    useOutsideClick({
        ref: selectRef,
        handler: () => {
            setIsOpen(false);
            setSearchText("");
            setHoveredIndex(0);
        },
    });

    // Find the selected option by value
    useEffect(() => {
        const option = options.find((opt) => opt.value == value);
        setSelectedOption(option);
    }, [value, options]);


    // Handle option selection
    const handleSelectOption = (option) => {
        onChange({ target: { value: option.value, name: name } });
        setIsOpen(false);
        setSearchText("");
        setHoveredIndex(0);
    };

    // Handle input click to toggle dropdown
    const handleInputClick = (e) => {
        // Always open dropdown on click
        setIsOpen(true);
        // Clear search text when opening to show all options
        setSearchText("");
        setHoveredIndex(0);

        // Focus the input
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        if (filteredOptions.length === 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHoveredIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHoveredIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                // Only select if we have a valid hoveredIndex
                if (hoveredIndex >= 0 && hoveredIndex < filteredOptions.length) {
                    handleSelectOption(filteredOptions[hoveredIndex]);
                } else if (filteredOptions.length > 0) {
                    // If no item is hovered but we have options, select the first one
                    handleSelectOption(filteredOptions[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearchText("");
                setHoveredIndex(0);
                break;
            case 'Tab':
                setIsOpen(false);
                setSearchText("");
                setHoveredIndex(0);
                break;
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchText(newValue);
        if (!isOpen) setIsOpen(true);

        // Reset hovered index when search text changes
        setHoveredIndex(0);
    };

    // Handle mouse hover
    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    // Handle mouse leave from the list
    const handleMouseLeave = () => {
        setHoveredIndex(0);
    };

    // Scroll hovered item into view
    useEffect(() => {
        if (isOpen && listRef.current && hoveredIndex >= 0) {
            const hoveredElement = listRef.current.children[hoveredIndex];
            if (hoveredElement) {
                hoveredElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [hoveredIndex, isOpen]);

    // Size mappings
    const sizeMap = {
        xs: {
            height: "6",
            fontSize: "xs",
            px: "2",
            dropdownMaxH: "32",
            iconSize: 14,
        },
        sm: {
            height: "8",
            fontSize: "sm",
            px: "3",
            dropdownMaxH: "40",
            iconSize: 16,
        },
        md: {
            height: "10",
            fontSize: "md",
            px: "4",
            dropdownMaxH: "48",
            iconSize: 18,
        },
        lg: {
            height: "12",
            fontSize: "lg",
            px: "4",
            dropdownMaxH: "56",
            iconSize: 20,
        },
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const hoverBgColor = useColorModeValue("blue.100", "blue.600");
    const activeBgColor = useColorModeValue("blue.200", "blue.700");

    return (
        <Box position="relative" width="100%" ref={selectRef} {...rest} >
            <InputGroup size={size}>
                <Input
                    ref={inputRef}
                    onClick={handleInputClick}
                    value={searchText}
                    name={name}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedOption?.label || placeholder}
                    height={currentSize.height}
                    fontSize={currentSize.fontSize}
                    px={currentSize.px}
                    bg={bg}
                    isDisabled={isDisabled}
                    color={isOpen ? '#333333' : '#333333'}
                    borderRadius={borderRadius}
                    borderWidth="1px"
                    borderColor={isOpen ? _focus.borderColor : borderColor}
                    _hover={_hover}
                    _focus={{ ...(_focus || {}), outline: "none" }}
                    autoComplete="off"
                    onFocus={handleInputClick}
                />
                <InputRightElement width="auto" color={iconColor} pr={2} h="100%">
                    <Flex alignItems="center" gap={1}>
                        {isLoading && (
                            <Box
                                as="span"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Spinner color={iconColor} boxSize={`${currentSize.iconSize - 2}px`} />
                            </Box>
                        )}
                        {JSON.stringify(selectedOption) != JSON.stringify(defaultOption) && (
                            <Box
                                as="span"
                                cursor="pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectOption(defaultOption);
                                }}
                                pointerEvents={isDisabled ? 'none' : "auto"}
                                display="flex"
                                alignItems="center"
                                _hover={{ color: 'black' }}
                                justifyContent="center"
                            >
                                <Icon as={X} boxSize={`${currentSize.iconSize}px`} />
                            </Box>
                        )}
                        <Icon as={Tally1} boxSize={`${currentSize.iconSize}px`} mr={-3} p={0} />
                        {isOpen && searchText ? (
                            <Icon as={SearchIcon} _hover={{ color: 'blue' }} boxSize={`${currentSize.iconSize - 2}px`} />
                        ) : (
                            <Box
                                cursor="pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                                transform={isOpen ? "rotate(180deg)" : undefined}
                                transition="transform 0.2s"
                                pointerEvents={isDisabled ? 'none' : "auto"}
                                display="flex"
                                alignItems="center"
                                _hover={{ color: 'black' }}
                                justifyContent="center"
                            >
                                <Icon as={ChevronDown} boxSize={`${currentSize.iconSize}px`} p={0} />
                            </Box>
                        )}
                    </Flex>
                </InputRightElement>
            </InputGroup>

            {
                isOpen && (
                    <List
                        ref={listRef}
                        position="absolute"
                        width="100%"
                        mt="1"
                        bg={bg}
                        borderRadius={borderRadius}
                        borderWidth="1px"
                        borderColor={borderColor}
                        boxShadow="md"
                        zIndex="10"
                        maxH={currentSize.dropdownMaxH}
                        overflowY="auto"
                        onMouseLeave={handleMouseLeave}
                    >
                        {filteredOptions?.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <ListItem
                                    key={option.value}
                                    onClick={() => handleSelectOption(option)}
                                    px={currentSize.px}
                                    py="2"
                                    cursor="pointer"
                                    bg={value == option.value ? activeBgColor : index == hoveredIndex ? hoverBgColor : undefined}
                                    _hover={{ bg: hoverBgColor }}
                                    fontSize={currentSize.fontSize}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                >
                                    {option.label}
                                </ListItem>
                            ))
                        ) : (
                            <ListItem px={currentSize.px} py="2" color="gray.500">
                                No options found
                            </ListItem>
                        )}
                    </List>
                )
            }
        </Box>
    );
};

export default CustomSelect;