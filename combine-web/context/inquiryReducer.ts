// context/inquiryReducer.ts

import { InquiryItem } from "@/types/inquiry";

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
      payload: string;
    }
  | {
      type: "CLEAR_ITEMS";
    }
  | {
      type: "INCREASE";
      payload: string;
    }
  | {
      type: "DECREASE";
      payload: string;
    }
  | {
      type: "UPDATE_NOTE";
      payload: {
        id: string;
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
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return state.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...state, action.payload];
    }

    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.id !== action.payload
      );

    case "CLEAR_ITEMS":
      return [];

    case "INCREASE":
      return state.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

    case "DECREASE":
      return state
        .map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "UPDATE_NOTE":
      return state.map((item) =>
        item.id === action.payload.id
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