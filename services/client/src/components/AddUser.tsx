import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
} from "@chakra-ui/react";
import { z } from "zod"; // new line

interface UserObject {
  username: string;
  email: string;
}

interface AddUserProps {
  addUserToList: (user: UserObject) => void;
}

// Zod schema for validation
const userSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().email({ message: "Invalid email address" }),
});

const AddUser: React.FC<AddUserProps> = ({ addUserToList }) => {
  const [userData, setUserData] = useState<UserObject>({
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the data using Zod
    const result = userSchema.safeParse(userData);

    if (!result.success) {
      // Handle validation errors
      const validationErrors = result.error.format();
      setErrors({
        username: validationErrors.username?._errors[0],
        email: validationErrors.email?._errors[0],
      });
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICE_URL}/users`,
        userData
      );

      if (response.status === 201) {
        console.log(response.data.message);

        const newUser = {
          username: userData.username,
          email: userData.email,
          created_date: new Date().toISOString(),
        };

        addUserToList(newUser);

        setUserData({ username: "", email: "" });
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" mt={12}>
      <Box mb={6} textAlign="left">
        <Heading as="h2" size="xl" color="gray.700">
          Register a User
        </Heading>
      </Box>

      <Box
        as="form"
        p={4}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        maxW="500px"
        onSubmit={handleSubmit}
        textAlign="left"
      >
        <FormControl isRequired mb={6} isInvalid={!!errors.username}>
          <FormLabel fontSize="lg" htmlFor="input-username">
            Username
          </FormLabel>
          <Input
            name="username"
            id="input-username"
            size="lg"
            placeholder="Enter a username"
            type="text"
            value={userData.username}
            onChange={handleInputChange}
          />
          {errors.username && <Text color="red.500">{errors.username}</Text>}
        </FormControl>

        <FormControl isRequired mb={6} isInvalid={!!errors.email}>
          <FormLabel fontSize="lg" htmlFor="input-email">
            Email
          </FormLabel>
          <Input
            name="email"
            id="input-email"
            size="lg"
            type="email"
            placeholder="Enter an email address"
            value={userData.email}
            onChange={handleInputChange}
          />
          {errors.email && <Text color="red.500">{errors.email}</Text>}
        </FormControl>

        <Button
          type="submit"
          colorScheme="green"
          bg="green.400"
          size="lg"
          width="full"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddUser;