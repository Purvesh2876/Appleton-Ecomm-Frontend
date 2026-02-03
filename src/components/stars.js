import { HStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const Stars = ({ value = 0, size = 4, onChange, readOnly = false }) => {
    return (
        <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    boxSize={size}
                    cursor={readOnly ? "default" : "pointer"}
                    color={star <= value ? "orange.400" : "gray.300"}
                    onClick={() => !readOnly && onChange?.(star)}
                />
            ))}
        </HStack>
    );
};

export default Stars;
