'use-client'

import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"
import { documentsApi } from "@/lib/api/document"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditDocumentPage(){
     const [title,setTitle] = useState("")
     const [description,setDescription] = useState("")
     const [price,setPrice] = useState("")
     const [image,setImage] = useState(null)
     const [pdf,setPdf] = useState(null)
     const [tcurrentImageUrlitle,setCurrentImageUrl] = useState("")
     const [error,setError] = useState('');
     const [loading,setLoading] = useState(true);
     const [updating,setUpdating] = useState(false);
     const [imagePreview,setImagePreview] = useState(null);


     const params = useParams();
     const router = useRouter();
     const {user} = useAuth();

     if(!user){
          router.push("/login");
          return null;
     }

       useEffect(() => {
    loadDocument();
  }, [params.id]);

  const loadDocument = async() =>{
     try {
          setLoading(true);
          const data = await documentsApi.getbyId(params.id);
          const fetchedDoc = data.document;
          if(fetchedDoc.creator.id !== user.id){
               router.push('/')
               return;
          }

          setTitle(fetchedDoc.title);
          setDescription(fetchedDoc.description)
          setPrice(fetchedDoc.price.toString());
          setCurrentImageUrl(fetchedDoc.imageUrl);
     } catch (error) {
          setError(error.response?.data?.message || 'failed to load document')

     }finally {
          setLoading(false);
     }
  }

  const handleImageChange = (e)=>{
     const file = e.target.file[0];
     if(file){
          setImage(file)
          const reader = new FileReader();
          reader.onloadend = ()=>{
               setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
     }



  }

}
