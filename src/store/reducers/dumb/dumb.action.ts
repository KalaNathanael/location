import { getDumbPostAPI } from "@/features/dumb/api/dumb.api";
import { TPost } from "@/features/dumb/interfaces";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

export const dumbAction = createAction("dumbAction");

type TFulfilled = {
  value: TPost[];
};
type TFirstParam = {
  param: number;
};
export const dumbAsyncAction = createAsyncThunk<
  TFulfilled,
  TFirstParam,
  {
    // ThunkAPI object typing. Il faudra typer au besoin ces paramètres :
    /* 
        // return type for `thunkApi.getState`
        state?: unknown,

        //type for `thunkApi.dispatch`
        dispatch?: Dispatch,

        //type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra`
        extra?: unknown,

        //type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload`
        rejectValue?: unknown,

        //return type of the `serializeError` option callback
        serializedErrorType?: unknown,

        //type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta`
        pendingMeta?: unknown,

        //type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta`
        fulfilledMeta?: unknown,

        //type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` 
        rejectedMeta?: unknown
    */
    rejectValue: any;
  }
>("asyncActionTypeName", async (firstParam, thunkAPI) => {
  try {
    const response: any = await getDumbPostAPI(firstParam.param);
    return {
      value: response.map((elt: any) => {
        let toReturn: TPost = {
          user: elt.userId,
          title: elt.title,
          body: elt.body,
        };
        return toReturn;
      }),
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err);
  }
});
