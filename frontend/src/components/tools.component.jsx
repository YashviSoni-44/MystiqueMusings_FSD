//importing tools
import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import axios from 'axios';

const uploadImageByFile = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return axios.post('http://localhost:5500/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => {
      if (response.data && response.data.uploadURL) {
        return {
          success: 1,
          file: { url: `http://localhost:5500${response.data.uploadURL}` },
        };
      } else {
        return { success: 0 };
      }
    })
    .catch((error) => {
      console.error('Image upload failed:', error);
      return { success: 0, message: 'Image upload failed' };
    });
};

export { uploadImageByFile };

const uploadImageByURL = (e)=>{
    let link=new Promise((resolve,reject)=>{
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })
    return link.then(url=>{
        return {
            success:1,
            file:{url}
        }
    })
}

export const tools ={
    embed: Embed,
    list: {
        class: List,
        inlineToolBar: true
    },
    image: {
        class:Image,
        config:{
            uploader:{
                uploadByUrl:uploadImageByURL,
                uploadByFile:uploadImageByFile,
            }
        }
    },
    header: {
        class:Header,
        config:{
            placeholder:"Enter Heading...",
            levels:[2,3,4,5],
            defaultLevel:3
        }
    },
    quote: {
        class:Quote,
        inlineToolBar:true
    },
    marker: Marker,
    inlineCode: InlineCode,
}