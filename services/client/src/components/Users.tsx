import {
  Heading,
  Box,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";

interface User {
  created_date: string;
  email: string;
  id: number;
  username: string;
}

interface UsersProps {
  users: User[];
}

const Users: React.FC<UsersProps> = ({ users }) => {
  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Heading
        as="h1"
        size="2xl"
        mb={6}
        mt={12}
        textAlign="left"
        color="gray.700"
      >
        Users
      </Heading>
      <Divider borderColor="gray.400" />

      {users.length > 0 ? (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Created Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.username}>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.created_date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text mt={4} color="gray.500" textAlign="center">
          There are no registered users.
        </Text>
      )}
    </Box>
  );
};

export default Users;