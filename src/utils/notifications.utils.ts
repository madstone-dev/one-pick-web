import { makeVar } from "@apollo/client";
import { IsuccessNoticifation } from "../../components/notifications/Success";

export const SUCCESS_DEFAULT = {
  title: "",
  description: "",
};

export const successNotificationVar =
  makeVar<IsuccessNoticifation>(SUCCESS_DEFAULT);

export const showSuccess = ({ title, description }: IsuccessNoticifation) => {
  successNotificationVar({ title, description });
};
