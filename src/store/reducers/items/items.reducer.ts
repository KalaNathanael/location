import { TLocationDateTimeValues } from "@/features/Dashboard/pages/LocationDateTime/LocationDateTime.page";
import { TItem, TReducerError, TSubItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const errorInitialValue: TReducerError = {
  message: "",
  value: null,
};
export type TBasket = {
  [itemId: string]: {
    label: string;
    selectedSubItems: Array<{
      subItemId: string;
      subItemLabel: string;
      subItemPrice: number;
      selectedQuantity: number;
    }>;
  };
};

export type TItemsState = {
  eventDetails: TLocationDateTimeValues;
  selectedItem: TItem | null;
  basket: TBasket;
  loading: "idle" | "pending" | "failed";
  error: TReducerError;
};

const initialState: TItemsState = {
  eventDetails: {
    dateTime: {
      start: null,
      end: null,
    },
    eventName: "",
  },
  selectedItem: null,
  basket: {},
  loading: "idle",
  error: errorInitialValue,
};
const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setEventDetails: (
      state,
      action: PayloadAction<TLocationDateTimeValues>
    ) => {
      state.eventDetails = action.payload;
    },
    clearEventDetails: (state) => {
      state.eventDetails = {
        dateTime: {
          start: null,
          end: null,
        },
        eventName: "",
      };
    },
    setSelectedItem: (state, action: PayloadAction<TItem>) => {
      state.selectedItem = action.payload;
    },
    clearChoice: (state) => {
      state.selectedItem = null;
    },
    addSubItemsInBasket: (
      state,
      action: PayloadAction<{ subItem: TSubItem; qte: number }>
    ) => {
      const { qte, subItem } = action.payload;

      let alreadyThere: boolean = !!state.basket[
        state.selectedItem.id
      ]?.selectedSubItems.find((elt) => elt.subItemId === subItem.id);

      if (qte === 0) {
        if (alreadyThere) {
          if (
            state.basket[state.selectedItem.id].selectedSubItems.length === 1
          ) {
            delete state.basket[state.selectedItem.id];
          } else {
            state.basket[state.selectedItem.id].selectedSubItems = state.basket[
              state.selectedItem.id
            ].selectedSubItems.filter((elt) => elt.subItemId !== subItem.id);
          }
        }
      } else {
        if (alreadyThere) {
          state.basket[state.selectedItem.id].selectedSubItems = state.basket[
            state.selectedItem.id
          ].selectedSubItems.map((elt) => {
            if (elt.subItemId === subItem.id) {
              return {
                subItemId: subItem.id,
                subItemLabel: subItem.label,
                subItemPrice: subItem.price,
                selectedQuantity: qte,
              };
            }
            return elt;
          });
        } else {
          let toAdd = {
            selectedQuantity: qte,
            subItemId: subItem.id,
            subItemPrice: subItem.price,
            subItemLabel: subItem.label,
          };
          if (state.basket[state.selectedItem.id]) {
            state.basket[state.selectedItem.id].selectedSubItems.push(toAdd);
          } else {
            state.basket[state.selectedItem.id] = {
              label: state.selectedItem.label,
              selectedSubItems: [toAdd],
            };
          }
        }
      }
    },
    removeSubItemFromBasket: (
      state,
      actions: PayloadAction<{ categoryId: string; subItemId: string }>
    ) => {
      const { categoryId, subItemId } = actions.payload;
      if (state.basket[categoryId].selectedSubItems.length === 1) {
        delete state.basket[categoryId];
      } else {
        state.basket[categoryId].selectedSubItems = state.basket[
          categoryId
        ].selectedSubItems.filter((elt) => elt.subItemId !== subItemId);
      }
    },
    clearBasket: (state) => {
      state.basket = {};
    },
  },
  extraReducers: (builder) => {},
});

const { actions, reducer } = itemSlice;
export const {
  clearEventDetails,
  setEventDetails,
  addSubItemsInBasket,
  removeSubItemFromBasket,
  clearBasket,
  clearChoice,
  setSelectedItem,
} = actions;
export default reducer;
