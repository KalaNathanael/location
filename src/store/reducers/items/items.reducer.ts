import { TLocationDateTimeValues } from "@/features/Dashboard/pages/location/LocationDateTime/LocationDateTime.page";
import { TCat, TReducerError, TArticle, TSubCat } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../app/app.reducer";

const errorInitialValue: TReducerError = {
  message: "",
  value: null,
};
export type TBasket = {
  [itemId: string]: {
    label: string;
    selectedSubItems: Array<{
      subCat?: TSubCat;
      subItemId: string;
      subItemLabel: string;
      subItemPrice: number;
      selectedQuantity: number;
    }>;
  };
};

export type TItemsState = {
  eventDetails: TLocationDateTimeValues;
  selectedCat: TCat | null;
  selectedSubCat: TSubCat | null;
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
  selectedCat: null,
  selectedSubCat: null,
  basket: {},
  loading: "idle",
  error: errorInitialValue,
};
const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    initialiseItemSlice: (state) => {
      state = initialState;
    },
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
    setSelectedCat: (state, action: PayloadAction<TCat>) => {
      state.selectedCat = action.payload;
    },
    clearSelectedCat: (state) => {
      state.selectedCat = null;
    },
    setSelectedSubCat: (state, action: PayloadAction<TSubCat>) => {
      state.selectedSubCat = action.payload;
    },
    clearSelectedSubCat: (state) => {
      state.selectedSubCat = null;
    },
    addSubItemsInBasket: (
      state,
      action: PayloadAction<{ subItem: TArticle; qte: number }>
    ) => {
      const { qte, subItem } = action.payload;

      let alreadyThere: boolean = !!state.basket[
        state.selectedCat.id
      ]?.selectedSubItems.find((elt) => elt.subItemId === subItem.id);

      if (qte === 0) {
        if (alreadyThere) {
          if (
            state.basket[state.selectedCat.id].selectedSubItems.length === 1
          ) {
            delete state.basket[state.selectedCat.id];
          } else {
            state.basket[state.selectedCat.id].selectedSubItems = state.basket[
              state.selectedCat.id
            ].selectedSubItems.filter((elt) => elt.subItemId !== subItem.id);
          }
        }
      } else {
        if (alreadyThere) {
          state.basket[state.selectedCat.id].selectedSubItems = state.basket[
            state.selectedCat.id
          ].selectedSubItems.map((elt) => {
            if (elt.subItemId === subItem.id) {
              return {
                subCat: state.selectedSubCat ? state.selectedSubCat : undefined,
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
            subCat: state.selectedSubCat ? state.selectedSubCat : undefined,
            selectedQuantity: qte,
            subItemId: subItem.id,
            subItemPrice: subItem.price,
            subItemLabel: subItem.label,
          };
          if (state.basket[state.selectedCat.id]) {
            state.basket[state.selectedCat.id].selectedSubItems.push(toAdd);
          } else {
            state.basket[state.selectedCat.id] = {
              label: state.selectedCat.label,
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
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.basket = {};
      state.error = errorInitialValue;
      state.eventDetails = initialState.eventDetails;
      state.loading = "idle";
      state.selectedCat = null;
      state.selectedSubCat = null;
    });
  },
});

const { actions, reducer } = itemSlice;
export const {
  addSubItemsInBasket,
  clearBasket,
  clearEventDetails,
  clearSelectedCat,
  clearSelectedSubCat,
  initialiseItemSlice,
  removeSubItemFromBasket,
  setEventDetails,
  setSelectedCat,
  setSelectedSubCat,
} = actions;
export default reducer;
