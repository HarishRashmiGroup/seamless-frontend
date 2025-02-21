import { useState } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";

const PasswordInput = ({ password, setPassword, onKeyDown }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputGroup>
            <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                bg="whiteAlpha.900"
                onKeyDown={(e) => onKeyDown(e)}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
            />
            <InputRightElement mr={1}>
                <Button
                    size="sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                    bg="transparent"
                    _hover={{ bg: "gray.100" }}
                >
                    {showPassword ? "🙈" : "👁️"}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default PasswordInput;
