import { apiClient } from "./client";

export const documentsApi = {
     getAll:async()=>{
          const {data} = apiClient.get('/documents');
          return data;
     },
     getbyId:async(id)=>{
          const {data} = await apiClient.get(`/documents/${id}`);
          return data;

     },
     upload:async(formData)=>{
          const {data} = await apiClient.post(`/documents`,formData,{
               headers:{"Content-Type":'multipart/form-data'},
          });
          return data;
     },
     update:async(id,formData)=>{
          const {data} = await apiClient.patch(`/documents/${id}`,formData,{
               headers:{'Content-Type':'multipart/form-data'}
          });
          return data;

     },
     delete:async(id)=>{
          const {data} = await apiClient.delete(`/documents/${id}`);
          return data;
     },

};

