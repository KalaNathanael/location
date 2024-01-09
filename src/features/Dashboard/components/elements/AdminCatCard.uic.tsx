import { FC } from "react";
import { TCat, TSubCat } from "@/types";

import { Button } from "@mui/material";
import styled from "styled-components";

type AdminCatCardUICProps = {
  rights: {
    delete: boolean;
    update: boolean;
  };
  item: TCat | TSubCat;
  onView: () => void;
  onModify: () => void;
  onDelete: () => void;
};
const AdminCatCardUIC: FC<AdminCatCardUICProps> = ({
  item,
  rights,
  onDelete,
  onModify,
  onView,
}) => {
  return (
    <Container>
      <LeftSide>
        <ImageContainer onClick={onView}>
          <img src={item.image_url} alt={item.label} />
        </ImageContainer>
      </LeftSide>
      <RightSide>
        <CardName onClick={onView}>{item.label}</CardName>
        <CardButtons>
          <Button id="delete" variant="text" color="error" onClick={onDelete} disabled={!rights.delete}>
            Supprimer
          </Button>
          <Button id="modify" variant="text" color="warning" onClick={onModify} disabled={!rights.update}>
            Modifier
          </Button>
          <Button id="view" variant="text" color="success" onClick={onView}>
            Consulter
          </Button>
        </CardButtons>
      </RightSide>
    </Container>
  );
};

export default AdminCatCardUIC;

const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  gap: 10px;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(var(--ui-primary-rgb), 0.8);

  &__right-side {
  }
`;

const LeftSide = styled.div`
  display: flex;
  width: 80px;
  height: 80px;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  flex: 1;
`;

const ImageContainer = styled.span`
  width: 100%;
  height: 100%;
  padding: 3px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
  border-radius: 7px;
  transition: box-shadow 100ms ease-in-out;
  cursor: pointer;

  & > img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const CardName = styled.span`
  font-size: 17px;
  font-weight: 500;
  text-transform: uppercase;
  align-self: center;
  cursor: pointer;
`;

const CardButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
`;
