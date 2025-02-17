import { Box, Spinner } from "@chakra-ui/react";

const FullScreenLoader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(0, 0, 0, 0.3)"
            zIndex={100}
        >
            <Spinner size="xl" color="white" />
        </Box>
    );
};

export default FullScreenLoader;
