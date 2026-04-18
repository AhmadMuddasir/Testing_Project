
import {apiClient} from "./client.js";

export const purchasesApi = {
     createOrder:async (documentId) => {
          const {data} = await apiClient.post('/purchases/create-order',{documentId});
          return data;
     },

     verifyPayment:async (paymentData) =>{
          const {data} = await apiClient.post('/purchases/verify',paymentData);
          return data;
     },
     getMyPurchases:async () =>{
          const {data} = await apiClient.get('purchases/my-purchases');
          return data;
     },
     checkPurchases:async (documentId) =>{
          const {data} = await apiClient.get(`/purchases/check/${documentId}`);
          return data
     },
}