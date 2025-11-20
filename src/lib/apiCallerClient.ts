
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@clerk/nextjs";


export function usePostApi() {
  const { getToken } = useAuth();

  return async function postApi<T = any>(
    url: string,
    payload: Record<string, any>
  ): Promise<AxiosResponse<T>> {
    const token = await getToken();
    return axios.post<T>(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}

export function useGetApi() {
  const { getToken } = useAuth();

  return async function getApi<T = any>(
    url: string
  ): Promise<AxiosResponse<T>> {
    const token = await getToken();
    return axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
