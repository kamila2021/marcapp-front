import { serviceAxiosApi } from "../../services/serviceAxiosApi";


export const TransbankService = {
  echo: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/echo`, payload);
    return response.data;
  },
  createTransaction: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/create-transaction`, payload);
    return response.data;
  },
  commitTransaction: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/commit-transaction`, payload);
    return response.data;
  },
  getTransactionStatus: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/transaction-status`, payload);
    return response.data;
  },
  refundTransaction: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/refund-transaction`, payload);
    return response.data;
  },
  getTransaction: async (payload: any) => {
    const response = await serviceAxiosApi.post(`/get-transaction`, payload);
    return response.data;
  },
};
