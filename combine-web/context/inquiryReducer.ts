// context/inquiryReducer.ts

import type { InquiryItem } from "@/types/inquiry";


export type InquiryAction =
  | {
      type: "SET_ITEMS";
      payload: InquiryItem[];
    }
  | {
      type: "ADD_ITEM";
      payload: InquiryItem;
    }
  | {
      type: "REMOVE_ITEM";
      payload: number;
    }
  | {
      type: "CLEAR_ITEMS";
    }
  | {
      type: "INCREASE";
      payload: number;
    }
  | {
      type: "DECREASE";
      payload: number;
    }
  | {
      type: "UPDATE_NOTE";
      payload: {
        productId: number;
        notes: string;
      };
    };


export function inquiryReducer(
  state: InquiryItem[],
  action: InquiryAction
): InquiryItem[] {

  switch (action.type) {

    case "SET_ITEMS":
      return action.payload;


    case "ADD_ITEM": {

      const existing = state.find(
        (item) =>
          item.productId === action.payload.productId
      );


      if (existing) {

        return state.map((item) =>
          item.productId === existing.productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );

      }


      return [
        ...state,
        action.payload,
      ];
    }


    case "REMOVE_ITEM":

      return state.filter(
        (item) =>
          item.productId !== action.payload
      );


    case "CLEAR_ITEMS":

      return [];


    case "INCREASE":

      return state.map((item) =>
        item.productId === action.payload
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );


    case "DECREASE":

      return state
        .map((item) =>
          item.productId === action.payload
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        );


    case "UPDATE_NOTE":

      return state.map((item) =>
        item.productId === action.payload.productId
          ? {
              ...item,
              notes: action.payload.notes,
            }
          : item
      );


    default:
      return state;
  }
}