import request from "@/config/axios";
import { apiURL } from "@/enums";

export const getUserInfo = async (params = {}) =>
    await request.post({
        url: apiURL.UserInfo,
        data: params,
    });

export const changeUser = async (
    params
) =>
    await request.post({
        url: apiURL.ChangeUser,
        data: params,
    });
