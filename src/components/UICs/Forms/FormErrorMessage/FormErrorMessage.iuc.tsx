import styled from "styled-components";

type FEMProps = {
  message: string;
};
const FormErrorMessage: React.FC<FEMProps> = ({ message }) => {
  return <ErrorMessage>{message}</ErrorMessage>;
};

export default FormErrorMessage;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  font-style: italic;
  color: var(--text-error);
`;
