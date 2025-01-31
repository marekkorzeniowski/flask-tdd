import React from 'react';
import { Formik, Form, Field } from 'formik';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
} from '@chakra-ui/react';

const validationSchema = z.object({
  username: z.string()
    .min(6, 'Username must be at least 6 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Enter a valid email')
    .min(6, 'Email must be at least 6 characters long'),
  password: z.string()
    .min(11, 'Password must be at least 11 characters long'),
});

type FormValues = z.infer<typeof validationSchema>;


interface RegisterFormProps {
  onSubmit: (values: { username: string; email: string; password: string }) => Promise<void>;
  isAuthenticated: () => boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isAuthenticated }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return (
    <Box maxWidth="400px" marginTop={10} margin="100px auto 0">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Register
      </Heading>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
        validate={(values) => {
          try {
            validationSchema.parse(values);
            return {};
          } catch (error) {
            return (error as z.ZodError).formErrors.fieldErrors;
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={4}>
              <Field name="username">
                {({ field }: { field: any }) => (
                  <FormControl isInvalid={!!(errors.username && touched.username)}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input {...field} id="username" placeholder="Enter a username" />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email">
                {({ field }: { field: any }) => (
                  <FormControl isInvalid={!!(errors.email && touched.email)}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...field} id="email" type="email" placeholder="Enter an email address" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field }: { field: any }) => (
                  <FormControl isInvalid={!!(errors.password && touched.password)}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input {...field} id="password" type="password" placeholder="Enter a password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                bg="green.400"
                _hover={{ bg: 'green.500' }}
              >
                Register
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;